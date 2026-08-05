import type { Locale } from '@/i18n/constants';
import type { LocalizedText } from '@/content/staging-fixtures';

export type CommunitySectionKey = 'current' | 'programs' | 'agenda' | 'people' | 'sources';

export type CommunityEvidenceMetric = {
  id: string;
  label: LocalizedText;
  value: string;
  period: LocalizedText;
  definition: LocalizedText;
  source: LocalizedText;
  method: LocalizedText;
  reviewedAt: string | null;
  reviewState: LocalizedText;
};

export type StoryReference = {
  label: LocalizedText;
  href: string;
  kind: 'program' | 'session' | 'event' | 'contributor';
};

export type StoryReferenceSet = {
  storyId: string;
  references: readonly StoryReference[];
};

export const COMMUNITY_SECTIONS: readonly CommunitySectionKey[] = ['current', 'programs', 'agenda', 'people', 'sources'];

export const PRODUCTION_COMMUNITY_METRICS: readonly CommunityEvidenceMetric[] = [
  {
    id: 'published-program-records',
    label: { id: 'Program dengan rekaman publik', en: 'Programs with public records' },
    value: '—',
    period: { id: 'Katalog publik', en: 'Public catalogue' },
    definition: { id: 'Angka akan tampil setelah indeks program menjalani tinjauan publikasi.', en: 'The count appears after the programme index passes publication review.' },
    source: { id: 'Evidence Placeholder', en: 'Evidence Placeholder' },
    method: { id: 'Metode belum dipublikasikan.', en: 'Method not published yet.' },
    reviewedAt: null,
    reviewState: { id: 'Menunggu sumber terverifikasi', en: 'Awaiting verified source' },
  },
  {
    id: 'published-agenda-records',
    label: { id: 'Agenda dengan jalur ikut', en: 'Agenda items with a joining path' },
    value: '—',
    period: { id: 'Agenda publik', en: 'Public schedule' },
    definition: { id: 'Hanya agenda dengan waktu dan jalur ikut yang disetujui yang dihitung.', en: 'Only agenda items with an approved time and joining path are counted.' },
    source: { id: 'Evidence Placeholder', en: 'Evidence Placeholder' },
    method: { id: 'Menunggu proyeksi agenda yang ditinjau.', en: 'Awaiting a reviewed schedule projection.' },
    reviewedAt: null,
    reviewState: { id: 'Menunggu sinkronisasi agenda', en: 'Awaiting schedule sync' },
  },
  {
    id: 'public-attribution-records',
    label: { id: 'Atribusi publik', en: 'Public attributions' },
    value: '—',
    period: { id: 'Buku kontribusi', en: 'Contribution ledger' },
    definition: { id: 'Nama dan rincian hanya dihitung setelah izin opt-in tercatat.', en: 'Names and details are counted only after opt-in permission is recorded.' },
    source: { id: 'Evidence Placeholder', en: 'Evidence Placeholder' },
    method: { id: 'Izin publik belum tersedia.', en: 'Public consent is not available yet.' },
    reviewedAt: null,
    reviewState: { id: 'Menunggu izin publik', en: 'Awaiting public consent' },
  },
];

export const STORY_REFERENCES: readonly StoryReferenceSet[] = [
  {
    storyId: 'demo-record-story-01',
    references: [
      { kind: 'program', label: { id: 'Japanese Study Club', en: 'Japanese Study Club' }, href: '/programs/japanese-study-club/', },
      { kind: 'session', label: { id: 'Sesi Japanese N5', en: 'Japanese N5 session' }, href: '/events/demo-session-japanese-n5-01/', },
      { kind: 'contributor', label: { id: 'Nara (fiktif)', en: 'Nara (fictional)' }, href: '/volunteer/nara/', },
    ],
  },
];

export function communityText(value: LocalizedText, locale: Locale): string {
  return locale === 'id' ? value.id : value.en;
}

export function storyReferencesFor(storyId: string): readonly StoryReference[] {
  return STORY_REFERENCES.find((item) => item.storyId === storyId)?.references ?? [];
}
