/**
 * KAD public agenda Worker.
 *
 * The Worker owns the public projection boundary. Discord never appears in
 * the public response: Kaddy sends a signed, allow-listed snapshot and this
 * service stores only the fields needed by the website.
 */

export const MAX_PROJECTION_BYTES = 256 * 1024;
export const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;
export const MAX_AGENDA_AGE_MS = 45 * 60 * 1000;

type AgendaStatus = 'scheduled' | 'active' | 'withdrawn';
type PublicAgendaStatus = Exclude<AgendaStatus, 'withdrawn'>;
type SourceStatus = 'fresh' | 'stale';
const PUBLIC_JOIN_URL = 'https://discord.gg/RUFFbEaeDx';
const PUBLIC_SOURCE = 'discord_scheduled_event';

export interface AgendaProjectionEntry {
  id: string;
  title: string;
  summary: string;
  startAt: string;
  endAt: string | null;
  timezone: string;
  status: PublicAgendaStatus;
  program: string;
  series: string | null;
  joinUrl: typeof PUBLIC_JOIN_URL;
  source: typeof PUBLIC_SOURCE;
}

export interface AgendaProjection {
  schemaVersion: 'v1';
  observedAt: string;
  revision: number;
  tombstones: string[];
  entries: AgendaProjectionEntry[];
}

interface D1Result<T = unknown> {
  results?: T[];
  success?: boolean;
  meta?: Record<string, unknown>;
}

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = unknown>(column?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1Statement;
  batch(statements: D1Statement[]): Promise<D1Result[]>;
}

interface Assets {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  ASSETS: Assets;
  AGENDA_DB?: D1Database;
  KAD_PROJECTION_PUBLIC_KEY_SPKI_BASE64?: string;
  KAD_PROJECTION_KEY_ID?: string;
  ENVIRONMENT?: string;
  PUBLIC_ENVIRONMENT?: string;
}

interface StoredCheckpoint {
  revision: number;
  observed_at: string;
  received_at: string;
}

interface StoredNonce {
  nonce: string;
  revision: number;
  content_sha256: string;
}

interface StoredAgendaEntry {
  id: string;
  title: string;
  summary: string;
  start_at: string;
  end_at: string | null;
  timezone: string;
  status: AgendaStatus;
  program: string;
  series: string | null;
  join_url: string;
  source: typeof PUBLIC_SOURCE;
  revision: number;
  observed_at: string;
  generated_at: string;
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'cross-origin-resource-policy': 'same-origin',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
};

const json = (value: unknown, init: ResponseInit = {}) => {
  const headers = new Headers(JSON_HEADERS);
  for (const [key, valueEntry] of Object.entries(init.headers ?? {})) headers.set(key, String(valueEntry));
  return new Response(JSON.stringify(value), { ...init, headers });
};

const errorResponse = (status: number, code: string, detail: string) =>
  json({ error: { code, detail } }, { status });

class ProjectionTooLargeError extends Error {}

export async function readProjectionBody(request: Request): Promise<string> {
  const declaredLength = request.headers.get('content-length');
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_PROJECTION_BYTES)) {
    throw new ProjectionTooLargeError('Projection exceeds the maximum size.');
  }
  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_PROJECTION_BYTES) {
        await reader.cancel();
        throw new ProjectionTooLargeError('Projection exceeds the maximum size.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(body);
}

export const canonicalSignaturePayload = (issuedAt: string, expiresAt: string, nonce: string, contentSha256: string, body: string) =>
  `v1\n${issuedAt}\n${expiresAt}\n${nonce}\n${contentSha256}\n${body}`;

const decodeBase64 = (value: string): Uint8Array => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const toArrayBuffer = (value: Uint8Array): ArrayBuffer => Uint8Array.from(value).buffer as ArrayBuffer;

const encodeBase64 = (value: ArrayBuffer): string => {
  const bytes = new Uint8Array(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const constantTimeEqual = (left: string, right: string): boolean => {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const maxLength = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < maxLength; index += 1) difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  return difference === 0;
};

const isValidIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) && Number.isFinite(Date.parse(value));

const isSafeOpaqueId = (value: unknown): value is string =>
  typeof value === 'string' && /^agenda_[A-Za-z0-9_-]{43}$/.test(value);

const hasUnsafeText = (value: string) =>
  /<@|<@&|<@!|https?:\/\/|discord(?:app)?\.com|@everyone|@here|\b\d{15,20}\b/i.test(value);

const exactKeys = (value: object, expected: readonly string[]) => {
  const actual = Object.keys(value).sort();
  return actual.length === expected.length && actual.every((key, index) => key === [...expected].sort()[index]);
};

export function parseProjection(value: unknown): AgendaProjection {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('projection must be an object');
  const projection = value as Record<string, unknown>;
  if (!exactKeys(projection, ['schemaVersion', 'observedAt', 'revision', 'entries', 'tombstones'])) {
    throw new Error('projection contains unknown fields');
  }
  if (projection.schemaVersion !== 'v1') throw new Error('unsupported schema version');
  if (!Number.isSafeInteger(projection.revision) || (projection.revision as number) < 1) throw new Error('invalid revision');
  if (!isValidIsoDate(projection.observedAt)) throw new Error('invalid projection timestamp');
  if (Date.parse(projection.observedAt as string) > Date.now() + MAX_CLOCK_SKEW_MS) throw new Error('projection timestamp is in the future');
  if (!Array.isArray(projection.entries) || projection.entries.length > 500) throw new Error('invalid entries');
  if (!Array.isArray(projection.tombstones) || projection.tombstones.length > 500) throw new Error('invalid tombstones');

  const ids = new Set<string>();
  const entries = projection.entries.map((candidate, index) => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw new Error(`entry ${index} must be an object`);
    const entry = candidate as Record<string, unknown>;
    const fields = ['id', 'title', 'summary', 'startAt', 'endAt', 'timezone', 'status', 'program', 'series', 'joinUrl', 'source'] as const;
    if (!exactKeys(entry, fields)) throw new Error(`entry ${index} contains unknown fields`);
    if (!isSafeOpaqueId(entry.id) || ids.has(entry.id)) throw new Error(`entry ${index} has invalid or duplicate id`);
    ids.add(entry.id);
    for (const field of ['title', 'summary', 'program'] as const) {
      if (typeof entry[field] !== 'string' || entry[field].length < 1 || entry[field].length > 500 || hasUnsafeText(entry[field])) throw new Error(`entry ${index} has invalid ${field}`);
    }
    if (entry.series !== null && (typeof entry.series !== 'string' || entry.series.length < 1 || entry.series.length > 500 || hasUnsafeText(entry.series))) throw new Error(`entry ${index} has invalid series`);
    if (entry.timezone !== 'Asia/Jakarta' || typeof entry.timezone !== 'string') throw new Error(`entry ${index} has invalid timezone`);
    if (!isValidIsoDate(entry.startAt)) throw new Error(`entry ${index} has invalid startAt`);
    if (entry.endAt !== null && (!isValidIsoDate(entry.endAt) || Date.parse(entry.endAt) <= Date.parse(entry.startAt))) throw new Error(`entry ${index} has invalid endAt`);
    if (entry.status !== 'scheduled' && entry.status !== 'active') throw new Error(`entry ${index} has invalid status`);
    if (entry.joinUrl !== PUBLIC_JOIN_URL) throw new Error(`entry ${index} has invalid join URL`);
    if (entry.source !== PUBLIC_SOURCE) throw new Error(`entry ${index} has invalid source`);
    return entry as unknown as AgendaProjectionEntry;
  });
  const tombstones = projection.tombstones.map((candidate, index) => {
    if (!isSafeOpaqueId(candidate) || ids.has(candidate)) throw new Error(`tombstone ${index} has invalid or duplicate id`);
    ids.add(candidate);
    return candidate;
  });
  return { schemaVersion: 'v1', observedAt: projection.observedAt as string, revision: projection.revision as number, entries, tombstones };
}

export async function verifyProjectionSignature(request: Request, body: string, env: Env): Promise<void> {
  const schemaVersion = request.headers.get('x-kad-schema-version');
  const keyId = request.headers.get('x-kad-key-id');
  const issuedAt = request.headers.get('x-kad-issued-at');
  const expiresAt = request.headers.get('x-kad-expires-at');
  const nonce = request.headers.get('x-kad-nonce');
  const contentSha256 = request.headers.get('x-kad-content-sha256');
  const signature = request.headers.get('x-kad-signature');
  if (schemaVersion !== 'v1' || !keyId || !issuedAt || !expiresAt || !nonce || !contentSha256 || !signature) throw new Error('missing signature headers');
  if (!env.KAD_PROJECTION_PUBLIC_KEY_SPKI_BASE64 || !env.KAD_PROJECTION_KEY_ID || keyId !== env.KAD_PROJECTION_KEY_ID) throw new Error('unknown signing key');
  if (!/^\d{10,16}$/.test(issuedAt) || !/^\d{10,16}$/.test(expiresAt)) throw new Error('invalid signature timestamps');
  const issuedAtMs = Number(issuedAt);
  const expiresAtMs = Number(expiresAt);
  const now = Date.now();
  if (expiresAtMs <= issuedAtMs || expiresAtMs - issuedAtMs > MAX_CLOCK_SKEW_MS || now < issuedAtMs - MAX_CLOCK_SKEW_MS || now > expiresAtMs) throw new Error('expired signature');
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(nonce)) throw new Error('invalid nonce');
  if (!/^[A-Za-z0-9_-]{43}$/.test(contentSha256)) throw new Error('invalid content hash');
  const computedContentSha256 = encodeBase64(await crypto.subtle.digest('SHA-256', toArrayBuffer(new TextEncoder().encode(body))));
  if (!constantTimeEqual(contentSha256, computedContentSha256)) throw new Error('content hash mismatch');
  let publicKey: CryptoKey;
  try {
    publicKey = await crypto.subtle.importKey('spki', toArrayBuffer(decodeBase64(env.KAD_PROJECTION_PUBLIC_KEY_SPKI_BASE64)), { name: 'Ed25519' }, false, ['verify']);
  } catch {
    throw new Error('invalid signing key');
  }
  const valid = await crypto.subtle.verify('Ed25519', publicKey, toArrayBuffer(decodeBase64(signature)), toArrayBuffer(new TextEncoder().encode(canonicalSignaturePayload(issuedAt, expiresAt, nonce, contentSha256, body))));
  if (!valid) throw new Error('invalid signature');
}

const checkpoint = async (db: D1Database): Promise<StoredCheckpoint | null> =>
  db.prepare('SELECT revision, observed_at, received_at FROM agenda_checkpoint WHERE id = 1').first<StoredCheckpoint>();

export async function applyProjection(
  db: D1Database,
  projection: AgendaProjection,
  nonce: string,
  now = new Date().toISOString(),
  contentSha256 = 'test-content-hash',
): Promise<'applied' | 'replayed'> {
  const previous = await checkpoint(db);
  const usedNonce = await db.prepare('SELECT nonce, revision, content_sha256 FROM ingest_nonces WHERE nonce = ?1 AND expires_at > ?2').bind(nonce, now).first<StoredNonce>();
  if (usedNonce) {
    if (previous?.revision === projection.revision && usedNonce.revision === projection.revision && constantTimeEqual(usedNonce.content_sha256, contentSha256)) return 'replayed';
    throw new Error('nonce has already been used');
  }
  if (previous && projection.revision <= previous.revision) throw new Error('revision is not newer than checkpoint');
  const statements: D1Statement[] = [
    db.prepare('DELETE FROM ingest_nonces WHERE expires_at <= ?1').bind(now),
    db.prepare('INSERT INTO ingest_nonces (nonce, issued_at, revision, content_sha256, expires_at) VALUES (?1, ?2, ?3, ?4, ?5)').bind(nonce, now, projection.revision, contentSha256, new Date(Date.parse(now) + MAX_CLOCK_SKEW_MS * 2).toISOString()),
    db.prepare("UPDATE agenda_entries SET status = 'withdrawn', withdrawn_at = ?1 WHERE status != 'withdrawn'").bind(now),
  ];
  for (const entry of projection.entries) {
    statements.push(db.prepare(`INSERT INTO agenda_entries
      (id, title, summary, start_at, end_at, timezone, status, program, series, join_url, source, revision, generated_at, observed_at, withdrawn_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, NULL)
      ON CONFLICT(id) DO UPDATE SET title=excluded.title, summary=excluded.summary, start_at=excluded.start_at, end_at=excluded.end_at, timezone=excluded.timezone, status=excluded.status, program=excluded.program, series=excluded.series, join_url=excluded.join_url, source=excluded.source, revision=excluded.revision, generated_at=excluded.generated_at, observed_at=excluded.observed_at, withdrawn_at=NULL`).bind(entry.id, entry.title, entry.summary, entry.startAt, entry.endAt, entry.timezone, entry.status, entry.program, entry.series, entry.joinUrl, entry.source, projection.revision, now, projection.observedAt));
  }
  for (const tombstone of projection.tombstones) {
    statements.push(db.prepare("UPDATE agenda_entries SET status = 'withdrawn', withdrawn_at = ?1, revision = ?2, generated_at = ?3, observed_at = ?4 WHERE id = ?5").bind(now, projection.revision, now, projection.observedAt, tombstone));
  }
  statements.push(db.prepare(`INSERT INTO agenda_checkpoint (id, revision, observed_at, received_at)
    VALUES (1, ?1, ?2, ?3)
    ON CONFLICT(id) DO UPDATE SET revision=excluded.revision, observed_at=excluded.observed_at, received_at=excluded.received_at`).bind(projection.revision, projection.observedAt, now));
  try {
    await db.batch(statements);
  } catch (error) {
    // A timed-out sender can overlap its retry with the first commit. Re-read
    // the committed nonce after a constraint race and accept only the exact
    // same revision and signed content hash.
    const committedCheckpoint = await checkpoint(db);
    const committedNonce = await db.prepare('SELECT nonce, revision, content_sha256 FROM ingest_nonces WHERE nonce = ?1 AND expires_at > ?2').bind(nonce, now).first<StoredNonce>();
    if (committedCheckpoint?.revision === projection.revision && committedNonce?.revision === projection.revision && constantTimeEqual(committedNonce.content_sha256, contentSha256)) return 'replayed';
    throw error;
  }
  return 'applied';
}

const toPublicEntry = (entry: StoredAgendaEntry) => ({
  id: entry.id,
  title: entry.title,
  summary: entry.summary,
  startAt: entry.start_at,
  endAt: entry.end_at,
  timezone: entry.timezone,
  status: entry.status,
  program: entry.program,
  series: entry.series,
  joinUrl: entry.join_url,
  source: entry.source,
});

async function agendaResponse(request: Request, env: Env): Promise<Response> {
  if (!env.AGENDA_DB) return errorResponse(503, 'agenda_unavailable', 'Agenda is not configured in this environment.');
  const [rowsResult, checkpointResult] = await env.AGENDA_DB.batch([
    env.AGENDA_DB.prepare(`SELECT id, title, summary, start_at, end_at, timezone, status, program, series, join_url, source, revision, generated_at, observed_at
      FROM agenda_entries WHERE status IN ('scheduled', 'active') ORDER BY start_at ASC`),
    env.AGENDA_DB.prepare('SELECT revision, observed_at, received_at FROM agenda_checkpoint WHERE id = 1'),
  ]);
  const rows = (rowsResult?.results ?? []) as StoredAgendaEntry[];
  const current = (checkpointResult?.results?.[0] as StoredCheckpoint | undefined) ?? null;
  if (!current) return errorResponse(503, 'agenda_unavailable', 'Agenda has not received a signed projection yet.');
  const observedAt = current.observed_at;
  const staleAt = new Date(Date.parse(observedAt) + MAX_AGENDA_AGE_MS).toISOString();
  const sourceStatus: SourceStatus = Date.now() - Date.parse(observedAt) <= MAX_AGENDA_AGE_MS ? 'fresh' : 'stale';
  const payload = {
    schemaVersion: 'v1',
    generatedAt: current.received_at,
    observedAt,
    revision: current.revision,
    sourceStatus,
    staleAt,
    entries: rows.map(toPublicEntry),
  };
  const body = JSON.stringify(payload);
  const etag = `"${encodeBase64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body)))}"`;
  if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers: new Headers({ ...JSON_HEADERS, etag, 'cache-control': 'public, max-age=30, stale-while-revalidate=120' }) });
  return json(payload, { headers: { etag, 'cache-control': 'public, max-age=30, stale-while-revalidate=120' } });
}

async function readiness(env: Env): Promise<Response> {
  if (!env.AGENDA_DB) return errorResponse(503, 'not_ready', 'D1 is not configured.');
  try {
    await env.AGENDA_DB.prepare('SELECT 1').first();
    await env.AGENDA_DB.prepare('SELECT id FROM agenda_checkpoint WHERE id = 1').first();
    return json({ status: 'ready' });
  } catch {
    return errorResponse(503, 'not_ready', 'D1 schema is not ready.');
  }
}

const sameOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
};

const withCors = (response: Response, request: Request) => {
  const origin = request.headers.get('origin');
  if (origin && origin === new URL(request.url).origin) response.headers.set('access-control-allow-origin', origin);
  return response;
};

async function handleIngest(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'method_not_allowed', 'Use POST.');
  if (!sameOrigin(request)) return errorResponse(403, 'origin_forbidden', 'Cross-origin ingest is not allowed.');
  let body: string;
  try {
    body = await readProjectionBody(request);
  } catch (error) {
    if (error instanceof ProjectionTooLargeError) return errorResponse(413, 'payload_too_large', 'Projection exceeds the maximum size.');
    return errorResponse(400, 'invalid_projection', 'Projection body must be valid UTF-8.');
  }
  try {
    await verifyProjectionSignature(request, body, env);
    const parsed = parseProjection(JSON.parse(body));
    if (!env.AGENDA_DB) return errorResponse(503, 'ingest_unavailable', 'D1 is not configured.');
    const nonce = request.headers.get('x-kad-nonce')!;
    const contentSha256 = request.headers.get('x-kad-content-sha256')!;
    const outcome = await applyProjection(env.AGENDA_DB, parsed, nonce, new Date().toISOString(), contentSha256);
    return withCors(json({ status: outcome === 'replayed' ? 'already_accepted' : 'accepted', revision: parsed.revision }, { status: 202, headers: { 'cache-control': 'no-store' } }), request);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'invalid projection';
    if (/revision|nonce has already been used/i.test(detail)) {
      return errorResponse(409, 'projection_conflict', 'Projection revision or replay state conflicts with the current checkpoint.');
    }
    if (/missing signature headers|unknown signing key|invalid signature timestamps|expired signature|invalid nonce$|invalid content hash|content hash mismatch|invalid signing key|invalid signature$/i.test(detail)) {
      return errorResponse(401, 'projection_authentication_failed', 'Projection authentication failed.');
    }
    if (error instanceof SyntaxError || /projection|schema|entries|tombstone|entry \d+/i.test(detail)) {
      return errorResponse(400, 'invalid_projection', 'Projection payload does not match the public agenda contract.');
    }
    return errorResponse(500, 'projection_ingest_failed', 'Projection could not be stored.');
  }
}

function stagingCrawlBoundary(request: Request, env: Env): Response | null {
  if (env.ENVIRONMENT !== 'staging') return null;
  const path = new URL(request.url).pathname;
  if (path === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  if (path === '/sitemap.xml') return new Response('Staging sitemap is not published.\n', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  return null;
}

async function serveAssets(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  if (env.ENVIRONMENT !== 'staging') return response;
  const headers = new Headers(response.headers);
  headers.set('x-robots-tag', 'noindex, nofollow');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const boundary = stagingCrawlBoundary(request, env);
    if (boundary) return boundary;
    const url = new URL(request.url);
    if ((url.pathname.startsWith('/api/') || url.pathname === '/healthz' || url.pathname === '/readyz' || url.pathname.startsWith('/internal/')) && !sameOrigin(request)) {
      return errorResponse(403, 'origin_forbidden', 'Cross-origin requests are not allowed.');
    }
    if (request.method === 'OPTIONS' && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/internal/'))) {
      if (!sameOrigin(request)) return errorResponse(403, 'origin_forbidden', 'Cross-origin requests are not allowed.');
      return withCors(new Response(null, { status: 204, headers: { ...JSON_HEADERS, 'access-control-allow-methods': 'GET, POST, OPTIONS', 'access-control-allow-headers': 'content-type, x-kad-schema-version, x-kad-key-id, x-kad-issued-at, x-kad-expires-at, x-kad-nonce, x-kad-content-sha256, x-kad-signature', 'cache-control': 'no-store' } }), request);
    }
    if (url.pathname === '/healthz') return json({ status: 'ok', service: 'kaburajadulu-web', version: 'agenda-api-v1' }, { headers: { 'cache-control': 'no-store' } });
    if (url.pathname === '/readyz') return readiness(env);
    if (url.pathname === '/api/v1/agenda' && request.method === 'GET') return withCors(await agendaResponse(request, env), request);
    if (url.pathname === '/internal/v1/projections/agenda') return handleIngest(request, env);
    return serveAssets(request, env);
  },
};
