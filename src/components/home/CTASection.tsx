'use client';

import { DISCORD_URL } from '@/constants/urls';
import { localizedPath } from '@/content/community-site';
import type { Locale } from '@/i18n/constants';
import { translate } from '@/i18n/dictionaries';

interface CTASectionProps {
  locale?: Locale;
}

export function CTASection({ locale = 'id' }: CTASectionProps) {
  const t = (key: string) => translate(locale, key);

  return (
    <section className="py-10 md:py-16" lang={locale} data-requested-locale={locale}>
      <div className="container mx-auto text-center px-4 md:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 mb-3">KAD</p>
        <h2 className="text-3xl font-bold mb-4">
          {t('cta.headline')}
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('cta.subheadline')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-lg"
            aria-label={t('cta.cta_primary')}
          >
            {t('cta.cta_primary')}
          </a>
          <a href={localizedPath(locale, '/programs')} className="font-semibold text-blue-600 underline underline-offset-4">
            {t('cta.cta_secondary')}
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
