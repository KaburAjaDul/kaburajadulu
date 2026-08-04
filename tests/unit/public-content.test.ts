import { describe, expect, test } from 'bun:test';
import { programDisplayState, type Freshness, type ProgramArchiveState } from '../../src/content/public-content';

const state = (archiveState: ProgramArchiveState, freshness: Freshness) =>
  programDisplayState({ archiveState, freshness });

describe('programDisplayState', () => {
  test('renders active, confirmation, and archived lifecycle states distinctly', () => {
    expect(state('active', 'current')).toBe('active');
    expect(state('needs_confirmation', 'unknown')).toBe('needs_confirmation');
    expect(state('archived', 'current')).toBe('archived');
  });

  test('freshness warnings override non-archived lifecycle labels', () => {
    expect(state('active', 'aging')).toBe('aging');
    expect(state('active', 'stale')).toBe('stale');
    expect(state('active', 'unknown')).toBe('unknown');
  });

  test('archived remains explicit even when its source is old', () => {
    expect(state('archived', 'stale')).toBe('archived');
  });
});
