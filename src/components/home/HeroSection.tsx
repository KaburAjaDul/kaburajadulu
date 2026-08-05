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
  const supportingLocale = locale === 'id' ? 'id' : 'en';
  const copy = supportingLocale === 'id'
    ? {
        note: 'Event publik tidak memerlukan pendaftaran atau konfirmasi kehadiran.',
        visual: 'Konteks kota, bukan peringkat',
        annotation: 'berangkat dari sini',
      }
    : {
        note: 'Public events require no registration or attendance confirmation.',
        visual: 'City context, not a ranking',
        annotation: 'start from here',
      };

  return (
    <section
      className="kad-home-hero"
      lang={locale}
      data-requested-locale={locale}
      data-field-station="home"
      aria-labelledby="home-title"
    >
      <div className="kad-container kad-home-hero__route-stamp">
        <span>KAD/00 · KABURAJADULU</span>
        <span>EST. 2024</span>
      </div>

      <div className="kad-container kad-home-hero__grid">
        <div className="kad-home-hero__content">
          <p className="kad-home-hero__kicker">{t('hero.badge')}</p>
          <h1 id="home-title">{t('hero.headline')}</h1>
          <p className="kad-home-hero__summary">{t('hero.subheadline')}</p>
          <div className="kad-home-hero__actions">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="kad-button kad-button--primary kad-home-hero__primary"
              aria-label={t('hero.cta_primary')}
              data-home-primary-action
            >
              {t('hero.cta_primary')} <span aria-hidden="true">↗</span>
            </a>
            <a href={localizedPath(locale, '/programs')} className="kad-home-hero__secondary">
              {t('hero.cta_secondary')} <span aria-hidden="true">→</span>
            </a>
          </div>
          <p className="kad-home-hero__note" lang={supportingLocale}>{copy.note}</p>
        </div>

        <figure className="kad-home-hero__visual" aria-label={copy.visual} lang={supportingLocale}>
          <div className="kad-home-hero__image" aria-hidden="true">
            <img src="/images/seoul.webp" alt="" width="720" height="900" />
          </div>
          <figcaption>
            <span>SEOUL / CITY 01</span>
            <strong>{copy.visual}</strong>
          </figcaption>
          <span className="kad-home-hero__annotation" aria-hidden="true">{copy.annotation} →</span>
        </figure>
      </div>
    </section>
  );
}

export default HeroSection;
