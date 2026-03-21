'use client';

import { DISCORD_URL } from '@/constants/urls';
import { LanguageSwitcher } from './LanguageSwitcher';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface NavbarProps {
  locale?: Locale;
  currentPath?: string;
}

export function Navbar({ locale = 'id', currentPath = '/' }: NavbarProps) {
  const t = (key: string) => translate(locale, key);

  const handleDiscordClick = () => {
    if (typeof window !== 'undefined') {
      window.open(DISCORD_URL, '_blank');
    }
  };

  return (
    <nav className="navbar container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
      {/* Logo */}
      <a href={`/${locale === 'id' ? '' : locale + '/'}`} className="font-bold text-lg flex items-center" aria-label="Kembali ke halaman utama">
        <img
          src="/icon.svg"
          alt="KaburAjaDulu Logo"
          width={140}
          height={28}
          className="w-32 sm:w-40 h-auto"
        />
      </a>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <a
          href={`/${locale === 'id' ? '' : locale + '/'}#blog`}
          className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm sm:text-base"
        >
          {t('nav.blog')}
        </a>
        <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
        <button
          onClick={handleDiscordClick}
          className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer font-medium"
          aria-label={t('footer.discord')}
        >
          {t('nav.contact')}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
