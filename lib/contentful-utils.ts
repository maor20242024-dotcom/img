/**
 * أدوات تحسين روابط Contentful + حل مسارات الوسائط (directAccess)
 * - tuneContentful*: لتحسين الصور من Contentful
 * - removeContentfulProxy: لإرجاع رابط Contentful الأصلي إن كان يمر عبر /api/proxy/file
 * - directAccess: يقرّر إن كان الرابط يجب أن يُحمَّل مباشرة أو عبر البروكسي
 */

/* ===================== تحسينات Contentful للصور ===================== */

/**
 * تحسين رابط Contentful لتقليل الحجم وتحسين الأداء
 * @param url - الرابط الأصلي من Contentful
 * @param options - خيارات التحسين
 * @returns الرابط المحسن
 */
export function tuneContentful(
  url: string,
  options: {
    quality?: number;
    width?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
    removeHeight?: boolean;
  } = {}
): string {
  try {
    const u = new URL(url);

    // تحقق من أن الرابط من Contentful
    if (!u.hostname.endsWith('ctfassets.net')) {
      return url;
    }

    const {
      quality = 70,
      width = 1600,
      format = 'webp',
      removeHeight = true,
    } = options;

    // تطبيق التحسينات
    u.searchParams.set('fm', format);
    u.searchParams.set('q', quality.toString());

    // تعديل العرض إذا كان موجوداً
    if (u.searchParams.has('w')) {
      u.searchParams.set('w', width.toString());
    }

    // إزالة الارتفاع للسماح لـ Next/Image بضبطه تلقائياً
    if (removeHeight && u.searchParams.has('h')) {
      u.searchParams.delete('h');
    }

    return u.toString();
  } catch {
    // في حالة خطأ في تحليل الرابط، أرجع الرابط الأصلي
    return url;
  }
}

/** تحسين رابط للصور في المعارض (جودة أقل للتحميل السريع) */
export function tuneContentfulForGallery(url: string): string {
  return tuneContentful(url, {
    quality: 60,
    width: 1200,
    format: 'webp',
  });
}

/** تحسين رابط للصور المصغرة */
export function tuneContentfulForThumbnail(url: string): string {
  return tuneContentful(url, {
    quality: 65,
    width: 400,
    format: 'webp',
  });
}

/** تحسين رابط للصور عالية الجودة (Hero images) */
export function tuneContentfulForHero(url: string): string {
  return tuneContentful(url, {
    quality: 80,
    width: 1920,
    format: 'webp',
  });
}

/**
 * إزالة البروكسي من رابط Contentful إذا كان يمر عبر /api/proxy/file
 */
export function removeContentfulProxy(url: string): string {
  try {
    const u = new URL(url);

    // تحقق من أن الرابط يمر عبر البروكسي
    if (u.pathname === '/api/proxy/file' && u.searchParams.has('url')) {
      const originalUrl = u.searchParams.get('url');
      if (originalUrl) {
        const decodedUrl = decodeURIComponent(originalUrl);
        const originalU = new URL(decodedUrl);

        // تحقق من أن الرابط الأصلي من Contentful
        if (originalU.hostname.endsWith('ctfassets.net')) {
          return decodedUrl;
        }
      }
    }

    return url;
  } catch {
    return url;
  }
}

/* ===================== حل مسارات الوسائط (بروكسي/تحميل مباشر) ===================== */

/** تطابق آمن: يطابق الدومين نفسه أو أي تحت-دومين منه */
function hostMatches(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

/** لائحة الدومينات التي يجب تحميلها مباشرة (بدون بروكسي) */
const SKIP_DIRECT_HOSTS = [
  // Contentful
  'images.ctfassets.net',
  'assets.ctfassets.net',
  'downloads.ctfassets.net',
  'videos.ctfassets.net',

  // Emaar
  'cdn.properties.emaar.com',
  'properties.emaar.com',

  // Sobha
  'sobharealty.com',
  'sobha.com',

  // Nakheel
  'www.nakheel.com',
  'nakheel-aut.sitefinity.cloud',

  // DAMAC CDN
  'prod-cdn.damacproperties.com',

  // PropVR / Matterport (جولات 3D)
  'view.propvr.tech',
  'propvr.tech',
  'my.matterport.com',
  'matterport.com',

  // منصات فيديو
  'www.youtube.com',
  'youtu.be',
  'player.vimeo.com',

  // خرائط
  'www.google.com',
  'maps.google.com',

  // مستضيفات وثائق
  'dubaiholding.box.com',
  'www.scribd.com',
];

/**
 * ✅ الدالة الموحّدة لاستخدامها في المكونات:
 * - تعيد رابطًا مباشرًا للدومينات الموثوقة أعلاه
 * - تمرّر الباقي عبر /api/proxy/file
 * - تحافظ على الروابط المحلية/النسبية و data:/blob:
 */
export function directAccess(src: string | null | undefined): string {
  if (!src) return '';

  const raw = src.trim();
  const lower = raw.toLowerCase();

  // اترك الروابط المحلية والـ data/blob كما هي
  if (
    lower.startsWith('/') ||                // داخل public أو مسار نسبي
    lower.startsWith('data:') ||
    lower.startsWith('blob:')
  ) {
    return raw;
  }

  // ابنِ URL بقاعدة آمنة في SSR/CSR
  const base =
    typeof window !== 'undefined' && (window as any).location?.origin
      ? (window as any).location.origin
      : 'http://localhost';

  let u: URL;
  try {
    u = new URL(raw, base);
  } catch {
    // في حال مسار غير قابل للبارس، أعده كما هو
    return raw;
  }

  const host = (u.hostname || '').toLowerCase();

  // إن كان ضمن لائحة التخطي، حمّل مباشرة
  if (SKIP_DIRECT_HOSTS.some((d) => hostMatches(host, d))) {
    return u.toString();
  }

  // خلاف ذلك، مرّره عبر البروكسي
  return `/api/proxy/file?url=${encodeURIComponent(u.toString())}`;
}