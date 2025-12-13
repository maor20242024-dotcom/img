// lib/routes.ts
export type Locale = 'ar' | 'en';

// مسارات Typed للاستخدام مع <Link/> (App Router)
export const routes = {
  home: (locale: Locale) =>
    ({ pathname: '/[locale]', params: { locale } } as const),

  // Projects
  projectsIndex: (locale: Locale) =>
    ({ pathname: '/[locale]/projects', params: { locale } } as const),

  projectShow: (locale: Locale, developer: string, slug: string) =>
    ({ pathname: '/[locale]/projects/[developer]/[slug]', params: { locale, developer, slug } } as const),

  // Developers
  developersIndex: (locale: Locale) =>
    ({ pathname: '/[locale]/developers', params: { locale } } as const),

  developerShow: (locale: Locale, developer: string) =>
    ({ pathname: '/[locale]/developers/[developer]', params: { locale, developer } } as const),

  // Other pages (عدّل المسارات هنا لو كانت مختلفة فعليًا عندك)
  about: (locale: Locale) =>
    ({ pathname: '/[locale]/about', params: { locale } } as const),

  vision: (locale: Locale) =>
    ({ pathname: '/[locale]/vision', params: { locale } } as const),

  news: (locale: Locale) =>
    ({ pathname: '/[locale]/news', params: { locale } } as const),

  favorites: (locale: Locale) =>
    ({ pathname: '/[locale]/favorites', params: { locale } } as const),

  ai: (locale: Locale) =>
    ({ pathname: '/[locale]/ai', params: { locale } } as const),

  contact: (locale: Locale) =>
    ({ pathname: '/[locale]/contact', params: { locale } } as const),

  compare: (locale: Locale) =>
    ({ pathname: '/[locale]/compare', params: { locale } } as const),

  privacy: (locale: Locale) =>
    ({ pathname: '/[locale]/privacy', params: { locale } } as const),

  terms: (locale: Locale) =>
    ({ pathname: '/[locale]/terms', params: { locale } } as const),

  sitemap: (locale: Locale) =>
    ({ pathname: '/[locale]/sitemap', params: { locale } } as const),
};

// سلاسل نصية فقط عندما تحتاج path كنص (ليس للاستخدام مع <Link/>)
export const stringRoutes = {
  home: (locale: Locale) => `/${locale}`,
  projectsIndex: (locale: Locale) => `/${locale}/projects`,
  projectShow: (locale: Locale, developer: string, slug: string) => `/${locale}/projects/${developer}/${slug}`,
  developersIndex: (locale: Locale) => `/${locale}/developers`,
  developerShow: (locale: Locale, developer: string) => `/${locale}/developers/${developer}`,
  about: (locale: Locale) => `/${locale}/about`,
  vision: (locale: Locale) => `/${locale}/vision`,
  news: (locale: Locale) => `/${locale}/news`,
  favorites: (locale: Locale) => `/${locale}/favorites`,
  ai: (locale: Locale) => `/${locale}/ai`,
  contact: (locale: Locale) => `/${locale}/contact`,
  compare: (locale: Locale) => `/${locale}/compare`,
  privacy: (locale: Locale) => `/${locale}/privacy`,
  terms: (locale: Locale) => `/${locale}/terms`,
  sitemap: (locale: Locale) => `/${locale}/sitemap`,
};

// اختياري: دالة نصية قديمة للتوافق الخلفي
export function makeProjectHref(locale: Locale, developer: string, slug: string): string {
  return `/${locale}/projects/${developer}/${slug}`;
}