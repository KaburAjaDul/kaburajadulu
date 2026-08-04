import type { Locale } from '@/i18n/constants';
import {
  PROGRAMS,
  localizedProgram,
  type ProgramMedia,
  type ProgramSource,
} from '@/content/community-site';

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

    const records = PROGRAMS
      .map((program) => toPublicProgram(input.locale, program))
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
    const program = PROGRAMS.find((candidate) => candidate.slug === input.slug);
    return program ? toPublicProgram(input.locale, program) : null;
  }
}

export const publicContentRepository: PublicContentRepository = new SeedPublicContentRepository();
