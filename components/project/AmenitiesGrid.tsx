import { type Locale } from '@/lib/i18n-utils';

// Server-side translation helper
function translateText(v?: {ar?:string; en?:string} | string, locale: Locale = 'ar'): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v[locale] || v.en || v.ar || '';
}

export default function AmenitiesGrid({ 
  amenities, 
  locale = 'ar' 
}: { 
  amenities: any[]; 
  locale?: 'ar' | 'en' 
}) {
  // Ensure amenities is an array
  const safeAmenities = Array.isArray(amenities) ? amenities : [];
  
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {safeAmenities.map((a, i) => (
        <div key={i} className="rounded-xl border border-gold/20 p-4 bg-black/50">
          <div className="text-gold font-semibold">
            {translateText(a.name, locale)}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {translateText(a.description, locale)}
          </div>
        </div>
      ))}
    </div>
  );
}