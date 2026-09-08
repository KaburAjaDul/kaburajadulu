import { describe, expect, test } from 'bun:test';
import { checkDeployment, validateAgenda } from '../../scripts/post-deploy-smoke.mjs';

const now = Date.parse('2026-09-08T12:00:00.000Z');
const observedAt = new Date(now - 60_000).toISOString();
const fresh = {
  schemaVersion: 'v1',
  generatedAt: new Date(now).toISOString(),
  observedAt,
  revision: 42,
  sourceStatus: 'fresh',
  staleAt: new Date(Date.parse(observedAt) + 45 * 60_000).toISOString(),
  entries: [],
};
const unavailable = (detail: string) => ({ error: { code: 'agenda_unavailable', detail } });
const missingSnapshot = unavailable('Agenda has not received a signed projection yet.');
const stale = {
  ...fresh,
  sourceStatus: 'stale',
  observedAt: new Date(now - 90 * 60_000).toISOString(),
  staleAt: new Date(now - 45 * 60_000).toISOString(),
};

describe('post-deploy agenda policy', () => {
  test('a fresh, signed empty schedule is healthy', () => {
    expect(validateAgenda(200, fresh, { now }).state).toBe('healthy');
  });

  test('only explicit migration mode tolerates no first signed snapshot', () => {
    expect(() => validateAgenda(503, missingSnapshot, { now })).toThrow('no signed snapshot');
    expect(validateAgenda(503, missingSnapshot, { now, migration: true }).state).toBe('degraded');
  });

  test('stale schedules and cached fresh labels fail normal mode', () => {
    expect(() => validateAgenda(200, stale, { now })).toThrow('stale');
    expect(() => validateAgenda(200, { ...stale, sourceStatus: 'fresh' }, { now })).toThrow('stale');
    expect(validateAgenda(200, stale, { now, migration: true }).state).toBe('degraded');
  });

  test.each([
    'Agenda is not configured in this environment.',
    'Agenda data is not currently available for public display.',
    'D1 schema is not ready.',
  ])('migration never accepts configuration or corrupt data: %s', (detail) => {
    expect(() => validateAgenda(503, unavailable(detail), { now, migration: true })).toThrow('not an allowed migration state');
  });

  test.each([401, 403, 500, 502])('migration never accepts HTTP %i', (status) => {
    expect(() => validateAgenda(status, missingSnapshot, { now, migration: true })).toThrow();
  });

  test('migration does not bypass source contract validation', () => {
    expect(() => validateAgenda(200, { ...stale, revision: 0 }, { now, migration: true })).toThrow('contract');
    expect(() => validateAgenda(200, { ...fresh, entries: [{ title: 'fake' }] }, { now, migration: true })).toThrow('contract');
    expect(() => validateAgenda(200, { ...fresh, demo: true }, { now, migration: true })).toThrow('contract');
  });

  test('rejects broken freshness timestamps even in migration mode', () => {
    expect(() => validateAgenda(200, { ...fresh, staleAt: new Date(now + 86_400_000).toISOString() }, { now, migration: true })).toThrow('timestamps');
    const future = new Date(now + 600_000).toISOString();
    expect(() => validateAgenda(200, { ...fresh, observedAt: future, staleAt: new Date(Date.parse(future) + 45 * 60_000).toISOString() }, { now, migration: true })).toThrow('timestamps');
  });
});

type Reply = () => Response;
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } });

function deploymentReplies(environment = 'production'): Record<string, Reply> {
  return {
    'GET /en/': () => new Response(`<html><head>${environment === 'staging' ? '<meta name="robots" content="noindex, nofollow">' : ''}</head><body><main><a href="https://discord.gg/RUFFbEaeDx">Discord</a></main></body></html>`, {
      headers: { 'content-type': 'text/html', ...(environment === 'staging' ? { 'x-robots-tag': 'noindex, nofollow' } : {}) },
    }),
    'GET /healthz': () => json({ status: 'ok', service: 'kaburajadulu-web', version: 'agenda-api-v1' }),
    'GET /readyz': () => json({ status: 'ready' }),
    'GET /api/v1/agenda': () => json(fresh),
    'CROSS /api/v1/agenda': () => json({ error: { code: 'origin_forbidden' } }, 403),
    'OPTIONS /internal/v1/projections/agenda': () => new Response(null, { status: 204, headers: { 'access-control-allow-origin': 'https://kad.example' } }),
    'POST /internal/v1/projections/agenda': () => json({ error: { code: 'projection_authentication_failed' } }, 401),
    'GET /sitemap.xml': () => new Response('No sitemap', { status: 404 }),
    'GET /robots.txt': () => new Response('User-agent: *\nDisallow: /\n'),
  };
}

function check(replies: Record<string, Reply>, environment = 'production', migration = false) {
  return checkDeployment({
    baseUrl: 'https://kad.example', environment, migration, now,
    fetchImpl: async (url: URL, options: RequestInit) => {
      const method = new Headers(options.headers).get('origin') === 'https://attacker.example' ? 'CROSS' : options.method ?? 'GET';
      const reply = replies[`${method} ${url.pathname}`];
      if (!reply) throw new Error(`Unexpected smoke request: ${method} ${url.pathname}`);
      return reply();
    },
  });
}

describe('deployed Cloudflare contract', () => {
  test('healthy production and crawler-blocked staging pass', async () => {
    expect((await check(deploymentReplies())).state).toBe('healthy');
    expect((await check(deploymentReplies('staging'), 'staging')).state).toBe('healthy');
  });

  test('no snapshot is only degraded after Cloudflare and security checks pass', async () => {
    const replies = deploymentReplies();
    replies['GET /api/v1/agenda'] = () => json(missingSnapshot, 503);
    expect((await check(replies, 'production', true)).state).toBe('degraded');
    replies['POST /internal/v1/projections/agenda'] = () => json({ status: 'accepted' }, 202);
    await expect(check(replies, 'production', true)).rejects.toThrow('Unsigned projection');
  });

  test('migration still fails missing D1 or verifier readiness', async () => {
    const replies = deploymentReplies();
    replies['GET /readyz'] = () => json({ error: { code: 'not_ready' } }, 503);
    replies['GET /api/v1/agenda'] = () => json(missingSnapshot, 503);
    await expect(check(replies, 'production', true)).rejects.toThrow('Worker readiness');
  });

  test('production cannot accidentally deploy the staging noindex artifact', async () => {
    await expect(check(deploymentReplies('staging'))).rejects.toThrow('staging noindex');
  });

  test('staging must keep both HTML and HTTP crawler boundaries', async () => {
    await expect(check(deploymentReplies(), 'staging')).rejects.toThrow('noindex');
    const replies = deploymentReplies('staging');
    replies['GET /sitemap.xml'] = () => new Response('<sitemap />');
    await expect(check(replies, 'staging')).rejects.toThrow('Staging sitemap');
  });

  test('network and invalid JSON failures cannot become a successful check', async () => {
    const replies = deploymentReplies();
    replies['GET /api/v1/agenda'] = () => new Response('Cloudflare outage', { status: 503 });
    await expect(check(replies, 'production', true)).rejects.toThrow('did not return JSON');
    replies['GET /healthz'] = () => { throw new Error('Network unreachable'); };
    await expect(check(replies, 'production', true)).rejects.toThrow('Network unreachable');
  });
});
