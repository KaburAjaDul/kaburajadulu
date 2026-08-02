'use client';

import { DISCORD_URL } from '@/constants/urls';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface FooterProps {
  locale?: Locale;
}

export function Footer({ locale = 'id' }: FooterProps) {
  const t = (key: string) => translate(locale, key);
  const root = locale === 'id' ? '/' : `/${locale}/`;

  return (
    <footer className="site-footer">
      <div className="page-width footer-grid">
        <div>
          <p className="footer-kicker">KaburAjaDulu</p>
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>
        <nav aria-label={t('a11y.footer_navigation')} className="footer-nav">
          <a href={`${root}community`}>{t('footer.community')}</a>
          <a href={`${root}programs`}>{t('footer.programs')}</a>
          <a href={`${root}events`}>{t('footer.events')}</a>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">{t('footer.discord')}</a>
        </nav>
        <p className="footer-copyright">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

export default Footer;
