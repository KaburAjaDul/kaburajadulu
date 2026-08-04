/**
 * Public-safe, deterministic records used only by the staging build.
 *
 * This module intentionally contains no contact details, private identifiers,
 * real handles, avatars, locations, or links into private community systems.
 */
const BUILD_STAGING_FIXTURES_ENABLED = import.meta.env.PUBLIC_STAGING_FIXTURES === 'true';

export function stagingFixturesEnabled(): boolean {
  const runtimeValue = typeof process !== 'undefined' ? process.env.PUBLIC_STAGING_FIXTURES : undefined;
  if (runtimeValue !== undefined) return runtimeValue === 'true';
  return BUILD_STAGING_FIXTURES_ENABLED;
}

export const STAGING_FIXTURES_ENABLED = stagingFixturesEnabled();

export const STAGING_FIXTURE_VERSION = '2026-08-03.kad-demo.1';

/**
 * The clock for every deterministic staging record. Keeping this explicit
 * prevents a fixture from becoming live (or stale) based on the build host's
 * wall clock.
 */
export const STAGING_SCENARIO = {
  asOf: '2026-08-04T12:00:00+07:00',
  environment: 'staging',
  demo: true,
} as const;

export const STAGING_SCENARIO_CLOCK = STAGING_SCENARIO.asOf;

import type { Locale } from '@/i18n/constants';

export type FixtureState = 'upcoming' | 'live' | 'completed' | 'pending' | 'error' | 'not-published';
export type EventLifecycleState = Extract<FixtureState, 'upcoming' | 'live' | 'completed'>;
export type LocalizedText = Readonly<{ id: string; en: string }>;

export function fixtureText(value: LocalizedText, locale: Locale | string): string {
  return locale === 'id' ? value.id : value.en;
}

interface FixtureMeta {
  id: string;
  state: FixtureState;
  source: 'staging-seed';
  revision: string;
  demo: true;
}

export interface PreviewFixture extends FixtureMeta {
  kind: 'preview-fixture';
  label: 'Data simulasi' | 'Demo data';
}

export interface Session extends FixtureMeta {
  kind: 'session';
  programId: string;
  seriesId: string | null;
  title: LocalizedText;
  startsAt: string;
  durationMinutes: number;
  timezone: 'Asia/Jakarta';
  format: 'online';
}

export interface Event extends FixtureMeta {
  kind: 'event';
  programId: string | null;
  relatedProgramId?: string | null;
  standalone?: boolean;
  title: LocalizedText;
  summary: LocalizedText;
  startsAt: string;
  endsAt: string;
  timezone: 'Asia/Jakarta';
  format: 'online';
  sourceLabel: LocalizedText;
  method: LocalizedText;
}

export interface ProgramSeries extends FixtureMeta {
  kind: 'series';
  programId: string;
  title: LocalizedText;
  summary: LocalizedText;
  level: string | null;
  sessionIds: readonly string[];
}

export type ProgramMetricKey =
  | 'completed-sessions'
  | 'unique-participants'
  | 'returning-participants'
  | 'documentation-coverage';

export interface ProgramMetric extends FixtureMeta {
  kind: 'program-metric';
  programId: string;
  key: ProgramMetricKey;
  label: LocalizedText;
  value: number | null;
  period: LocalizedText;
  definition: LocalizedText;
  sourceLabel: LocalizedText;
  method: LocalizedText;
  reviewedAt: string | null;
}

export interface StagingProgram extends FixtureMeta {
  kind: 'program';
  slug: string;
  title: LocalizedText;
  purpose: LocalizedText;
  audience: LocalizedText;
  series: readonly ProgramSeries[];
  sessions: readonly Session[];
  metricContract: readonly ProgramMetric[];
}

export interface VolunteerProfile extends FixtureMeta {
  kind: 'volunteer-profile';
  displayName: LocalizedText;
  role: LocalizedText;
  cycle: LocalizedText;
  attribution: 'opt-in-demo';
}

export interface ContributorStub extends FixtureMeta {
  kind: 'contributor-stub';
  visibility: 'anonymous-stub';
  cycle: LocalizedText;
}

export interface VolunteerCycle extends FixtureMeta {
  kind: 'volunteer-cycle';
  name: LocalizedText;
  startsOn: string;
  endsOn: string;
  recruitment: 'continuous' | 'closed';
}

export interface Division extends FixtureMeta {
  kind: 'division';
  name: LocalizedText;
  purpose: LocalizedText;
}

export type VolunteerPosition =
  | 'advisor'
  | 'community-manager'
  | 'division-lead'
  | 'individual-volunteer';

export interface VolunteerAssignment extends FixtureMeta {
  kind: 'volunteer-assignment';
  volunteerId: string;
  cycleId: string;
  divisionIds: readonly string[];
  position: VolunteerPosition;
  responsibilities: readonly LocalizedText[];
}

export interface VolunteerOpportunity extends FixtureMeta {
  kind: 'volunteer-opportunity';
  divisionId: string;
  title: LocalizedText;
  outcome: LocalizedText;
  commitment: LocalizedText;
  owner: LocalizedText;
  applicationPath: LocalizedText;
  state: Extract<FixtureState, 'upcoming' | 'live' | 'pending'>;
}

export type ContributorVisibility = 'anonymous-stub' | 'opt-in-profile';

export interface ContributionAttribution {
  volunteerId: string;
  responsibility: LocalizedText;
  visibility: ContributorVisibility;
}

export interface Contribution extends FixtureMeta {
  kind: 'contribution';
  programId: string;
  attributions: readonly ContributionAttribution[];
  contributor: LocalizedText;
  area: LocalizedText;
  summary: LocalizedText;
  period: LocalizedText;
  reviewState: 'reported' | 'evidence_attached' | 'verified' | 'corrected' | 'revoked';
  evidence: readonly LocalizedText[];
}

export interface EvidenceMetric extends FixtureMeta {
  kind: 'evidence-metric';
  label: LocalizedText;
  value: string;
  period: LocalizedText;
  updatedAt: string;
  definition: LocalizedText;
  sourceLabel: LocalizedText;
  method: LocalizedText;
}

export interface OrganizationUnit extends FixtureMeta {
  kind: 'organization-unit';
  name: LocalizedText;
  purpose: LocalizedText;
  handoff: LocalizedText;
  profileCount: number;
}

export interface AttributionConsent extends FixtureMeta {
  kind: 'attribution-consent';
  subject?: LocalizedText;
  scope?: LocalizedText;
  status: 'granted-for-demo' | 'anonymous-by-choice' | 'revoked-demo';
}

export interface PublishedRecord extends FixtureMeta {
  kind: 'published-record';
  slug?: string;
  title: LocalizedText;
  summary: LocalizedText;
  body?: readonly LocalizedText[];
  publishedDate: string;
  sourceLabel: LocalizedText;
  method: LocalizedText;
  recordType: 'event' | 'story' | 'credit';
}

export function deriveEventLifecycle(
  event: Pick<Event, 'startsAt' | 'endsAt'>,
  asOf: string = STAGING_SCENARIO.asOf,
): EventLifecycleState {
  const now = Date.parse(asOf);
  const startsAt = Date.parse(event.startsAt);
  const endsAt = Date.parse(event.endsAt);

  if (now < startsAt) return 'upcoming';
  if (now < endsAt) return 'live';
  return 'completed';
}

export const eventLifecycle = deriveEventLifecycle;

function deriveSessionLifecycle(
  session: Pick<Session, 'startsAt' | 'durationMinutes'>,
  asOf: string = STAGING_SCENARIO.asOf,
): EventLifecycleState {
  const startsAt = Date.parse(session.startsAt);
  return deriveEventLifecycle(
    {
      startsAt: session.startsAt,
      endsAt: new Date(startsAt + session.durationMinutes * 60_000).toISOString(),
    },
    asOf,
  );
}

const revision = STAGING_FIXTURE_VERSION;
const meta = <T extends FixtureMeta>(record: T): T => record;
const eventFixture = <T extends Omit<Event, 'state'>>(record: T): Event => meta({
  ...record,
  state: deriveEventLifecycle(record),
});

export const PREVIEW_FIXTURE: PreviewFixture = meta({
  id: 'demo-preview-fixture-kad-2026',
  kind: 'preview-fixture',
  state: 'pending',
  source: 'staging-seed',
  revision,
  demo: true,
  label: 'Data simulasi',
});

const STAGING_SESSIONS: readonly Session[] = [
  meta({
    id: 'demo-session-japanese-n5-01',
    kind: 'session',
    state: 'upcoming',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'japanese-study-club',
    seriesId: 'demo-series-japanese-n5',
    title: { id: 'Japanese Study Club · N5', en: 'Japanese Study Club · N5' },
    startsAt: '2026-08-10T19:00:00+07:00',
    durationMinutes: 90,
    timezone: 'Asia/Jakarta',
    format: 'online',
  }),
  meta({
    id: 'demo-session-japanese-n4-01',
    kind: 'session',
    state: 'upcoming',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'japanese-study-club',
    seriesId: 'demo-series-japanese-n4-n3',
    title: { id: 'Japanese Study Club · N4–N3', en: 'Japanese Study Club · N4–N3' },
    startsAt: '2026-08-17T19:00:00+07:00',
    durationMinutes: 90,
    timezone: 'Asia/Jakarta',
    format: 'online',
  }),
  meta({
    id: 'demo-session-english-direct-01',
    kind: 'session',
    state: 'upcoming',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'english-study-club',
    seriesId: null,
    title: { id: 'English Study Club · percakapan', en: 'English Study Club · conversation' },
    startsAt: '2026-08-12T19:30:00+07:00',
    durationMinutes: 60,
    timezone: 'Asia/Jakarta',
    format: 'online',
  }),
  meta({
    id: 'demo-session-tech-coding-01',
    kind: 'session',
    state: 'upcoming',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'tech-coding-club',
    seriesId: null,
    title: { id: 'Tech/Coding Club · berbagi praktik', en: 'Tech/Coding Club · practice sharing' },
    startsAt: '2026-08-19T19:00:00+07:00',
    durationMinutes: 90,
    timezone: 'Asia/Jakarta',
    format: 'online',
  }),
];

const STAGING_EVENTS: readonly Event[] = [
  eventFixture({
    id: 'demo-event-community-collaboration-01',
    kind: 'event',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: null,
    relatedProgramId: null,
    standalone: true,
    title: { id: 'Kolaborasi komunitas · malam berbagi', en: 'Community collaboration · sharing night' },
    summary: { id: 'Pertemuan kolaboratif satu kali di luar Program berkelanjutan.', en: 'A one-off collaborative gathering outside a continuing program.' },
    startsAt: '2026-08-22T16:00:00+07:00',
    endsAt: '2026-08-22T18:00:00+07:00',
    timezone: 'Asia/Jakarta',
    format: 'online',
    sourceLabel: { id: 'Catatan kolaborasi contoh', en: 'Sample collaboration record' },
    method: { id: 'Acara fiktif untuk menguji Agenda campuran.', en: 'Fictional event used to test the mixed Agenda.' },
  }),
];

const STAGING_VOLUNTEERS: readonly VolunteerProfile[] = [
  meta({ id: 'demo-volunteer-nara-01', kind: 'volunteer-profile', state: 'completed', source: 'staging-seed', revision, demo: true, displayName: { id: 'Nara (fiktif)', en: 'Nara (fictional)' }, role: { id: 'Penjaga ritme program', en: 'Program rhythm keeper' }, cycle: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, attribution: 'opt-in-demo' }),
  meta({ id: 'demo-volunteer-bima-01', kind: 'volunteer-profile', state: 'live', source: 'staging-seed', revision, demo: true, displayName: { id: 'Bima (fiktif)', en: 'Bima (fictional)' }, role: { id: 'Pendamping dokumentasi', en: 'Documentation companion' }, cycle: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, attribution: 'opt-in-demo' }),
  meta({ id: 'demo-volunteer-sari-01', kind: 'volunteer-profile', state: 'live', source: 'staging-seed', revision, demo: true, displayName: { id: 'Sari (fiktif)', en: 'Sari (fictional)' }, role: { id: 'Lead area teknologi', en: 'Technology area lead' }, cycle: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, attribution: 'opt-in-demo' }),
];

const STAGING_CONTRIBUTOR_STUBS: readonly ContributorStub[] = [
  meta({ id: 'demo-volunteer-anonymous-01', kind: 'contributor-stub', state: 'pending', source: 'staging-seed', revision, demo: true, visibility: 'anonymous-stub', cycle: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' } }),
];

const STAGING_TEAMS: readonly OrganizationUnit[] = [
  meta({ id: 'demo-team-program-01', kind: 'organization-unit', state: 'live', source: 'staging-seed', revision, demo: true, name: { id: 'Tim Program', en: 'Program Team' }, purpose: { id: 'Menjaga tujuan, fasilitator, dan ritme sesi tetap jelas.', en: 'Keeps session goals, facilitators, and rhythm clear.' }, handoff: { id: 'Menyerahkan catatan sesi ke tim dokumentasi.', en: 'Hands session notes to the documentation team.' }, profileCount: 1 }),
  meta({ id: 'demo-team-documentation-01', kind: 'organization-unit', state: 'live', source: 'staging-seed', revision, demo: true, name: { id: 'Tim Dokumentasi', en: 'Documentation Team' }, purpose: { id: 'Mengubah kegiatan menjadi catatan yang bisa diperiksa.', en: 'Turns activity into records that people can inspect.' }, handoff: { id: 'Menyerahkan rekaman terverifikasi ke meja publikasi.', en: 'Hands verified records to the publishing desk.' }, profileCount: 1 }),
  meta({ id: 'demo-team-community-01', kind: 'organization-unit', state: 'pending', source: 'staging-seed', revision, demo: true, name: { id: 'Tim Pendamping Komunitas', en: 'Community Support Team' }, purpose: { id: 'Membantu anggota menemukan ruang dan langkah awal yang tepat.', en: 'Helps members find the right room and first step.' }, handoff: { id: 'Mencatat kebutuhan yang perlu dibawa ke siklus berikutnya.', en: 'Records needs that should enter the next cycle.' }, profileCount: 1 }),
];

const STAGING_CONTRIBUTIONS: readonly Contribution[] = [
  meta({ id: 'demo-contribution-guide-01', kind: 'contribution', state: 'completed', source: 'staging-seed', revision, demo: true, programId: 'japanese-study-club', attributions: [{ volunteerId: 'demo-volunteer-nara-01', responsibility: { id: 'Menyusun panduan program', en: 'Prepared the program guide' }, visibility: 'opt-in-profile' }, { volunteerId: 'demo-volunteer-bima-01', responsibility: { id: 'Meninjau kejelasan panduan', en: 'Reviewed guide clarity' }, visibility: 'opt-in-profile' }], contributor: { id: 'Nara (fiktif)', en: 'Nara (fictional)' }, area: { id: 'Panduan program', en: 'Program guide' }, summary: { id: 'Merapikan langkah awal untuk klub bahasa.', en: 'Clarified the first steps for a language club.' }, period: { id: 'Agustus 2026', en: 'August 2026' }, reviewState: 'verified', evidence: [{ id: 'Ringkasan editorial contoh', en: 'Sample editorial recap' }] }),
  meta({ id: 'demo-contribution-recap-01', kind: 'contribution', state: 'completed', source: 'staging-seed', revision, demo: true, programId: 'english-study-club', attributions: [{ volunteerId: 'demo-volunteer-anonymous-01', responsibility: { id: 'Menyusun ringkasan sesi', en: 'Prepared the session recap' }, visibility: 'anonymous-stub' }], contributor: { id: 'Relawan Anonim 1', en: 'Anonymous Volunteer 1' }, area: { id: 'Ringkasan sesi', en: 'Session recap' }, summary: { id: 'Menyusun ringkasan sesi yang siap ditinjau.', en: 'Prepared a session recap for review.' }, period: { id: 'Agustus 2026', en: 'August 2026' }, reviewState: 'evidence_attached', evidence: [{ id: 'Catatan sesi contoh', en: 'Sample session notes' }] }),
  meta({ id: 'demo-contribution-calendar-01', kind: 'contribution', state: 'live', source: 'staging-seed', revision, demo: true, programId: 'tech-coding-club', attributions: [{ volunteerId: 'demo-volunteer-bima-01', responsibility: { id: 'Menjaga status agenda', en: 'Maintained agenda status' }, visibility: 'opt-in-profile' }], contributor: { id: 'Bima (fiktif)', en: 'Bima (fictional)' }, area: { id: 'Meja agenda', en: 'Schedule desk' }, summary: { id: 'Menjaga status agenda tetap mudah dibaca.', en: 'Kept schedule status easy to understand.' }, period: { id: 'Agustus 2026', en: 'August 2026' }, reviewState: 'reported', evidence: [] }),
];

const STAGING_METRICS: readonly EvidenceMetric[] = [
  meta({ id: 'demo-metric-sessions-2026-08', kind: 'evidence-metric', state: 'completed', source: 'staging-seed', revision, demo: true, label: { id: 'Sesi terdokumentasi', en: 'Documented sessions' }, value: '12', period: { id: 'Juli 2026', en: 'July 2026' }, updatedAt: '2026-08-03', definition: { id: 'Rekaman sesi dengan ringkasan yang ditandai selesai.', en: 'Session records with a recap marked complete.' }, sourceLabel: { id: 'Dataset pratinjau', en: 'Preview dataset' }, method: { id: 'Hitung rekaman contoh berstatus selesai.', en: 'Count fictional records marked complete.' } }),
  meta({ id: 'demo-metric-contributors-2026-08', kind: 'evidence-metric', state: 'live', source: 'staging-seed', revision, demo: true, label: { id: 'Kontributor aktif', en: 'Active contributors' }, value: '8', period: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, updatedAt: '2026-08-03', definition: { id: 'Profil contoh dengan kontribusi pada siklus berjalan.', en: 'Sample profiles with work in the current cycle.' }, sourceLabel: { id: 'Dataset pratinjau', en: 'Preview dataset' }, method: { id: 'Hitung profil contoh dengan kontribusi pada siklus.', en: 'Count fictional profiles with a cycle contribution.' } }),
  meta({ id: 'demo-metric-programs-2026-08', kind: 'evidence-metric', state: 'upcoming', source: 'staging-seed', revision, demo: true, label: { id: 'Program dengan langkah berikutnya', en: 'Programs with a next step' }, value: '3', period: { id: 'Agustus 2026', en: 'August 2026' }, updatedAt: '2026-08-03', definition: { id: 'Program contoh dengan sesi berikutnya yang disimulasikan.', en: 'Sample programs with a simulated next session.' }, sourceLabel: { id: 'Dataset pratinjau', en: 'Preview dataset' }, method: { id: 'Hitung program contoh dengan sesi berikutnya.', en: 'Count fictional programs with a next session.' } }),
];

const STAGING_ATTRIBUTION: readonly AttributionConsent[] = [
  meta({ id: 'demo-consent-nara-01', kind: 'attribution-consent', state: 'completed', source: 'staging-seed', revision, demo: true, subject: { id: 'Nara (fiktif)', en: 'Nara (fictional)' }, scope: { id: 'Nama dan kontribusi simulasi', en: 'Simulated name and contribution' }, status: 'granted-for-demo' }),
  meta({ id: 'demo-consent-anonymous-01', kind: 'attribution-consent', state: 'live', source: 'staging-seed', revision, demo: true, subject: { id: 'Relawan Anonim 1', en: 'Anonymous Volunteer 1' }, scope: { id: 'Kontribusi simulasi tanpa nama', en: 'Simulated contribution without a name' }, status: 'anonymous-by-choice' }),
  meta({ id: 'demo-consent-revoked-01', kind: 'attribution-consent', state: 'completed', source: 'staging-seed', revision, demo: true, status: 'revoked-demo' }),
];

const STAGING_PUBLISHED_RECORDS: readonly PublishedRecord[] = [
  meta({ id: 'demo-record-story-01', slug: 'catatan-belajar-satu-siklus', kind: 'published-record', state: 'completed', source: 'staging-seed', revision, demo: true, title: { id: 'Catatan belajar dari satu siklus', en: 'Learning notes from one cycle' }, summary: { id: 'Ringkasan fiktif tentang pelajaran yang bisa dibawa ke siklus berikutnya.', en: 'A fictional recap of lessons to carry into the next cycle.' }, body: [{ id: 'Siklus ini dimulai dari satu kebutuhan kecil: membuat langkah awal program lebih mudah dipahami.', en: 'This cycle began with one small need: making a program’s first step easier to understand.' }, { id: 'Relawan membagi pekerjaan menjadi lingkup yang dapat diselesaikan, mencatat keputusan, lalu menyerahkan konteksnya kepada siklus berikutnya.', en: 'Volunteers divided the work into finishable scopes, recorded decisions, and handed the context to the next cycle.' }, { id: 'Catatan ini menunjukkan bentuk dokumentasi publik yang ringkas tanpa membuka percakapan atau identitas privat.', en: 'This note demonstrates concise public documentation without exposing private conversations or identities.' }], publishedDate: '2026-08-02', sourceLabel: { id: 'Catatan editorial contoh', en: 'Sample editorial record' }, method: { id: 'Disusun sebagai contoh ulasan editorial.', en: 'Prepared as an editorial review example.' }, recordType: 'story' }),
  meta({ id: 'demo-record-credit-01', kind: 'published-record', state: 'completed', source: 'staging-seed', revision, demo: true, title: { id: 'Kredit kontribusi siklus contoh 03', en: 'Sample cycle 03 contribution credit' }, summary: { id: 'Kredit fiktif yang menunjukkan cara kontribusi dicatat dengan aman.', en: 'A fictional credit showing how contributions can be recorded safely.' }, publishedDate: '2026-08-03', sourceLabel: { id: 'Catatan kredit contoh', en: 'Sample credit record' }, method: { id: 'Dibuat untuk meninjau tampilan kredit publik.', en: 'Created to review the public credit presentation.' }, recordType: 'credit' }),
];

const deriveSessionState = (session: Session): Session => ({ ...session, state: deriveSessionLifecycle(session) });
const deriveEventState = (event: Event): Event => ({ ...event, state: deriveEventLifecycle(event) });

const STAGING_SESSIONS_WITH_CLOCK: readonly Session[] = STAGING_SESSIONS.map(deriveSessionState);
const STAGING_EVENTS_WITH_CLOCK: readonly Event[] = STAGING_EVENTS.map(deriveEventState);

export const STAGING_POSITIONS = [
  'advisor',
  'community-manager',
  'division-lead',
  'individual-volunteer',
] as const satisfies readonly VolunteerPosition[];

const stagingCycle: VolunteerCycle = meta({
  id: 'demo-cycle-2026-q3',
  kind: 'volunteer-cycle',
  state: 'live',
  source: 'staging-seed',
  revision,
  demo: true,
  name: { id: 'Siklus relawan 03 · 2026', en: 'Volunteer Cycle 03 · 2026' },
  startsOn: '2026-07-01',
  endsOn: '2026-09-30',
  recruitment: 'continuous',
});

const STAGING_DIVISIONS: readonly Division[] = [
  ['study-club', 'Study Club', 'Menjaga ruang belajar rutin dan ramah pemula.', 'Maintains regular, beginner-friendly study spaces.'],
  ['tech-coding-club', 'Tech/Coding Club', 'Mengelola sesi berbagi praktik teknologi.', 'Coordinates technology practice-sharing sessions.'],
  ['event', 'Event', 'Menyiapkan kolaborasi dan acara satu kali.', 'Prepares collaborations and one-off Events.'],
  ['design', 'Design', 'Membuat kebutuhan visual publik tetap jelas dan dapat diakses.', 'Keeps public visual work clear and accessible.'],
  ['content', 'Content', 'Menyusun dokumentasi dan cerita yang dapat ditelusuri.', 'Produces traceable documentation and Stories.'],
  ['partnership', 'Partnership', 'Menjaga hubungan dengan komunitas dan mitra.', 'Maintains community and partner relationships.'],
  ['data', 'Data', 'Menjaga sumber, definisi, dan kesegaran metrik.', 'Maintains metric sources, definitions, and freshness.'],
].map(([id, idName, idPurpose, enPurpose]) => meta({
  id: `demo-division-${id}`,
  kind: 'division' as const,
  state: 'live' as const,
  source: 'staging-seed' as const,
  revision,
  demo: true as const,
  name: { id: idName, en: idName },
  purpose: { id: idPurpose, en: enPurpose },
}));

const STAGING_VOLUNTEER_ASSIGNMENTS: readonly VolunteerAssignment[] = [
  meta({ id: 'demo-assignment-nara-study-01', kind: 'volunteer-assignment', state: 'live', source: 'staging-seed', revision, demo: true, volunteerId: 'demo-volunteer-nara-01', cycleId: stagingCycle.id, divisionIds: ['demo-division-study-club'], position: 'advisor', responsibilities: [{ id: 'Menjaga arah belajar.', en: 'Provides learning oversight.' }] }),
  meta({ id: 'demo-assignment-bima-content-01', kind: 'volunteer-assignment', state: 'live', source: 'staging-seed', revision, demo: true, volunteerId: 'demo-volunteer-bima-01', cycleId: stagingCycle.id, divisionIds: ['demo-division-content'], position: 'community-manager', responsibilities: [{ id: 'Menjaga serah terima dokumentasi.', en: 'Maintains documentation handover.' }] }),
  meta({ id: 'demo-assignment-sari-tech-01', kind: 'volunteer-assignment', state: 'live', source: 'staging-seed', revision, demo: true, volunteerId: 'demo-volunteer-sari-01', cycleId: stagingCycle.id, divisionIds: ['demo-division-tech-coding-club'], position: 'division-lead', responsibilities: [{ id: 'Mengawal sesi berbagi teknologi.', en: 'Leads technology sharing sessions.' }] }),
  meta({ id: 'demo-assignment-anonymous-study-01', kind: 'volunteer-assignment', state: 'live', source: 'staging-seed', revision, demo: true, volunteerId: 'demo-volunteer-anonymous-01', cycleId: stagingCycle.id, divisionIds: ['demo-division-study-club'], position: 'individual-volunteer', responsibilities: [{ id: 'Mendampingi peserta.', en: 'Supports participants.' }] }),
];

const STAGING_ASSIGNMENTS = STAGING_VOLUNTEER_ASSIGNMENTS;
const stagingCycles: readonly VolunteerCycle[] = [stagingCycle];

const STAGING_VOLUNTEER_OPPORTUNITIES: readonly VolunteerOpportunity[] = [
  meta({ id: 'demo-opportunity-content-01', kind: 'volunteer-opportunity', state: 'upcoming', source: 'staging-seed', revision, demo: true, divisionId: 'demo-division-content', title: { id: 'Penyunting ringkasan sesi', en: 'Session recap editor' }, outcome: { id: 'Satu ringkasan sesi siap ditinjau.', en: 'One session recap ready for review.' }, commitment: { id: 'Dua jam per minggu.', en: 'Two hours per week.' }, owner: { id: 'Lead Content fiktif', en: 'Fictional Content Lead' }, applicationPath: { id: 'Kirim minat melalui intake komunitas.', en: 'Share interest through community intake.' } }),
  meta({ id: 'demo-opportunity-data-01', kind: 'volunteer-opportunity', state: 'live', source: 'staging-seed', revision, demo: true, divisionId: 'demo-division-data', title: { id: 'Pemeriksa sumber metrik', en: 'Metric source checker' }, outcome: { id: 'Satu metrik memiliki sumber dan tanggal tinjau.', en: 'One metric has a source and review date.' }, commitment: { id: 'Satu lingkup kecil per siklus.', en: 'One bounded scope per cycle.' }, owner: { id: 'Lead Data fiktif', en: 'Fictional Data Lead' }, applicationPath: { id: 'Kirim minat melalui intake komunitas.', en: 'Share interest through community intake.' } }),
  meta({ id: 'demo-opportunity-tech-01', kind: 'volunteer-opportunity', state: 'upcoming', source: 'staging-seed', revision, demo: true, divisionId: 'demo-division-tech-coding-club', title: { id: 'Pendamping sesi berbagi', en: 'Practice-sharing facilitator' }, outcome: { id: 'Satu sesi berbagi memiliki fasilitator.', en: 'One sharing Session has a facilitator.' }, commitment: { id: 'Satu sesi per bulan.', en: 'One Session per month.' }, owner: { id: 'Lead Tech fiktif', en: 'Fictional Tech Lead' }, applicationPath: { id: 'Kirim minat melalui intake komunitas.', en: 'Share interest through community intake.' } }),
];

const programMetric = (programId: string, key: ProgramMetricKey, label: LocalizedText, value: number | null): ProgramMetric => meta({
  id: `demo-program-metric-${programId}-${key}`,
  kind: 'program-metric',
  state: value === null ? 'pending' : 'completed',
  source: 'staging-seed',
  revision,
  demo: true,
  programId,
  key,
  label,
  value,
  period: { id: 'Agustus 2026', en: 'August 2026' },
  definition: { id: 'Definisi metrik contoh yang disepakati untuk Program.', en: 'Fictional metric definition agreed for the program.' },
  sourceLabel: { id: 'Dataset pratinjau', en: 'Preview dataset' },
  method: { id: 'Hitung rekaman contoh yang telah ditandai.', en: 'Count fictional records marked for the measure.' },
  reviewedAt: value === null ? null : '2026-08-03T12:00:00+07:00',
});

const japaneseSeries = [
  meta({ id: 'demo-series-japanese-n5', kind: 'series', state: 'live', source: 'staging-seed', revision, demo: true, programId: 'japanese-study-club', title: { id: 'Japanese N5', en: 'Japanese N5' }, summary: { id: 'Fondasi hiragana, katakana, dan percakapan awal.', en: 'Hiragana, katakana, and first-conversation foundations.' }, level: 'N5', sessionIds: ['demo-session-japanese-n5-01'] }),
  meta({ id: 'demo-series-japanese-n4-n3', kind: 'series', state: 'upcoming', source: 'staging-seed', revision, demo: true, programId: 'japanese-study-club', title: { id: 'Japanese N4–N3', en: 'Japanese N4–N3' }, summary: { id: 'Latihan tata bahasa dan pemahaman tingkat menengah.', en: 'Grammar and comprehension practice at intermediate levels.' }, level: 'N4–N3', sessionIds: ['demo-session-japanese-n4-01'] }),
  meta({ id: 'demo-series-japanese-n2-n1', kind: 'series', state: 'pending', source: 'staging-seed', revision, demo: true, programId: 'japanese-study-club', title: { id: 'Japanese N2–N1', en: 'Japanese N2–N1' }, summary: { id: 'Ruang persiapan tingkat lanjut yang menunggu bukti jadwal.', en: 'Advanced preparation pending schedule evidence.' }, level: 'N2–N1', sessionIds: [] }),
] as const satisfies readonly ProgramSeries[];

const stagingProgram = (record: Omit<StagingProgram, 'metricContract'>): StagingProgram => meta({
  ...record,
  metricContract: [
    programMetric(record.slug, 'completed-sessions', { id: 'Sesi selesai', en: 'Completed sessions' }, 4),
    programMetric(record.slug, 'unique-participants', { id: 'Peserta unik', en: 'Unique participants' }, 18),
    programMetric(record.slug, 'returning-participants', { id: 'Peserta yang kembali', en: 'Returning participants' }, 7),
    programMetric(record.slug, 'documentation-coverage', { id: 'Cakupan dokumentasi', en: 'Documentation coverage' }, 80),
  ],
});

const STAGING_PROGRAMS: readonly StagingProgram[] = [
  stagingProgram({ id: 'demo-program-japanese-study-club', kind: 'program', state: 'live', source: 'staging-seed', revision, demo: true, slug: 'japanese-study-club', title: { id: 'Japanese Study Club', en: 'Japanese Study Club' }, purpose: { id: 'Program belajar bahasa Jepang bertahap.', en: 'A staged Japanese language learning program.' }, audience: { id: 'Pembelajar dari dasar sampai tingkat lanjut.', en: 'Learners from foundational to advanced levels.' }, series: japaneseSeries, sessions: STAGING_SESSIONS_WITH_CLOCK.filter((session) => session.programId === 'japanese-study-club') }),
  stagingProgram({ id: 'demo-program-english-study-club', kind: 'program', state: 'live', source: 'staging-seed', revision, demo: true, slug: 'english-study-club', title: { id: 'English Study Club', en: 'English Study Club' }, purpose: { id: 'Latihan percakapan langsung dengan ritme informal.', en: 'Direct conversation practice with an informal rhythm.' }, audience: { id: 'Pembelajar yang ingin berlatih berbicara.', en: 'Learners who want to practise speaking.' }, series: [], sessions: STAGING_SESSIONS_WITH_CLOCK.filter((session) => session.programId === 'english-study-club') }),
  stagingProgram({ id: 'demo-program-korean-study-club', kind: 'program', state: 'upcoming', source: 'staging-seed', revision, demo: true, slug: 'korean-study-club', title: { id: 'Korean Study Club', en: 'Korean Study Club' }, purpose: { id: 'Ruang belajar Korea dan konteks budaya.', en: 'A space for Korean study and cultural context.' }, audience: { id: 'Pembelajar bahasa Korea.', en: 'Korean language learners.' }, series: [], sessions: [] }),
  stagingProgram({ id: 'demo-program-tech-coding-club', kind: 'program', state: 'live', source: 'staging-seed', revision, demo: true, slug: 'tech-coding-club', title: { id: 'Tech/Coding Club', en: 'Tech/Coding Club' }, purpose: { id: 'Sesi berbagi praktik teknologi tanpa klaim proyek.', en: 'Technology practice-sharing sessions without a project claim.' }, audience: { id: 'Orang yang ingin berbagi dan belajar teknologi.', en: 'People who want to share and learn technology.' }, series: [], sessions: STAGING_SESSIONS_WITH_CLOCK.filter((session) => session.programId === 'tech-coding-club') }),
  stagingProgram({ id: 'demo-program-cerita-aja-dulu', kind: 'program', state: 'upcoming', source: 'staging-seed', revision, demo: true, slug: 'cerita-aja-dulu', title: { id: 'CeritaAjaDulu', en: 'CeritaAjaDulu' }, purpose: { id: 'Ruang cerita dan refleksi komunitas yang berkelanjutan.', en: 'A continuing space for community stories and reflection.' }, audience: { id: 'Anggota yang ingin berbagi pengalaman.', en: 'Members who want to share experiences.' }, series: [], sessions: [] }),
];

const STAGING_SERIES: readonly ProgramSeries[] = STAGING_PROGRAMS.flatMap((program) => program.series);
const STAGING_PROGRAM_METRICS: readonly ProgramMetric[] = STAGING_PROGRAMS.flatMap((program) => program.metricContract);

export type StagingAgendaItem = Session | Event;

const CANONICAL_AGENDA_SESSION_IDS = new Set([
  'demo-session-japanese-n5-01',
  'demo-session-japanese-n4-01',
  'demo-session-english-direct-01',
]);

export function listStagingAgenda(): readonly StagingAgendaItem[] {
  if (!stagingFixturesEnabled()) return [];
  return [
    ...STAGING_SESSIONS_WITH_CLOCK.filter((session) => CANONICAL_AGENDA_SESSION_IDS.has(session.id)),
    ...STAGING_EVENTS_WITH_CLOCK.filter((event) => event.id === 'demo-event-community-collaboration-01'),
  ].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

export function groupContributionsByProgram(volunteerId: string): ReadonlyMap<string, readonly Contribution[]> {
  const grouped = new Map<string, Contribution[]>();
  if (!stagingFixturesEnabled()) return grouped;
  for (const contribution of STAGING_CONTRIBUTIONS) {
    if (!contribution.attributions.some((attribution) => attribution.volunteerId === volunteerId)) continue;
    const current = grouped.get(contribution.programId) ?? [];
    current.push(contribution);
    grouped.set(contribution.programId, current);
  }
  return grouped;
}

export interface StagingContributorProjection {
  id: string;
  visibility: ContributorVisibility;
  displayName: LocalizedText | null;
  role: LocalizedText | null;
  cycle: LocalizedText | null;
  contributionCount: number;
  verifiedContributionCount: number;
  source: 'staging-seed';
  revision: string;
  demo: true;
}

/** Resolve public identity from the active consent record, never profile presence alone. */
export function contributorVisibility(volunteerId: string): ContributorVisibility {
  const stub = STAGING_CONTRIBUTOR_STUBS.find((candidate) => candidate.id === volunteerId);
  if (stub) return stub.visibility;
  const profile = STAGING_VOLUNTEERS.find((candidate) => candidate.id === volunteerId);
  if (!profile) return 'anonymous-stub';
  return activeStagingAttribution().some((consent) => consent.status === 'granted-for-demo' && consent.subject?.id === profile.displayName.id)
    ? 'opt-in-profile'
    : 'anonymous-stub';
}

export function publicContributorProjection(volunteerId: string): StagingContributorProjection | null {
  if (!stagingFixturesEnabled()) return null;
  const profile = STAGING_VOLUNTEERS.find((candidate) => candidate.id === volunteerId);
  const stub = STAGING_CONTRIBUTOR_STUBS.find((candidate) => candidate.id === volunteerId);
  if (!profile && !stub) return null;
  const visibility = contributorVisibility(volunteerId);
  const contributions = STAGING_CONTRIBUTIONS.filter((contribution) => contribution.attributions.some((attribution) => attribution.volunteerId === volunteerId));
  return {
    id: volunteerId,
    visibility,
    displayName: visibility === 'opt-in-profile' ? profile?.displayName ?? null : null,
    role: visibility === 'opt-in-profile' ? profile?.role ?? null : null,
    cycle: profile?.cycle ?? stub!.cycle,
    contributionCount: contributions.length,
    verifiedContributionCount: contributions.filter((contribution) => contribution.reviewState === 'verified').length,
    source: 'staging-seed',
    revision,
    demo: true,
  };
}

export const activeStagingPrograms = (): readonly StagingProgram[] => stagingFixturesEnabled() ? STAGING_PROGRAMS : [];
export const activeStagingSeries = (): readonly ProgramSeries[] => stagingFixturesEnabled() ? STAGING_SERIES : [];
export const activeStagingProgramMetrics = (): readonly ProgramMetric[] => stagingFixturesEnabled() ? STAGING_PROGRAM_METRICS : [];
export const activeStagingSessions = (): readonly Session[] => stagingFixturesEnabled() ? STAGING_SESSIONS_WITH_CLOCK : [];
export const activeStagingEvents = (): readonly Event[] => stagingFixturesEnabled() ? STAGING_EVENTS_WITH_CLOCK : [];
export const activeStagingVolunteers = (): readonly VolunteerProfile[] => stagingFixturesEnabled() ? STAGING_VOLUNTEERS : [];
export const activeStagingContributorStubs = (): readonly ContributorStub[] => stagingFixturesEnabled() ? STAGING_CONTRIBUTOR_STUBS : [];
export const activeStagingTeams = (): readonly OrganizationUnit[] => stagingFixturesEnabled() ? STAGING_TEAMS : [];
export const activeStagingContributions = (): readonly Contribution[] => stagingFixturesEnabled() ? STAGING_CONTRIBUTIONS : [];
export const activeStagingMetrics = (): readonly EvidenceMetric[] => stagingFixturesEnabled() ? STAGING_METRICS : [];
export const activeStagingAttribution = (): readonly AttributionConsent[] => stagingFixturesEnabled() ? STAGING_ATTRIBUTION : [];
export const activeStagingPublishedRecords = (): readonly PublishedRecord[] => stagingFixturesEnabled() ? STAGING_PUBLISHED_RECORDS : [];
export const activeStagingCycles = (): readonly VolunteerCycle[] => stagingFixturesEnabled() ? stagingCycles : [];
export const activeStagingDivisions = (): readonly Division[] => stagingFixturesEnabled() ? STAGING_DIVISIONS : [];
export const activeStagingVolunteerAssignments = (): readonly VolunteerAssignment[] => stagingFixturesEnabled() ? STAGING_ASSIGNMENTS : [];
export const activeStagingVolunteerOpportunities = (): readonly VolunteerOpportunity[] => stagingFixturesEnabled() ? STAGING_VOLUNTEER_OPPORTUNITIES : [];
export const stagingEventById = (id: string): Event | undefined => activeStagingEvents().find((event) => event.id === id);
export const stagingSessionByProgramId = (programId: string): Session | undefined => activeStagingSessions().find((session) => session.programId === programId);
export const stagingStoryBySlug = (slug: string): PublishedRecord | undefined => activeStagingPublishedRecords().find((record) => record.recordType === 'story' && record.slug === slug);
