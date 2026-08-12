'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DISCORD_URL } from '@/constants/urls';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import type { Locale } from '@/i18n/constants';
import { translate } from '@/i18n/dictionaries';

interface NavbarProps {
  locale?: Locale;
  currentPath?: string;
}

const NAV_ITEMS = [
  { key: 'community', path: '/community' },
  { key: 'programs', path: '/programs' },
  { key: 'events', path: '/events' },
  { key: 'volunteer', path: '/volunteer' },
  { key: 'stories', path: '/stories' },
] as const;

function localizedPath(locale: Locale, path: string): string {
  const prefix = locale === 'id' ? '' : `/${locale}`;
  return `${prefix}${path}` || '/';
}

export function Navbar({ locale = 'id', currentPath = '/' }: NavbarProps) {
  const contentLocale = locale === 'id' ? 'id' : 'en';
  const t = (key: string) => translate(contentLocale, key);
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
    <header className="kad-masthead" data-testid="site-header" lang={contentLocale} data-requested-locale={locale}>
      <a className="kad-skip-link" href="#main-content">
        {t('nav.skip_to_content')}
      </a>
      <nav className="navbar kad-nav kad-container" aria-label={t('nav.main_navigation')}>
        <a href={homePath} className="kad-brand" aria-label={`KaburAjaDulu, ${t('nav.home')}`}>
          <img src="/icon.svg" alt="KaburAjaDulu" width={160} height={32} />
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="kad-menu-button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? t('nav.close_navigation') : t('nav.open_navigation')}
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
                  {t(`nav.${item.key}`)}
                </a>
              );
            })}
          </div>

          <div className="kad-nav-actions">
            <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="kad-nav-discord"
              aria-label={`${t('nav.join_discord')} KaburAjaDulu`}
            >
              {t('nav.join_discord')} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
