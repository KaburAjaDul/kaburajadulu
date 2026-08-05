'use client';

import { GithubButton } from '@/components/github-button';
import { GITHUB_URL } from '@/constants/urls';
import { EMAIL } from '@/constants/contacts';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';

interface AboutSectionProps {
  locale?: Locale;
}

export function AboutSection({ locale = 'id' }: AboutSectionProps) {
  const contentLocale = locale === 'id' ? 'id' : 'en';
  const copy = contentLocale === 'id'
    ? {
        eyebrow: 'Jejak komunitas',
        headline: 'KAD berjalan karena orang-orang yang memilih untuk hadir.',
        subheadline: 'Lihat program yang dicatat, kontribusi yang boleh ditampilkan, dan cara kerja komunitas sebelum memutuskan langkahmu.',
        credits: 'Lihat kontribusi komunitas',
        github: 'Lihat ruang kerja publik',
        contact: 'Hubungi tim KAD',
      }
    : {
        eyebrow: 'Community proof',
        headline: 'KAD moves because people choose to show up.',
        subheadline: 'See recorded programs, opted-in contributions, and how the community works before choosing your next step.',
        credits: 'See community contributions',
        github: 'See the public workspace',
        contact: 'Contact the KAD team',
      };

  return (
    <section className="py-10 md:py-16" lang={contentLocale} data-requested-locale={locale}>
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 text-center">{copy.eyebrow}</p>
        <h2 className="text-3xl font-bold text-center mb-6 md:mb-8 mt-3">
          {copy.headline}
        </h2>
        <div className="max-w-3xl mx-auto text-lg text-center">
          <p className="mb-6 font-light">
            {copy.subheadline}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-10 gap-6 sm:gap-6">
          <a
            href={localizedPath(locale, '/community/credits')}
            className="px-6 py-2 text-base w-full sm:w-auto text-center rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {copy.credits}
          </a>
          <GithubButton
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 text-base w-full sm:w-auto"
            ariaLabel={copy.github}
          >
            {copy.github}
          </GithubButton>
          <a
            href={`mailto:${EMAIL}`}
            className="text-base underline decoration-1 hover:text-blue-600 transition-colors mt-2 sm:mt-0"
            aria-label={copy.contact}
          >
            {copy.contact}
          </a>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
