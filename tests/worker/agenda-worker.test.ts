import { describe, expect, test } from 'bun:test';
import worker, {
  applyProjection,
  canonicalSignaturePayload,
  parseProjection,
  readProjectionBody,
  verifyProjectionSignature,
  type AgendaProjection,
} from '../../worker/index';

const invite = 'https://discord.gg/RUFFbEaeDx';
const now = new Date().toISOString();
const agendaId = (index: number) => `agenda_${String(index).padStart(43, 'A')}`;

const projection = (revision = 1, entries = 1): AgendaProjection => ({
  schemaVersion: 'v1',
  revision,
  observedAt: now,
  tombstones: [],
  entries: Array.from({ length: entries }, (_, index) => ({
    id: agendaId(index + 1),
    title: `Language session ${index + 1}`,
    summary: 'A public session for the KAD community.',
    startAt: new Date(Date.now() + (index + 1) * 60_000).toISOString(),
    endAt: new Date(Date.now() + (index + 2) * 60_000).toISOString(),
    timezone: 'Asia/Jakarta',
    status: 'scheduled' as const,
    program: 'Language Club',
    series: 'Japanese N4',
    joinUrl: invite,
    source: 'discord_scheduled_event',
  })),
});

class FakeStatement {
  values: unknown[] = [];
  constructor(private readonly db: FakeD1, readonly query: string) {}
  bind(...values: unknown[]) { this.values = values; return this; }
  async first<T = unknown>(): Promise<T | null> {
    const query = this.query.toLowerCase();
    if (query.includes('from agenda_checkpoint')) return (this.db.checkpoint ? { ...this.db.checkpoint } : null) as T;
    if (query.includes('from ingest_nonces')) {
      const nonce = String(this.values[0]);
      const stored = this.db.nonces.get(nonce);
      return stored ? ({ nonce, ...stored } as T) : null;
    }
    return null;
  }
  async all<T = unknown>() {
    if (this.query.toLowerCase().includes('from agenda_entries')) {
      const query = this.query.toLowerCase();
      const results = (query.includes('where id')
        ? [...this.db.entries.values()].filter((entry) => entry.id === this.values[0])
        : [...this.db.entries.values()].filter((entry) => entry.status === 'scheduled' || entry.status === 'active')) as T[];
      return { results };
    }
    return { results: [] as T[] };
  }
  async run() { return { success: true }; }
}

class FakeD1 {
  entries = new Map<string, any>();
  nonces = new Map<string, { revision: number; content_sha256: string }>();
  checkpoint: any = null;
  raceRevision: number | undefined;
  concurrentReplay: { nonce: string; revision: number; contentSha256: string } | undefined;
  prepare(query: string) { return new FakeStatement(this, query); }
  async batch(statements: FakeStatement[]) {
    if (this.concurrentReplay) {
      const replay = this.concurrentReplay;
      this.concurrentReplay = undefined;
      this.nonces.set(replay.nonce, { revision: replay.revision, content_sha256: replay.contentSha256 });
      this.checkpoint = { revision: replay.revision, observed_at: now, received_at: now };
      throw new Error('UNIQUE constraint failed: ingest_nonces.nonce');
    }
    const entriesSnapshot = new Map([...this.entries].map(([id, entry]) => [id, { ...entry }]));
    const noncesSnapshot = new Map(this.nonces);
    const checkpointSnapshot = this.checkpoint && { ...this.checkpoint };
    const results: Array<{ success: boolean; results?: any[] }> = [];
    try {
      for (const statement of statements) {
        const query = statement.query.toLowerCase();
        const values = statement.values;
        if (query.includes('select') && query.includes('from agenda_entries')) {
          results.push({ success: true, results: query.includes('where id')
            ? [...this.entries.values()].filter((entry) => entry.id === values[0])
            : [...this.entries.values()].filter((entry) => entry.status === 'scheduled' || entry.status === 'active') });
          continue;
        } else if (query.includes('select') && query.includes('from agenda_checkpoint')) {
          results.push({ success: true, results: this.checkpoint ? [{ ...this.checkpoint }] : [] });
          continue;
        } else if (query.includes('delete from ingest_nonces')) {
          // The test store keeps nonces as active until a later test explicitly exercises replay.
        } else if (query.includes('insert into ingest_nonces')) this.nonces.set(String(values[0]), { revision: Number(values[2]), content_sha256: String(values[3]) });
        else if (query.includes('update agenda_entries set status')) {
          for (const entry of this.entries.values()) entry.status = 'withdrawn';
        } else if (query.includes('insert into agenda_entries')) {
          this.entries.set(String(values[0]), {
            id: values[0], title: values[1], summary: values[2], start_at: values[3], end_at: values[4], timezone: values[5], status: values[6],
            program: values[7], series: values[8], join_url: values[9], source: values[10], revision: values[11], generated_at: values[12], observed_at: values[13],
          });
        } else if (query.includes('insert into agenda_checkpoint')) {
          if (this.raceRevision !== undefined && this.checkpoint) this.checkpoint.revision = this.raceRevision;
          if (this.checkpoint && Number(values[0]) <= Number(this.checkpoint.revision)) throw new Error('revision is not newer than checkpoint');
          this.checkpoint = { revision: values[0], observed_at: values[1], received_at: values[2] };
        }
        results.push({ success: true });
      }
    } catch (error) {
      this.entries = entriesSnapshot;
      this.nonces = noncesSnapshot;
      this.checkpoint = checkpointSnapshot ? { ...checkpointSnapshot } : null;
      throw error;
    }
    return results;
  }
}

const keyPairPromise = crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);

describe('agenda projection contract', () => {
  test('accepts the exact public allow-list', () => expect(parseProjection(projection()).entries).toHaveLength(1));

  test('rejects unknown fields and Discord snowflakes/private URLs', () => {
    const extra = { ...projection(), unexpected: true };
    expect(() => parseProjection(extra)).toThrow('unknown fields');
    const snowflake = projection();
    snowflake.entries[0].id = '123456789012345678';
    expect(() => parseProjection(snowflake)).toThrow('invalid or duplicate id');
    const privateLink = projection();
    privateLink.entries[0].joinUrl = 'https://discord.com/channels/123/456' as typeof invite;
    expect(() => parseProjection(privateLink)).toThrow('invalid join URL');
    const nullableEnd = projection();
    nullableEnd.entries[0].endAt = null;
    expect(parseProjection(nullableEnd).entries[0].endAt).toBeNull();
    const directSession = projection();
    directSession.entries[0].series = null;
    expect(parseProjection(directSession).entries[0].series).toBeNull();
    const wrongSource = projection();
    wrongSource.entries[0].source = 'discord_scheduled_event_copy' as typeof wrongSource.entries[0]['source'];
    expect(() => parseProjection(wrongSource)).toThrow('invalid source');
    const privateText = projection();
    privateText.entries[0].summary = 'Internal event 123456789012345678 at https://discord.com/events/private';
    expect(() => parseProjection(privateText)).toThrow('invalid summary');
    const malformedObservedAt = projection();
    malformedObservedAt.observedAt = '1Z';
    expect(() => parseProjection(malformedObservedAt)).toThrow('invalid projection timestamp');
    const malformedStartAt = projection();
    malformedStartAt.entries[0].startAt = '1Z';
    expect(() => parseProjection(malformedStartAt)).toThrow('invalid startAt');
  });

  test('rejects stale, malformed, and invalid signatures', async () => {
    const keyPair = await keyPairPromise;
    const publicSpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const body = JSON.stringify(projection());
    const nonce = 'nonce-for-signature-test';
    const issuedAt = String(Date.now());
    const expiresAt = String(Date.now() + 60_000);
    const contentSha256 = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    const signature = await crypto.subtle.sign('Ed25519', keyPair.privateKey, new TextEncoder().encode(canonicalSignaturePayload(issuedAt, expiresAt, nonce, contentSha256, body)));
    const env = { KAD_PROJECTION_KEY_ID: 'test-key', KAD_PROJECTION_PUBLIC_KEY_SPKI_BASE64: btoa(String.fromCharCode(...new Uint8Array(publicSpki))) } as any;
    const request = new Request('https://example.test/internal/v1/projections/agenda', { method: 'POST', body, headers: { 'x-kad-schema-version': 'v1', 'x-kad-key-id': 'test-key', 'x-kad-issued-at': issuedAt, 'x-kad-expires-at': expiresAt, 'x-kad-nonce': nonce, 'x-kad-content-sha256': contentSha256, 'x-kad-signature': btoa(String.fromCharCode(...new Uint8Array(signature))) } });
    await expect(verifyProjectionSignature(request, body, env)).resolves.toBeUndefined();
    const stale = new Request(request, { headers: new Headers({ ...Object.fromEntries(request.headers), 'x-kad-expires-at': String(Date.now() - 10 * 60_000) }) });
    await expect(verifyProjectionSignature(stale, body, env)).rejects.toThrow('expired signature');
    const badHash = new Request(request, { headers: new Headers({ ...Object.fromEntries(request.headers), 'x-kad-content-sha256': 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' }) });
    await expect(verifyProjectionSignature(badHash, body, env)).rejects.toThrow('content hash mismatch');
    await expect(verifyProjectionSignature(request, `${body} `, env)).rejects.toThrow('content hash mismatch');
  });

  test('stops reading a chunked projection once it exceeds the public limit', async () => {
    const oversized = new Uint8Array(256 * 1024 + 1);
    const request = new Request('https://example.test/internal/v1/projections/agenda', {
      method: 'POST',
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(oversized.subarray(0, 128 * 1024));
          controller.enqueue(oversized.subarray(128 * 1024));
          controller.close();
        },
      }),
    });
    await expect(readProjectionBody(request)).rejects.toThrow('maximum size');
  });
});

describe('agenda persistence and public API', () => {
  test('health is cheap and readiness fails closed without D1', async () => {
    const env = { ASSETS: { fetch: async () => new Response('asset') } } as any;
    const health = await worker.fetch(new Request('https://example.test/healthz'), env);
    expect(health.status).toBe(200);
    expect((await health.json() as any).status).toBe('ok');
    const ready = await worker.fetch(new Request('https://example.test/readyz'), env);
    expect(ready.status).toBe(503);
  });

  test('full snapshots withdraw absent rows and reject replay/downgrade', async () => {
    const db = new FakeD1();
    await applyProjection(db as any, projection(1, 2), 'nonce-first');
    await applyProjection(db as any, projection(2, 1), 'nonce-second');
    expect(db.entries.get(agendaId(2)).status).toBe('withdrawn');
    await expect(applyProjection(db as any, projection(2, 1), 'nonce-third')).rejects.toThrow('not newer');
    await expect(applyProjection(db as any, projection(3, 1), 'nonce-second')).rejects.toThrow('already been used');
  });

  test('accepts an identical retry but rejects changed content under the same nonce', async () => {
    const db = new FakeD1();
    const first = projection(1, 1);
    expect(await applyProjection(db as any, first, 'nonce-idempotent', now, 'same-content-hash')).toBe('applied');
    expect(await applyProjection(db as any, first, 'nonce-idempotent', now, 'same-content-hash')).toBe('replayed');
    await expect(applyProjection(db as any, first, 'nonce-idempotent', now, 'changed-content-hash')).rejects.toThrow('already been used');
  });

  test('reconciles a concurrent identical retry after the nonce insert wins elsewhere', async () => {
    const db = new FakeD1();
    db.concurrentReplay = { nonce: 'nonce-concurrent', revision: 1, contentSha256: 'same-content-hash' };
    expect(await applyProjection(db as any, projection(1, 1), 'nonce-concurrent', now, 'same-content-hash')).toBe('replayed');
  });

  test('accepts explicit tombstones and computes stale status from observedAt', async () => {
    const db = new FakeD1();
    await applyProjection(db as any, projection(1, 1), 'nonce-tombstone');
    const withdrawn = projection(2, 0);
    withdrawn.tombstones = [agendaId(1)];
    await applyProjection(db as any, withdrawn, 'nonce-tombstone-2', new Date(Date.now() + 1).toISOString());
    expect(db.entries.get(agendaId(1)).status).toBe('withdrawn');
    const stale = projection(3, 0);
    stale.observedAt = new Date(Date.now() - 60 * 60_000).toISOString();
    await applyProjection(db as any, stale, 'nonce-stale');
    const response = await worker.fetch(new Request('https://example.test/api/v1/agenda'), { AGENDA_DB: db, ASSETS: { fetch: async () => new Response('asset') } } as any);
    expect((await response.json() as any).sourceStatus).toBe('stale');
  });

  test('atomic revision guard rolls back a raced lower revision', async () => {
    const db = new FakeD1();
    await applyProjection(db as any, projection(1, 1), 'nonce-atomic-1');
    db.raceRevision = 3;
    await expect(applyProjection(db as any, projection(2, 1), 'nonce-atomic-2')).rejects.toThrow('not newer');
    expect(db.checkpoint.revision).toBe(1);
    expect(db.nonces.has('nonce-atomic-2')).toBe(false);
    expect(db.entries.get(agendaId(1)).revision).toBe(1);
  });

  test('returns cache metadata and honours ETag', async () => {
    const db = new FakeD1();
    await applyProjection(db as any, projection(), 'nonce-api');
    const env = { AGENDA_DB: db, ASSETS: { fetch: async () => new Response('asset') } } as any;
    const first = await worker.fetch(new Request('https://example.test/api/v1/agenda'), env);
    expect(first.status).toBe(200);
    const firstPayload = await first.json() as any;
    expect(firstPayload.entries).toHaveLength(1);
    expect(firstPayload.sourceStatus).toBe('fresh');
    expect(firstPayload.generatedAt).toBeTruthy();
    expect(firstPayload.staleAt).toBeTruthy();
    const second = await worker.fetch(new Request('https://example.test/api/v1/agenda', { headers: { 'if-none-match': first.headers.get('etag')! } }), env);
    expect(second.status).toBe(304);
  });

  test('returns one opaque-id detail DTO, keeps withdrawn records out of the list, and honours detail ETag', async () => {
    const db = new FakeD1();
    await applyProjection(db as any, projection(), 'nonce-detail');
    const env = { AGENDA_DB: db, ASSETS: { fetch: async () => new Response('asset') } } as any;
    const id = agendaId(1);
    const first = await worker.fetch(new Request(`https://example.test/api/v1/agenda/${id}`), env);
    expect(first.status).toBe(200);
    const payload = await first.json() as any;
    expect(Object.keys(payload).sort()).toEqual(['entry', 'generatedAt', 'observedAt', 'revision', 'schemaVersion', 'sourceStatus', 'staleAt']);
    expect(Object.keys(payload.entry).sort()).toEqual(['endAt', 'id', 'joinUrl', 'program', 'series', 'source', 'startAt', 'status', 'summary', 'timezone', 'title']);
    expect(JSON.stringify(payload)).not.toMatch(/discord_id|snowflake|channel|raw/i);
    const second = await worker.fetch(new Request(`https://example.test/api/v1/agenda/${id}`, { headers: { 'if-none-match': first.headers.get('etag')! } }), env);
    expect(second.status).toBe(304);
    const withdrawn = projection(2, 0);
    withdrawn.tombstones = [id];
    await applyProjection(db as any, withdrawn, 'nonce-detail-withdrawn');
    const gone = await worker.fetch(new Request(`https://example.test/api/v1/agenda/${id}`), env);
    expect(gone.status).toBe(410);
    expect(gone.headers.get('cache-control')).toBe('no-store');
    const goneBody = await gone.json() as any;
    expect(Object.keys(goneBody)).toEqual(['error']);
    expect(JSON.stringify(goneBody)).not.toMatch(/title|summary|program|series|join|source|agenda_A/);
  });

  test('fails closed when a stored row violates the public DTO contract', async () => {
    const db = new FakeD1();
    await applyProjection(db as any, projection(), 'nonce-invalid-row');
    db.entries.get(agendaId(1)).title = 'Private <@123456789012345678>';
    const env = { AGENDA_DB: db, ASSETS: { fetch: async () => new Response('asset') } } as any;
    const response = await worker.fetch(new Request('https://example.test/api/v1/agenda'), env);
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toMatch(/Private|123456789012345678/);
  });

  test('fails closed when the checkpoint is malformed, future, or out of sync with an active row', async () => {
    const db = new FakeD1();
    await applyProjection(db as any, projection(), 'nonce-invalid-checkpoint');
    const env = { AGENDA_DB: db, ASSETS: { fetch: async () => new Response('asset') } } as any;

    db.checkpoint.revision = '1';
    const malformed = await worker.fetch(new Request('https://example.test/api/v1/agenda'), env);
    expect(malformed.status).toBe(503);
    expect(JSON.stringify(await malformed.json())).not.toMatch(/agenda_A|Language session/);

    db.checkpoint = { revision: 1, observed_at: new Date(Date.now() + 60 * 60_000).toISOString(), received_at: now };
    const future = await worker.fetch(new Request('https://example.test/api/v1/agenda'), env);
    expect(future.status).toBe(503);

    db.checkpoint = { revision: 1, observed_at: now, received_at: now };
    db.entries.get(agendaId(1)).revision = 99;
    const mismatch = await worker.fetch(new Request('https://example.test/api/v1/agenda'), env);
    expect(mismatch.status).toBe(503);
    const detail = await worker.fetch(new Request(`https://example.test/api/v1/agenda/${agendaId(1)}`), env);
    expect(detail.status).toBe(503);
    expect(JSON.stringify(await detail.json())).not.toMatch(/Language session|agenda_A/);
  });

  test('staging assets are noindex and sitemap is unavailable', async () => {
    const env = { ENVIRONMENT: 'staging', ASSETS: { fetch: async () => new Response('asset') } } as any;
    const page = await worker.fetch(new Request('https://example.test/'), env);
    expect(page.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect((await worker.fetch(new Request('https://example.test/robots.txt'), env)).text()).resolves.toContain('Disallow: /');
    expect((await worker.fetch(new Request('https://example.test/sitemap.xml'), env)).status).toBe(404);
  });

  test('rejects cross-origin API access and permits only same-origin preflight', async () => {
    const env = { AGENDA_DB: new FakeD1(), ASSETS: { fetch: async () => new Response('asset') } } as any;
    const foreign = await worker.fetch(new Request('https://example.test/api/v1/agenda', { headers: { origin: 'https://attacker.example' } }), env);
    expect(foreign.status).toBe(403);
    expect(foreign.headers.get('access-control-allow-origin')).toBeNull();

    const foreignPreflight = await worker.fetch(new Request('https://example.test/internal/v1/projections/agenda', { method: 'OPTIONS', headers: { origin: 'https://attacker.example' } }), env);
    expect(foreignPreflight.status).toBe(403);

    const sameOriginPreflight = await worker.fetch(new Request('https://example.test/internal/v1/projections/agenda', { method: 'OPTIONS', headers: { origin: 'https://example.test' } }), env);
    expect(sameOriginPreflight.status).toBe(204);
    expect(sameOriginPreflight.headers.get('access-control-allow-origin')).toBe('https://example.test');
  });

  test('returns 503 before the first signed checkpoint', async () => {
    const env = { AGENDA_DB: new FakeD1(), ASSETS: { fetch: async () => new Response('asset') } } as any;
    const response = await worker.fetch(new Request('https://example.test/api/v1/agenda'), env);
    expect(response.status).toBe(503);
  });

  test('does not expose storage failures through the ingest response', async () => {
    const keyPair = await keyPairPromise;
    const publicSpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const body = JSON.stringify(projection());
    const issuedAt = String(Date.now());
    const expiresAt = String(Date.now() + 60_000);
    const nonce = 'nonce-storage-failure-test';
    const contentSha256 = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    const signature = await crypto.subtle.sign('Ed25519', keyPair.privateKey, new TextEncoder().encode(canonicalSignaturePayload(issuedAt, expiresAt, nonce, contentSha256, body)));
    const env = {
      AGENDA_DB: {
        prepare: () => ({ bind() { return this; }, first: async () => null }),
        batch: async () => { throw new Error('D1_ERROR: secret_table_name and SQL internals'); },
      },
      ASSETS: { fetch: async () => new Response('asset') },
      KAD_PROJECTION_KEY_ID: 'test-key',
      KAD_PROJECTION_PUBLIC_KEY_SPKI_BASE64: btoa(String.fromCharCode(...new Uint8Array(publicSpki))),
    } as any;
    const request = new Request('https://example.test/internal/v1/projections/agenda', {
      method: 'POST',
      body,
      headers: {
        'x-kad-schema-version': 'v1',
        'x-kad-key-id': 'test-key',
        'x-kad-issued-at': issuedAt,
        'x-kad-expires-at': expiresAt,
        'x-kad-nonce': nonce,
        'x-kad-content-sha256': contentSha256,
        'x-kad-signature': btoa(String.fromCharCode(...new Uint8Array(signature))),
      },
    });
    const response = await worker.fetch(request, env);
    expect(response.status).toBe(500);
    const serialized = JSON.stringify(await response.json());
    expect(serialized).not.toContain('secret_table_name');
    expect(serialized).toContain('Projection could not be stored.');
  });
});
