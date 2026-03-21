import type { Locale } from './constants';
import { DEFAULT_LOCALE, LOCALES } from './constants';

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (LOCALES.includes(lang as Locale)) {
    return lang as Locale;
  }
  return DEFAULT_LOCALE;
}

export function getLocalizedPath(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) {
    return cleanPath;
  }
  return `/${locale}${cleanPath}`;
}
