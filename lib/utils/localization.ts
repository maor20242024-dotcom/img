/**
 * Utility functions for handling localized content
 */

export type LocalizedField = {
  en: string;
  ar: string;
};

/**
 * Get localized text from a field that can be either a string or a localized object
 * @param field - The field to get text from (string or LocalizedField)
 * @param locale - The locale to use ('en' or 'ar')
 * @returns The localized text as a string
 */
export function getLocalizedText(
  field: string | LocalizedField | undefined | null,
  locale: 'en' | 'ar' = 'en'
): string {
  if (!field) return '';
  
  // If it's already a string, return it
  if (typeof field === 'string') {
    return field;
  }
  
  // If it's a localized object, return the appropriate locale
  if (typeof field === 'object' && field !== null && 'en' in field && 'ar' in field) {
    return field[locale] || field.en || '';
  }
  
  // Fallback: convert to string
  return String(field);
}

/**
 * Get developer name as a string, handling both string and localized object formats
 * @param developer - The developer field (string or LocalizedField)
 * @param locale - The locale to use ('en' or 'ar')
 * @returns The developer name as a string
 */
export function getDeveloperName(
  developer: string | LocalizedField | undefined | null,
  locale: 'en' | 'ar' = 'en'
): string {
  return getLocalizedText(developer, locale);
}