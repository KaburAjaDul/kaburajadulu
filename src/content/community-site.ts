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
  | 'story'
  | 'history'
  | 'impact'
  | 'support'
  | 'credits';

export type CommunityCopy = {
  eyebrow: string;
  title: string;
  description: string;
  actions: { discord: string; support: string; back: string; detail: string };
  states: { empty: string; pending: string; notPublished: string; demo: string };
};

const COPY: Record<'id' | 'en', Record<CommunityPageKind, CommunityCopy>> = {
  id: {
    community: { eyebrow: 'Menemukan komunitas', title: 'Komunitas bukan cuma server.', description: 'Temukan pertanyaan yang ingin kamu jawab, ritme belajar yang cocok, lalu percakapan yang terasa berguna.', actions: { discord: 'Gabung ke Discord', support: 'Dukung KAD', back: 'Kembali', detail: 'Lihat detail' }, states: { empty: 'Belum tersedia', pending: 'Menunggu persetujuan', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    programs: { eyebrow: 'Direktori program', title: 'Program komunitas', description: 'Bandingkan topik, sumber, dan status setiap program sebelum memilih langkah berikutnya.', actions: { discord: 'Tanyakan jadwal terbaru', support: 'Dukung KAD', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum tersedia', pending: 'Perlu konfirmasi', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    program: { eyebrow: 'Catatan program', title: 'Program', description: 'Baca sumber, pahami kegiatannya, lalu periksa apa yang masih perlu dikonfirmasi.', actions: { discord: 'Tanyakan status terbaru', support: 'Dukung KAD', back: 'Kembali ke program', detail: 'Baca rincian' }, states: { empty: 'Belum tersedia', pending: 'Perlu konfirmasi', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    events: { eyebrow: 'Jadwal dan status', title: 'Agenda komunitas', description: 'Periksa waktu, durasi, status publikasi, dan cara mengonfirmasi jadwal terbaru.', actions: { discord: 'Tanyakan jadwal terbaru', support: 'Dukung KAD', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum ada agenda publik', pending: 'Sedang diperiksa', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    event: { eyebrow: 'Rincian acara', title: 'Acara ini belum dipublikasikan.', description: 'Halaman acara baru dibuka setelah waktu, jalur ikut, sumber, dan catatan perubahannya lengkap.', actions: { discord: 'Tanyakan di Discord', support: 'Dukung KAD', back: 'Kembali ke agenda', detail: 'Baca rincian' }, states: { empty: 'Belum tersedia', pending: 'Sedang diperiksa', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    volunteer: { eyebrow: 'Siklus dan pembagian kerja', title: 'Cara kerja relawan', description: 'Lihat tahap siklus, cara pekerjaan dibagi, dan aturan atribusi kontribusi.', actions: { discord: 'Lihat cara mulai', support: 'Dukung KAD', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum tersedia', pending: 'Menunggu izin', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    stories: { eyebrow: 'Arsip komunitas', title: 'Cerita dan dokumentasi', description: 'Cerita tampil setelah isi, media, dan cara menyebut kontributor mendapat persetujuan.', actions: { discord: 'Bagikan bahan cerita', support: 'Dukung KAD', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum ada cerita terbit', pending: 'Menunggu persetujuan', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    story: { eyebrow: 'Catatan komunitas', title: 'Cerita belum tersedia', description: 'Catatan publik hanya menampilkan bahan yang telah melewati pemeriksaan editorial dan privasi.', actions: { discord: 'Bagikan bahan cerita', support: 'Dukung KAD', back: 'Kembali ke cerita', detail: 'Baca cerita' }, states: { empty: 'Belum ada cerita terbit', pending: 'Menunggu persetujuan', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    history: { eyebrow: 'Sejarah komunitas', title: 'Sejarah yang bisa ditelusuri, bukan sekadar diingat.', description: 'Setiap tonggak membutuhkan tanggal, sumber, penanggung jawab, dan jalur koreksi sebelum masuk ke halaman publik.', actions: { discord: 'Kirim sumber', support: 'Dukung KAD', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum tersedia', pending: 'Sedang meninjau bukti', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    impact: { eyebrow: 'Dampak komunitas', title: 'Angka hanya berarti kalau cara menghitungnya jelas.', description: 'Setiap angka harus menyebut periode, definisi, sumber, dan kapan terakhir diperbarui.', actions: { discord: 'Tanyakan sumber', support: 'Lihat cara mendukung', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum tersedia', pending: 'Menunggu sumber', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    support: { eyebrow: 'Dukungan untuk KAD', title: 'Bantu satu pekerjaan selesai, lalu lihat hasilnya.', description: 'Halaman ini menjelaskan kebutuhan, batas penggunaan, dan bentuk laporan sebelum KAD menerima dukungan apa pun.', actions: { discord: 'Bicarakan bentuk dukungan', support: 'Dukung KAD', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum tersedia', pending: 'Belum siap menerima dana', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
    credits: { eyebrow: 'Jejak kontribusi', title: 'Setiap kerja punya jejak. Setiap nama tetap pilihan.', description: 'Kontributor memilih apakah namanya ditampilkan, bagian kerja yang disebut, dan kapan izin itu berakhir.', actions: { discord: 'Tanyakan cara berkontribusi', support: 'Dukung KAD', back: 'Kembali', detail: 'Baca rincian' }, states: { empty: 'Belum ada kredit publik', pending: 'Menunggu izin', notPublished: 'Belum dipublikasikan', demo: 'Data simulasi' } },
  },
  en: {
    community: { eyebrow: 'Find your community', title: 'Community is more than a server.', description: 'Start with a question, find a learning rhythm that fits, then join conversations with useful context.', actions: { discord: 'Join Discord', support: 'Support KAD', back: 'Back', detail: 'View details' }, states: { empty: 'Not available yet', pending: 'Pending approval', notPublished: 'Not published', demo: 'Demo data' } },
    programs: { eyebrow: 'Program directory', title: 'Community programs', description: 'Compare each program’s topic, source, and status before choosing your next step.', actions: { discord: 'Ask for the latest schedule', support: 'Support KAD', back: 'Back', detail: 'Read details' }, states: { empty: 'Not available yet', pending: 'Needs confirmation', notPublished: 'Not published', demo: 'Demo data' } },
    program: { eyebrow: 'Program', title: 'Program', description: 'A public-source record with readable status.', actions: { discord: 'Confirm on Discord', support: 'Support KAD', back: 'Back to programs', detail: 'View details' }, states: { empty: 'Not available yet', pending: 'Latest confirmation', notPublished: 'Not published', demo: 'Demo data' } },
    events: { eyebrow: 'Schedule and status', title: 'Community events', description: 'Check the time, duration, publication status, and where to confirm the latest schedule.', actions: { discord: 'Ask for the latest schedule', support: 'Support KAD', back: 'Back', detail: 'Read details' }, states: { empty: 'No public events yet', pending: 'Under review', notPublished: 'Not published', demo: 'Demo data' } },
    event: { eyebrow: 'Event record', title: 'This event is not published.', description: 'The public record has not cleared source, time, registration, and recap review.', actions: { discord: 'Ask on Discord', support: 'Support KAD', back: 'Back to events', detail: 'View details' }, states: { empty: 'Not available yet', pending: 'Pending review', notPublished: 'Not published', demo: 'Demo data' } },
    volunteer: { eyebrow: 'Cycle and work structure', title: 'How volunteering works', description: 'See the cycle stages, how work is assigned, and how contribution attribution is handled.', actions: { discord: 'See how to start', support: 'Support KAD', back: 'Back', detail: 'Read details' }, states: { empty: 'Not available yet', pending: 'Permission required', notPublished: 'Not published', demo: 'Demo data' } },
    stories: { eyebrow: 'Community archive', title: 'Stories and documentation', description: 'Stories appear after the content, media, and contributor attribution have been approved.', actions: { discord: 'Share context', support: 'Support KAD', back: 'Back', detail: 'View details' }, states: { empty: 'No published stories yet', pending: 'Pending approval', notPublished: 'Not published', demo: 'Demo data' } },
    story: { eyebrow: 'Community note', title: 'Story not available', description: 'Public notes show only material that has passed editorial and privacy review.', actions: { discord: 'Share story material', support: 'Support KAD', back: 'Back to stories', detail: 'Read story' }, states: { empty: 'No published stories yet', pending: 'Pending approval', notPublished: 'Not published', demo: 'Demo data' } },
    history: { eyebrow: 'Community history', title: 'History people can trace, not just remember.', description: 'Every milestone needs a date, source, owner, and correction path before it reaches the public timeline.', actions: { discord: 'Send a source', support: 'Support KAD', back: 'Back', detail: 'Read details' }, states: { empty: 'Not available yet', pending: 'Reviewing evidence', notPublished: 'Not published', demo: 'Demo data' } },
    impact: { eyebrow: 'Community impact', title: 'A number only matters when the counting method is clear.', description: 'Every metric must name its period, definition, source, and last update.', actions: { discord: 'Ask for the source', support: 'See how to support', back: 'Back', detail: 'Read details' }, states: { empty: 'Not available yet', pending: 'Source required', notPublished: 'Not published', demo: 'Demo data' } },
    support: { eyebrow: 'Support KAD', title: 'Help one piece of work get finished, then see the result.', description: 'This page explains the need, spending boundary, and reporting method before KAD accepts any support.', actions: { discord: 'Discuss a form of support', support: 'Support KAD', back: 'Back', detail: 'Read details' }, states: { empty: 'Not available yet', pending: 'Not ready to accept funds', notPublished: 'Not published', demo: 'Demo data' } },
    credits: { eyebrow: 'Contribution trail', title: 'Every contribution leaves a trail. Naming the person stays optional.', description: 'Contributors choose whether their name appears, which work is credited, and when that permission ends.', actions: { discord: 'Ask how to contribute', support: 'Support KAD', back: 'Back', detail: 'Read details' }, states: { empty: 'No public credits yet', pending: 'Permission required', notPublished: 'Not published', demo: 'Demo data' } },
  },
};

export function communityCopy(locale: Locale, kind: CommunityPageKind): CommunityCopy {
  return COPY[locale === 'id' ? 'id' : 'en'][kind];
}

type ProgramEnglishCopy = {
  summary: string;
  known: readonly string[];
  confirm: readonly string[];
  media: readonly { alt: string; caption: string }[];
};

const PROGRAM_ENGLISH_COPY: Record<string, ProgramEnglishCopy> = {
  'french-club-trial': {
    summary: 'A beginner trial covering the French alphabet, pronunciation, introductions, and basic grammar.',
    known: ['The public announcement describes this as a trial session.', 'The listed topics cover beginner French foundations.'],
    confirm: ['Current availability and capacity', 'Registration path and what follows the trial'],
    media: [{ alt: 'Yellow French Study Club poster for a beginner La Classe du Français trial on 2 August 2026 at 4:00 PM Jakarta time.', caption: 'Public French Study Club trial announcement published by KADSocialHub.' }],
  },
  'mandarin-study-club-transport': {
    summary: 'A beginner-friendly Mandarin session focused on transport vocabulary.',
    known: ['The public announcement names transport as the topic.', 'The session is described as beginner-friendly.'],
    confirm: ['Latest schedule and capacity', 'Registration path and available documentation'],
    media: [{ alt: 'Mandarin Study Club poster for a beginner transport session on 1 August 2026 at 6:30 PM Jakarta time in the KaburAjaDulu Discord.', caption: 'Public Mandarin Study Club transport announcement published by KADSocialHub.' }],
  },
  'apple-developer-academy-batch-2027': {
    summary: 'An online information session and learner conversation about Apple Developer Academy Batch 2027.',
    known: ['The public announcement lists an information session and learner sharing.', 'The session focuses on the 2027 batch.'],
    confirm: ['Official eligibility and application window', 'Recording, application sources, and archive status'],
    media: [{ alt: 'Apple Developer Academy 2027 information-session poster for 31 July 2026 from 7:00 to 8:30 PM Jakarta time.', caption: 'Public Apple Developer Academy 2027 session announcement published by KADSocialHub.' }],
  },
  'english-mandarin-weekly-clubs': {
    summary: 'Weekly English and Mandarin study clubs designed to feel approachable for beginners.',
    known: ['The public announcement promotes both English and Mandarin clubs.', 'The format emphasizes beginner-friendly peer learning.'],
    confirm: ['Whether the weekly rhythm is still active', 'Current capacity and joining path'],
    media: [
      { alt: 'English Study Club poster for a beginner weekly session about hobbies on 25 July 2026 at 7:30 PM Jakarta time.', caption: 'Public weekly English Study Club announcement published by KADSocialHub.' },
      { alt: 'Mandarin Study Club poster for a third-batch weekly session about hobbies and monologue practice on Fridays at 8:30 PM Jakarta time.', caption: 'Public weekly Mandarin Study Club announcement published by KADSocialHub.' },
    ],
  },
  'gks-preparation': {
    summary: 'Scholarship preparation ranging from GKS foundations to practical life after arriving in Korea.',
    known: ['The public source names GKS foundations as part of the scope.', 'It also mentions practical context for living in Korea.'],
    confirm: ['Date, time, and eligibility', 'Official scholarship links and archive status'],
    media: [],
  },
};

export type LocalizedProgramSource = Omit<ProgramSource, 'category' | 'known' | 'confirm'> & {
  category: string;
  known: readonly string[];
  confirm: readonly string[];
};

export function localizedProgram(locale: Locale, program: ProgramSource): LocalizedProgramSource {
  if (locale === 'id') return program;
  const copy = PROGRAM_ENGLISH_COPY[program.slug];
  if (!copy) return { ...program, category: program.category === 'Klub bahasa' ? 'Language club' : 'Education and career', sourceLabel: 'Public source' };
  return {
    ...program,
    category: program.category === 'Klub bahasa' ? 'Language club' : 'Education and career',
    summary: copy.summary,
    known: copy.known,
    confirm: copy.confirm,
    sourceLabel: 'Public source on X',
    media: program.media.map((media, index) => ({ ...media, ...(copy.media[index] ?? {}) })),
  };
}

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
  { label: 'Relawan', path: '/volunteer' },
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

export function pageTitle(kind: CommunityPageKind, item?: LocalizedProgramSource | ProgramSource, locale: Locale = 'id'): string {
  if (kind === 'program' && item) return `${item.title} — KaburAjaDulu`;
  const titlesId: Record<CommunityPageKind, string> = {
    community: 'Komunitas — KaburAjaDulu',
    programs: 'Program — KaburAjaDulu',
    program: 'Program — KaburAjaDulu',
    events: 'Acara — KaburAjaDulu',
    event: 'Acara belum dipublikasikan — KaburAjaDulu',
    volunteer: 'Relawan | KaburAjaDulu',
    stories: 'Cerita — KaburAjaDulu',
    story: 'Cerita — KaburAjaDulu',
    history: 'Sejarah — KaburAjaDulu',
    impact: 'Dampak — KaburAjaDulu',
    support: 'Dukungan — KaburAjaDulu',
    credits: 'Kredit komunitas — KaburAjaDulu',
  };
  const titlesEn: Record<CommunityPageKind, string> = {
    community: 'Community | KaburAjaDulu',
    programs: 'Programs | KaburAjaDulu',
    program: 'Program | KaburAjaDulu',
    events: 'Events | KaburAjaDulu',
    event: 'Event record | KaburAjaDulu',
    volunteer: 'Volunteer | KaburAjaDulu',
    stories: 'Stories | KaburAjaDulu',
    story: 'Story | KaburAjaDulu',
    history: 'History | KaburAjaDulu',
    impact: 'Impact | KaburAjaDulu',
    support: 'Support | KaburAjaDulu',
    credits: 'Community credits | KaburAjaDulu',
  };
  return (locale === 'id' ? titlesId : titlesEn)[kind];
}
