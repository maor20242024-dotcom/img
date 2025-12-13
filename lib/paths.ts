/**
 * Central path generator for all routes
 * Single source of truth for URL generation
 */

export type Locale = 'en' | 'ar';

export const path = {
  // Home
  home: (l: Locale) => `/${l}`,

  // Projects
  projectsHome: (l: Locale) => `/${l}/projects`,
  developerProjects: (l: Locale, developerKey: string) => `/${l}/projects/${developerKey}`,
  project: (l: Locale, developerKey: string, projectSlug: string) =>
    `/${l}/projects/${developerKey}/${projectSlug}`,

  // Developers
  developersHome: (l: Locale) => `/${l}/developers`,
  developer: (l: Locale, developerKey: string) => `/${l}/developers/${developerKey}`,

  // Communities
  communitiesHome: (l: Locale) => `/${l}/communities`,
  community: (l: Locale, communitySlug: string) => `/${l}/communities/${communitySlug}`,
  developerCommunity: (l: Locale, developerKey: string, communitySlug: string) => `/${l}/developers/${developerKey}/communities/${communitySlug}`,

  // Other pages
  contact: (l: Locale) => `/${l}/contact`,
  favorites: (l: Locale) => `/${l}/favorites`,
  compare: (l: Locale) => `/${l}/compare`,
  about: (l: Locale) => `/${l}/about`,
  vision: (l: Locale) => `/${l}/vision`,
  news: (l: Locale) => `/${l}/news`,
  ai: (l: Locale) => `/${l}/ai`,
  privacy: (l: Locale) => `/${l}/privacy`,
  terms: (l: Locale) => `/${l}/terms`,
  sitemap: (l: Locale) => `/${l}/sitemap`,
} as const;

/**
 * Helper to switch locale while preserving the current path
 * @param currentPath - Current pathname (e.g., /en/projects/emaar/greenville)
 * @param targetLocale - Target locale (en or ar)
 * @returns New path with switched locale
 */
export function switchLocale(currentPath: string, targetLocale: Locale): string {
  return currentPath.replace(/^\/(ar|en)/, `/${targetLocale}`);
}

/**
 * Extract locale from path
 * @param pathname - Current pathname
 * @returns Detected locale or default 'ar'
 */
export function extractLocale(pathname: string): Locale {
  const match = pathname.match(/^\/(ar|en)/);
  return (match?.[1] as Locale) || 'ar';
}
