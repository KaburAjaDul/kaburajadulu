import { useEffect, useState } from 'react';
import { operationalProgramSlug } from '@/content/live-agenda';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';
import { isPayloadStale, parseAgendaPayload, type AgendaPayload } from '@/components/events/live-agenda-contract';

interface Props { locale: string; }
type State = { phase: 'loading' | 'ready' | 'empty' | 'error'; payload?: AgendaPayload };

export default function LiveCommunitySummary({ locale }: Props) {
  const [state, setState] = useState<State>({ phase: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const english = locale !== 'id' && locale !== 'ar';
  const arabic = locale === 'ar';
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/v1/agenda', { headers: { accept: 'application/json' }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`agenda-${response.status}`);
        const payload = parseAgendaPayload(await response.json());
        if (!payload) throw new Error('agenda-invalid-payload');
        setState({ phase: payload.entries.length > 0 ? 'ready' : 'empty', payload });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState({ phase: 'error' });
      });
    return () => controller.abort();
  }, [attempt]);

  const payload = state.payload;
  const entries = payload?.entries ?? [];
  const mappedPrograms = new Set(entries.map((entry) => operationalProgramSlug(entry.program)).filter((slug) => slug !== null));
  const freshness = payload ? (isPayloadStale(payload) ? (english ? 'Stale source' : arabic ? 'مصدر يحتاج إلى مراجعة' : 'Sumber perlu ditinjau') : (english ? 'Fresh source' : arabic ? 'مصدر حديث' : 'Sumber mutakhir')) : '—';
  const text = arabic ? { eyebrow: 'الجدول العام المباشر', title: 'ما تؤكده الأجندة الحالية', note: 'الأعداد تصف سجلات الجدول المنشورة فقط.', schedule: 'الأجندة المنشورة', scheduleDetail: 'سجلات الجدول الحالية', mapped: 'البرامج المطابقة', mappedDetail: 'مطابقات مصدرية دقيقة', freshness: 'حداثة المصدر', unavailable: 'الأجندة غير متاحة', error: 'تعذر تحميل ملخص الجدول المباشر؛ افتح الأجندة للحالة الكاملة.', agenda: 'فتح الأجندة', retry: 'حاول مرة أخرى', staleEmpty: 'لا توجد سجلات منشورة، والمصدر يحتاج إلى مراجعة.' } : english ? { eyebrow: 'Live public schedule', title: 'What the current agenda can confirm.', note: 'Counts describe published schedule records only.', schedule: 'Published agenda', scheduleDetail: 'Current schedule records', mapped: 'Mapped Programs', mappedDetail: 'Exact source-backed matches', freshness: 'Freshness', unavailable: 'Agenda unavailable', error: 'The live schedule summary is unavailable; open Agenda for the full state.', agenda: 'Open Agenda', retry: 'Try again', staleEmpty: 'No published records are available and the source is stale.' } : { eyebrow: 'Jadwal publik live', title: 'Yang dapat dikonfirmasi agenda saat ini.', note: 'Jumlah hanya menggambarkan rekaman jadwal yang dipublikasikan.', schedule: 'Agenda terbit', scheduleDetail: 'Rekaman jadwal saat ini', mapped: 'Program terpetakan', mappedDetail: 'Kecocokan persis berbasis sumber', freshness: 'Kesegaran sumber', unavailable: 'Agenda belum tersedia', error: 'Ringkasan jadwal live belum tersedia; buka Agenda untuk melihat status lengkap.', agenda: 'Buka Agenda', retry: 'Coba lagi', staleEmpty: 'Belum ada rekaman terbit dan sumber perlu ditinjau.' };
  return <section className="kad-live-community-summary" data-community-live-summary data-summary-phase={state.phase} aria-labelledby="community-live-summary-title">
    <div className="kad-community-information__section-heading"><div><p className="kad-community-information__eyebrow">{text.eyebrow}</p><h2 id="community-live-summary-title">{text.title}</h2></div><p>{text.note}</p></div>
    <dl className="kad-live-community-summary__metrics" aria-label={text.title}>
      <div className="kad-live-community-summary__metric" data-community-live-metric="schedule-count"><dt>{text.schedule}</dt><dd className="kad-live-community-summary__value">{state.phase === 'loading' ? '…' : entries.length}</dd><dd className="kad-live-community-summary__detail">{text.scheduleDetail}</dd></div>
      <div className="kad-live-community-summary__metric" data-community-live-metric="program-coverage"><dt>{text.mapped}</dt><dd className="kad-live-community-summary__value">{state.phase === 'loading' ? '…' : mappedPrograms.size}</dd><dd className="kad-live-community-summary__detail">{text.mappedDetail}</dd></div>
      <div className="kad-live-community-summary__metric" data-community-live-metric="freshness"><dt>{text.freshness}</dt><dd className="kad-live-community-summary__value">{state.phase === 'loading' ? '…' : freshness}</dd><dd className="kad-live-community-summary__detail">{payload ? (english ? `Revision ${payload.revision}` : arabic ? `مراجعة ${payload.revision}` : `Revisi ${payload.revision}`) : text.unavailable}</dd></div>
    </dl>
    {state.phase === 'error' && <div className="kad-live-agenda__stale" data-community-summary-error role="alert"><p>{text.error}</p><button className="kad-button kad-button--outline" type="button" onClick={() => setAttempt((value) => value + 1)}>{text.retry}</button></div>}
    {payload && entries.length === 0 && isPayloadStale(payload) && <p className="kad-live-agenda__stale" data-community-summary-stale-empty role="status">{text.staleEmpty}</p>}
    <a className="kad-button kad-button--outline" data-community-agenda-link href={localizedPath(locale as Locale, '/events')}>{text.agenda}</a>
  </section>;
}
