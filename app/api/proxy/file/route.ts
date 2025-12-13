import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ISR/Streaming متوافق

// نطاقات يجب تخطّي البروكسي لها (تحميل مباشر فقط)
const SKIP_DOMAINS = [
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

  // Video Platforms
  'www.youtube.com',
  'youtu.be',
  'player.vimeo.com',

  // Google Maps Embed
  'www.google.com',
  'maps.google.com',

  // Document Hosts
  'dubaiholding.box.com',
  'www.scribd.com',
];

// تطابق آمن: الدومين نفسه أو أي تحت-دومين
function hostMatches(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

function shouldSkipProxy(host: string) {
  return SKIP_DOMAINS.some((d) => hostMatches(host, d));
}

// حظر أهداف خطيرة (مانع SSRF بسيط)
function isBlockedTarget(url: URL) {
  const h = (url.hostname || '').toLowerCase();
  // حظر localhost و IPs داخلية
  if (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '::1' ||
    /^10\.\d+\.\d+\.\d+$/.test(h) ||
    /^192\.168\.\d+\.\d+$/.test(h) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(h)
  ) {
    return true;
  }
  // بروتوكولات غير http/https
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return true;
  return false;
}

async function proxy(method: 'GET'|'HEAD', req: Request) {
  const urlParam = new URL(req.url).searchParams.get('url');
  if (!urlParam) {
    return new NextResponse('Bad Request: missing ?url', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    return new NextResponse('Bad Request: invalid url', { status: 400 });
  }

  if (isBlockedTarget(target)) {
    return new NextResponse('Forbidden target', { status: 403 });
  }

  // ✅ للنطاقات الموثوقة: نجلب المحتوى بدلاً من redirect (أمان أفضل + CORS)
  // لن نستخدم redirect لتجنب Open Redirect vulnerability
  // نقوم بالـ proxy لجميع الطلبات مع التخزين المؤقت المناسب

  // جهّز طلب upstream
  const incoming = new Headers(req.headers);
  // لا نمرر الكوكيز للأمان
  incoming.delete('cookie');

  // Range لوسائط الفيديو/الملفات
  const rangeHeader = req.headers.get('range');
  const headers: HeadersInit = {
    // هيدرات مفيدة، مع المحافظة على Accept/Range لو موجودة
    'Accept': incoming.get('accept') || '*/*',
    ...(rangeHeader ? { 'Range': rangeHeader } : {}),
    // تحييد UA إن لزم
    'User-Agent':
      incoming.get('user-agent') ||
      'ImperiumGateProxy/1.0 (+https://imperium-gate.local)',
  };

  const upstream = await fetch(target.toString(), {
    method,
    headers,
    redirect: 'follow',
    // no credentials forward
  });

  // انسخ الهيدرات المهمة
  const outHeaders = new Headers();
  // المحتوى
  const ct = upstream.headers.get('content-type');
  if (ct) outHeaders.set('content-type', ct);
  const cl = upstream.headers.get('content-length');
  if (cl) outHeaders.set('content-length', cl);
  const cd = upstream.headers.get('content-disposition');
  if (cd) outHeaders.set('content-disposition', cd);
  // كاش بسيط (يمكن تعديل القيم)
  outHeaders.set('cache-control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=60');

  // CORS (ليس ضروري داخليًا، لكنه لا يضر)
  outHeaders.set('access-control-allow-origin', '*');

  // حالة upstream (200/206/…)
  const status = upstream.status;

  if (method === 'HEAD') {
    return new NextResponse(null, { status, headers: outHeaders });
  }

  // stream body
  return new NextResponse(upstream.body, { status, headers: outHeaders });
}

export async function GET(req: Request) {
  return proxy('GET', req);
}

export async function HEAD(req: Request) {
  return proxy('HEAD', req);
}