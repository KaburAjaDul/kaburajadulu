import type { Locale } from '@/i18n/constants';
import { DISCORD_URL } from '@/constants/urls';

export type CommunityPageKind =
  | 'community'
  | 'programs'
  | 'program'
  | 'events'
  | 'event'
  | 'volunteer'
  | 'stories'
  | 'history'
  | 'impact'
  | 'support'
  | 'credits';

export interface ProgramSource {
  slug: string;
  title: string;
  category: 'Klub bahasa' | 'Pendidikan & karier';
  summary: string;
  known: string[];
  confirm: string[];
  sourceUrl: string;
  sourceLabel: string;
}

export { DISCORD_URL };
export const X_URL = 'https://x.com/KADSocialHub';
export const INSTAGRAM_URL = 'https://www.instagram.com/kadsocialhub/';

export const PROGRAMS: readonly ProgramSource[] = [
  {
    slug: 'french-club-trial',
    title: 'French Club trial',
    category: 'Klub bahasa',
    summary: 'Uji coba latihan alfabet, pelafalan, perkenalan, dan tata bahasa dasar Prancis.',
    known: ['Formatnya disebut sebagai sesi trial.', 'Topik yang disebut mencakup dasar-dasar bahasa Prancis.'],
    confirm: ['Ketersediaan dan kapasitas saat ini', 'Jalur pendaftaran dan status setelah sesi trial'],
    sourceUrl: 'https://x.com/KADSocialHub/status/2083791105590784033',
    sourceLabel: 'Sumber publik di X',
  },
  {
    slug: 'mandarin-study-club-transport',
    title: 'Mandarin Study Club — Transport',
    category: 'Klub bahasa',
    summary: 'Sesi Mandarin bertema transportasi yang disebut gratis dan ramah pemula.',
    known: ['Sumber menyebut tema transportasi.', 'Sumber menyebut sesi ramah pemula.'],
    confirm: ['Jadwal dan kapasitas terbaru', 'Jalur pendaftaran dan dokumentasi'],
    sourceUrl: 'https://x.com/KADSocialHub/status/2083159775362302137',
    sourceLabel: 'Sumber publik di X',
  },
  {
    slug: 'apple-developer-academy-batch-2027',
    title: 'Apple Developer Academy Batch 2027',
    category: 'Pendidikan & karier',
    summary: 'Sesi info daring dan berbagi pengalaman belajar tentang Apple Developer Academy.',
    known: ['Sumber menyebut sesi info daring dan learner sharing.', 'Sesi ditujukan untuk membahas Batch 2027.'],
    confirm: ['Kelayakan dan jendela pendaftaran resmi', 'Rekaman, sumber aplikasi, dan status arsip'],
    sourceUrl: 'https://x.com/KADSocialHub/status/2082436751105388905',
    sourceLabel: 'Sumber publik di X',
  },
  {
    slug: 'english-mandarin-weekly-clubs',
    title: 'English + Mandarin weekly clubs',
    category: 'Klub bahasa',
    summary: 'Klub belajar mingguan bahasa Inggris dan Mandarin dengan pendekatan aman untuk pemula.',
    known: ['Sumber mempromosikan klub English dan Mandarin.', 'Sumber menekankan pembelajaran sebaya yang ramah pemula.'],
    confirm: ['Apakah ritme mingguan masih berjalan', 'Kapasitas dan jalur ikut terbaru'],
    sourceUrl: 'https://x.com/KADSocialHub/status/2080532059408490846',
    sourceLabel: 'Sumber publik di X',
  },
  {
    slug: 'gks-preparation',
    title: 'GKS preparation',
    category: 'Pendidikan & karier',
    summary: 'Persiapan beasiswa yang disebut membentang dari GKS 101 hingga kehidupan praktis di Korea.',
    known: ['Sumber menyebut cakupan GKS 101.', 'Sumber menyebut konteks kehidupan setelah tiba di Korea.'],
    confirm: ['Tanggal, waktu, dan kelayakan sesi', 'Tautan beasiswa resmi dan status arsip'],
    sourceUrl: 'https://x.com/KADSocialHub/status/2080283341807604175',
    sourceLabel: 'Sumber publik di X',
  },
];

export const NAV_ITEMS: readonly { label: string; path: string }[] = [
  { label: 'Komunitas', path: '/community' },
  { label: 'Program', path: '/programs' },
  { label: 'Acara', path: '/events' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Cerita', path: '/stories' },
  { label: 'Sejarah', path: '/about/history' },
  { label: 'Dampak', path: '/community/impact' },
  { label: 'Dukungan', path: '/support' },
  { label: 'Kredit', path: '/community/credits' },
];

export function localizedPath(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return locale === 'id' ? cleanPath : `/${locale}${cleanPath}`;
}

export function programBySlug(slug: string): ProgramSource | undefined {
  return PROGRAMS.find((program) => program.slug === slug);
}

export function pageTitle(kind: CommunityPageKind, item?: ProgramSource): string {
  if (kind === 'program' && item) return `${item.title} — KaburAjaDulu`;
  const titles: Record<CommunityPageKind, string> = {
    community: 'Komunitas — KaburAjaDulu',
    programs: 'Program — KaburAjaDulu',
    program: 'Program — KaburAjaDulu',
    events: 'Acara — KaburAjaDulu',
    event: 'Acara belum dipublikasikan — KaburAjaDulu',
    volunteer: 'Volunteer — KaburAjaDulu',
    stories: 'Cerita — KaburAjaDulu',
    history: 'Sejarah — KaburAjaDulu',
    impact: 'Dampak — KaburAjaDulu',
    support: 'Dukungan — KaburAjaDulu',
    credits: 'Kredit komunitas — KaburAjaDulu',
  };
  return titles[kind];
}
