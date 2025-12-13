'use client';

import { directAccess } from '@/lib/contentful-utils';
import { useEffect, useMemo, useState } from 'react';
import LazyVideo from '@/components/ui/LazyVideo';

type Slide = {
  videoLink: string;
  developer?: string;
  title?: string;
  fallbackImage?: string;
};

export default function OrbitCarousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);

  // Memoize slides to prevent unnecessary re-renders
  const memoizedSlides = useMemo(() => slides || [], [slides]);

  // Auto-advance carousel with cleanup
  useEffect(() => {
    if (!memoizedSlides.length) return;
    
    const id = setInterval(() => {
      setActive((prevActive) => (prevActive + 1) % memoizedSlides.length);
    }, 8000);
    setIntervalRef(id);

    return () => {
      if (id) clearInterval(id);
    };
  }, [memoizedSlides.length]);

  // Reset auto-advance timer on manual change
  useEffect(() => {
    if (!memoizedSlides.length) return;
    if (intervalRef) {
      clearInterval(intervalRef);
      const id = setInterval(() => {
        setActive((prevActive) => (prevActive + 1) % memoizedSlides.length);
      }, 8000);
      setIntervalRef(id);
    }
  }, [active, memoizedSlides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0f1a]">
      {/* إطار ذهبي أنيق حول الكاروسيل */}
      <div className="absolute inset-0 border-4 border-gold/40 rounded-3xl shadow-2xl shadow-gold/20 z-10 pointer-events-none"></div>
      {/* تأثير توهج ذهبي */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10 animate-pulse-slow z-5 pointer-events-none"></div>
      
      {/* Render only the active slide to avoid loading all videos at once */}
      {memoizedSlides[active] && (
        <div
          key={`slide-${active}`}
          className={"absolute inset-0 transition-opacity duration-1000 will-change-[opacity] opacity-100"}
        >
          {/* إطار ذهبي داخلي حول الفيديو */}
          <div className="absolute inset-4 border-2 border-gold/60 rounded-2xl shadow-lg shadow-gold/30 z-10 pointer-events-none"></div>
          <LazyVideo
            src={directAccess(memoizedSlides[active].videoLink)}
            poster={directAccess(memoizedSlides[active].fallbackImage) || '/images/hero-fallback.png'}
            autoPlay
            loop
            muted
            controls={false}
            className="w-full h-full object-cover rounded-xl"
            alt={memoizedSlides[active].title || 'Project video'}
          />
        </div>
      )}

      {/* Content overlay with improved animations */}
      <div className="absolute bottom-24 left-16 text-amber-100 max-w-lg">
        <div 
          key={`content-${active}`}
          className="animate-fadeInUp"
        >
          <p className="text-sm mb-2 opacity-80 transition-all duration-500">
            {memoizedSlides[active]?.developer}
          </p>
          <h2 className="text-5xl font-amiri font-bold leading-tight transition-all duration-500">
            {memoizedSlides[active]?.title}
          </h2>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {memoizedSlides.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setActive(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === active 
                ? 'bg-amber-400 scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/70 via-[#0a0f1a]/30 to-transparent pointer-events-none" />
    </div>
  );
}
