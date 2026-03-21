import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all locale files
import id from '@/locales/id.json';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';
import zhCN from '@/locales/zh-cn.json';
import zhTW from '@/locales/zh-tw.json';
import ko from '@/locales/ko.json';
import es from '@/locales/es.json';
import ar from '@/locales/ar.json';
import nl from '@/locales/nl.json';
import it from '@/locales/it.json';
import de from '@/locales/de.json';
import fr from '@/locales/fr.json';
import sv from '@/locales/sv.json';

export const SUPPORTED_LANGUAGES = ['id', 'en', 'ja', 'zh-cn', 'zh-tw', 'ko', 'es', 'ar', 'nl', 'it', 'de', 'fr', 'sv'] as const;

// Create resources object in the format i18next expects
// The key is the language code, and it contains a 'translation' namespace
const resources = {
  id: { translation: id },
  en: { translation: en },
  ja: { translation: ja },
  'zh-cn': { translation: zhCN },
  'zh-tw': { translation: zhTW },
  ko: { translation: ko },
  es: { translation: es },
  ar: { translation: ar },
  nl: { translation: nl },
  it: { translation: it },
  de: { translation: de },
  fr: { translation: fr },
  sv: { translation: sv },
};

// Initialize on client side only with resources
if (typeof window !== 'undefined') {
  i18n
    .use(initReactI18next)
    .init({
      resources, // Pass resources directly in init
      lng: 'id',
      fallbackLng: false,
      supportedLngs: SUPPORTED_LANGUAGES,
      ns: ['translation'], // Explicitly set namespace
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  
  console.log('[i18n] Initialized');
  console.log('[i18n] Current language:', i18n.language);
  console.log('[i18n] Available languages:', Object.keys(resources));
  console.log('[i18n] zh-tw translation test:', i18n.t('hero.headline', { lng: 'zh-tw' }));
}

export const initI18n = async (lng: string): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  const normalizedLng = lng.toLowerCase();
  
  if (i18n.language !== normalizedLng) {
    await i18n.changeLanguage(normalizedLng);
    console.log('[initI18n] Language changed to:', i18n.language);
    console.log('[initI18n] Translation test:', i18n.t('hero.headline'));
  }
};

export default i18n;
