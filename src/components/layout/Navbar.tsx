'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DISCORD_URL } from '@/constants/urls';
import { LanguageSwitcher } from './LanguageSwitcher';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface NavbarProps {
  locale?: Locale;
  currentPath?: string;
}

const sections = [
  { key: 'nav.community', slug: 'community' },
  { key: 'nav.programs', slug: 'programs' },
  { key: 'nav.events', slug: 'events' },
] as const;

function localizedRoot(locale: Locale): string {
  return locale === 'id' ? '' : `${locale}/`;
}

export function Navbar({ locale = 'id', currentPath = '/' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const t = (key: string) => translate(locale, key);
  const root = `/${localizedRoot(locale)}`;
  const unprefixedPath = currentPath.replace(/^\/(id|en|ja|zh-cn|zh-tw|ko|es|ar|nl|it|de|fr|sv)(?=\/|$)/, '');
  const currentSection = unprefixedPath.split('/').filter(Boolean)[0];

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <nav className="navbar page-width" aria-label={t('a11y.primary_navigation')}>
        <a href={root} className="brand-mark" aria-label={t('a11y.home_link')}>
          <img src="/icon.svg" alt="KaburAjaDulu" width={140} height={28} />
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? t('a11y.close_menu') : t('a11y.open_menu')}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <div id="primary-navigation" className={`nav-cluster${menuOpen ? ' is-open' : ''}`}>
          <div className="nav-links">
            {sections.map(({ key, slug }) => (
              <a
                key={slug}
                href={`${root}${slug}`}
                className="nav-link"
                aria-current={currentSection === slug ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {t(key)}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
            <a
              className="button button-small"
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              {t('nav.join_discord')}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
