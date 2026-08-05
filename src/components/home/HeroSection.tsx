'use client';

import { DISCORD_URL } from '@/constants/urls';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';
import { translate } from '@/i18n/dictionaries';

interface HeroSectionProps {
  locale?: Locale;
}

export function HeroSection({ locale = 'id' }: HeroSectionProps) {
  const t = (key: string) => translate(locale, key);
  const eventNote = locale === 'id'
    ? 'Event publik tidak memerlukan pendaftaran. Masuk ke Discord saat acaranya dimulai.'
    : 'Public events do not require registration. Open Discord when the event starts.';

  return (
    <section className="kad-home-hero py-10 md:py-16 lg:py-24" lang={locale} data-requested-locale={locale}>
      <div className="kad-home-hero__ornaments" aria-hidden="true">
        <div className="kad-home-hero__dither">
          <img src="/images/seoul.webp" alt="" width="720" height="480" />
        </div>
        <div className="kad-home-hero__route"><span></span></div>
        <div className="kad-home-hero__note">
          <strong>KAD</strong>
          <span>EST.<br />2024</span>
        </div>
      </div>
      <div className="kad-home-hero__content container mx-auto text-center px-4 md:px-6">
        <p className="kad-home-hero__kicker">{t('hero.badge')}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6">
          {t('hero.headline')}
        </h1>
        <p className="text-lg md:text-xl font-light max-w-3xl mx-auto mb-8">
          {t('hero.subheadline')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            aria-label={t('hero.cta_primary')}
          >
            {t('hero.cta_primary')}
          </a>
          <a
            href={localizedPath(locale, '/programs')}
            className="text-blue-600 hover:underline font-medium mt-2 sm:mt-0"
          >
            {t('hero.cta_secondary')}
          </a>
        </div>
        <p className="mt-6 text-sm text-gray-500" lang={locale === 'id' ? 'id' : 'en'}>{eventNote}</p>
      </div>
    </section>
  );
}

export default HeroSection;
