export const LOCALES = ['id', 'en', 'ja', 'zh-cn', 'zh-tw', 'ko', 'es', 'ar', 'nl', 'it', 'de', 'fr', 'sv'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'id';

export const LOCALE_NAMES: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
  ja: '日本語',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
  ko: '한국어',
  es: 'Español',
  ar: 'العربية',
  nl: 'Nederlands',
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Français',
  sv: 'Svenska',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  id: '🇮🇩',
  en: '🇬🇧',
  ja: '🇯🇵',
  'zh-cn': '🇨🇳',
  'zh-tw': '🇹🇼',
  ko: '🇰🇷',
  es: '🇪🇸',
  ar: '🇸🇦',
  nl: '🇳🇱',
  it: '🇮🇹',
  de: '🇩🇪',
  fr: '🇫🇷',
  sv: '🇸🇪',
};

export const LOCALE_DIR: Record<Locale, 'ltr' | 'rtl'> = {
  id: 'ltr',
  en: 'ltr',
  ja: 'ltr',
  'zh-cn': 'ltr',
  'zh-tw': 'ltr',
  ko: 'ltr',
  es: 'ltr',
  ar: 'rtl',
  nl: 'ltr',
  it: 'ltr',
  de: 'ltr',
  fr: 'ltr',
  sv: 'ltr',
};
