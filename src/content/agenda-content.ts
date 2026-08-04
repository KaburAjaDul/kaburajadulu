import type { Locale } from '@/i18n/constants';
import { DISCORD_URL, localizedPath, programBySlug } from '@/content/community-site';
import {
  activeStagingPrograms,
  activeStagingSeries,
  fixtureText,
  listStagingAgenda,
  stagingFixturesEnabled,
  type Event,
  type LocalizedText,
  type Session,
  type StagingAgendaItem,
} from '@/content/staging-fixtures';

export type AgendaKind = 'session' | 'event';

export interface AgendaRecord {
  id: string;
  kind: AgendaKind;
  title: string;
  summary: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  timezone: string;
  lifecycle: 'upcoming' | 'live' | 'completed';
  programId: string | null;
  programTitle: string | null;
  programHref: string | null;
  seriesId: string | null;
  seriesTitle: string | null;
  sourceRevision: string;
  freshness: 'demo' | 'published';
  demo: boolean;
  joinHref: typeof DISCORD_URL;
  joinLabel: string;
}

const localize = (value: LocalizedText, locale: Locale): string => fixtureText(value, locale);

function toAgendaRecord(item: StagingAgendaItem, locale: Locale): AgendaRecord {
  const isSession = item.kind === 'session';
  const session = isSession ? item as Session : null;
  const event = !isSession ? item as Event : null;
  const durationMinutes = session
    ? session.durationMinutes
    : Math.round((Date.parse(event!.endsAt) - Date.parse(event!.startsAt)) / 60000);
  const programId = item.programId;
  const stagingProgram = programId ? activeStagingPrograms().find((candidate) => candidate.slug === programId) : undefined;
  const publishedProgram = programId ? programBySlug(programId) : undefined;
  const series = isSession && item.seriesId
    ? activeStagingSeries().find((candidate) => candidate.id === item.seriesId)
    : undefined;

  return {
    id: item.id,
    kind: item.kind,
    title: localize(item.title, locale),
    summary: isSession
      ? item.seriesId
        ? locale === 'id' ? 'Sesi terjadwal dalam rangkaian seri program.' : 'A scheduled session within a program series.'
        : locale === 'id' ? 'Sesi langsung dari program.' : 'A direct session from the program.'
      : localize(event!.summary, locale),
    startsAt: item.startsAt,
    endsAt: session ? new Date(Date.parse(session.startsAt) + durationMinutes * 60000).toISOString() : event!.endsAt,
    durationMinutes,
    timezone: item.timezone,
    lifecycle: item.state as AgendaRecord['lifecycle'],
    programId,
    programTitle: stagingProgram
      ? localize(stagingProgram.title, locale)
      : publishedProgram?.title ?? null,
    programHref: programId ? localizedPath(locale, `/programs/${programId}`) : null,
    seriesId: isSession ? item.seriesId : null,
    seriesTitle: series ? localize(series.title, locale) : null,
    sourceRevision: item.revision,
    freshness: item.demo ? 'demo' : 'published',
    demo: item.demo,
    joinHref: DISCORD_URL,
    joinLabel: locale === 'id' ? 'Konfirmasi di Discord' : 'Confirm on Discord',
  };
}

export function activeAgenda(locale: Locale): readonly AgendaRecord[] {
  if (!stagingFixturesEnabled()) return [];
  return listStagingAgenda().map((item) => toAgendaRecord(item, locale));
}

export function agendaById(id: string, locale: Locale): AgendaRecord | undefined {
  return activeAgenda(locale).find((item) => item.id === id);
}

export function agendaFixtureIds(): readonly string[] {
  return listStagingAgenda().map((item) => item.id);
}
