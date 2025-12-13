
import { notFound } from 'next/navigation';
import { getDeveloperSummary } from '@/lib/unifiedDataService';
import { getDeveloperByKey } from '@/lib/data/store'; // Legacy store for metadata if available
import { tx } from '@/lib/i18n-utils';
import Image from 'next/image';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import CommunityCard from '@/components/CommunityCard';
import { Building2, MapPin, Award, TrendingUp, Home } from 'lucide-react';
import type { Locale, Project } from '@/lib/types';
import { path } from '@/lib/paths';

// ISR - Revalidate every 5 minutes
export const revalidate = 300;

interface DeveloperPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
  const { locale, slug } = await params;
  const isRTL = locale === 'ar';

  // Fetch Data
  const summary = await getDeveloperSummary(slug);

  // Try to get legacy metadata (Logo, Description)
  // If not found, we use safe defaults
  const legacyDeveloper = await getDeveloperByKey(slug).catch(() => null);

  const developerName = legacyDeveloper?.name?.[locale as Locale] || slug.charAt(0).toUpperCase() + slug.slice(1);
  const developerDesc = legacyDeveloper?.description?.[locale as Locale];
  const developerLogo = legacyDeveloper?.logoWhite;

  // If no data at all, 404
  if (summary.projects.length === 0 && summary.communities.length === 0 && !legacyDeveloper) {
    notFound();
  }

  // Map Projects to compatible format for ProjectCard
  const projects: Project[] = summary.projects.map((p: any) => ({
    ...p,
    projectName: p.name,
    heroImage: p.heroImage || p.extra?.hero_image || p.media?.[0] || '/images/hero-fallback.png',
    galleryImages: p.galleryImages || p.extra?.gallery_images || p.media || [],
    developer: p.developer || developerName,
    developerKey: slug, // explicit key matching the URL param
    // Ensure we have correct localized fields if possible, or fallback to string
    location: (p.location && typeof p.location === 'object' && 'city' in p.location)
      ? (p.location.city as string)
      : (p.location?.en || p.location?.ar || p.location || ''),
    description: p.description?.en || p.description?.ar || p.description,
    // Extra fields
    ...p.extra
  }));

  const communities = summary.communities;

  // Stats
  const stats = {
    totalProjects: summary.counts.projects,
    communities: summary.counts.communities,
    // We might not have status in new data, so we check extra or default to 0
    activeProjects: projects.filter(p => p.projectStatus === 'under_construction' || p.extra?.projectStatus === 'under_construction').length,
    completedProjects: projects.filter(p => p.projectStatus === 'completed' || p.extra?.projectStatus === 'completed').length,
  };

  // Helper for localized text
  const t = (obj: any): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const val = obj?.[locale as Locale] || obj?.en || '';
    if (typeof val === 'string') return val;
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/50 to-[#0a0f1a] z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${developerLogo || '/media/default-developer.jpg'})`,
            filter: 'blur(20px) brightness(0.5)',
          }}
        />

        <div className="relative z-20 h-full flex flex-col items-center justify-center px-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            {developerLogo && (
              <Image
                src={developerLogo}
                alt={developerName}
                width={200}
                height={80}
                className="object-contain mb-4"
              />
            )}
            <h1 className="text-5xl font-bold text-white text-center mb-4">
              {developerName}
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-2xl">
              {developerDesc || (isRTL
                ? `مطور عقاري رائد في دبي`
                : `Leading Real Estate Developer in Dubai`)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <Building2 className="w-10 h-10 text-gold-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.totalProjects}</div>
            <div className="text-gray-400">{isRTL ? 'إجمالي المشاريع' : 'Total Projects'}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <Home className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.communities}</div>
            <div className="text-gray-400">{isRTL ? 'المجتمعات' : 'Communities'}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.activeProjects > 0 ? stats.activeProjects : '-'}</div>
            <div className="text-gray-400">{isRTL ? 'قيد الإنشاء' : 'Under Construction'}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center">
            <Award className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">{stats.completedProjects > 0 ? stats.completedProjects : '-'}</div>
            <div className="text-gray-400">{isRTL ? 'مشاريع جاهزة' : 'Completed'}</div>
          </div>
        </div>

        {/* Communities Section */}
        {communities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gold-400 mb-6">
              {isRTL ? 'المجتمعات' : 'Communities'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((c: any) => (
                <CommunityCard
                  key={c.slug}
                  community={c}
                  developerSlug={slug}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gold-400">
              {isRTL ? 'جميع المشاريع' : 'All Projects'}
            </h2>
            <div className="text-gray-400">
              {projects.length} {isRTL ? 'مشروع' : 'projects'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={`${project.developer}-${project.slug}`}
                project={project}
              />
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href={path.developersHome(locale as Locale)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-lg transition-colors"
          >
            {isRTL ? 'عودة إلى المطورين' : 'Back to Developers'}
          </Link>
        </div>
      </div>
    </div>
  );
}
