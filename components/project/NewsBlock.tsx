import type { NewsItem, Locale } from '@/lib/types';

// Server-side translation helper
function translateText(v?: { ar?: string; en?: string } | string, locale: Locale = 'ar'): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v[locale] || v.en || v.ar || '';
}

export default function NewsBlock({
  news,
  locale = 'ar'
}: {
  news: NewsItem[];
  locale: Locale
}) {
  if (!Array.isArray(news) || !news.length) return null;

  return (
    <div className="grid gap-4">
      {news.map((n, i) => (
        <a
          key={i}
          href={n.url || '#'}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg border border-gold/20 p-4 bg-black/40 hover:shadow-gold transition"
        >
          <div className="text-gold font-semibold">
            {translateText(n.title as any, locale)}
          </div>
          {n.source || n.date ? (
            <div className="text-xs text-zinc-400 mt-1">
              {[n.source, n.date].filter(Boolean).join(' • ')}
            </div>
          ) : null}
        </a>
      ))}
    </div>
  );
}