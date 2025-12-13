


export type Locale = 'ar' | 'en';

export const SUPPORTED_LOCALES: readonly Locale[] = (
  process.env.NEXT_PUBLIC_SUPPORTED_LANGUAGES ?? 'ar,en'
).split(',').map(s => s.trim().toLowerCase()).filter(Boolean) as Locale[];

export function normalizeLocale(x?: string): Locale {
  return (x || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function t(v?: { ar?: string; en?: string } | string | { city?: string }, locale: Locale = 'ar'): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if ('city' in v) return v.city || '';
  return (v as any)[locale] || (v as any).en || (v as any).ar || '';
}

// Legacy alias
export const tx = t;


import enDict from './dictionaries/en.json';
import arDict from './dictionaries/ar.json';

export const DICTIONARIES = { en: enDict, ar: arDict };

export function getDictionary(locale: Locale) {
  return DICTIONARIES[locale] ?? DICTIONARIES.ar;
}

export function localizeField(value: any, locale: Locale): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value[locale] || value.en || value.ar || Object.values(value)[0] || '';
  }
  return String(value);
}