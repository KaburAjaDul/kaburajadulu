'use client';

import { DISCORD_URL } from '@/constants/urls';
import { GITHUB_URL } from '@/constants/urls';
import type { Locale } from '@/i18n/constants';

interface FooterProps {
  locale?: Locale;
}

const FOOTER_LINKS = [
  { label: 'Komunitas', path: '/community' },
  { label: 'Program', path: '/programs' },
  { label: 'Agenda', path: '/events' },
  { label: 'Relawan', path: '/volunteer' },
  { label: 'Cerita', path: '/stories' },
  { label: 'Dampak', path: '/community/impact' },
  { label: 'Kredit', path: '/community/credits' },
  { label: 'Dukung KAD', path: '/support' },
] as const;

function localizedPath(locale: Locale, path: string): string {
  return `${locale === 'id' ? '' : `/${locale}`}${path}`;
}

export function Footer({ locale = 'id' }: FooterProps) {
  return (
    <footer className="kad-footer" lang={locale === 'id' ? undefined : 'id'}>
      <div className="kad-container kad-footer__grid">
        <div className="kad-footer__brand">
          <img src="/icon.svg" alt="KaburAjaDulu" width={170} height={34} />
          <p>
            Ruang belajar, berbagi, dan bertumbuh untuk orang Indonesia yang sedang
            mencari jalan ke dunia.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="kad-button kad-button--primary"
          >
            Gabung Discord
          </a>
        </div>

        <nav className="kad-footer__links" aria-label="Navigasi kaki">
          <p className="kad-eyebrow">Jelajahi</p>
          {FOOTER_LINKS.map((item) => (
            <a key={item.path} href={localizedPath(locale, item.path)}>{item.label}</a>
          ))}
        </nav>

        <div className="kad-footer__links">
          <p className="kad-eyebrow">Sumber publik</p>
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
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <div className="kad-container kad-footer__bottom">
        <p>© 2026 KaburAjaDulu.</p>
        <p>Informasi program selalu dikonfirmasi melalui sumber publik atau Discord.</p>
      </div>
    </footer>
  );
}

export default Footer;
