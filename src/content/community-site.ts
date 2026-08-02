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
  media: readonly ProgramMedia[];
}

export interface ProgramMedia {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  mimeType: 'image/webp';
  sha256: string;
  sourceUrl: string;
  sourcePublishedAt: string;
  approval: 'KAD operator approved for website publication on 2026-08-02';
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
    media: [{
      id: 'french-club-trial-poster-2026-08-02',
      src: '/images/programs/french-club-trial-2026-08-02.webp',
      alt: 'Poster kuning French Study Club untuk trial run La Classe du Français bagi pemula pada 2 Agustus 2026 pukul 16.00 WIB.',
      caption: 'Poster publik trial run French Study Club, diterbitkan KADSocialHub.',
      width: 1600,
      height: 640,
      mimeType: 'image/webp',
      sha256: '547cc84cc3d5fe76502701b56e2b0ea74fa4f4c0dc3cf28940c42a09ecd05bc2',
      sourceUrl: 'https://x.com/KADSocialHub/status/2083791105590784033',
      sourcePublishedAt: '2026-08-02T12:44:00+07:00',
      approval: 'KAD operator approved for website publication on 2026-08-02',
    }],
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
    media: [{
      id: 'mandarin-transport-poster-2026-08-01',
      src: '/images/programs/mandarin-transport-2026-08-01.webp',
      alt: 'Poster Mandarin Study Club bertema transportasi untuk sesi pemula pada 1 Agustus 2026 pukul 18.30 WIB di Discord KaburAjaDulu.',
      caption: 'Poster publik Mandarin Study Club bertema transportasi, diterbitkan KADSocialHub.',
      width: 960,
      height: 1280,
      mimeType: 'image/webp',
      sha256: 'e021a8fe8eb8a3d43adfb6c193e6290f795d43028bf7cc0721429409191fe5a1',
      sourceUrl: 'https://x.com/KADSocialHub/status/2083159775362302137',
      sourcePublishedAt: '2026-07-31T18:56:00+07:00',
      approval: 'KAD operator approved for website publication on 2026-08-02',
    }],
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
    media: [{
      id: 'apple-developer-academy-info-session-poster-2026-07-31',
      src: '/images/programs/apple-developer-academy-2027-info-session.webp',
      alt: 'Poster sesi informasi Apple Developer Academy 2027 dan learner sharing pada 31 Juli 2026 pukul 19.00 sampai 20.30 WIB.',
      caption: 'Poster publik sesi informasi Apple Developer Academy 2027, diterbitkan KADSocialHub.',
      width: 1080,
      height: 1440,
      mimeType: 'image/webp',
      sha256: '5c17b45927e24c8f0b0cee0bc3a1b0be30baa02099041fd884586290ec90e28e',
      sourceUrl: 'https://x.com/KADSocialHub/status/2082436751105388905',
      sourcePublishedAt: '2026-07-29T19:03:00+07:00',
      approval: 'KAD operator approved for website publication on 2026-08-02',
    }],
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
    media: [
      {
        id: 'english-study-club-weekly-poster-2026-07',
        src: '/images/programs/english-study-club-weekly-2026-07.webp',
        alt: 'Poster English Study Club sesi mingguan ramah pemula bertema talking about hobbies pada 25 Juli 2026 pukul 19.30 WIB.',
        caption: 'Poster publik English Study Club mingguan, diterbitkan KADSocialHub.',
        width: 1080,
        height: 1440,
        mimeType: 'image/webp',
        sha256: 'dd8e0cef2fe909b5faf3071f13d5286000ef76daf2e671db6023a882de9629cb',
        sourceUrl: 'https://x.com/KADSocialHub/status/2080532059408490846',
        sourcePublishedAt: '2026-07-24T12:54:00+07:00',
        approval: 'KAD operator approved for website publication on 2026-08-02',
      },
      {
        id: 'mandarin-study-club-weekly-poster-2026-07',
        src: '/images/programs/mandarin-study-club-weekly-2026-07.webp',
        alt: 'Poster Mandarin Study Club sesi mingguan batch tiga bertema hobi dan monolog setiap Jumat pukul 20.30 WIB.',
        caption: 'Poster publik Mandarin Study Club mingguan, diterbitkan KADSocialHub.',
        width: 1080,
        height: 1440,
        mimeType: 'image/webp',
        sha256: '4d81ce9813ac93081c2612b0896d7ffc5575ed03e1ff96a534d9b68570739a3b',
        sourceUrl: 'https://x.com/KADSocialHub/status/2080532059408490846',
        sourcePublishedAt: '2026-07-24T12:54:00+07:00',
        approval: 'KAD operator approved for website publication on 2026-08-02',
      },
    ],
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
    media: [],
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
