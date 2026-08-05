'use client';

import { DISCORD_URL } from '@/constants/urls';
import { GITHUB_URL } from '@/constants/urls';
import type { Locale } from '@/i18n/constants';
import { translate } from '@/i18n/dictionaries';

interface FooterProps {
  locale?: Locale;
}

const FOOTER_LINKS = [
  { key: 'community', path: '/community' },
  { key: 'programs', path: '/programs' },
  { key: 'events', path: '/events' },
  { key: 'volunteer', path: '/volunteer' },
  { key: 'stories', path: '/stories' },
  { key: 'history', path: '/about/history' },
  { key: 'impact', path: '/community/impact' },
  { key: 'credits', path: '/community/credits' },
  { key: 'support', path: '/support' },
] as const;

function localizedPath(locale: Locale, path: string): string {
  return `${locale === 'id' ? '' : `/${locale}`}${path}`;
}

export function Footer({ locale = 'id' }: FooterProps) {
  const contentLocale = locale === 'id' ? 'id' : 'en';
  const t = (key: string) => translate(contentLocale, key);
  return (
    <footer className="kad-footer" lang={contentLocale} data-requested-locale={locale}>
      <div className="kad-container kad-footer__grid">
        <div className="kad-footer__brand">
          <img src="/icon.svg" alt="KaburAjaDulu" width={170} height={34} />
          <p>{t('footer.tagline')}</p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="kad-footer__discord"
          >
            {t('footer.join_discord')}
          </a>
        </div>

        <nav className="kad-footer__links" aria-label={locale === 'id' ? 'Navigasi kaki' : 'Footer navigation'}>
          <p className="kad-eyebrow">{t('footer.explore')}</p>
          {FOOTER_LINKS.map((item) => (
              <a key={item.path} href={localizedPath(locale, item.path)}>{t(`nav.${item.key}`)}</a>
          ))}
        </nav>

        <div className="kad-footer__links">
          <p className="kad-eyebrow">{t('footer.public_sources')}</p>
          <a href="https://x.com/KADSocialHub" target="_blank" rel="noopener noreferrer">
            X · @KADSocialHub
          </a>
          <a
            href="https://www.instagram.com/kadsocialhub/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram · @kadsocialhub
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.github_contributor')}
          >
            GitHub · {t('footer.github_contributor')}
          </a>
        </div>
      </div>
      <div className="kad-container kad-footer__bottom">
        <p>© 2026 KaburAjaDulu.</p>
        <p>{t('footer.community_note')}</p>
      </div>
    </footer>
  );
}

export default Footer;
