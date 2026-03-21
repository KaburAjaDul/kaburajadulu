'use client';

import { DISCORD_URL } from '@/constants/urls';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface CTASectionProps {
  locale?: Locale;
}

export function CTASection({ locale = 'id' }: CTASectionProps) {
  const t = (key: string) => translate(locale, key);

  const handleDiscordClick = () => {
    if (typeof window !== 'undefined') {
      window.open(DISCORD_URL, '_blank');
    }
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto text-center px-4 md:px-6">
        <h2 className="text-3xl font-bold mb-4">
          {t('cta.headline')}
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('cta.subheadline')}
        </p>
        <button
          onClick={handleDiscordClick}
          className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer text-lg"
          aria-label={t('cta.cta_primary')}
        >
          {t('cta.cta_primary')}
        </button>
      </div>
    </section>
  );
}

export default CTASection;
