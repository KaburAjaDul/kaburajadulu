import { useEffect, useMemo, useState } from 'react';

type AgendaStatus = 'scheduled' | 'active';
type AgendaPhase = 'loading' | 'ready' | 'empty' | 'error';

interface AgendaEntry {
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
  source: string;
}

interface AgendaPayload {
  schemaVersion: 'v1';
  generatedAt: string;
  observedAt: string;
  revision: number;
  sourceStatus: 'fresh' | 'stale';
  staleAt?: string | null;
  entries: unknown[];
}

interface Props {
  locale: string;
  discordUrl: string;
  copy: {
    eyebrow: string;
    title: string;
    description: string;
    discord: string;
  };
}

interface LoadedAgenda {
  phase: Exclude<AgendaPhase, 'loading' | 'error'>;
  entries: AgendaEntry[];
  payload: AgendaPayload;
  stale: boolean;
}

interface AgendaError {
  phase: 'error';
  message: string;
}

type AgendaState = { phase: 'loading' } | LoadedAgenda | AgendaError;

const unsafePublicText = /<@!?\d+>|@everyone|@here|\b\d{15,20}\b|https?:\/\/|discord(?:app)?\.com|discord\.gg/i;
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

function parseEntry(value: unknown, discordUrl: string): AgendaEntry | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  if (!hasExactKeys(item, ['id', 'title', 'summary', 'startAt', 'endAt', 'timezone', 'status', 'program', 'series', 'joinUrl', 'source'])) return null;
  if (item.status !== 'scheduled' && item.status !== 'active') return null;
  if (item.source !== 'discord_scheduled_event' || item.joinUrl !== discordUrl) return null;
  if (!isSafeText(item.id) || !/^agenda_[A-Za-z0-9_-]{43}$/.test(item.id) || !isSafeText(item.title) || !isSafeText(item.summary) || !isSafeText(item.program) || item.timezone !== 'Asia/Jakarta') return null;
  if (!isIsoTimestamp(item.startAt)) return null;
  if (item.endAt !== null && !isIsoTimestamp(item.endAt)) return null;
  if (item.endAt !== null && Date.parse(item.endAt) <= Date.parse(item.startAt)) return null;
  if (item.series !== null && item.series !== undefined && !isSafeText(item.series)) return null;
  const series = item.series === null || item.series === undefined ? null : item.series;
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    startAt: item.startAt,
    endAt: item.endAt,
    timezone: item.timezone,
    status: item.status,
    program: item.program,
    series,
    joinUrl: discordUrl,
    source: item.source,
  };
}

function parsePayload(value: unknown, discordUrl: string): LoadedAgenda | null {
  if (!value || typeof value !== 'object') return null;
  const payload = value as Partial<AgendaPayload>;
  if (!hasExactKeys(payload as Record<string, unknown>, ['schemaVersion', 'generatedAt', 'observedAt', 'revision', 'sourceStatus', 'staleAt', 'entries'])) return null;
  const revision = payload.revision;
  if (payload.schemaVersion !== 'v1' || !Array.isArray(payload.entries) || !isIsoTimestamp(payload.generatedAt) || !isIsoTimestamp(payload.observedAt) || typeof revision !== 'number' || !Number.isSafeInteger(revision) || revision < 1 || (payload.sourceStatus !== 'fresh' && payload.sourceStatus !== 'stale')) return null;
  if (payload.staleAt !== null && payload.staleAt !== undefined && !isIsoTimestamp(payload.staleAt)) return null;
  const parsedEntries = payload.entries.map((entry) => parseEntry(entry, discordUrl));
  if (parsedEntries.some((entry) => entry === null)) return null;
  const entries = parsedEntries as AgendaEntry[];
  if (new Set(entries.map((entry) => entry.id)).size !== entries.length) return null;
  const staleAt = payload.staleAt ?? null;
  const stale = payload.sourceStatus === 'stale' || (staleAt !== null && Date.parse(staleAt) <= Date.now());
  return {
    phase: entries.length > 0 ? 'ready' : 'empty',
    entries,
    payload: payload as AgendaPayload,
    stale,
  };
}

function sortEntries(entries: AgendaEntry[]): AgendaEntry[] {
  return [...entries].sort((left, right) => {
    if (left.status !== right.status) return left.status === 'active' ? -1 : 1;
    return Date.parse(left.startAt) - Date.parse(right.startAt);
  });
}

function formatDate(value: string, locale: string, timezone: string): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: timezone,
  }).format(new Date(value));
}

function formatTime(value: string, locale: string, timezone: string): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(value));
}

function timezoneLabel(timezone: string, locale: string): string {
  if (timezone === 'Asia/Jakarta') return locale === 'id' ? 'WIB · Jakarta' : 'Jakarta time (WIB)';
  return timezone;
}

function revisionCopy(locale: string, revision: number): string {
  return locale === 'id' ? `Revisi sumber ${revision}` : `Source revision ${revision}`;
}

export default function LiveAgenda({ locale, discordUrl, copy }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AgendaState>({ phase: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ phase: 'loading' });
    fetch('/api/v1/agenda', { headers: { accept: 'application/json' }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`agenda-${response.status}`);
        return parsePayload(await response.json(), discordUrl);
      })
      .then((payload) => {
        if (!payload) throw new Error('agenda-invalid-payload');
        setState({ ...payload, entries: sortEntries(payload.entries) });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState({ phase: 'error', message: error instanceof Error ? error.message : 'agenda-request-failed' });
      });
    return () => controller.abort();
  }, [attempt, discordUrl]);

  const isEnglish = locale !== 'id';
  const text = useMemo(() => isEnglish ? {
    live: 'Live now',
    scheduled: 'Scheduled',
    join: 'Join on Discord',
    noRegistration: 'No web registration or confirmation is required.',
    loading: 'Loading the public agenda…',
    emptyTitle: 'No public agenda is scheduled yet.',
    emptyDescription: 'Once a confirmed schedule is available, it will appear here. In the meantime, check Discord for the latest updates.',
    staleTitle: 'The agenda may be out of date.',
    staleDescription: 'Check Discord for the latest timing before you join.',
    errorTitle: 'The agenda could not be loaded.',
    errorDescription: 'You can retry, or open Discord to see the current community schedule.',
    retry: 'Try again',
    source: 'Source',
    sourceLabel: 'Discord scheduled event',
    endTimePending: 'End time not published.',
    agendaHeading: 'Upcoming agenda',
    program: 'Program',
    series: 'Series',
  } : {
    live: 'Sedang berlangsung',
    scheduled: 'Terjadwal',
    join: 'Gabung lewat Discord',
    noRegistration: 'Tidak perlu mendaftar atau mengonfirmasi lewat web.',
    loading: 'Memuat agenda publik…',
    emptyTitle: 'Belum ada agenda publik terjadwal.',
    emptyDescription: 'Begitu ada jadwal yang sudah dikonfirmasi, kegiatannya akan muncul di sini. Sementara itu, cek Discord untuk kabar terbaru.',
    staleTitle: 'Agenda mungkin belum mutakhir.',
    staleDescription: 'Periksa Discord untuk waktu terbaru sebelum bergabung.',
    errorTitle: 'Agenda belum dapat dimuat.',
    errorDescription: 'Coba lagi, atau buka Discord untuk melihat jadwal komunitas terbaru.',
    retry: 'Coba lagi',
    source: 'Sumber',
    sourceLabel: 'Acara terjadwal di Discord',
    endTimePending: 'Waktu selesai belum dipublikasikan.',
    agendaHeading: 'Agenda terdekat',
    program: 'Program',
    series: 'Seri',
  }, [isEnglish]);

  return (
    <div className="kad-live-agenda" data-agenda-app data-agenda-phase={state.phase}>
      <header className="kad-live-agenda__header" data-page-header="schedule" aria-labelledby="page-title">
        <div>
          <p className="kad-eyebrow">{copy.eyebrow}</p>
          <h1 id="page-title">{copy.title}</h1>
          <p className="kad-live-agenda__header-summary">{copy.description}</p>
        </div>
        <div className="kad-live-agenda__rule" aria-hidden="true"><span>01</span><i /></div>
      </header>

      <section className="kad-live-agenda__surface" aria-labelledby="agenda-list-title" aria-busy={state.phase === 'loading'}>
        <div className="kad-live-agenda__section-heading">
          <div>
            <p className="kad-kicker">Agenda</p>
            <h2 id="agenda-list-title">{text.agendaHeading}</h2>
          </div>
          <p className="kad-note">{text.noRegistration}</p>
        </div>

        {state.phase === 'loading' && (
          <div className="kad-live-agenda__loading" role="status" aria-live="polite">
            <span className="kad-skeleton kad-skeleton--wide" />
            <span className="kad-skeleton" />
            <span className="kad-skeleton kad-skeleton--short" />
            <span className="kad-live-agenda__sr-only">{text.loading}</span>
          </div>
        )}

        {state.phase === 'error' && (
          <div className="kad-live-agenda__state" data-agenda-state="error" role="alert" aria-live="assertive">
            <span className="kad-status kad-status--semantic" data-status="error">{isEnglish ? 'Needs attention' : 'Perlu diperiksa'}</span>
            <h3>{text.errorTitle}</h3>
            <p>{text.errorDescription}</p>
            <div className="kad-live-agenda__state-actions">
              <button className="kad-button kad-button--primary" type="button" onClick={() => setAttempt((value) => value + 1)}>{text.retry}</button>
              <a className="kad-button kad-button--outline" href={discordUrl} target="_blank" rel="noopener noreferrer">{copy.discord}</a>
            </div>
          </div>
        )}

        {(state.phase === 'empty' || state.phase === 'ready') && (
          <>
            {state.stale && <div className="kad-live-agenda__stale" data-agenda-state="stale" role="status" aria-live="polite"><strong>{text.staleTitle}</strong><span>{text.staleDescription}</span></div>}
            {state.phase === 'empty' ? (
              <div className="kad-live-agenda__state" data-agenda-state="empty">
                <span className="kad-status kad-status--semantic" data-status="empty">{isEnglish ? 'No public agenda' : 'Belum tersedia'}</span>
                <h3>{text.emptyTitle}</h3>
                <p>{text.emptyDescription}</p>
                <a className="kad-button kad-button--outline" href={discordUrl} target="_blank" rel="noopener noreferrer">{copy.discord}</a>
              </div>
            ) : (
              <>
                <ol className="kad-live-agenda__list" data-agenda-list>
                  {state.entries.map((entry) => (
                    <li key={entry.id} data-agenda-entry={entry.id} data-agenda-status={entry.status}>
                      <article className="kad-live-agenda__card">
                        <div className="kad-live-agenda__card-meta">
                          <span className={`kad-live-agenda__status kad-live-agenda__status--${entry.status}`} data-agenda-status-label>{entry.status === 'active' ? text.live : text.scheduled}</span>
                          <time dateTime={entry.startAt}>{formatDate(entry.startAt, locale, entry.timezone)} · {formatTime(entry.startAt, locale, entry.timezone)}{entry.endAt ? <>–{formatTime(entry.endAt, locale, entry.timezone)}</> : <> · <span className="kad-live-agenda__pending-end">{text.endTimePending}</span></>} <span>{timezoneLabel(entry.timezone, locale)}</span></time>
                        </div>
                        <h3>{entry.title}</h3>
                        <p className="kad-live-agenda__summary">{entry.summary}</p>
                        <dl className="kad-live-agenda__context">
                          <div><dt>{text.program}</dt><dd>{entry.program}</dd></div>
                          {entry.series && <div><dt>{text.series}</dt><dd>{entry.series}</dd></div>}
                        </dl>
                        <div className="kad-live-agenda__card-footer">
                          <small>{text.source}: {text.sourceLabel}</small>
                          <a className="kad-button kad-button--primary" data-discord-join-path href={entry.joinUrl} target="_blank" rel="noopener noreferrer">{text.join}</a>
                        </div>
                      </article>
                    </li>
                  ))}
                </ol>
                <p className="kad-live-agenda__freshness" data-agenda-freshness>{revisionCopy(locale, state.payload.revision)}</p>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
