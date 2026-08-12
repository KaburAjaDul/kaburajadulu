export type AgendaStatus = 'scheduled' | 'active' | 'withdrawn';

export interface AgendaEntry {
  id: string;
  title: string;
  summary: string;
  startAt: string;
  endAt: string | null;
  timezone: string;
  status: AgendaStatus;
  program: string;
  series: string | null;
  joinUrl: string;
  source: 'discord_scheduled_event';
}

export interface AgendaPayload {
  schemaVersion: 'v1';
  generatedAt: string;
  observedAt: string;
  revision: number;
  sourceStatus: 'fresh' | 'stale';
  staleAt: string;
  entries: AgendaEntry[];
}

export interface AgendaDetailPayload {
  schemaVersion: 'v1';
  generatedAt: string;
  observedAt: string;
  revision: number;
  sourceStatus: 'fresh' | 'stale';
  staleAt: string;
  entry: AgendaEntry;
}

export const INVITE = 'https://discord.gg/RUFFbEaeDx';
const unsafePublicText = /<@!?(?:\d+)>|@everyone|@here|\b\d{15,20}\b|https?:\/\/|discord(?:app)?\.com|discord\.gg/i;
const isoTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function hasExactKeys(value: Record<string, unknown>, expected: readonly string[]): boolean {
  const keys = Object.keys(value).sort();
  const allowed = [...expected].sort();
  return keys.length === allowed.length && keys.every((key, index) => key === allowed[index]);
}

function isSafeText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !unsafePublicText.test(value);
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === 'string' && isoTimestamp.test(value) && !Number.isNaN(Date.parse(value));
}

export function parseAgendaEntry(value: unknown): AgendaEntry | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (!hasExactKeys(item, ['id', 'title', 'summary', 'startAt', 'endAt', 'timezone', 'status', 'program', 'series', 'joinUrl', 'source'])) return null;
  if (item.status !== 'scheduled' && item.status !== 'active' && item.status !== 'withdrawn') return null;
  if (item.source !== 'discord_scheduled_event' || item.joinUrl !== INVITE) return null;
  if (!isSafeText(item.id) || !/^agenda_[A-Za-z0-9_-]{43}$/.test(item.id) || !isSafeText(item.title) || !isSafeText(item.summary) || !isSafeText(item.program) || item.timezone !== 'Asia/Jakarta') return null;
  if (!isIsoTimestamp(item.startAt)) return null;
  if (item.endAt !== null && !isIsoTimestamp(item.endAt)) return null;
  if (item.endAt !== null && Date.parse(item.endAt) <= Date.parse(item.startAt)) return null;
  if (item.series !== null && !isSafeText(item.series)) return null;
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    startAt: item.startAt,
    endAt: item.endAt,
    timezone: item.timezone,
    status: item.status,
    program: item.program,
    series: item.series,
    joinUrl: INVITE,
    source: 'discord_scheduled_event',
  };
}

function parseEnvelope(value: unknown, kind: 'list' | 'detail'): Omit<AgendaPayload, 'entries'> & { entries?: AgendaEntry[]; entry?: AgendaEntry } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const payload = value as Record<string, unknown>;
  const fields = ['schemaVersion', 'generatedAt', 'observedAt', 'revision', 'sourceStatus', 'staleAt', kind === 'list' ? 'entries' : 'entry'];
  if (!hasExactKeys(payload, fields)) return null;
  if (payload.schemaVersion !== 'v1' || !isIsoTimestamp(payload.generatedAt) || !isIsoTimestamp(payload.observedAt) || !isIsoTimestamp(payload.staleAt) || (payload.sourceStatus !== 'fresh' && payload.sourceStatus !== 'stale') || typeof payload.revision !== 'number' || !Number.isSafeInteger(payload.revision) || payload.revision < 1) return null;
  if (kind === 'list') {
    if (!Array.isArray(payload.entries)) return null;
    const entries = payload.entries.map(parseAgendaEntry);
    if (entries.some((entry) => entry === null)) return null;
    const parsedEntries = entries as AgendaEntry[];
    if (new Set(parsedEntries.map((entry) => entry.id)).size !== parsedEntries.length || parsedEntries.some((entry) => entry.status === 'withdrawn')) return null;
    return { schemaVersion: 'v1', generatedAt: payload.generatedAt as string, observedAt: payload.observedAt as string, revision: payload.revision as number, sourceStatus: payload.sourceStatus, staleAt: payload.staleAt as string, entries: parsedEntries };
  }
  const entry = parseAgendaEntry(payload.entry);
  return entry ? { schemaVersion: 'v1', generatedAt: payload.generatedAt as string, observedAt: payload.observedAt as string, revision: payload.revision as number, sourceStatus: payload.sourceStatus, staleAt: payload.staleAt as string, entry } : null;
}

export function parseAgendaPayload(value: unknown): AgendaPayload | null {
  return parseEnvelope(value, 'list') as AgendaPayload | null;
}

export function parseAgendaDetailPayload(value: unknown): AgendaDetailPayload | null {
  return parseEnvelope(value, 'detail') as AgendaDetailPayload | null;
}

export function isPayloadStale(payload: Pick<AgendaPayload, 'sourceStatus' | 'staleAt'>): boolean {
  return payload.sourceStatus === 'stale' || Date.parse(payload.staleAt) <= Date.now();
}
