import { useEffect, useMemo, useState } from 'react';
import { operationalProgramHref } from '@/content/live-agenda';
import type { Locale } from '@/i18n/constants';
import { INVITE, isPayloadStale, parseAgendaDetailPayload, type AgendaDetailPayload, type AgendaEntry } from '@/components/events/live-agenda-contract';

type DetailPhase = 'loading' | 'ready' | 'stale' | 'withdrawn' | 'not-found' | 'error';
type DetailState = { phase: 'loading' } | { phase: Exclude<DetailPhase, 'loading'>; entry?: AgendaEntry; payload?: AgendaDetailPayload };

interface Props {
  locale: string;
  opaqueId: string;
  backHref: string;
  discordLabel: string;
}

const copy = (locale: string) => locale === 'id' ? {
  loading: 'Memuat detail agenda…', ready: 'Agenda publik', stale: 'Sumber agenda mungkin belum mutakhir.', withdrawn: 'Agenda ini sudah ditarik.', notFound: 'Agenda tidak ditemukan.', error: 'Detail agenda belum dapat dimuat.', retry: 'Coba lagi', back: 'Kembali ke agenda', join: 'Gabung lewat Discord', source: 'Acara terjadwal di Discord', noRegistration: 'Tidak perlu mendaftar atau mengonfirmasi lewat web.', program: 'Program', series: 'Seri', when: 'Waktu', endPending: 'Waktu selesai belum dipublikasikan.',
} : locale === 'ar' ? {
  loading: 'جارٍ تحميل تفاصيل الأجندة…', ready: 'أجندة عامة', stale: 'قد يكون مصدر الأجندة قديماً.', withdrawn: 'تم سحب هذا الموعد.', notFound: 'لم يتم العثور على الموعد.', error: 'تعذر تحميل تفاصيل الأجندة.', retry: 'حاول مرة أخرى', back: 'العودة إلى الأجندة', join: 'الانضمام عبر Discord', source: 'فعالية مجدولة في Discord', noRegistration: 'لا يلزم التسجيل أو التأكيد عبر الموقع.', program: 'البرنامج', series: 'السلسلة', when: 'الموعد', endPending: 'لم يُنشر وقت الانتهاء.',
} : {
  loading: 'Loading agenda detail…', ready: 'Public agenda', stale: 'The agenda source may be out of date.', withdrawn: 'This agenda item has been withdrawn.', notFound: 'Agenda item not found.', error: 'The agenda detail could not be loaded.', retry: 'Try again', back: 'Back to agenda', join: 'Join on Discord', source: 'Discord scheduled event', noRegistration: 'No web registration or confirmation is required.', program: 'Program', series: 'Series', when: 'When', endPending: 'End time not published.',
};

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : locale === 'id' ? 'id-ID' : 'en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(value));
}

export default function LiveAgendaDetail({ locale, opaqueId, backHref, discordLabel }: Props) {
  const [attempt, setAttempt] = useState(0);
  const [requestedId, setRequestedId] = useState(opaqueId);
  const [state, setState] = useState<DetailState>({ phase: 'loading' });
  const text = useMemo(() => copy(locale), [locale]);

  useEffect(() => {
    const queryId = new URLSearchParams(window.location.search).get('id');
    const id = queryId || requestedId;
    if (!id) { setState({ phase: 'not-found' }); return; }
    setRequestedId(id);
    const controller = new AbortController();
    setState({ phase: 'loading' });
    fetch(`/api/v1/agenda/${encodeURIComponent(id)}`, { headers: { accept: 'application/json' }, signal: controller.signal })
      .then(async (response) => {
        if (response.status === 410) return setState({ phase: 'withdrawn' });
        let body: unknown = null;
        try { body = await response.json(); } catch { body = null; }
        if (response.status === 404) return setState({ phase: 'not-found' });
        const payload = parseAgendaDetailPayload(body);
        if (!response.ok || !payload || payload.entry.status === 'withdrawn') throw new Error(`agenda-detail-${response.status}`);
        setState({ phase: isPayloadStale(payload) ? 'stale' : 'ready', entry: payload.entry, payload });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState({ phase: 'error' });
      });
    return () => controller.abort();
  }, [attempt, requestedId]);

  if (state.phase === 'loading') return <section className="kad-live-agenda-detail" data-agenda-detail-phase="loading" aria-busy="true" role="status"><p className="kad-eyebrow">Agenda</p><h1>{text.loading}</h1><span className="kad-skeleton kad-skeleton--wide" /></section>;
  if (state.phase === 'not-found' || state.phase === 'withdrawn') return <section className="kad-live-agenda-detail" data-agenda-detail-phase={state.phase} aria-labelledby="agenda-detail-title"><p className="kad-eyebrow">Agenda</p><h1 id="agenda-detail-title">{state.phase === 'withdrawn' ? text.withdrawn : text.notFound}</h1><p>{state.phase === 'withdrawn' ? (locale === 'id' ? 'Catatan publiknya tidak lagi tersedia untuk diikuti.' : locale === 'ar' ? 'لم يعد السجل العام متاحاً للانضمام.' : 'Its public record is no longer available to join.') : (locale === 'id' ? 'Periksa kembali tautan atau buka agenda terbaru.' : locale === 'ar' ? 'تحقق من الرابط أو افتح الأجندة الحالية.' : 'Check the link or open the current agenda.')}</p><a className="kad-button kad-button--outline" href={backHref}>{text.back}</a></section>;
  if (state.phase === 'error') return <section className="kad-live-agenda-detail" data-agenda-detail-phase="error" role="alert" aria-labelledby="agenda-detail-title"><p className="kad-eyebrow">Agenda</p><h1 id="agenda-detail-title">{text.error}</h1><div className="kad-live-agenda__state-actions"><button className="kad-button kad-button--primary" type="button" onClick={() => setAttempt((value) => value + 1)}>{text.retry}</button><a className="kad-button kad-button--outline" href={INVITE} target="_blank" rel="noopener noreferrer">{discordLabel}</a></div></section>;

  const entry = state.entry!;
  const mappedProgram = operationalProgramHref(locale as Locale, entry.program);
  return <article className="kad-live-agenda-detail" data-agenda-detail-phase={state.phase} data-agenda-id={entry.id} aria-labelledby="agenda-detail-title">
    {state.phase === 'stale' && <p className="kad-live-agenda__stale" data-agenda-state="stale" role="status">{text.stale}</p>}
    <p className="kad-eyebrow">{text.ready}</p>
    <h1 id="agenda-detail-title">{entry.title}</h1>
    <p className="kad-live-agenda-detail__summary">{entry.summary}</p>
    <dl className="kad-record-facts">
      <div><dt>{text.when}</dt><dd><time dateTime={entry.startAt}>{formatDate(entry.startAt, locale)}</time>{entry.endAt ? <time dateTime={entry.endAt}>{formatDate(entry.endAt, locale)}</time> : <span>{text.endPending}</span>}</dd></div>
      <div><dt>{text.program}</dt><dd>{mappedProgram ? <a href={mappedProgram}>{entry.program}</a> : <span data-program-mapping="unmapped">{entry.program}</span>}</dd></div>
      {entry.series && <div><dt>{text.series}</dt><dd>{entry.series}</dd></div>}
      <div><dt>{text.source}</dt><dd>{text.source}</dd></div>
    </dl>
    <p className="kad-note">{text.noRegistration}</p>
    <div className="kad-actions"><a className="kad-button kad-button--primary" data-discord-join-path href={entry.joinUrl} target="_blank" rel="noopener noreferrer">{text.join}</a><a className="kad-button kad-button--outline" href={backHref}>{text.back}</a></div>
    {state.payload && <small data-agenda-freshness>{locale === 'id' ? `Revisi sumber ${state.payload.revision}` : `Source revision ${state.payload.revision}`}</small>}
  </article>;
}
