import type { Locale } from '@/i18n/constants';

export type CommunitySection = 'community' | 'programs' | 'events';

export interface ProgramRow {
  title: string;
  category: 'Language club' | 'Education & career' | 'Community story';
  summary: string;
  status: 'Availability to confirm' | 'Approval-gated';
}

export const COMMUNITY_SECTIONS: CommunitySection[] = ['community', 'programs', 'events'];

export const PROGRAM_ROWS: ProgramRow[] = [
  {
    title: 'Language clubs',
    category: 'Language club',
    summary: 'Practice spaces across English, Mandarin, Japanese, Korean, and French, with current availability checked before publication.',
    status: 'Availability to confirm',
  },
  {
    title: 'Education & career sessions',
    category: 'Education & career',
    summary: 'Source-backed sessions about Apple Developer Academy and GKS preparation.',
    status: 'Availability to confirm',
  },
  {
    title: 'Cerita Aja Dulu',
    category: 'Community story',
    summary: 'A community story format about practical life abroad; publication remains approval-gated.',
    status: 'Approval-gated',
  },
];

export const SECTION_TITLES: Record<CommunitySection, Record<'id' | 'en', string>> = {
  community: { id: 'Komunitas yang membantu kamu bergerak', en: 'A community that helps you move' },
  programs: { id: 'Program yang bisa kamu telusuri', en: 'Programs you can explore' },
  events: { id: 'Acara yang siap ketika memang siap', en: 'Events, when they are actually ready' },
};

export function sectionPath(locale: Locale, section: CommunitySection): string {
  return locale === 'id' ? `/${section}` : `/${locale}/${section}`;
}

export function localizedShellCopy(locale: Locale, section: CommunitySection): {
  eyebrow: string;
  title: string;
  description: string;
} {
  const english = {
    community: {
      eyebrow: 'Community discovery',
      title: SECTION_TITLES.community.en,
      description: 'Start with a question, find a learning rhythm, then join the conversation when it feels useful.',
    },
    programs: {
      eyebrow: 'Program catalog',
      title: SECTION_TITLES.programs.en,
      description: 'A calm index of source-backed program families. Dates and availability are confirmed before publication.',
    },
    events: {
      eyebrow: 'Event desk',
      title: SECTION_TITLES.events.en,
      description: 'There are no published events yet. This page explains exactly what visitors will see as the public projection matures.',
    },
  }[section];

  if (locale === 'id') {
    const indonesian = {
      community: {
        eyebrow: 'Menemukan komunitas',
        title: SECTION_TITLES.community.id,
        description: 'Mulai dari pertanyaan, temukan ritme belajar, lalu bergabung saat percakapan terasa berguna.',
      },
      programs: {
        eyebrow: 'Katalog program',
        title: SECTION_TITLES.programs.id,
        description: 'Indeks tenang untuk keluarga program berbasis sumber. Jadwal dan ketersediaan dikonfirmasi sebelum terbit.',
      },
      events: {
        eyebrow: 'Meja acara',
        title: SECTION_TITLES.events.id,
        description: 'Belum ada acara yang dipublikasikan. Halaman ini menjelaskan keadaan yang akan kamu lihat saat data publik siap.',
      },
    }[section];
    return indonesian;
  }

  return english;
}
