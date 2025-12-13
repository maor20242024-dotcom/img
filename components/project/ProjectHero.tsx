"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import LuxuryButton from "@/components/ui/LuxuryButton";
import { directAccess } from "@/lib/contentful-utils";
// (Reverted) استخدم عنصر فيديو مباشر بدل LazyVideo

export default function ProjectHero({ project }: { project: any }) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'ar';
  const isRtl = locale === 'ar';
  // (Reverted) نستخدم <video> مباشرة كما كان سابقاً

  // عند فتح صفحة المشروع، لا نحمل أي هاش متبقٍ من التنقل السابق.
  // هذا يمنع التمرير التلقائي إلى أقسام مثل #tour3d عند الدخول من قائمة المشاريع.
  // (Reverted) لا نقوم بإزالة الهاش عند التحميل؛ نحافظ على سلوك الروابط العميقة.

  const goTo = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Update URL hash so section links are reflected in the address bar
      try {
        const clean = hash.startsWith('#') ? hash.slice(1) : hash;
        window.location.hash = clean;
      } catch (e) {
        // ignore
      }
    }
  };

  // Get project name from different possible fields
  const getProjectName = () => {
    if (typeof project.projectName === 'string') return project.projectName;
    if (typeof project.projectName === 'object' && project.projectName) {
      const localeKey = locale as string;
      return project.projectName[localeKey] || project.projectName.en || project.projectName.ar;
    }
    return project.name || project.title || 'Project';
  };

  // Get project description
  const getProjectDescription = () => {
    if (typeof project.description === 'string') return project.description;
    if (typeof project.description === 'object' && project.description) {
      const localeKey = locale as string;
      return project.description[localeKey] || project.description.en || project.description.ar;
    }
    return '';
  };

  // Get project location
  const getProjectLocation = () => {
    if (typeof project.location === 'string') return project.location;
    if (typeof project.location === 'object' && project.location) {
      const localeKey = locale as string;
      return project.location[localeKey] || project.location.en || project.location.ar;
    }
    return '';
  };

  const projectName = getProjectName();
  const projectDescription = getProjectDescription();
  const projectLocation = getProjectLocation();
  const hasVideo = !!project.videoLink;

  // Validate potential media src (http/https or local path)
  const isValidMediaSrc = (src?: string | null): src is string => {
    if (!src || typeof src !== 'string') return false;
    const trimmed = src.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('/')) return true;
    try {
      const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Validate potential image src to avoid invalid CSS url() fetch attempts
  const isValidSrc = (src?: string | null): src is string => {
    if (!src || typeof src !== 'string') return false;
    const trimmed = src.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('/')) return true;
    try {
      const u = new URL(trimmed);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const candidateHero: string | undefined = project.heroImage || project.image_hero || (project.galleryImages && project.galleryImages[0]) || (project.images_gallery && project.images_gallery[0]);
  const safeHeroImage = isValidSrc(candidateHero) ? candidateHero : undefined;
  const safeHeroImageProxied = safeHeroImage ? directAccess(safeHeroImage) : undefined;
  const safeVideoSrc = isValidMediaSrc(project.videoLink) ? directAccess(project.videoLink) : undefined;

  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background Media: always show image or gradient as base */}
      {safeHeroImageProxied ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${String(safeHeroImageProxied).replace(/"/g, '\\"')}")` }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]" />
      )}

      {/* (Reverted) استخدم فيديو خام بدل LazyVideo */}
      {hasVideo && safeVideoSrc && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={safeVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={safeHeroImageProxied || '/images/hero-fallback.png'}
        />
      )}

      {/* Golden Overlay - لا تعيق النقرات */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/40 via-transparent to-[#0a0f1a]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-white">
        {/* Project Name */}
        <h1 className={`luxury-title text-4xl md:text-6xl lg:text-7xl gold-gradient-static luxury-text-shadow mb-6 fade-in-up ${isRtl ? 'font-arabic' : 'font-display'}`}>
          {projectName}
        </h1>

        {/* Project Location */}
        {projectLocation && (
          <p className={`luxury-subtitle text-xl md:text-2xl text-gold/90 mb-4 fade-in-up ${isRtl ? 'font-arabic' : 'font-sans'}`} style={{ animationDelay: '0.2s' }}>
            📍 {projectLocation}
          </p>
        )}

        {/* Project Description */}
        {projectDescription && (
          <p className={`luxury-body text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 fade-in-up leading-relaxed ${isRtl ? 'font-arabic' : 'font-sans'}`} style={{ animationDelay: '0.4s' }}>
            {projectDescription.length > 200 ? `${projectDescription.substring(0, 200)}...` : projectDescription}
          </p>
        )}

        {/* Action Buttons */}
        <div className={`flex flex-wrap gap-4 justify-center fade-in-up ${isRtl ? 'flex-row-reverse' : ''}`} style={{ animationDelay: '0.6s' }}>
          {safeVideoSrc && (
            <LuxuryButton 
              variant="primary"
              size="lg"
              className={`rounded-full ${isRtl ? 'font-arabic' : 'font-sans'}`}
              onClick={() => goTo("#video")}
            >
              {isRtl ? '🎬 مشاهدة الفيديو' : '🎬 Watch Video'}
            </LuxuryButton>
          )}
          
          {project.brochurePdfLink && (
            <LuxuryButton 
              variant="outline"
              size="lg"
              className={`rounded-full ${isRtl ? 'font-arabic' : 'font-sans'}`}
              onClick={() => goTo("#docs")}
            >
              {isRtl ? '📥 عرض البروشور' : '📥 View Brochure'}
            </LuxuryButton>
          )}

          {((project.galleryImages && project.galleryImages.length > 0) || (project.images_gallery && project.images_gallery.length > 0)) && (
            <LuxuryButton 
              variant="outline"
              size="lg"
              className={`rounded-full ${isRtl ? 'font-arabic' : 'font-sans'}`}
              onClick={() => goTo("#gallery")}
            >
              {isRtl ? '🖼️ معرض الصور' : '🖼️ Gallery'}
            </LuxuryButton>
          )}

          {project['3D_TourLink'] && (
            <LuxuryButton 
              variant="outline"
              size="lg"
              className={`rounded-full ${isRtl ? 'font-arabic' : 'font-sans'}`}
              onClick={() => goTo("#tour3d")}
            >
              {isRtl ? '🏗️ جولة ثلاثية الأبعاد' : '🏗️ 3D Tour'}
            </LuxuryButton>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col items-center text-gold/60">
            <span className={`text-sm mb-2 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
              {isRtl ? 'اكتشف المزيد' : 'Discover More'}
            </span>
            <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gold/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated particles for luxury effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-gold rounded-full animate-ping-slow opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gold rounded-full animate-ping-medium opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-gold rounded-full animate-ping-fast opacity-20"></div>
      </div>
    </section>
  );
}
