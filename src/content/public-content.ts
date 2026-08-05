import type { Locale } from '@/i18n/constants';
import {
  PROGRAMS,
  localizedProgram,
  type ProgramMedia,
  type ProgramSource,
} from '@/content/community-site';
import {
  activeStagingContributions,
  activeStagingPrograms,
  fixtureText,
  publicContributorProjection,
  stagingFixturesEnabled,
  type StagingProgram,
} from '@/content/staging-fixtures';

export type PublicContentLocale = 'id' | 'en';
export type PublicContentKind = 'program' | 'session' | 'event' | 'volunteer_opportunity' | 'story';
export type PublicationState =
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'superseded'
  | 'revoked'
  | 'stale'
  | 'execution_failed';
export type Freshness = 'current' | 'aging' | 'stale' | 'unknown';
export type ProgramArchiveState = 'active' | 'needs_confirmation' | 'archived';
export type ProgramCategoryId = 'language' | 'career';
export type RepositoryState = 'loading' | 'ready' | 'empty' | 'stale' | 'error';
export type ProgramSeedScenario = 'loading' | 'ready' | 'empty' | 'stale' | 'error';
export type ProgramDisplayState = 'active' | 'needs_confirmation' | 'archived' | 'aging' | 'stale' | 'unknown';

export interface PublicProvenance {
  label: string;
  url: string | null;
  observedAt: string | null;
}

export interface PublicMedia {
  id: string;
  kind: 'image' | 'document' | 'video';
  url: string;
  alt: string;
  caption: string | null;
  approvedAt: string;
  revision: number;
  width: number | null;
  height: number | null;
  sha256: string | null;
}

export interface PublicRecordEnvelope {
  id: string;
  kind: PublicContentKind;
  schemaVersion: 1;
  locale: PublicContentLocale;
  visibility: 'public';
  publicationState: PublicationState;
  title: string;
  summary: string;
  revision: number;
  sourceRevision: string;
  publishedAt: string | null;
  updatedAt: string;
  observedAt: string | null;
  freshness: Freshness;
  publicProvenance: readonly PublicProvenance[];
  media: readonly PublicMedia[];
  attributionPublicState: 'not_applicable' | 'anonymous' | 'opted_in';
  correctionPath: string;
  tombstone: boolean;
  demo: boolean;
}

export interface PublicProgram extends PublicRecordEnvelope {
  kind: 'program';
  slug: string;
  category: string;
  categoryId: ProgramCategoryId;
  audience: string | null;
  cadence: string | null;
  format: string | null;
  known: readonly string[];
  needsConfirmation: readonly string[];
  nextSessionId: string | null;
  archiveState: ProgramArchiveState;
  purpose: string;
  series: readonly PublicProgramSeries[];
  sessions: readonly PublicProgramSession[];
  metrics: readonly PublicProgramMetric[];
  contributors: readonly PublicProgramContributor[];
  repositoryUrl: string | null;
}

/** Public projection of the optional Program -> Series relationship. */
export interface PublicProgramSeries {
  id: string;
  programId: string;
  title: string;
  summary: string;
  level: string | null;
  sessionIds: readonly string[];
}

export interface PublicProgramSession {
  id: string;
  programId: string;
  seriesId: string | null;
  title: string;
  startsAt: string;
  durationMinutes: number;
  timezone: string;
  lifecycle: 'upcoming' | 'live' | 'completed';
}

export interface PublicProgramContributor {
  id: string;
  displayName: string | null;
  responsibility: string;
  visibility: 'anonymous-stub' | 'opt-in-profile';
  reviewState: 'reported' | 'evidence_attached' | 'verified' | 'corrected' | 'revoked';
}

export type PublicProgramMetricKey =
  | 'completed-sessions'
  | 'unique-participants'
  | 'returning-participants'
  | 'documentation-coverage';

/** Shared Program Metric Contract; outcome metrics never become contributor scores. */
export interface PublicProgramMetric {
  id: string;
  programId: string;
  key: PublicProgramMetricKey;
  label: string;
  value: number | null;
  period: string;
  definition: string;
  sourceLabel: string;
  method: string;
  reviewedAt: string | null;
}

export interface PublicAgendaRecordBase {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  lifecycle: 'upcoming' | 'live' | 'completed';
  programId: string | null;
  seriesId: string | null;
  sourceRevision: string;
  revision: number;
  demo: boolean;
}

export interface PublicAgendaSession extends PublicAgendaRecordBase {
  kind: 'session';
  durationMinutes: number;
}

export interface PublicAgendaEvent extends PublicAgendaRecordBase {
  kind: 'event';
  summary: string;
}

export type PublicAgendaItem = PublicAgendaSession | PublicAgendaEvent;

/** Privacy-safe public projection. Private platform identities are not part of this DTO. */
export interface PublicContributorProjection {
  id: string;
  visibility: 'anonymous-stub' | 'opt-in-profile';
  displayName: string | null;
  role: string | null;
  cycle: string | null;
  contributionCount: number;
  verifiedContributionCount: number;
  sourceRevision: string;
  demo: boolean;
}

export interface RepositoryResult<T> {
  state: RepositoryState;
  records: readonly T[];
  updatedAt: string | null;
  error: { code: string; message: string } | null;
}

export interface ListProgramsInput {
  locale: Locale;
  category?: ProgramCategoryId;
  archiveState?: ProgramArchiveState;
  scenario?: ProgramSeedScenario;
}

export interface GetProgramInput {
  locale: Locale;
  slug: string;
}

export function programDisplayState(program: Pick<PublicProgram, 'archiveState' | 'freshness'>): ProgramDisplayState {
  if (program.archiveState === 'archived') return 'archived';
  if (program.freshness === 'stale') return 'stale';
  if (program.freshness === 'aging') return 'aging';
  if (program.archiveState === 'needs_confirmation') return 'needs_confirmation';
  if (program.freshness === 'unknown') return 'unknown';
  return 'active';
}

export interface PublicContentRepository {
  listPrograms(input: ListProgramsInput): Promise<RepositoryResult<PublicProgram>>;
  getProgram(input: GetProgramInput): Promise<PublicProgram | null>;
}

const REVIEWED_AT = '2026-08-02T23:59:00+07:00';
const STALE_REVIEWED_AT = '2026-07-01T12:00:00+07:00';
const MEDIA_APPROVED_AT = '2026-08-02T00:00:00+07:00';

function contentLocale(locale: Locale): PublicContentLocale {
  return locale === 'id' ? 'id' : 'en';
}

function categoryId(program: ProgramSource): ProgramCategoryId {
  return program.category === 'Klub bahasa' ? 'language' : 'career';
}

function toPublicMedia(media: ProgramMedia): PublicMedia {
  return {
    id: media.id,
    kind: 'image',
    url: media.src,
    alt: media.alt,
    caption: media.caption,
    approvedAt: MEDIA_APPROVED_AT,
    revision: 1,
    width: media.width,
    height: media.height,
    sha256: media.sha256,
  };
}

function toPublicProgram(locale: Locale, program: ProgramSource): PublicProgram {
  const localized = localizedProgram(locale, program);
  const observedAt = program.media[0]?.sourcePublishedAt ?? REVIEWED_AT;

  return {
    id: `program:${program.slug}`,
    kind: 'program',
    schemaVersion: 1,
    locale: contentLocale(locale),
    visibility: 'public',
    publicationState: 'published',
    title: localized.title,
    summary: localized.summary,
    revision: 1,
    sourceRevision: `kadsocialhub:${program.slug}:${observedAt}`,
    publishedAt: observedAt,
    updatedAt: REVIEWED_AT,
    observedAt,
    freshness: 'unknown',
    publicProvenance: [{
      label: localized.sourceLabel,
      url: program.sourceUrl,
      observedAt,
    }],
    media: localized.media.map(toPublicMedia),
    attributionPublicState: 'not_applicable',
    correctionPath: '/community/',
    tombstone: false,
    demo: false,
    slug: program.slug,
    category: localized.category,
    categoryId: categoryId(program),
    audience: null,
    cadence: null,
    format: null,
    known: localized.known,
    needsConfirmation: localized.confirm,
    nextSessionId: null,
    archiveState: 'needs_confirmation',
    purpose: localized.summary,
    series: [],
    sessions: [],
    metrics: [
      'completed-sessions',
      'unique-participants',
      'returning-participants',
      'documentation-coverage',
    ].map((key) => ({
      id: `program-metric:${program.slug}:${key}`,
      programId: program.slug,
      key: key as PublicProgramMetricKey,
      label: key === 'completed-sessions' ? (locale === 'id' ? 'Sesi selesai' : 'Completed Sessions')
        : key === 'unique-participants' ? (locale === 'id' ? 'Peserta unik' : 'Unique participants')
          : key === 'returning-participants' ? (locale === 'id' ? 'Peserta yang kembali' : 'Returning participants')
            : (locale === 'id' ? 'Cakupan dokumentasi' : 'Documentation coverage'),
      value: null,
      period: locale === 'id' ? 'Belum ditentukan' : 'Not established',
      definition: locale === 'id' ? 'Definisi metrik belum disetujui.' : 'The metric definition has not been approved.',
      sourceLabel: locale === 'id' ? 'Evidence Placeholder' : 'Evidence Placeholder',
      method: locale === 'id' ? 'Belum terdokumentasi.' : 'Not documented yet.',
      reviewedAt: null,
    })),
    contributors: [],
    repositoryUrl: null,
  };
}

const canonicalFixtureId = (id: string, prefix: string): string => id.startsWith(`${prefix}-`) ? id.slice(prefix.length + 1) : id;

/** Typed adapter from the active staging domain projection to the public Program DTO. */
export function publicProgramFromStaging(locale: Locale, program: StagingProgram): PublicProgram {
  const title = fixtureText(program.title, locale);
  const sessions = program.sessions.map((session) => ({
    id: session.id,
    programId: program.slug,
    seriesId: session.seriesId ? canonicalFixtureId(session.seriesId, 'demo-series') : null,
    title: fixtureText(session.title, locale),
    startsAt: session.startsAt,
    durationMinutes: session.durationMinutes,
    timezone: session.timezone,
    lifecycle: session.state as PublicProgramSession['lifecycle'],
  }));
  const series = program.series.map((item) => ({
    id: canonicalFixtureId(item.id, 'demo-series'),
    programId: program.slug,
    title: fixtureText(item.title, locale),
    summary: fixtureText(item.summary, locale),
    level: item.level,
    sessionIds: item.sessionIds,
  }));
  const contributions = activeStagingContributions().filter((item) => item.programId === program.slug);
  const contributors = contributions.flatMap((item) => item.attributions.map((attribution) => {
    const projection = publicContributorProjection(attribution.volunteerId);
    return {
      id: attribution.volunteerId,
      displayName: projection?.displayName ? fixtureText(projection.displayName, locale) : null,
      responsibility: fixtureText(attribution.responsibility, locale),
      visibility: projection?.visibility ?? 'anonymous-stub',
      reviewState: item.reviewState,
    };
  }));
  return {
    id: program.id,
    kind: 'program',
    schemaVersion: 1,
    locale: contentLocale(locale),
    visibility: 'public',
    publicationState: 'published',
    title,
    summary: fixtureText(program.purpose, locale),
    revision: 1,
    sourceRevision: `${program.source}:${program.revision}:${program.slug}`,
    publishedAt: null,
    updatedAt: '2026-08-03T12:00:00+07:00',
    observedAt: '2026-08-03T12:00:00+07:00',
    freshness: 'current',
    publicProvenance: [{ label: locale === 'id' ? 'Dataset pratinjau' : 'Preview dataset', url: null, observedAt: '2026-08-03T12:00:00+07:00' }],
    media: [],
    attributionPublicState: contributors.some((item) => item.visibility === 'opt-in-profile') ? 'opted_in' : 'anonymous',
    correctionPath: '/community/',
    tombstone: false,
    demo: true,
    slug: program.slug,
    category: program.slug === 'tech-coding-club' || program.slug === 'cerita-aja-dulu'
      ? (locale === 'id' ? 'Pendidikan & karier' : 'Education & career')
      : (locale === 'id' ? 'Klub bahasa' : 'Language club'),
    categoryId: program.slug === 'tech-coding-club' || program.slug === 'cerita-aja-dulu' ? 'career' : 'language',
    audience: fixtureText(program.audience, locale),
    cadence: null,
    format: 'online',
    known: [fixtureText(program.purpose, locale)],
    needsConfirmation: [locale === 'id' ? 'Jadwal dan kapasitas terbaru' : 'Latest schedule and capacity'],
    nextSessionId: sessions[0]?.id ?? null,
    // A fixture Program can be structurally present before its next public
    // occurrence is confirmed. Preserve that lifecycle in the presentation
    // DTO instead of making every staging record appear actively running.
    archiveState: program.state === 'upcoming' || program.state === 'pending' ? 'needs_confirmation' : 'active',
    purpose: fixtureText(program.purpose, locale),
    series,
    sessions,
    metrics: program.metricContract.map((metric) => ({
      id: metric.id,
      programId: program.slug,
      key: metric.key,
      label: fixtureText(metric.label, locale),
      value: metric.value,
      period: fixtureText(metric.period, locale),
      definition: fixtureText(metric.definition, locale),
      sourceLabel: fixtureText(metric.sourceLabel, locale),
      method: fixtureText(metric.method, locale),
      reviewedAt: metric.reviewedAt,
    })),
    contributors,
    repositoryUrl: null,
  };
}

export class SeedPublicContentRepository implements PublicContentRepository {
  async listPrograms(input: ListProgramsInput): Promise<RepositoryResult<PublicProgram>> {
    const scenario = input.scenario ?? 'ready';
    if (scenario === 'loading') {
      return { state: 'loading', records: [], updatedAt: null, error: null };
    }

    if (scenario === 'error') {
      return {
        state: 'error',
        records: [],
        updatedAt: null,
        error: { code: 'programs_unavailable', message: 'The program directory could not be loaded.' },
      };
    }

    if (scenario === 'empty') {
      return { state: 'empty', records: [], updatedAt: REVIEWED_AT, error: null };
    }

    const records = (stagingFixturesEnabled()
      ? activeStagingPrograms().map((program) => publicProgramFromStaging(input.locale, program))
      : PROGRAMS.map((program) => toPublicProgram(input.locale, program)))
      .filter((program) => !input.category || program.categoryId === input.category)
      .filter((program) => !input.archiveState || program.archiveState === input.archiveState)
      .map((program) => scenario === 'stale'
        ? { ...program, freshness: 'stale' as const, updatedAt: STALE_REVIEWED_AT, demo: true }
        : program);

    return {
      state: scenario === 'stale' ? 'stale' : records.length > 0 ? 'ready' : 'empty',
      records,
      updatedAt: scenario === 'stale' ? STALE_REVIEWED_AT : REVIEWED_AT,
      error: null,
    };
  }

  async getProgram(input: GetProgramInput): Promise<PublicProgram | null> {
    if (stagingFixturesEnabled()) {
      const fixture = activeStagingPrograms().find((candidate) => candidate.slug === input.slug);
      return fixture ? publicProgramFromStaging(input.locale, fixture) : null;
    }
    const program = PROGRAMS.find((candidate) => candidate.slug === input.slug);
    return program ? toPublicProgram(input.locale, program) : null;
  }
}

export const publicContentRepository: PublicContentRepository = new SeedPublicContentRepository();
