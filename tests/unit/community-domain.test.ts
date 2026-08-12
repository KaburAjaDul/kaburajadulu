import { describe, expect, test } from 'bun:test';
import {
  STAGING_POSITIONS,
  activeStagingContributorStubs,
  activeStagingCycles,
  activeStagingDivisions,
  activeStagingPrograms,
  activeStagingVolunteerAssignments,
  activeStagingVolunteerOpportunities,
  groupContributionsByProgram,
  listStagingAgenda,
  publicContributorProjection,
} from '../../src/content/staging-fixtures';
import { agendaFixtureIds } from '../../src/content/agenda-content';

function withFixtureEnv<T>(enabled: boolean, callback: () => T): T {
  const previous = process.env.PUBLIC_STAGING_FIXTURES;
  process.env.PUBLIC_STAGING_FIXTURES = String(enabled);
  try {
    return callback();
  } finally {
    if (previous === undefined) delete process.env.PUBLIC_STAGING_FIXTURES;
    else process.env.PUBLIC_STAGING_FIXTURES = previous;
  }
}

describe('staging community domain', () => {
  test('models optional Series and direct-to-Program Sessions', () => {
    withFixtureEnv(true, () => {
      const programs = activeStagingPrograms();
      expect(programs.find((item) => item.slug === 'japanese-study-club')?.series).toHaveLength(3);
      expect(programs.find((item) => item.slug === 'english-study-club')?.series).toHaveLength(0);
      const japanese = programs.find((item) => item.slug === 'japanese-study-club')!;
      const english = programs.find((item) => item.slug === 'english-study-club')!;
      expect(japanese?.sessions.every((session) => session.seriesId !== null)).toBe(true);
      expect(japanese?.sessions.every((session) => japanese.series.some((series) => series.id === session.seriesId && series.sessionIds.includes(session.id)))).toBe(true);
      expect(english?.sessions.length).toBeGreaterThan(0);
      expect(english?.sessions.every((session) => session.seriesId === null)).toBe(true);
    });
  });

  test('gates the canonical Agenda fixtures by environment', () => {
    withFixtureEnv(false, () => {
      expect(listStagingAgenda()).toHaveLength(0);
      expect(agendaFixtureIds()).toHaveLength(0);
    });
    withFixtureEnv(true, () => {
      const agenda = listStagingAgenda();
      expect(agenda.filter((item) => item.kind === 'session')).toHaveLength(3);
      expect(agenda.filter((item) => item.kind === 'event')).toHaveLength(1);
      expect(agenda.some((item) => item.kind === 'event' && item.standalone && item.programId === null)).toBe(true);
      expect(agenda.every((item) => item.source === 'staging-seed' && item.demo === true)).toBe(true);
      expect(agendaFixtureIds()).toHaveLength(agenda.length);
    });
  });

  test('declares the four positions, assignments, and seven enduring Divisions', () => {
    withFixtureEnv(false, () => {
      expect(activeStagingPrograms()).toHaveLength(0);
      expect(activeStagingCycles()).toHaveLength(0);
      expect(activeStagingDivisions()).toHaveLength(0);
      expect(activeStagingVolunteerOpportunities()).toHaveLength(0);
      expect(activeStagingVolunteerAssignments()).toHaveLength(0);
      expect(activeStagingContributorStubs()).toHaveLength(0);
    });
    withFixtureEnv(true, () => {
      expect(STAGING_POSITIONS).toEqual([
        'advisor',
        'community-manager',
        'division-lead',
        'individual-volunteer',
      ]);
      expect(activeStagingDivisions()).toHaveLength(7);
      expect(activeStagingCycles()).toHaveLength(1);
      expect(activeStagingVolunteerOpportunities()).toHaveLength(3);
      const assignments = activeStagingVolunteerAssignments();
      expect(assignments).toHaveLength(4);
      expect(assignments.every((assignment) => assignment.divisionIds.length > 0)).toBe(true);
      expect(new Set(assignments.map((assignment) => assignment.position)).size).toBe(4);
      expect(new Set(assignments.map((assignment) => assignment.volunteerId)).size).toBe(4);
      expect(activeStagingContributorStubs().every((stub) => !('displayName' in stub) && !('role' in stub))).toBe(true);
    });
  });

  test('keeps the shared Program Metric Contract explicit', () => {
    withFixtureEnv(true, () => {
      for (const program of activeStagingPrograms()) {
        expect(program.metricContract).toHaveLength(4);
        expect(program.metricContract.every((metric) => metric.period && metric.definition && metric.method && metric.sourceLabel && metric.reviewedAt)).toBe(true);
      }
    });
  });

  test('groups shared contributions by Program without copying ledger records', () => {
    withFixtureEnv(false, () => expect(groupContributionsByProgram('demo-volunteer-nara-01').size).toBe(0));
    withFixtureEnv(true, () => {
      const grouped = groupContributionsByProgram('demo-volunteer-nara-01');
      expect(grouped.size).toBeGreaterThan(0);
      const contributions = [...grouped.values()].flat();
      expect(contributions.some((contribution) => contribution.attributions.length > 1)).toBe(true);
      expect(contributions.every((contribution) => contribution.period && contribution.reviewState && contribution.evidence)).toBe(true);
    });
  });

  test('projects anonymous contributors without private identity fields', () => {
    withFixtureEnv(false, () => expect(publicContributorProjection('demo-volunteer-anonymous-01')).toBeNull());
    withFixtureEnv(true, () => {
      const projection = publicContributorProjection(activeStagingContributorStubs()[0]?.id ?? 'missing');
      expect(projection).not.toBeNull();
      if (!projection) return;
      expect(projection).not.toHaveProperty('privateIdentity');
      expect(projection).not.toHaveProperty('discordId');
      expect(projection.visibility).toBe('anonymous-stub');
      expect(projection.displayName).toBeNull();
    });
  });

  test('derives named identity strictly from active attribution consent', () => {
    withFixtureEnv(true, () => {
      const nara = publicContributorProjection('demo-volunteer-nara-01');
      const bima = publicContributorProjection('demo-volunteer-bima-01');
      const sari = publicContributorProjection('demo-volunteer-sari-01');

      expect(nara?.visibility).toBe('opt-in-profile');
      expect(nara?.displayName).not.toBeNull();
      expect(bima?.visibility).toBe('anonymous-stub');
      expect(bima?.displayName).toBeNull();
      expect(sari?.visibility).toBe('anonymous-stub');
      expect(sari?.displayName).toBeNull();
    });
  });
});
