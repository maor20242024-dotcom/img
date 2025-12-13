'use client';

import Link from 'next/link';
import { useState } from 'react';

interface CommunityCardProps {
  community: {
    slug: string;
    name: { en?: string; ar?: string } | string;
    description?: { en?: string; ar?: string } | string;
    heroImage?: string;
    media?: string[];
  };
  developerSlug: string;
  locale: string;
}

export default function CommunityCard({ community, developerSlug, locale }: CommunityCardProps) {
  const [imageError, setImageError] = useState(false);
  const isRTL = locale === 'ar';

  // Helper for localized text
  const t = (obj: any): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const val = obj?.[locale] || obj?.en || '';
    if (typeof val === 'string') return val;
    return '';
  };

  const imageSrc = imageError 
    ? '/images/hero-fallback.png' 
    : (community.heroImage || community.media?.[0] || '/images/hero-fallback.png');

  return (
    <Link
      href={`/${locale}/developers/${developerSlug}/communities/${community.slug}`}
      className="group relative h-64 rounded-xl overflow-hidden border border-white/10 hover:border-gold-400 transition-all"
    >
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={t(community.name)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/80 via-[#0a0f1a]/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{t(community.name)}</h3>
        <p className="text-white/70 text-sm line-clamp-2">{t(community.description)}</p>
      </div>
    </Link>
  );
}
