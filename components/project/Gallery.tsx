'use client';
import { useState } from 'react';
import { directAccess } from '@/lib/contentful-utils';
import { useLocale } from '@/lib/i18n-client';
import LuxuryButton from "@/components/ui/LuxuryButton";

export default function Gallery({ images, title }:{ images:string[]; title:string }){
  const [open, setOpen] = useState(false);
  const [curr, setCurr] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const locale = useLocale();
  const isAr = locale === 'ar';
  
  if (!images?.length) return null;
  
  // Filter valid URLs and proxy them
  const validImages = images.filter(url => url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('/')));
  if (validImages.length === 0) return null;
  
  const proxied = validImages.map(u => u.startsWith('/') ? u : directAccess(u));
  const displayImages = showAll ? proxied : proxied.slice(0, 6);
  const hasMoreImages = proxied.length > 6;
  
  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set(prev).add(index));
  };
  
  const openLightbox = (index: number) => {
    // Get the actual index in the full proxied array
    const actualIndex = showAll ? index : index;
    setCurr(actualIndex);
    setOpen(true);
  };
  
  return (<>
    {/* Grid: 2 columns on mobile, 3 columns on tablet+ */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {displayImages.map((src, i) => (
        !failedImages.has(i) && (
          <button 
            key={i} 
            onClick={() => openLightbox(i)} 
            className="relative group aspect-[4/3] overflow-hidden rounded-lg border border-gold/20 hover:border-gold/50 transition-all"
          >
            <img 
              src={src} 
              alt={`${title} - ${i + 1}`} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => handleImageError(i)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Show overlay on last visible image if there are more */}
            {!showAll && hasMoreImages && i === 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{proxied.length - 6}</span>
              </div>
            )}
          </button>
        )
      ))}
    </div>
    
    {/* Show "more images" button if there are more than 6 */}
    {hasMoreImages && (
      <div className="text-center mt-4">
        <LuxuryButton
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="px-6"
        >
          {showAll 
            ? (isAr ? 'عرض أقل' : 'Show Less') 
            : (isAr ? `عرض جميع الصور (${proxied.length})` : `View All Images (${proxied.length})`)}
        </LuxuryButton>
      </div>
    )}
    
    {/* Lightbox Modal */}
    {open && (
      <div className="fixed inset-0 z-[1000] bg-[#0a0f1a]/95 flex items-center justify-center">
        <LuxuryButton 
          variant="outline" 
          size="sm" 
          onClick={() => setOpen(false)} 
          className="absolute top-4 right-4 w-10 h-10 rounded-full p-0 flex items-center justify-center z-10"
        >
          ✕
        </LuxuryButton>
        <LuxuryButton 
          variant="outline" 
          size="sm" 
          onClick={() => setCurr((curr - 1 + proxied.length) % proxied.length)} 
          className="absolute left-4 w-12 h-12 rounded-full p-0 flex items-center justify-center text-2xl z-10"
        >
          ‹
        </LuxuryButton>
        <img 
          src={proxied[curr]} 
          alt={`${title} - ${curr + 1}`}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg border border-gold/30"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-fallback.png'; }}
        />
        <LuxuryButton 
          variant="outline" 
          size="sm" 
          onClick={() => setCurr((curr + 1) % proxied.length)} 
          className="absolute right-4 w-12 h-12 rounded-full p-0 flex items-center justify-center text-2xl z-10"
        >
          ›
        </LuxuryButton>
        <div className="absolute bottom-4 text-gray-400 text-sm">
          {curr + 1} / {proxied.length}
        </div>
      </div>
    )}
  </>);
}
