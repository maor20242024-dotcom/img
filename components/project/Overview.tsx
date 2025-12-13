import { type Locale } from '@/lib/i18n-utils';

// Server-side translation helper
function translateText(v?: {ar?:string; en?:string} | string, locale: Locale = 'ar'): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v[locale] || v.en || v.ar || '';
}

export default function Overview({ 
  project, 
  locale = 'ar' 
}: { 
  project: any; 
  locale?: 'ar' | 'en' 
}) {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-gold">
        {translateText(project.projectName, locale) || project.slug}
      </h2>
      <p className="mt-4 text-gray-300 whitespace-pre-wrap">
        {translateText(project.description, locale) || translateText(project.summary, locale)}
      </p>
    </div>
  );
}
