'use client';

import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOCALE_NAMES, LOCALE_FLAGS, LOCALES } from '@/i18n/constants';
import { translate } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/constants';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  currentPath: string;
  className?: string;
}

export function LanguageSwitcher({ currentLocale, currentPath, className }: LanguageSwitcherProps) {
  const t = (key: string) => translate(currentLocale, key);
  const [isOpen, setIsOpen] = useState(false);
  const detectedLocale =
    typeof document !== 'undefined'
      ? (document.documentElement.dataset.detectedLocale as Locale | undefined) ?? null
      : null;

  const localePrefixRegex = /^\/(id|en|ja|zh-cn|zh-tw|ko|es|ar|nl|it|de|fr|sv)(?=\/|$)/;

  function getLocalizedUrl(targetLocale: Locale): string {
    const basePath = currentPath.replace(localePrefixRegex, '') || '/';
    const suffix = basePath === '/' ? '' : basePath;
    if (targetLocale === 'id') return `/id${suffix}`;
    return `/${targetLocale}${suffix}`;
  }

  function handleLanguageClick(locale: Locale): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLocale', locale);
    }
    setIsOpen(false);
  }

  const currentFlag = LOCALE_FLAGS[currentLocale];
  const currentName = LOCALE_NAMES[currentLocale];

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('nav.language')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium',
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
          'transition-colors duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500'
        )}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentFlag} {currentName}</span>
        <span className="sm:hidden">{currentFlag}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className={cn(
            'absolute right-0 mt-1 w-52 max-h-80 overflow-y-auto',
            'bg-white rounded-xl shadow-lg border border-gray-100',
            'z-50 py-1',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150'
          )}
        >
          {LOCALES.map((locale) => {
            const flag = LOCALE_FLAGS[locale];
            const name = LOCALE_NAMES[locale];
            const isActive = locale === currentLocale;
            const isDetected = locale === detectedLocale;
            const url = getLocalizedUrl(locale);

            return (
              <a
                key={locale}
                href={url}
                role="option"
                aria-selected={isActive}
                onClick={() => handleLanguageClick(locale)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm',
                  'transition-colors duration-100 cursor-pointer',
                  'hover:bg-gray-50',
                  isActive && 'bg-blue-50 text-blue-700 font-medium',
                  !isActive && 'text-gray-700'
                )}
              >
                <span className="text-lg leading-none">{flag}</span>
                <span className="flex-1">{name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
                {isDetected && !isActive && (
                  <span className="text-xs text-gray-400 font-medium">detected</span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
