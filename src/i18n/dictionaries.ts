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

// Flatten nested JSON object to dot-notation keys
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, k: string) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = String(obj[k]);
    }
    return acc;
  }, {});
}

// Dictionary of all translations
const dictionaries: Record<string, Record<string, string>> = {
  id: flattenObject(id),
  en: flattenObject(en),
  ja: flattenObject(ja),
  'zh-cn': flattenObject(zhCN),
  'zh-tw': flattenObject(zhTW),
  ko: flattenObject(ko),
  es: flattenObject(es),
  ar: flattenObject(ar),
  nl: flattenObject(nl),
  it: flattenObject(it),
  de: flattenObject(de),
  fr: flattenObject(fr),
  sv: flattenObject(sv),
};

export function translate(locale: string | undefined | null, key: string): string {
  if (!locale) {
    const fallback = dictionaries.id?.[key] ?? dictionaries.en?.[key];
    return fallback ?? key;
  }

  const normalizedLocale = String(locale).toLowerCase();
  const dict = dictionaries[normalizedLocale];
  
  if (!dict) {
    console.warn(`[translate] Dictionary not found for locale: ${normalizedLocale}`);
    return key;
  }
  
  const value = dict[key];
  
  if (!value) {
    // Fallback to English, then Indonesian, then return key
    const enValue = dictionaries['en']?.[key];
    if (enValue) return enValue;
    
    const idValue = dictionaries['id']?.[key];
    if (idValue) return idValue;
    
    console.warn(`[translate] Key not found: ${key} in locale: ${normalizedLocale}`);
    return key;
  }
  
  return value;
}

export function getDictionary(locale: string) {
  if (!locale) return dictionaries.id;
  return dictionaries[locale.toLowerCase()] || dictionaries.id;
}

export const SUPPORTED_LANGUAGES = Object.keys(dictionaries);
