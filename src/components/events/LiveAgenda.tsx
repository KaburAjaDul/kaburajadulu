import { useEffect, useMemo, useState } from 'react';
import { operationalProgramHref } from '@/content/live-agenda';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';
import {
  isPayloadStale,
  parseAgendaPayload,
  type AgendaEntry,
  type AgendaPayload,
} from '@/components/events/live-agenda-contract';

type AgendaPhase = 'loading' | 'ready' | 'empty' | 'error';
const AGENDA_ENDPOINT = '/api/v1/agenda';
const AGENDA_SOURCE = 'discord_scheduled_event';

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

function parsePayload(value: unknown): LoadedAgenda | null {
  const payload = parseAgendaPayload(value);
  if (!payload) return null;
  return { phase: payload.entries.length > 0 ? 'ready' : 'empty', entries: payload.entries, payload, stale: isPayloadStale(payload) };
}

function sortEntries(entries: AgendaEntry[]): AgendaEntry[] {
  return [...entries].sort((left, right) => {
    if (left.status !== right.status) return left.status === 'active' ? -1 : 1;
    return Date.parse(left.startAt) - Date.parse(right.startAt);
  });
}

function formatDate(value: string, locale: string, timezone: string): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : locale === 'ar' ? 'ar' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: timezone,
  }).format(new Date(value));
}

function formatTime(value: string, locale: string, timezone: string): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : locale === 'ar' ? 'ar' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(value));
}

function timezoneLabel(timezone: string, locale: string): string {
  if (timezone === 'Asia/Jakarta') return locale === 'id' ? 'WIB · Jakarta' : locale === 'ar' ? 'توقيت جاكرتا (WIB)' : 'Jakarta time (WIB)';
  return timezone;
}

function revisionCopy(locale: string, revision: number): string {
  return locale === 'id' ? `Revisi sumber ${revision}` : locale === 'ar' ? `مراجعة المصدر ${revision}` : `Source revision ${revision}`;
}

export default function LiveAgenda({ locale, discordUrl, copy }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AgendaState>({ phase: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ phase: 'loading' });
    fetch(AGENDA_ENDPOINT, { headers: { accept: 'application/json' }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`agenda-${response.status}`);
        return parsePayload(await response.json());
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

  const isEnglish = locale !== 'id' && locale !== 'ar';
  const text = useMemo(() => locale === 'ar' ? {
    live: 'مباشر الآن', scheduled: 'مجدول', join: 'الانضمام عبر Discord', noRegistration: 'لا يلزم التسجيل أو التأكيد عبر الموقع.', loading: 'جارٍ تحميل الأجندة العامة…', emptyTitle: 'لا توجد أجندة عامة مجدولة بعد.', emptyDescription: 'ستظهر المواعيد المؤكدة هنا. تحقق من Discord للحصول على آخر التحديثات.', staleTitle: 'قد تكون الأجندة قديمة.', staleDescription: 'تحقق من Discord من الوقت الأحدث قبل الانضمام.', errorTitle: 'تعذر تحميل الأجندة.', errorDescription: 'يمكنك المحاولة مرة أخرى أو فتح Discord لرؤية جدول المجتمع الحالي.', retry: 'حاول مرة أخرى', source: 'المصدر', sourceLabel: 'فعالية مجدولة في Discord', endTimePending: 'لم يُنشر وقت الانتهاء.', agendaHeading: 'الأجندة القادمة', program: 'البرنامج', series: 'السلسلة',
  } : isEnglish ? {
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
  }, [isEnglish, locale]);

  return (
    <div className="kad-live-agenda" data-agenda-app data-agenda-phase={state.phase} data-agenda-source={AGENDA_SOURCE}>
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
                        <h3><a href={localizedPath(locale as Locale, `/events/live/?id=${encodeURIComponent(entry.id)}`)}>{entry.title}</a></h3>
                        <p className="kad-live-agenda__summary">{entry.summary}</p>
                        <dl className="kad-live-agenda__context">
                          <div><dt>{text.program}</dt><dd>{operationalProgramHref(locale as Locale, entry.program) ? <a href={operationalProgramHref(locale as Locale, entry.program)!}>{entry.program}</a> : <span data-program-mapping="unmapped">{entry.program}</span>}</dd></div>
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
