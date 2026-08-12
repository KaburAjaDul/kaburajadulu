import { useEffect, useState } from 'react';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';
import { isPayloadStale, parseAgendaPayload, type AgendaPayload } from '@/components/events/live-agenda-contract';
import { operationalProgramLabel, operationalProgramSlug } from '@/content/live-agenda';

interface Props { locale: string; }

export default function LiveStudyClubs({ locale }: Props) {
  const [payload, setPayload] = useState<AgendaPayload | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const english = locale !== 'id' && locale !== 'ar';
  const arabic = locale === 'ar';
  useEffect(() => {
    const controller = new AbortController();
    setPayload(null);
    setPhase('loading');
    fetch('/api/v1/agenda', { headers: { accept: 'application/json' }, signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`agenda-${response.status}`);
      const next = parseAgendaPayload(await response.json());
      if (!next) throw new Error('agenda-invalid-payload');
      setPayload(next); setPhase(next.entries.some((entry) => operationalProgramSlug(entry.program)) ? 'ready' : 'empty');
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setPhase('error');
    });
    return () => controller.abort();
  }, [attempt]);
  const groups = [...new Set((payload?.entries ?? []).map((entry) => operationalProgramSlug(entry.program)).filter((slug): slug is NonNullable<typeof slug> => slug !== null))];
  const text = arabic ? { eyebrow: 'نوادي Study Club المباشرة', title: 'الجدول التشغيلي من الأجندة العامة', note: 'هذه السجلات مستقلة عن أرشيف مصادر KADSocialHub.', loading: 'جارٍ تحميل الجدول…', empty: 'لا توجد سجلات Study Club مؤكدة حالياً.', error: 'تعذر تحميل جدول Study Club.', stale: 'المصدر يحتاج إلى مراجعة.', retry: 'حاول مرة أخرى' } : english ? { eyebrow: 'Live Study Clubs', title: 'Operational schedule from the public agenda', note: 'These records stay separate from KADSocialHub source archives.', loading: 'Loading the schedule…', empty: 'No confirmed Study Club records are published yet.', error: 'The Study Club schedule could not be loaded.', stale: 'Source review is due.', retry: 'Try again' } : { eyebrow: 'Study Club live', title: 'Jadwal operasional dari agenda publik', note: 'Rekaman ini terpisah dari arsip sumber KADSocialHub.', loading: 'Memuat jadwal…', empty: 'Belum ada rekaman Study Club yang dikonfirmasi.', error: 'Jadwal Study Club belum dapat dimuat.', stale: 'Sumber perlu ditinjau ulang.', retry: 'Coba lagi' };
  return <section className="kad-live-study-clubs" data-live-study-clubs data-live-study-clubs-phase={phase} aria-labelledby="live-study-clubs-title"><p className="kad-eyebrow">{text.eyebrow}</p><h2 id="live-study-clubs-title">{text.title}</h2><p>{text.note}</p>{phase === 'loading' && <p data-live-study-state="loading" role="status">{text.loading}</p>}{phase === 'error' && <div data-live-study-state="error" role="alert"><p>{text.error}</p><button className="kad-button kad-button--outline" type="button" onClick={() => setAttempt((value) => value + 1)}>{text.retry}</button></div>}{phase === 'empty' && <p data-live-study-state="empty" role="status">{text.empty}</p>}{payload && isPayloadStale(payload) && <p data-live-study-state="stale" role="status">{text.stale}</p>}{phase !== 'loading' && phase !== 'error' && <button className="kad-button kad-button--outline" data-live-study-retry type="button" onClick={() => setAttempt((value) => value + 1)}>{text.retry}</button>}{groups.length > 0 && <ul>{groups.map((slug) => <li data-live-study-program={slug}><a href={localizedPath(locale as Locale, `/programs/live/?program=${encodeURIComponent(slug)}`)}>{operationalProgramLabel(slug) ?? slug}</a></li>)}</ul>}</section>;
}
