/**
 * Data normalization utilities for handling inconsistent project data
 * Provides fallback mechanisms to ensure robust rendering
 */

import type { Locale } from './i18n-utils';
import type { Project } from './types';

/**
 * Safely extract localized text from various formats
 */
export function normalizeTitle(
  entity: any,
  locale: Locale = 'ar'
): string {
  // Try multiple field names and formats
  const titleFields = [
    entity?.projectName,
    entity?.name,
    entity?.title,
  ];

  for (const field of titleFields) {
    if (!field) continue;

    // Handle localized object
    if (typeof field === 'object' && field !== null) {
      const localized = field[locale] || field.en || field.ar;
      if (localized && typeof localized === 'string') {
        return localized.trim();
      }
    }

    // Handle plain string
    if (typeof field === 'string' && field.trim()) {
      return field.trim();
    }
  }

  // Final fallback: use slug or default text
  if (entity?.slug && typeof entity.slug === 'string') {
    return entity.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  return locale === 'ar' ? 'مشروع غير محدد' : 'Untitled Project';
}

/**
 * Normalize bedroom count
 */
export function normalizeBedrooms(entity: any): number | null {
  const bedroomFields = [
    entity?.beds_min,
    entity?.beds?.min,
    entity?.bedrooms?.[0],
    entity?.beds,
    entity?.bedrooms,
  ];

  for (const field of bedroomFields) {
    if (typeof field === 'number' && field > 0) {
      return field;
    }
  }

  return null;
}

/**
 * Normalize area (in sqm or sqft)
 */
export function normalizeArea(
  entity: any,
  unit: 'sqm' | 'sqft' = 'sqm'
): { min: number | null; max: number | null } {
  const result = { min: null as number | null, max: null as number | null };

  if (unit === 'sqm') {
    result.min = entity?.minAreaSqmt ?? entity?.area?.minSqmt ?? null;
    result.max = entity?.maxAreaSqmt ?? entity?.area?.maxSqmt ?? null;
  } else {
    result.min = entity?.minAreaSqft ?? entity?.area?.minSqft ?? null;
    result.max = entity?.maxAreaSqft ?? entity?.area?.maxSqft ?? null;
  }

  return result;
}

/**
 * Normalize price (in AED)
 */
export function normalizePrice(entity: any): { min: number | null; max: number | null } {
  return {
    min: entity?.minPriceAED ?? entity?.price?.minAED ?? null,
    max: entity?.maxPriceAED ?? entity?.price?.maxAED ?? null,
  };
}

/**
 * Normalize location text
 */
export function normalizeLocation(entity: any, locale: Locale = 'ar'): string {
  const locationFields = [
    entity?.area,
    entity?.location,
    entity?.city,
    entity?.community,
  ];

  for (const field of locationFields) {
    if (!field) continue;

    if (typeof field === 'object' && field !== null) {
      const localized = field[locale] || field.en || field.ar;
      if (localized && typeof localized === 'string') {
        return localized.trim();
      }
    }

    if (typeof field === 'string' && field.trim()) {
      return field.trim();
    }
  }

  return '';
}

/**
 * Normalize image URL
 */
export function normalizeImage(entity: any): string | null {
  const imageFields = [
    entity?.heroImage,
    entity?.galleryImages?.[0],
    entity?.images?.[0],
    entity?.image,
  ];

  for (const field of imageFields) {
    if (typeof field === 'string' && field.trim()) {
      return field.trim();
    }
  }

  return null;
}

/**
 * Detect if entity is a community or individual project
 */
export function isCommunity(entity: any): boolean {
  // Check explicit markers
  if (entity?.community_id) return true;
  if (entity?.type === 'community') return true;

  // Check name patterns
  const nameText = normalizeTitle(entity, 'en').toLowerCase();
  const communityKeywords = [
    'community',
    'estate',
    'village',
    'heights',
    'islands',
    'district',
    'quarter',
    'town',
  ];

  return communityKeywords.some(keyword => nameText.includes(keyword));
}

/**
 * Comprehensive project normalization
 */
export function normalizeProject(raw: any, locale: Locale = 'ar'): Partial<Project> {
  return {
    ...raw,
    projectName: normalizeTitle(raw, locale),
    location: normalizeLocation(raw, locale),
    heroImage: normalizeImage(raw) || '/images/hero-fallback.png',
    ...normalizePrice(raw),
    ...normalizeArea(raw, 'sqm'),
  };
}
