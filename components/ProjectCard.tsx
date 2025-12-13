'use client';
import LuxuryButton from '@/components/ui/LuxuryButton';
import SafeImage from '@/components/ui/SafeImage';
import { useCompare } from '@/lib/compare';
import { useFavorites } from '@/lib/favorites';
import { formatAED, formatArea, formatBedrooms } from '@/lib/format';
import { useLocale } from '@/lib/i18n-client';
import { t, tx } from '@/lib/i18n-utils';
import { path } from '@/lib/paths';
import type { Project } from '@/lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Route } from 'next';
import { useState } from 'react';

// Validate URL is actually a URL
const isValidImageUrl = (url: any): url is string => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/');
};

type Props = { project: Project };

export default function ProjectCard({ project }: Props) {
  const locale = useLocale();

  // Safe data extraction with fallbacks
  const title =
    t(project?.projectName, locale) ||
    project?.slug ||
    (locale === 'ar' ? 'مشروع غير محدد' : 'Unnamed Project');

  const subtitle =
    tx(project?.area, locale) ||
    tx(project?.location, locale) ||
    tx(project?.city, locale) ||
    '';

  // Get first valid image URL
  const candidates = [
    project?.heroImage, 
    project?.image_hero, 
    project?.galleryImages?.[0], 
    project?.images_gallery?.[0]
  ];
  const img = candidates.find(isValidImageUrl) || '/images/hero-fallback.png';

  // Safe price calculation
  const hasMinPrice = project?.minPriceAED && project.minPriceAED > 0;
  const hasMaxPrice = project?.maxPriceAED && project.maxPriceAED > 0;

  const price =
    hasMinPrice &&
    hasMaxPrice &&
    project.maxPriceAED &&
    project.minPriceAED &&
    project.maxPriceAED > project.minPriceAED
      ? `${formatAED(project.minPriceAED, locale)} – ${formatAED(project.maxPriceAED, locale)}`
      : hasMinPrice && project.minPriceAED
      ? formatAED(project.minPriceAED, locale)
      : hasMaxPrice && project.maxPriceAED
      ? formatAED(project.maxPriceAED, locale)
      : null;

  // Safe area calculation
  const hasAreaSqmt =
    (project?.minAreaSqmt && project.minAreaSqmt > 0) ||
    (project?.maxAreaSqmt && project.maxAreaSqmt > 0);

  const hasAreaSqft =
    (project?.minAreaSqft && project.minAreaSqft > 0) ||
    (project?.maxAreaSqft && project.maxAreaSqft > 0);

  const area = hasAreaSqmt
    ? formatArea(project.minAreaSqmt, project.maxAreaSqmt, 'sqm', locale)
    : hasAreaSqft
    ? formatArea(project.minAreaSqft, project.maxAreaSqft, 'sqft', locale)
    : null;

  // Safe bedrooms formatting
  const bedrooms = project?.bedrooms ? formatBedrooms(project.bedrooms, locale) : null;

  const loc = (locale || 'ar') as 'ar' | 'en';
  const slug = (project?.slug && String(project.slug).trim()) ||
    (t(project?.projectName, locale)?.toString().trim().toLowerCase()
      .replace(/\s+/g, '-').replace(/[^a-z0-9\-]+/g, '') ?? '');
  const developerKey = (project?.developer && String(project.developer).trim().toLowerCase()) ||
                       (project?.developerKey && String(project.developerKey).trim().toLowerCase()) ||
                       'emaar';

  const href = slug && developerKey
    ? (path.project(loc, developerKey, slug) as Route)
    : (path.projectsHome(loc) as Route);

  const favorites = useFavorites();
  const compare = useCompare();
  const isCompared = compare.ids.includes(project.id || project.slug);

  // Simplified state
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      {...({
        whileHover: { y: -4 },
        transition: { duration: 0.2, ease: 'easeOut' },
        onHoverStart: () => setIsHovered(true),
        onHoverEnd: () => setIsHovered(false),
        className:
          'group relative flex flex-col justify-between rounded-xl md:rounded-2xl overflow-hidden border border-gold/30 bg-[#0a0f1a]/90 hover:shadow-[0_0_20px_rgba(107,90,43,0.2)] hover:border-gold-800 transition-all duration-700 opacity-0 animate-fade-in h-auto md:h-[520px]',
      } as any)}
    >
      {/* رابط يغطي البطاقة كاملة للفتح الفوري */}
      <Link href={href} prefetch={false} className="absolute inset-0 z-20" aria-label={title} />

      {/* Simple glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="block relative overflow-hidden">
        <div className="relative h-40 sm:h-44 w-full overflow-hidden">
          {img ? (
            <>
              <SafeImage
                src={img}
                alt={title}
                width={400}
                height={176}
                className="h-40 sm:h-44 w-full object-cover transition-all duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                quality={85}
              />
              {/* Simple overlay effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                style={{ filter: isHovered ? 'brightness(1.1)' : 'brightness(1)' }}
              />
            </>
          ) : (
            <div className="h-40 sm:h-44 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
              <div className="text-gold/30 text-4xl">🏢</div>
            </div>
          )}
        </div>
      </div>

      {/* Simplified floating buttons */}
      <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1.5 md:gap-2 z-30">
        {project?.goldenVisaEligible ? (
          <span className="text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-gold/30 text-gold border border-gold/40 shadow backdrop-blur-sm">
            {locale === 'ar' ? 'تأشيرة ذهبية' : 'Golden Visa'}
          </span>
        ) : null}

        <LuxuryButton
          aria-label="favorite"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); favorites.toggle(project.id || project.slug); }}
          variant={favorites.has(project.id || project.slug) ? 'secondary' : 'outline'}
          size="sm"
          className="!h-8 !w-8 md:!h-9 md:!w-9 !p-0 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-200 relative"
        >
          <span style={{ color: favorites.has(project.id || project.slug) ? '#FFD700' : '#D4AF37', fontSize: '14px' }}>
            ★
          </span>
        </LuxuryButton>

        <LuxuryButton
          aria-label="compare"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            isCompared ? compare.remove(project.id || project.slug) : compare.add(project.id || project.slug);
          }}
          variant={isCompared ? 'secondary' : 'outline'}
          size="sm"
          className="!h-8 !w-8 md:!h-9 md:!w-9 !p-0 rounded-full backdrop-blur-sm hover:scale-105 transition-transform duration-200 relative"
        >
          <span style={{ color: isCompared ? '#FFD700' : '#D4AF37', fontSize: '12px' }}>⚖️</span>
        </LuxuryButton>
      </div>

      <div className="flex flex-col justify-between h-auto md:h-[calc(100%-11rem)] p-3 md:p-4 relative z-10 pointer-events-none">
        <div>
          <h3
            className={`luxury-title text-base md:text-lg gold-gradient-static luxury-text-shadow leading-snug line-clamp-2 transition-colors duration-200 ${
              locale === 'ar' ? 'font-arabic' : 'font-display'
            }`}
          >
            {title}
          </h3>
          <p className={`mt-1 text-xs text-gray-400 line-clamp-1 ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
            {subtitle}
          </p>
          <p
            className={`mt-2 md:mt-3 text-xs md:text-sm text-gray-300 line-clamp-2 ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}
          >
            {String(t(project.summary, locale) || t(project.description, locale) || '').slice(0, 140)}
          </p>
        </div>

        <div>
          {/* Only show stats grid if we have at least one piece of data */}
          {(price || area || bedrooms) && (
            <div
              className={`mt-3 md:mt-4 grid gap-1.5 md:gap-2 text-xs ${
                [price, area, bedrooms].filter(Boolean).length === 1
                  ? 'grid-cols-1'
                  : [price, area, bedrooms].filter(Boolean).length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {price && (
                <div className="rounded-md md:rounded-lg bg-zinc-900/70 px-2 md:px-3 py-1.5 md:py-2 border border-zinc-700/50 hover:border-gold/30 hover:bg-white/5 transition-all duration-200">
                  <div className="text-[9px] md:text-[10px] text-gray-400">{locale === 'ar' ? 'السعر' : 'Price'}</div>
                  <div className="font-semibold text-white/90 text-[10px] md:text-xs truncate">{price}</div>
                </div>
              )}
              {area && (
                <div className="rounded-md md:rounded-lg bg-zinc-900/70 px-2 md:px-3 py-1.5 md:py-2 border border-zinc-700/50 hover:border-gold/30 hover:bg-white/5 transition-all duration-200">
                  <div className="text-[9px] md:text-[10px] text-gray-400">{locale === 'ar' ? 'المساحة' : 'Area'}</div>
                  <div className="font-semibold text-white/90 text-[10px] md:text-xs truncate">{area}</div>
                </div>
              )}
              {bedrooms && (
                <div className="rounded-md md:rounded-lg bg-zinc-900/70 px-2 md:px-3 py-1.5 md:py-2 border border-zinc-700/50 hover:border-gold/30 hover:bg-white/5 transition-all duration-200">
                  <div className="text-[9px] md:text-[10px] text-gray-400">{locale === 'ar' ? 'الغرف' : 'Bedrooms'}</div>
                  <div className="font-semibold text-white/90 text-[10px] md:text-xs">{bedrooms}</div>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 md:mt-4 block pointer-events-auto relative z-30">
            <LuxuryButton
              variant="primary"
              size="md"
              fullWidth
              className={`${locale === 'ar' ? 'font-arabic' : 'font-sans'} text-sm md:text-base hover:scale-[1.02] transition-transform duration-200`}
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = href;
              }}
            >
              {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
            </LuxuryButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}