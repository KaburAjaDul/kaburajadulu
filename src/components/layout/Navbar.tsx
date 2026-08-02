'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DISCORD_URL } from '@/constants/urls';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import type { Locale } from '@/i18n/constants';

interface NavbarProps {
  locale?: Locale;
  currentPath?: string;
}

const NAV_ITEMS = [
  { label: 'Komunitas', path: '/community' },
  { label: 'Program', path: '/programs' },
  { label: 'Agenda', path: '/events' },
  { label: 'Relawan', path: '/volunteer' },
] as const;

function localizedPath(locale: Locale, path: string): string {
  const prefix = locale === 'id' ? '' : `/${locale}`;
  return `${prefix}${path}` || '/';
}

export function Navbar({ locale = 'id', currentPath = '/' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const homePath = localizedPath(locale, '/');

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <header className="kad-masthead" data-testid="site-header" lang={locale === 'id' ? undefined : 'id'}>
      <a className="kad-skip-link" href="#main-content">
        Lewati ke konten
      </a>
      <nav className="navbar kad-nav kad-container" aria-label="Navigasi utama">
        <a href={homePath} className="kad-brand" aria-label="KaburAjaDulu — halaman utama">
          <img src="/icon.svg" alt="KaburAjaDulu" width={160} height={32} />
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="kad-menu-button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <div
          id="primary-navigation"
          className="kad-nav-panel"
          data-open={isOpen ? 'true' : 'false'}
        >
          <div className="kad-nav-links">
            {NAV_ITEMS.map((item) => {
              const href = localizedPath(locale, item.path);
              const active = currentPath === href || currentPath.startsWith(`${href}/`);

              return (
                <a key={item.path} href={href} aria-current={active ? 'page' : undefined}>
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="kad-nav-actions">
            <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
            <a className="kad-button kad-button--outline" href={localizedPath(locale, '/support')}>
              Dukung KAD
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="kad-button kad-button--primary"
              aria-label="Gabung Discord KaburAjaDulu"
            >
              Gabung Discord
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
