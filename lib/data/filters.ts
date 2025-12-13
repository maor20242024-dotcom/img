import type { Locale, Project } from './schema';

// مفاتيح مسموح بها
export const DEV_KEYS = new Set(['emaar', 'damac', 'nakheel', 'sobha', 'binghatti']);

export const normKey = (v?: string) =>
  String(v ?? '').trim().toLowerCase().replace(/\s+/g, '-');

export const getSlug = (p: Project, l: Locale) =>
  String(p?.slugs?.[l] ?? p?.slugs?.en ?? '').trim();

export const isValidProject = (p: any): p is Project => {
  const dev = normKey(p?.developerKey);
  const en = p?.slugs?.en;
  const ar = p?.slugs?.ar;
  return !!dev && DEV_KEYS.has(dev) && !!en && !!ar;
};

// لا تسقط مشروعًا بسبب نقص صور/أصول. placeholders تتكفّل.
export function selectProjects(rows: any[]): Project[] {
  const idSeen = new Set<string>();
  const out: Project[] = [];
  for (const r of rows ?? []) {
    if (!isValidProject(r)) continue;
    const id = String(r.id || `${r.developerKey}:${r.slugs.en}`);
    if (idSeen.has(id)) continue;
    idSeen.add(id);
    out.push({
      ...r,
      developerKey: normKey(r.developerKey) as Project['developerKey'],
      community: r.community?.key
        ? {
            key: normKey(r.community.key),
            slugs: r.community.slugs ?? { en: r.community.key, ar: r.community.key },
          }
        : undefined,
    });
  }
  return out;
}

// معايير موحّدة للفلترة
export type ProjectCriteria = {
  locale: Locale;
  developerKey?: string; // emmar... إلخ
  projectSlug?: string; // slug مطابق للغة
  communityKey?: string;
  status?: 'under_construction' | 'completed';
  bedrooms?: number[];
  priceMin?: number; // AED
  priceMax?: number;
  tags?: string[];
  city?: string;
};

// فلترة متسامحة + تطبيع قبل المقارنة
export function filterProjects(all: Project[], c: ProjectCriteria): Project[] {
  const l = c.locale;
  const dev = c.developerKey ? normKey(c.developerKey) : undefined;
  const com = c.communityKey ? normKey(c.communityKey) : undefined;
  const city = c.city ? normKey(c.city) : undefined;
  const slug = c.projectSlug ? String(c.projectSlug).trim() : undefined;

  return all.filter(p => {
    if (dev && normKey(p.developerKey) !== dev) return false;
    if (slug && getSlug(p, l) !== slug) return false;
    if (com && normKey(p.community?.key) !== com) return false;
    if (c.status && p.status && p.status !== c.status) return false;
    if (Array.isArray(c.bedrooms) && c.bedrooms.length > 0) {
      const ok = (p.bedrooms ?? []).some(b => c.bedrooms!.includes(b));
      if (!ok) return false;
    }
    if (typeof c.priceMin === 'number') {
      const min = p.priceRangeAED?.min ?? Number.POSITIVE_INFINITY;
      if (min < 0) return true; // متسامح
      if ((p.priceRangeAED?.max ?? min) < c.priceMin!) return false;
    }
    if (typeof c.priceMax === 'number') {
      const max = p.priceRangeAED?.max ?? Number.POSITIVE_INFINITY;
      if (max !== Number.POSITIVE_INFINITY && max > c.priceMax!) return false;
    }
    if (Array.isArray(c.tags) && c.tags.length > 0) {
      const tags = (p.tags ?? []).map(normKey);
      const want = c.tags.map(normKey);
      const hit = want.every(t => tags.includes(t));
      if (!hit) return false;
    }
    if (city) {
      const pcity = normKey(p.location?.city);
      if (pcity && pcity !== city) return false;
    }
    return true;
  });
}

// فرز ثابت: أولوية المدينة/المطور ثم السعر الأدنى ثم الاسم
export function sortProjects(rows: Project[], l: Locale): Project[] {
  return [...rows].sort((a, b) => {
    const ac = normKey(a.location?.city);
    const bc = normKey(b.location?.city);
    if (ac !== bc) return ac < bc ? -1 : 1;
    if (a.developerKey !== b.developerKey) return a.developerKey < b.developerKey ? -1 : 1;
    const amin = a.priceRangeAED?.min ?? Number.MAX_SAFE_INTEGER;
    const bmin = b.priceRangeAED?.min ?? Number.MAX_SAFE_INTEGER;
    if (amin !== bmin) return amin - bmin;
    const an = (a.names?.[l] ?? a.names?.en ?? '').toLowerCase();
    const bn = (b.names?.[l] ?? b.names?.en ?? '').toLowerCase();
    return an.localeCompare(bn, l === 'ar' ? 'ar' : 'en');
  });
}

// Related: مجتمع → مطوّر → مدينة
export function relatedProjects(seed: Project, pool: Project[], l: Locale, limit = 6): Project[] {
  const com = normKey(seed.community?.key);
  const dev = normKey(seed.developerKey);
  const city = normKey(seed.location?.city);

  const byCom = com ? pool.filter(p => normKey(p.community?.key) === com && getSlug(p, l) !== getSlug(seed, l)) : [];
  const byDev = pool.filter(p => normKey(p.developerKey) === dev && getSlug(p, l) !== getSlug(seed, l));
  const byCity = city ? pool.filter(p => normKey(p.location?.city) === city && getSlug(p, l) !== getSlug(seed, l)) : [];

  const out: Project[] = [];
  const seen = new Set<string>();
  const push = (arr: Project[]) => {
    for (const p of arr) {
      const key = `${p.developerKey}:${getSlug(p, l)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
      if (out.length >= limit) return;
    }
  };
  push(byCom);
  if (out.length < limit) push(byDev);
  if (out.length < limit) push(byCity);
  return sortProjects(out, l).slice(0, limit);
}
