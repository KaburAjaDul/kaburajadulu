/**
 * Public-safe, deterministic records used only by the staging build.
 *
 * This module intentionally contains no contact details, private identifiers,
 * real handles, avatars, locations, or links into private community systems.
 */
export const STAGING_FIXTURES_ENABLED = import.meta.env.PUBLIC_STAGING_FIXTURES === 'true';

export const STAGING_FIXTURE_VERSION = '2026-08-03.kad-demo.1';

import type { Locale } from '@/i18n/constants';

export type FixtureState = 'upcoming' | 'live' | 'completed' | 'pending' | 'error' | 'not-published';
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
  title: LocalizedText;
  startsAt: string;
  durationMinutes: number;
  timezone: 'Asia/Jakarta';
  format: 'online';
}

export interface Event extends FixtureMeta {
  kind: 'event';
  programId: string;
  title: LocalizedText;
  summary: LocalizedText;
  startsAt: string;
  endsAt: string;
  timezone: 'Asia/Jakarta';
  format: 'online';
  sourceLabel: 'Staging seed';
}

export interface VolunteerProfile extends FixtureMeta {
  kind: 'volunteer-profile';
  displayName: LocalizedText;
  role: LocalizedText;
  cycle: LocalizedText;
  attribution: 'opt-in-demo';
}

export interface Contribution extends FixtureMeta {
  kind: 'contribution';
  contributor: LocalizedText;
  area: LocalizedText;
  summary: LocalizedText;
}

export interface EvidenceMetric extends FixtureMeta {
  kind: 'evidence-metric';
  label: LocalizedText;
  value: string;
  period: LocalizedText;
  definition: LocalizedText;
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
  subject: LocalizedText;
  scope: LocalizedText;
  status: 'granted-for-demo' | 'anonymous-by-choice' | 'revoked-demo';
}

export interface PublishedRecord extends FixtureMeta {
  kind: 'published-record';
  title: LocalizedText;
  recordType: 'event' | 'story' | 'credit';
}

const revision = STAGING_FIXTURE_VERSION;
const meta = <T extends FixtureMeta>(record: T): T => record;

export const PREVIEW_FIXTURE: PreviewFixture = meta({
  id: 'demo-preview-fixture-kad-2026',
  kind: 'preview-fixture',
  state: 'pending',
  source: 'staging-seed',
  revision,
  demo: true,
  label: 'Data simulasi',
});

export const STAGING_SESSIONS: readonly Session[] = [
  meta({
    id: 'demo-session-french-club-01',
    kind: 'session',
    state: 'upcoming',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'french-club-trial',
    title: { id: 'French Club · latihan perkenalan', en: 'French Club · introductions practice' },
    startsAt: '2026-08-08T16:00:00+07:00',
    durationMinutes: 60,
    timezone: 'Asia/Jakarta',
    format: 'online',
  }),
  meta({
    id: 'demo-session-mandarin-transport-01',
    kind: 'session',
    state: 'live',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'mandarin-study-club-transport',
    title: { id: 'Mandarin Study Club · transportasi', en: 'Mandarin Study Club · transport' },
    startsAt: '2026-08-03T18:30:00+07:00',
    durationMinutes: 75,
    timezone: 'Asia/Jakarta',
    format: 'online',
  }),
];

export const STAGING_EVENTS: readonly Event[] = [
  meta({
    id: 'demo-event-french-club-01',
    kind: 'event',
    state: 'upcoming',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'french-club-trial',
    title: { id: 'French Club · sesi perkenalan', en: 'French Club · introductions session' },
    summary: { id: 'Latihan alfabet, pelafalan, dan perkenalan untuk pemula.', en: 'Alphabet, pronunciation, and introductions practice for beginners.' },
    startsAt: '2026-08-08T16:00:00+07:00',
    endsAt: '2026-08-08T17:00:00+07:00',
    timezone: 'Asia/Jakarta',
    format: 'online',
    sourceLabel: 'Staging seed',
  }),
  meta({
    id: 'demo-event-mandarin-transport-01',
    kind: 'event',
    state: 'live',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'mandarin-study-club-transport',
    title: { id: 'Mandarin Study Club · transportasi', en: 'Mandarin Study Club · transport' },
    summary: { id: 'Kosakata transportasi dan latihan percakapan bersama.', en: 'Transport vocabulary and peer conversation practice.' },
    startsAt: '2026-08-03T18:30:00+07:00',
    endsAt: '2026-08-03T19:45:00+07:00',
    timezone: 'Asia/Jakarta',
    format: 'online',
    sourceLabel: 'Staging seed',
  }),
  meta({
    id: 'demo-event-english-weekly-01',
    kind: 'event',
    state: 'completed',
    source: 'staging-seed',
    revision,
    demo: true,
    programId: 'english-mandarin-weekly-clubs',
    title: { id: 'English Study Club · hobi', en: 'English Study Club · hobbies' },
    summary: { id: 'Sesi latihan berbicara dengan tema hobi.', en: 'A speaking practice session about hobbies.' },
    startsAt: '2026-07-25T19:30:00+07:00',
    endsAt: '2026-07-25T20:30:00+07:00',
    timezone: 'Asia/Jakarta',
    format: 'online',
    sourceLabel: 'Staging seed',
  }),
];

export const STAGING_VOLUNTEERS: readonly VolunteerProfile[] = [
  meta({ id: 'demo-volunteer-nara-01', kind: 'volunteer-profile', state: 'completed', source: 'staging-seed', revision, demo: true, displayName: { id: 'Nara (fiktif)', en: 'Nara (fictional)' }, role: { id: 'Penjaga ritme program', en: 'Program rhythm keeper' }, cycle: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, attribution: 'opt-in-demo' }),
  meta({ id: 'demo-volunteer-bima-01', kind: 'volunteer-profile', state: 'live', source: 'staging-seed', revision, demo: true, displayName: { id: 'Bima (fiktif)', en: 'Bima (fictional)' }, role: { id: 'Pendamping dokumentasi', en: 'Documentation companion' }, cycle: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, attribution: 'opt-in-demo' }),
  meta({ id: 'demo-volunteer-anonymous-01', kind: 'volunteer-profile', state: 'pending', source: 'staging-seed', revision, demo: true, displayName: { id: 'Relawan Anonim 1', en: 'Anonymous Volunteer 1' }, role: { id: 'Pendamping komunitas', en: 'Community support' }, cycle: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, attribution: 'opt-in-demo' }),
];

export const STAGING_TEAMS: readonly OrganizationUnit[] = [
  meta({ id: 'demo-team-program-01', kind: 'organization-unit', state: 'live', source: 'staging-seed', revision, demo: true, name: { id: 'Tim Program', en: 'Program Team' }, purpose: { id: 'Menjaga tujuan, fasilitator, dan ritme sesi tetap jelas.', en: 'Keeps session goals, facilitators, and rhythm clear.' }, handoff: { id: 'Menyerahkan catatan sesi ke tim dokumentasi.', en: 'Hands session notes to the documentation team.' }, profileCount: 1 }),
  meta({ id: 'demo-team-documentation-01', kind: 'organization-unit', state: 'live', source: 'staging-seed', revision, demo: true, name: { id: 'Tim Dokumentasi', en: 'Documentation Team' }, purpose: { id: 'Mengubah kegiatan menjadi catatan yang bisa diperiksa.', en: 'Turns activity into records that people can inspect.' }, handoff: { id: 'Menyerahkan rekaman terverifikasi ke meja publikasi.', en: 'Hands verified records to the publishing desk.' }, profileCount: 1 }),
  meta({ id: 'demo-team-community-01', kind: 'organization-unit', state: 'pending', source: 'staging-seed', revision, demo: true, name: { id: 'Tim Pendamping Komunitas', en: 'Community Support Team' }, purpose: { id: 'Membantu anggota menemukan ruang dan langkah awal yang tepat.', en: 'Helps members find the right room and first step.' }, handoff: { id: 'Mencatat kebutuhan yang perlu dibawa ke siklus berikutnya.', en: 'Records needs that should enter the next cycle.' }, profileCount: 1 }),
];

export const STAGING_CONTRIBUTIONS: readonly Contribution[] = [
  meta({ id: 'demo-contribution-guide-01', kind: 'contribution', state: 'completed', source: 'staging-seed', revision, demo: true, contributor: { id: 'Nara (fiktif)', en: 'Nara (fictional)' }, area: { id: 'Panduan program', en: 'Program guide' }, summary: { id: 'Merapikan langkah awal untuk klub bahasa.', en: 'Clarified the first steps for a language club.' } }),
  meta({ id: 'demo-contribution-recap-01', kind: 'contribution', state: 'completed', source: 'staging-seed', revision, demo: true, contributor: { id: 'Relawan Anonim 1', en: 'Anonymous Volunteer 1' }, area: { id: 'Ringkasan sesi', en: 'Session recap' }, summary: { id: 'Menyusun ringkasan sesi yang siap ditinjau.', en: 'Prepared a session recap for review.' } }),
  meta({ id: 'demo-contribution-calendar-01', kind: 'contribution', state: 'live', source: 'staging-seed', revision, demo: true, contributor: { id: 'Bima (fiktif)', en: 'Bima (fictional)' }, area: { id: 'Meja agenda', en: 'Schedule desk' }, summary: { id: 'Menjaga status agenda tetap mudah dibaca.', en: 'Kept schedule status easy to understand.' } }),
];

export const STAGING_METRICS: readonly EvidenceMetric[] = [
  meta({ id: 'demo-metric-sessions-2026-08', kind: 'evidence-metric', state: 'completed', source: 'staging-seed', revision, demo: true, label: { id: 'Sesi terdokumentasi', en: 'Documented sessions' }, value: '12', period: { id: 'Juli 2026', en: 'July 2026' }, definition: { id: 'Rekaman sesi dengan ringkasan yang ditandai selesai.', en: 'Session records with a recap marked complete.' } }),
  meta({ id: 'demo-metric-contributors-2026-08', kind: 'evidence-metric', state: 'live', source: 'staging-seed', revision, demo: true, label: { id: 'Kontributor aktif', en: 'Active contributors' }, value: '8', period: { id: 'Siklus contoh 03 · 2026', en: 'Sample cycle 03 · 2026' }, definition: { id: 'Profil contoh dengan kontribusi pada siklus berjalan.', en: 'Sample profiles with work in the current cycle.' } }),
  meta({ id: 'demo-metric-programs-2026-08', kind: 'evidence-metric', state: 'upcoming', source: 'staging-seed', revision, demo: true, label: { id: 'Program dengan langkah berikutnya', en: 'Programs with a next step' }, value: '3', period: { id: 'Agustus 2026', en: 'August 2026' }, definition: { id: 'Program contoh dengan sesi berikutnya yang disimulasikan.', en: 'Sample programs with a simulated next session.' } }),
];

export const STAGING_ATTRIBUTION: readonly AttributionConsent[] = [
  meta({ id: 'demo-consent-nara-01', kind: 'attribution-consent', state: 'completed', source: 'staging-seed', revision, demo: true, subject: { id: 'Nara (fiktif)', en: 'Nara (fictional)' }, scope: { id: 'Nama dan kontribusi simulasi', en: 'Simulated name and contribution' }, status: 'granted-for-demo' }),
  meta({ id: 'demo-consent-anonymous-01', kind: 'attribution-consent', state: 'live', source: 'staging-seed', revision, demo: true, subject: { id: 'Relawan Anonim 1', en: 'Anonymous Volunteer 1' }, scope: { id: 'Kontribusi simulasi tanpa nama', en: 'Simulated contribution without a name' }, status: 'anonymous-by-choice' }),
  meta({ id: 'demo-consent-revoked-01', kind: 'attribution-consent', state: 'completed', source: 'staging-seed', revision, demo: true, subject: { id: 'Identitas demo ditarik', en: 'Withdrawn demo identity' }, scope: { id: 'Tidak boleh ditampilkan', en: 'Must not be displayed' }, status: 'revoked-demo' }),
];

export const STAGING_PUBLISHED_RECORDS: readonly PublishedRecord[] = [
  meta({ id: 'demo-record-story-01', kind: 'published-record', state: 'completed', source: 'staging-seed', revision, demo: true, title: { id: 'Catatan belajar dari satu siklus', en: 'Learning notes from one cycle' }, recordType: 'story' }),
  meta({ id: 'demo-record-credit-01', kind: 'published-record', state: 'completed', source: 'staging-seed', revision, demo: true, title: { id: 'Kredit kontribusi siklus contoh 03', en: 'Sample cycle 03 contribution credit' }, recordType: 'credit' }),
];

export const activeStagingEvents = (): readonly Event[] => STAGING_FIXTURES_ENABLED ? STAGING_EVENTS : [];
export const stagingEventById = (id: string): Event | undefined => STAGING_FIXTURES_ENABLED ? STAGING_EVENTS.find((event) => event.id === id) : undefined;
export const stagingSessionByProgramId = (programId: string): Session | undefined => STAGING_FIXTURES_ENABLED ? STAGING_SESSIONS.find((session) => session.programId === programId) : undefined;
