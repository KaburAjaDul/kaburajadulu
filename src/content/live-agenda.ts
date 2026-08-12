import type { Locale } from '@/i18n/constants';
import { localizedPath } from '@/content/community-site';

/** Exact operational families emitted by the approved signed agenda projection. */
export const OPERATIONAL_PROGRAMS = {
  'Japanese Study Club': 'japanese-study-club',
  'Arabic Study Club': 'arabic-study-club',
  'French Study Club': 'french-study-club',
  'English Study Club': 'english-study-club',
  'Mandarin Study Club': 'mandarin-study-club',
} as const;

export type OperationalProgramSlug = (typeof OPERATIONAL_PROGRAMS)[keyof typeof OPERATIONAL_PROGRAMS];

export function operationalProgramSlug(label: string): OperationalProgramSlug | null {
  const direct = OPERATIONAL_PROGRAMS[label as keyof typeof OPERATIONAL_PROGRAMS];
  if (direct) return direct;
  return (Object.values(OPERATIONAL_PROGRAMS) as OperationalProgramSlug[]).includes(label as OperationalProgramSlug) ? label as OperationalProgramSlug : null;
}

export function operationalProgramLabel(slug: string): string | null {
  const match = Object.entries(OPERATIONAL_PROGRAMS).find(([, value]) => value === slug);
  return match?.[0] ?? null;
}

export function operationalProgramHref(locale: Locale, label: string): string | null {
  const slug = operationalProgramSlug(label);
  return slug ? localizedPath(locale, `/programs/live/?program=${encodeURIComponent(slug)}`) : null;
}

export function operationalProgramRoute(locale: Locale, slug: string): string {
  return localizedPath(locale, `/programs/live/?program=${encodeURIComponent(slug)}`);
}
