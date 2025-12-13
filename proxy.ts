import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { i18n } from './lib/i18n-config';

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|mp4|webm|pdf|json)$/i;

function getPreferredLocale(request: NextRequest): string {
  const accept = request.headers.get('accept-language') || '';
  const primary = accept.split(',')[0]?.split(';')[0]?.toLowerCase() || '';
  if (primary.startsWith('ar')) return 'ar';
  if (primary.startsWith('en')) return 'en';
  return i18n.defaultLocale;
}

function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    return getPreferredLocale(request);
  }

  // Extract locale from pathname
  const segments = pathname.split('/');
  const localeFromPath = segments[1];
  
  // Validate locale
  if (i18n.locales.includes(localeFromPath as any)) {
    return localeFromPath;
  }
  
  return i18n.defaultLocale;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // تخطّي الملفات العامة و Next internals و الـ API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname) ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // تحويل الجذر إلى اللغة الافتراضية/المفضلة من المتصفح
  if (pathname === '/') {
    const preferred = getPreferredLocale(req);
    return NextResponse.redirect(new URL(`/${preferred}`, req.url));
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);
    const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return NextResponse.redirect(new URL(`/${locale}${cleanPath}`, req.url));
  }

  // Normalize paths that accidentally include two locale segments (e.g., /en/ar or /ar/en)
  {
    const segments = pathname.split('/').filter(Boolean);
    if (
      segments.length >= 2 &&
      i18n.locales.includes(segments[0] as any) &&
      i18n.locales.includes(segments[1] as any)
    ) {
      const rest = segments.slice(2).join('/');
      const target = `/${segments[1]}${rest ? `/${rest}` : ''}`;
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  // No CSP headers - maximum compatibility for all external resources
  const res = NextResponse.next();

  return res;
}

export const config = {
  matcher: [
    {
      // Match all request paths except for static assets and prefetches
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
