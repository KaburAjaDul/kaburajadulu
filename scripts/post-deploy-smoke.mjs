import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { INVITE, parseAgendaPayload } from '../src/components/events/live-agenda-contract.ts';

const MAX_AGENDA_AGE_MS = 45 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;
const MISSING_SNAPSHOT = 'Agenda has not received a signed projection yet.';

/** The migration exception applies to source availability, never Worker readiness. */
export function validateAgenda(status, value, { migration = false, now = Date.now() } = {}) {
  if (status === 503 && value?.error?.code === 'agenda_unavailable' && value.error.detail === MISSING_SNAPSHOT) {
    if (!migration) throw new Error('Agenda has no signed snapshot. Restore the publisher or explicitly enable KAD_INFRA_MIGRATION during the migration.');
    return { state: 'degraded', reason: 'Cloudflare is ready; the external publisher has not delivered a signed snapshot.' };
  }
  if (status !== 200) throw new Error(`Agenda returned HTTP ${status}; this is not an allowed migration state.`);
  const payload = parseAgendaPayload(value);
  if (!payload) throw new Error('Agenda does not match the public v1 source contract.');
  const observedAt = Date.parse(payload.observedAt);
  const generatedAt = Date.parse(payload.generatedAt);
  const staleAt = Date.parse(payload.staleAt);
  if (observedAt > now + CLOCK_SKEW_MS || generatedAt > now + CLOCK_SKEW_MS || generatedAt < observedAt - CLOCK_SKEW_MS || staleAt !== observedAt + MAX_AGENDA_AGE_MS) {
    throw new Error('Agenda timestamps violate the 45-minute freshness contract.');
  }
  if (/\b(?:fixture|deterministic|staging seed)\b/i.test(JSON.stringify(payload))) {
    throw new Error('Agenda contains fixture markers.');
  }
  const stale = payload.sourceStatus === 'stale' || staleAt <= now;
  if (stale) {
    if (!migration) throw new Error(`Agenda revision ${payload.revision} is stale (observed ${payload.observedAt}).`);
    return { state: 'degraded', reason: `Cloudflare is ready; signed source revision ${payload.revision} is stale (observed ${payload.observedAt}).` };
  }
  return { state: 'healthy', reason: `Fresh signed source revision ${payload.revision}; ${payload.entries.length} public agenda entries.` };
}

function requireStatus(response, expected, label) {
  if (response.status !== expected) throw new Error(`${label} returned HTTP ${response.status}, expected ${expected}.`);
}

async function readJson(response, label) {
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error(`${label} did not return JSON.`);
  try {
    return await response.json();
  } catch {
    throw new Error(`${label} returned invalid JSON.`);
  }
}

/**
 * @param {{baseUrl: string, environment: string, migration?: boolean, fetchImpl?: (url: URL, options: RequestInit) => Promise<Response>, now?: number}} options
 */
export async function checkDeployment({ baseUrl, environment, migration = false, fetchImpl = fetch, now = Date.now() }) {
  if (environment !== 'production' && environment !== 'staging') throw new Error('SMOKE_ENVIRONMENT must be production or staging.');
  const origin = new URL(baseUrl).origin;
  const request = (path, options = {}) => fetchImpl(new URL(path, origin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(15_000),
    ...options,
    headers: { 'cache-control': 'no-cache', ...options.headers },
  });

  const page = await request('/en/');
  requireStatus(page, 200, 'Public page');
  const html = await page.text();
  if (!page.headers.get('content-type')?.includes('text/html') || !/<main[\s>]/i.test(html) || !html.includes(INVITE)) throw new Error('Public page is missing the deployed site HTML.');
  const noindexHeader = /noindex/i.test(page.headers.get('x-robots-tag') ?? '');
  const noindexMeta = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  if (environment === 'production' && (noindexHeader || noindexMeta)) throw new Error('Production is serving a staging noindex artifact.');
  if (environment === 'staging' && (!noindexHeader || !noindexMeta)) throw new Error('Staging page is missing the noindex header or HTML contract.');

  const health = await request('/healthz');
  requireStatus(health, 200, 'Worker health');
  const healthValue = await readJson(health, 'Worker health');
  if (healthValue.status !== 'ok' || healthValue.service !== 'kaburajadulu-web' || healthValue.version !== 'agenda-api-v1') throw new Error('Worker health does not identify the expected agenda service.');
  const ready = await request('/readyz');
  requireStatus(ready, 200, 'Worker readiness');
  if ((await readJson(ready, 'Worker readiness')).status !== 'ready') throw new Error('Worker is not ready.');

  const agenda = await request('/api/v1/agenda');
  const result = validateAgenda(agenda.status, await readJson(agenda, 'Agenda'), { migration, now });

  const crossOrigin = await request('/api/v1/agenda', { headers: { origin: 'https://attacker.example' } });
  requireStatus(crossOrigin, 403, 'Cross-origin agenda request');
  if ((await readJson(crossOrigin, 'Cross-origin agenda request')).error?.code !== 'origin_forbidden') throw new Error('Cross-origin agenda rejection has an unexpected contract.');
  const preflight = await request('/internal/v1/projections/agenda', { method: 'OPTIONS', headers: { origin } });
  requireStatus(preflight, 204, 'Same-origin ingest preflight');
  if (preflight.headers.get('access-control-allow-origin') !== origin) throw new Error('Ingest preflight does not allow the same origin.');
  const unsigned = await request('/internal/v1/projections/agenda', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  requireStatus(unsigned, 401, 'Unsigned projection');
  if ((await readJson(unsigned, 'Unsigned projection')).error?.code !== 'projection_authentication_failed') throw new Error('Unsigned projection was not rejected by signature authentication.');

  if (environment === 'staging') {
    const sitemap = await request('/sitemap.xml');
    requireStatus(sitemap, 404, 'Staging sitemap');
    const robots = await request('/robots.txt');
    requireStatus(robots, 200, 'Staging robots');
    if (!/^Disallow:\s*\/\s*$/m.test(await robots.text())) throw new Error('Staging robots does not block crawlers.');
  }
  return result;
}

async function main() {
  const migration = process.env.KAD_INFRA_MIGRATION === 'true';
  const environment = process.env.SMOKE_ENVIRONMENT;
  const baseUrl = process.env.SMOKE_BASE_URL;
  if (!baseUrl) throw new Error('SMOKE_BASE_URL is required.');
  let lastError;
  // Cloudflare propagation can briefly serve the preceding version. Bound every
  // request and retry the whole contract; a retry never relaxes its assertions.
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const result = await checkDeployment({ baseUrl, environment, migration });
      const status = result.state === 'healthy' ? 'PASS' : 'DEGRADED — INFRA MIGRATION';
      const message = `${environment}: ${status}. ${result.reason}`;
      console.log(message);
      if (result.state === 'degraded') console.log(`::warning title=Infra migration::${message}`);
      if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `### Cloudflare post-deploy check\n\n${message}\n\nMigration policy: \`${migration}\`. Static HTML, health, readiness, and request security passed. ${migration ? 'Disable `KAD_INFRA_MIGRATION` after the publisher resumes, then rerun verification to require fresh source data.' : ''}\n`);
      return;
    } catch (error) {
      lastError = error;
      console.error(`Smoke attempt ${attempt}/4: ${error.message}`);
      if (attempt < 4) await delay(3_000);
    }
  }
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `### Cloudflare post-deploy check failed\n\n${lastError.message}\n\nMigration policy: \`${migration}\`. Configuration, schema, contract, and security failures are never waived.\n`);
  throw lastError;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
