import { useEffect, useMemo, useState } from 'react';
import { operationalProgramLabel, operationalProgramSlug } from '@/content/live-agenda';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';
import { INVITE, isPayloadStale, parseAgendaPayload, type AgendaEntry, type AgendaPayload } from '@/components/events/live-agenda-contract';

interface Props { locale: string; initialProgram: string; }
type Phase = 'loading' | 'ready' | 'stale' | 'stale-empty' | 'empty' | 'unmapped' | 'error';

const copy = (locale: string) => locale === 'id' ? {
  eyebrow: 'Program Study Club live', title: 'Jadwal operasional Study Club', loading: 'Memuat jadwal program…', error: 'Jadwal program belum dapat dimuat.', empty: 'Belum ada sesi aktif atau berikutnya untuk program ini.', unmapped: 'Program ini belum termasuk keluarga operasional yang diizinkan.', stale: 'Sumber jadwal mungkin belum mutakhir.', evidence: 'Bukti jadwal berasal dari Discord Scheduled Events yang telah disetujui.', noRegistration: 'Tidak perlu mendaftar atau mengonfirmasi lewat web.', join: 'Gabung lewat Discord', back: 'Kembali ke program live', next: 'Berikutnya', active: 'Sedang berlangsung', scheduled: 'Terjadwal', source: 'Sumber', revision: 'Revisi sumber', retry: 'Coba lagi',
} : locale === 'ar' ? {
  eyebrow: 'برنامج Study Club المباشر', title: 'الجدول التشغيلي لـ Study Club', loading: 'جارٍ تحميل جدول البرنامج…', error: 'تعذر تحميل جدول البرنامج.', empty: 'لا توجد جلسة حالية أو تالية لهذا البرنامج.', unmapped: 'هذا البرنامج ليس ضمن العائلات التشغيلية المسموح بها.', stale: 'قد يكون مصدر الجدول قديماً.', evidence: 'دليل الجدول مستمد من فعاليات Discord المجدولة المعتمدة.', noRegistration: 'لا يلزم التسجيل أو التأكيد عبر الموقع.', join: 'الانضمام عبر Discord', back: 'العودة إلى البرامج المباشرة', next: 'التالي', active: 'جارٍ الآن', scheduled: 'مجدول', source: 'المصدر', revision: 'مراجعة المصدر', retry: 'حاول مرة أخرى',
} : {
  eyebrow: 'Live Study Club program', title: 'Study Club operational schedule', loading: 'Loading the program schedule…', error: 'The program schedule could not be loaded.', empty: 'No active or next session is published for this program.', unmapped: 'This program is not in the allowed operational families.', stale: 'The source schedule may be out of date.', evidence: 'Schedule evidence comes from approved Discord Scheduled Events.', noRegistration: 'No web registration or confirmation is required.', join: 'Join on Discord', back: 'Back to live programs', next: 'Next', active: 'Live now', scheduled: 'Scheduled', source: 'Source', revision: 'Source revision', retry: 'Try again',
};

function localDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : locale === 'id' ? 'id-ID' : 'en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(value));
}

export default function LiveProgramDetail({ locale, initialProgram }: Props) {
  const [program, setProgram] = useState(initialProgram);
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [payload, setPayload] = useState<AgendaPayload | null>(null);
  const text = useMemo(() => copy(locale), [locale]);
  const slug = operationalProgramSlug(program);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('program');
    if (query) setProgram(query);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setPayload(null);
    setPhase('loading');
    if (!slug) { setPhase('unmapped'); return () => controller.abort(); }
    fetch('/api/v1/agenda', { headers: { accept: 'application/json' }, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`agenda-${response.status}`);
        const nextPayload = parseAgendaPayload(await response.json());
        if (!nextPayload) throw new Error('agenda-invalid-payload');
        setPayload(nextPayload);
        const entries = nextPayload.entries.filter((entry) => operationalProgramSlug(entry.program) === slug);
        const stale = isPayloadStale(nextPayload);
        setPhase(entries.length ? (stale ? 'stale' : 'ready') : (stale ? 'stale-empty' : 'empty'));
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setPhase('error');
      });
    return () => controller.abort();
  }, [slug, attempt]);

  const entries: AgendaEntry[] = payload?.entries.filter((entry) => operationalProgramSlug(entry.program) === slug) ?? [];
  const label = operationalProgramLabel(slug ?? '') ?? program;
  const backHref = localizedPath(locale as Locale, '/programs');
  return <article className="kad-live-program-detail" data-live-program-detail={program} data-live-program-phase={phase} aria-labelledby="live-program-title">
    <p className="kad-eyebrow">{text.eyebrow}</p>
    <h1 id="live-program-title">{label}</h1>
    {phase === 'loading' && <p data-live-program-state="loading" role="status">{text.loading}</p>}
    {phase === 'error' && <div data-live-program-state="error" role="alert"><p>{text.error}</p><button className="kad-button kad-button--outline" type="button" onClick={() => setAttempt((value) => value + 1)}>{text.retry}</button></div>}
    {phase === 'unmapped' && <p data-live-program-state="unmapped" role="status">{text.unmapped}</p>}
    {(phase === 'empty' || phase === 'stale-empty') && <p data-live-program-state="empty" role="status">{text.empty}</p>}
    {(phase === 'stale' || phase === 'stale-empty') && <p data-live-program-state="stale" role="status">{text.stale}</p>}
    {phase !== 'loading' && phase !== 'unmapped' && phase !== 'error' && <button className="kad-button kad-button--outline" data-live-program-retry type="button" onClick={() => setAttempt((value) => value + 1)}>{text.retry}</button>}
    <p className="kad-live-program-detail__evidence">{text.evidence}</p><p className="kad-note">{text.noRegistration}</p>
    {entries.length > 0 && <ol className="kad-live-program-detail__sessions">{entries.map((entry) => <li data-live-program-session={entry.id} data-session-status={entry.status}><span className="kad-status">{entry.status === 'active' ? text.active : text.scheduled}</span><h2><a href={localizedPath(locale as Locale, `/events/live/?id=${encodeURIComponent(entry.id)}`)}>{entry.title}</a></h2><time dateTime={entry.startAt}>{localDate(entry.startAt, locale)}</time>{entry.endAt && <time dateTime={entry.endAt}>{localDate(entry.endAt, locale)}</time>}{entry.series && <p>{entry.series}</p>}</li>)}</ol>}
    <dl className="kad-live-program-detail__meta"><div><dt>{text.source}</dt><dd>{text.evidence}</dd></div>{payload && <div><dt>{text.revision}</dt><dd>{payload.revision}</dd></div>}</dl>
    <div className="kad-actions"><a className="kad-button kad-button--primary" data-discord-join-path href={INVITE} target="_blank" rel="noopener noreferrer">{text.join}</a><a className="kad-button kad-button--outline" href={backHref}>{text.back}</a></div>
  </article>;
}
