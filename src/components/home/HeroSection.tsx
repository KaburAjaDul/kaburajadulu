'use client';

import { useMemo } from 'react';
import { DISCORD_URL } from '@/constants/urls';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface HeroSectionProps {
  locale?: Locale;
}

export function HeroSection({ locale = 'id' }: HeroSectionProps) {
  const contentLocale = locale === 'id' ? 'id' : 'en';
  const t = useMemo(() => {
    return (key: string) => translate(contentLocale, key);
  }, [contentLocale]);

  return (
    <section className="kad-home-hero py-10 md:py-16 lg:py-24" lang={contentLocale} data-requested-locale={locale}>
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
            href={`${locale === 'id' ? '' : `/${locale}`}/programs`}
            className="text-blue-600 hover:underline font-medium mt-2 sm:mt-0"
          >
            {t('hero.cta_secondary')}
          </a>
        </div>
        <div className="mt-6">
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-full">
            {t('hero.badge')}
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
