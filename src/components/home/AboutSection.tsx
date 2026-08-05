'use client';

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
        route: '04 · Catatan terbuka',
        headline: 'Lihat pekerjaan dan sumbernya, bukan hanya ceritanya.',
        summary: 'KAD sedang menyusun catatan program, kontribusi yang boleh ditampilkan, dan cara mengoreksi informasi publik.',
        credits: 'Buka jejak kontribusi',
        github: 'Lihat ruang kerja publik',
        contact: 'Kirim koreksi atau pertanyaan',
      }
    : {
        route: '04 · Open records',
        headline: 'See the work and its sources, not only the story.',
        summary: 'KAD is organizing program records, contributions people chose to show, and a correction path for public information.',
        credits: 'Open contribution records',
        github: 'View the public workspace',
        contact: 'Send a correction or question',
      };

  return (
    <section className="kad-open-records" lang={contentLocale} data-requested-locale={locale}>
      <div className="kad-container kad-open-records__grid">
        <div>
          <p>{copy.route}</p>
          <h2>{copy.headline}</h2>
        </div>
        <div>
          <p>{copy.summary}</p>
          <nav aria-label={contentLocale === 'id' ? 'Catatan terbuka KAD' : 'KAD open records'}>
            <a href={localizedPath(locale, '/community/credits')}>{copy.credits} <span aria-hidden="true">→</span></a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label={copy.github}>{copy.github} <span aria-hidden="true">↗</span></a>
            <a href={`mailto:${EMAIL}`} aria-label={copy.contact}>{copy.contact} <span aria-hidden="true">→</span></a>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
