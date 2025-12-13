import 'server-only';
import type { Locale } from './i18n-config'; // Import Locale from i18n-config

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ar: () => import('./dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const dictionary = dictionaries[locale];
  if (!dictionary) {
    console.warn(`Dictionary not found for locale: ${locale}, falling back to 'ar'`);
    return dictionaries.ar();
  }
  return dictionary();
};

export const defaultLocale='ar'; export const locales=['ar','en'] as const; export type Locales = typeof locales[number]; export const isRTL=(l:string)=>l==='ar';