import type { Locale } from '@/i18n/constants';
import {
  activeStagingContributorStubs,
  activeStagingCycles,
  activeStagingDivisions,
  activeStagingVolunteerAssignments,
  activeStagingVolunteerOpportunities,
  activeStagingVolunteers,
  contributorVisibility,
  fixtureText,
  groupContributionsByProgram,
  stagingFixturesEnabled,
  type ContributorVisibility,
  type LocalizedText,
  type VolunteerPosition,
} from '@/content/staging-fixtures';

export type VolunteerContentLocale = 'id' | 'en';

export interface VolunteerPositionDefinition {
  id: VolunteerPosition;
  label: LocalizedText;
  description: LocalizedText;
}

export interface VolunteerContributionRecord {
  id: string;
  programId: string;
  programLabel: LocalizedText;
  area: LocalizedText;
  summary: LocalizedText;
  responsibility: LocalizedText;
  period: LocalizedText;
  evidence: readonly LocalizedText[];
  reviewState: 'reported' | 'evidence_attached' | 'verified' | 'corrected' | 'revoked';
}

export interface VolunteerContributionGroup {
  programId: string;
  programLabel: LocalizedText;
  entries: readonly VolunteerContributionRecord[];
}

export interface VolunteerAssignmentRecord {
  id: string;
  cycle: LocalizedText;
  position: VolunteerPosition;
  divisions: readonly LocalizedText[];
  responsibilities: readonly LocalizedText[];
  current: boolean;
  source: 'staging-seed' | 'simulated-fixture';
  status: 'current' | 'simulated';
}

export interface VolunteerDirectoryRecord {
  id: string;
  slug: string;
  visibility: ContributorVisibility;
  displayName: LocalizedText;
  role: LocalizedText;
  cycle: LocalizedText;
  position: VolunteerPosition;
  divisions: readonly LocalizedText[];
  responsibilities: readonly LocalizedText[];
  contributions: readonly VolunteerContributionRecord[];
  contributionGroups: readonly VolunteerContributionGroup[];
  assignments: readonly VolunteerAssignmentRecord[];
  demo: true;
}

export interface VolunteerDirectoryData {
  enabled: boolean;
  cycle: {
    id: string;
    name: LocalizedText;
    startsOn: string;
    endsOn: string;
    recruitment: 'continuous' | 'closed';
  } | null;
  positions: readonly VolunteerPositionDefinition[];
  divisions: readonly { id: string; name: LocalizedText; purpose: LocalizedText }[];
  people: readonly VolunteerDirectoryRecord[];
  openings: readonly {
    id: string;
    divisionId: string;
    divisionName: LocalizedText;
    title: LocalizedText;
    outcome: LocalizedText;
    commitment: LocalizedText;
    owner: LocalizedText;
    applicationPath: LocalizedText;
    state: 'upcoming' | 'live' | 'pending';
  }[];
}

export const VOLUNTEER_POSITIONS: readonly VolunteerPositionDefinition[] = [
  {
    id: 'advisor',
    label: { id: 'Advisor', en: 'Advisor' },
    description: { id: 'Peran non-eksekutif yang menjaga arah, konteks, dan kesinambungan.', en: 'A non-executive role that protects direction, context, and continuity.' },
  },
  {
    id: 'community-manager',
    label: { id: 'Community Manager', en: 'Community Manager' },
    description: { id: 'Kepala eksekutif yang menjaga ritme kerja lintas divisi.', en: 'The executive head who keeps work moving across divisions.' },
  },
  {
    id: 'division-lead',
    label: { id: 'Admin / Division Lead', en: 'Admin / Division Lead' },
    description: { id: 'Memimpin satu divisi dan menjaga lingkup kerja tetap jelas.', en: 'Leads one division and keeps its working scope clear.' },
  },
  {
    id: 'individual-volunteer',
    label: { id: 'Individual Volunteer', en: 'Individual Volunteer' },
    description: { id: 'Menyelesaikan satu lingkup kerja bersama tim program.', en: 'Delivers one bounded piece of work with a program team.' },
  },
] as const;

const localeOf = (locale: Locale): VolunteerContentLocale => locale === 'id' ? 'id' : 'en';

const slugify = (value: string): string => value
  .toLowerCase()
  .replace(/\(fictional\)|\(fiktif\)/g, '')
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const labelForProgram = (programId: string): LocalizedText => {
  const labels: Record<string, LocalizedText> = {
    'japanese-study-club': { id: 'Japanese Study Club', en: 'Japanese Study Club' },
    'english-study-club': { id: 'English Study Club', en: 'English Study Club' },
    'korean-study-club': { id: 'Korean Study Club', en: 'Korean Study Club' },
    'tech-coding-club': { id: 'Tech/Coding Club', en: 'Tech/Coding Club' },
    ceritaajadulu: { id: 'CeritaAjaDulu', en: 'CeritaAjaDulu' },
  };
  return labels[programId] ?? { id: programId, en: programId };
};

function toContributionRecord(volunteerId: string): VolunteerContributionRecord[] {
  const grouped = groupContributionsByProgram(volunteerId);
  const records: VolunteerContributionRecord[] = [];
  for (const [programId, contributions] of grouped) {
    for (const contribution of contributions) {
      if (contribution.reviewState === 'revoked') continue;
      const attribution = contribution.attributions.find((item) => item.volunteerId === volunteerId);
      if (!attribution) continue;
      records.push({
        id: contribution.id,
        programId,
        programLabel: labelForProgram(programId),
        area: contribution.area,
        summary: contribution.summary,
        responsibility: attribution.responsibility,
        period: contribution.period,
        evidence: contribution.evidence,
        reviewState: contribution.reviewState,
      });
    }
  }
  return records;
}

function toContributionGroups(records: readonly VolunteerContributionRecord[]): VolunteerContributionGroup[] {
  const groups = new Map<string, VolunteerContributionGroup>();
  for (const record of records) {
    const existing = groups.get(record.programId);
    if (existing) {
      groups.set(record.programId, { ...existing, entries: [...existing.entries, record] });
      continue;
    }
    groups.set(record.programId, { programId: record.programId, programLabel: record.programLabel, entries: [record] });
  }
  return [...groups.values()];
}

/** Stable public slug; it does not expose or encode a private display name. */
function anonymousSlug(id: string): string {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `contributor-anonim-${(hash >>> 0).toString(36).padStart(7, '0')}`;
}

export function volunteerDirectory(locale: Locale): VolunteerDirectoryData {
  const contentLocale = localeOf(locale);
  if (!stagingFixturesEnabled()) {
    return { enabled: false, cycle: null, positions: VOLUNTEER_POSITIONS, divisions: [], people: [], openings: [] };
  }

  const cycle = activeStagingCycles()[0];
  const divisions = activeStagingDivisions().map((division) => ({ id: division.id, name: division.name, purpose: division.purpose }));
  const divisionById = new Map(divisions.map((division) => [division.id, division]));
  const assignmentByVolunteer = new Map(activeStagingVolunteerAssignments().map((assignment) => [assignment.volunteerId, assignment]));
  const currentAssignment = (volunteerId: string): VolunteerAssignmentRecord | null => {
    const assignment = assignmentByVolunteer.get(volunteerId);
    if (!assignment || !cycle) return null;
    return {
      id: assignment.id,
      cycle: cycle.name,
      position: assignment.position,
      divisions: assignment.divisionIds.map((id) => divisionById.get(id)?.name).filter((value): value is LocalizedText => Boolean(value)),
      responsibilities: assignment.responsibilities,
      current: true,
      source: 'staging-seed',
      status: 'current',
    };
  };
  const historicalAssignment = (volunteerId: string): VolunteerAssignmentRecord[] => {
    const assignment = assignmentByVolunteer.get(volunteerId);
    if (!assignment || volunteerId === 'demo-volunteer-anonymous-01') return [];
    const historicalPosition: VolunteerPosition = assignment.position === 'advisor' ? 'individual-volunteer' : assignment.position === 'community-manager' ? 'division-lead' : 'individual-volunteer';
    return [{
      id: `${assignment.id}-history`,
      cycle: { id: 'Siklus relawan 02 · 2026', en: 'Volunteer Cycle 02 · 2026' },
      position: historicalPosition,
      divisions: assignment.divisionIds.map((id) => divisionById.get(id)?.name).filter((value): value is LocalizedText => Boolean(value)),
      responsibilities: assignment.responsibilities,
      current: false,
      source: 'simulated-fixture',
      status: 'simulated',
    }];
  };
  const assignmentRecords = (volunteerId: string): VolunteerAssignmentRecord[] => {
    const current = currentAssignment(volunteerId);
    return [...(current ? [current] : []), ...historicalAssignment(volunteerId)];
  };
  const people: VolunteerDirectoryRecord[] = [
    ...activeStagingVolunteers().map((profile) => {
      const assignment = assignmentByVolunteer.get(profile.id);
      const optedIn = contributorVisibility(profile.id) === 'opt-in-profile';
      const records = toContributionRecord(profile.id);
      return {
        id: profile.id,
        slug: optedIn ? slugify(fixtureText(profile.displayName, contentLocale)) : anonymousSlug(profile.id),
        visibility: optedIn ? 'opt-in-profile' as const : 'anonymous-stub' as const,
        displayName: optedIn ? profile.displayName : { id: 'Kontributor anonim', en: 'Anonymous contributor' },
        role: optedIn ? profile.role : { id: 'Identitas tidak ditampilkan', en: 'Identity not shared' },
        cycle: profile.cycle,
        position: assignment?.position ?? 'individual-volunteer',
        divisions: assignment?.divisionIds.map((id) => divisionById.get(id)?.name).filter((value): value is LocalizedText => Boolean(value)) ?? [],
        responsibilities: assignment?.responsibilities ?? [],
        contributions: records,
        contributionGroups: toContributionGroups(records),
        assignments: assignmentRecords(profile.id),
        demo: true as const,
      };
    }),
    ...activeStagingContributorStubs().map((stub) => {
      const assignment = assignmentByVolunteer.get(stub.id);
      return {
        id: stub.id,
        slug: anonymousSlug(stub.id),
        visibility: 'anonymous-stub' as const,
        displayName: { id: 'Kontributor anonim', en: 'Anonymous contributor' },
        role: { id: 'Identitas tidak ditampilkan', en: 'Identity not shared' },
        cycle: stub.cycle,
        position: assignment?.position ?? 'individual-volunteer',
        divisions: assignment?.divisionIds.map((id) => divisionById.get(id)?.name).filter((value): value is LocalizedText => Boolean(value)) ?? [],
        responsibilities: assignment?.responsibilities ?? [],
        contributions: toContributionRecord(stub.id),
        contributionGroups: toContributionGroups(toContributionRecord(stub.id)),
        assignments: assignmentRecords(stub.id),
        demo: true as const,
      };
    }),
  ];
  const openings = activeStagingVolunteerOpportunities().map((opportunity) => ({
    id: opportunity.id,
    divisionId: opportunity.divisionId,
    divisionName: divisionById.get(opportunity.divisionId)?.name ?? { id: 'Divisi', en: 'Division' },
    title: opportunity.title,
    outcome: opportunity.outcome,
    commitment: opportunity.commitment,
    owner: opportunity.owner,
    applicationPath: opportunity.applicationPath,
    state: opportunity.state,
  }));
  return {
    enabled: true,
    cycle: cycle ? { id: cycle.id, name: cycle.name, startsOn: cycle.startsOn, endsOn: cycle.endsOn, recruitment: cycle.recruitment } : null,
    positions: VOLUNTEER_POSITIONS,
    divisions,
    people,
    openings,
  };
}

export function volunteerBySlug(locale: Locale, slug: string): VolunteerDirectoryRecord | null {
  return volunteerDirectory(locale).people.find((person) => person.slug === slug) ?? null;
}

export function volunteerPositionLabel(position: VolunteerPosition, locale: Locale): string {
  return fixtureText(VOLUNTEER_POSITIONS.find((item) => item.id === position)?.label ?? VOLUNTEER_POSITIONS[3].label, localeOf(locale));
}

export function volunteerReviewLabel(state: VolunteerContributionRecord['reviewState'], locale: Locale): string {
  const labels: Record<VolunteerContributionRecord['reviewState'], LocalizedText> = {
    reported: { id: 'Dilaporkan', en: 'Reported' },
    evidence_attached: { id: 'Bukti terlampir', en: 'Evidence attached' },
    verified: { id: 'Terverifikasi', en: 'Verified' },
    corrected: { id: 'Dikoreksi', en: 'Corrected' },
    revoked: { id: 'Dicabut', en: 'Revoked' },
  };
  return fixtureText(labels[state], localeOf(locale));
}

export function volunteerContributionCount(locale: Locale): number {
  return volunteerDirectory(locale).people.reduce((total, person) => total + person.contributions.length, 0);
}
