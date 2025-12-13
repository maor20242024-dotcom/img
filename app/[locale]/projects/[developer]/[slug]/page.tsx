
import AmenitiesGrid from '@/components/project/AmenitiesGrid';
import ContactBlock from '@/components/project/ContactBlock';
import DocsBlock from '@/components/project/DocsBlock';
import Gallery from '@/components/project/Gallery';
import Insights from '@/components/project/Insights';
import KeyStats from '@/components/project/KeyStats';
import NewsBlock from '@/components/project/NewsBlock';
import Overview from '@/components/project/Overview';
import ProjectHero from '@/components/project/ProjectHero';
import ProjectNotFound from '@/components/project/ProjectNotFound';
import RelatedCarousel from '@/components/project/RelatedCarousel';
import SectionNav from '@/components/project/SectionNav';
import ProjectLocationMapWrapper from '@/components/project/ProjectLocationMapWrapper';
import ThreeDTourButton from '@/components/project/3DTourButton';
import VideoBlock from '@/components/project/VideoBlock';
import ROICalculator from '@/components/ui/ROICalculator';
import { deriveProjectLatLon } from '@/lib/geo';
import { type Locale } from '@/lib/i18n-utils';
import type { Project } from '@/lib/types';
import { 
  getProjectsByDeveloper, 
  getProjectBySlug, 
  listDevelopers 
} from '@/lib/unifiedDataService';
import { notFound } from 'next/navigation';

// ISR - Revalidate every 5 minutes for optimal performance
export const revalidate = 300;

// Helper to handle translation objects or strings safely
// Helper to handle translation objects or strings safely
function translateText(
  v?: { ar?: string; en?: string } | string | { city?: string },
  locale: Locale = 'ar'
): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if ('city' in v) return v.city || '';
  return (v as any)[locale] || (v as any).en || (v as any).ar || '';
}

export async function generateStaticParams() {
  const devList = await listDevelopers();
  const params: any[] = [];

  for (const { developer } of devList) {
    const projects = await getProjectsByDeveloper(developer);
    for (const p of projects) {
      params.push({ locale: 'ar', developer, slug: p.slug });
      params.push({ locale: 'en', developer, slug: p.slug });
    }
  }
  return params;
}

export default async function ProjectDetail({ params }: { params: Promise<{ locale: Locale; developer: string; slug: string }> }) {
  const { locale = 'ar', developer, slug } = await params;

  // Fetch using unified data service directly
  const unifiedProject = await getProjectBySlug(developer, slug);

  if (!unifiedProject) {
    // Fallback or 404. Since we are fully migrating, 404 is appropriate if not found in new data.
    // But preserving specific Not Found UI is good.
    return <ProjectNotFound developer={developer} slug={slug} developerProjects={[]} otherProjects={[]} />;
  }

  // Map Unified Data to Legacy Project Interface for backward compatibility with components
  // unifiedProject.extra contains the fields from the original JSON (amenities, etc)
  const legacyProject: Project = {
    ...unifiedProject, // Spread all unified fields first
    ...unifiedProject.extra, // Spread extra next (if needed) to override or ensure compatibility
    slug: unifiedProject.slug,
    developer: unifiedProject.developer,
    developerKey: developer, // important for links
    projectName: unifiedProject.name || unifiedProject.projectName || 'Project',
    // Map media to legacy fields - fix to use correct field names
    heroImage: unifiedProject.heroImage || (unifiedProject as any).image_hero || unifiedProject.extra?.heroImage || unifiedProject.extra?.image_hero,
    galleryImages: unifiedProject.galleryImages || (unifiedProject as any).images_gallery || unifiedProject.extra?.galleryImages || unifiedProject.extra?.images_gallery || [],
    // Ensure description is handled
    description: unifiedProject.description || unifiedProject.extra?.description,
    // Location
    location: unifiedProject.location || unifiedProject.extra?.location,
  };

  // Derive helpers
  const { lat, lon } = deriveProjectLatLon(legacyProject);
  const galleryImages: string[] = legacyProject.galleryImages ?? [];
  const hasGallery = galleryImages.length > 0;
  const has3D = !!(
    legacyProject.assets?.tour3d?.matterport ||
    legacyProject.assets?.tour3d?.propvr ||
    legacyProject['3D_TourLink'] ||
    legacyProject.extra?.['3D_TourLink']
  );
  const hasVideo = !!(legacyProject.hero?.type === 'video' || legacyProject.videoLink || (unifiedProject.hero_prefer === 'video'));

  const brochure = legacyProject.assets?.brochure?.[locale] || legacyProject.brochurePdfLink || legacyProject.brochure_url || legacyProject.extra?.brochurePdfLink || legacyProject.extra?.brochure_url;
  const hasPDF = !!brochure;

  const hasAmenities = !!legacyProject.amenities?.length;
  const hasInsights = !!legacyProject.insights;
  const hasNews = Array.isArray(legacyProject.news) && legacyProject.news.length > 0;
  const hasContact = !!legacyProject.contact;

  // Fetch Related Projects (Same Developer)
  const allDevProjects = await getProjectsByDeveloper(developer);
  const related = allDevProjects
    .filter(p => p.slug !== slug) // Exclude current
    .slice(0, 9); // Take up to 9 related projects

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] text-light">
      <ProjectHero project={legacyProject} />
      <div className="max-w-6xl mx-auto px-6">
        <KeyStats project={legacyProject} locale={locale} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <ROICalculator project={legacyProject} locale={locale} />
      </div>

      {/* Future Units Section Placeholder */}
      <div id="units" className="max-w-6xl mx-auto px-6 py-8 hidden">
        {/*
          TODO: This section will be populated with Unit information in the future.
          For now, it is hidden or can be used to display a 'Coming Soon' message if desired.
          Structure:
          - Unit Types List
          - Floor Plans
          - Availability Status
        */}
      </div>

      <SectionNav project={legacyProject} locale={locale} />

      <div id="overview" className="max-w-6xl mx-auto px-6 py-16">
        <Overview project={legacyProject} locale={locale} />
      </div>

      {hasGallery && (
        <div id="gallery" className="max-w-6xl mx-auto px-6 py-16">
          <Gallery
            images={galleryImages}
            title={
              translateText(legacyProject.projectName, locale) || legacyProject.slug
            }
          />
        </div>
      )}

      {has3D && (
        <div id="tour3d" className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gold mb-4">
              {locale === 'ar' ? '🏛️ جولة افتراضية' : '🏛️ Virtual Tour'}
            </h2>
            <p className="text-gray-400">
              {locale === 'ar'
                ? 'استكشف المشروع بتقنية 360 درجة'
                : 'Explore the project in 360°'
              }
            </p>
          </div>
          <ThreeDTourButton
            tourUrl={
              legacyProject.assets?.tour3d?.matterport ||
              legacyProject.assets?.tour3d?.propvr ||
              legacyProject['3D_TourLink'] ||
              legacyProject.extra?.['3D_TourLink']
            }
            projectName={
              translateText(legacyProject.projectName, locale) || legacyProject.slug
            }
            locale={locale}
          />
        </div>
      )}

      {hasVideo && (
        <div id="video" className="max-w-6xl mx-auto px-6 py-16">
          <VideoBlock
            src={legacyProject.hero?.src || legacyProject.videoLink || (unifiedProject.media && unifiedProject.media[0] ? unifiedProject.media[0] : '')}
            poster={
              legacyProject.hero?.poster ||
              legacyProject.heroImage ||
              legacyProject.galleryImages?.[0] ||
              galleryImages[0]
            }
          />
        </div>
      )}

      <div id="map" className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {locale === 'ar' ? '📍 الموقع' : '📍 Location'}
          </h2>
          <p className="text-gray-600 text-sm">
            {locale === 'ar'
              ? 'موقع المشروع على الخريطة'
              : 'Project location on the map'
            }
          </p>
        </div>
        <ProjectLocationMapWrapper
          latitude={lat ?? undefined}
          longitude={lon ?? undefined}
          title={translateText(legacyProject.projectName, locale) || legacyProject.slug}
          locationText={translateText(legacyProject.location, locale)}
          height="400px"
        />
      </div>

      {hasAmenities && (
        <div id="amenities" className="max-w-6xl mx-auto px-6 py-16">
          <AmenitiesGrid amenities={legacyProject.amenities!} locale={locale} />
        </div>
      )}

      <div id="docs" className="max-w-6xl mx-auto px-6 py-16">
        {(hasPDF || hasGallery) && (
          <DocsBlock
            brochureUrl={brochure}
            galleryImages={galleryImages}
            projectName={
              translateText(legacyProject.projectName, locale) || legacyProject.slug
            }
          />
        )}
      </div>

      {hasInsights && (
        <div id="insights" className="max-w-6xl mx-auto px-6 py-16">
          <Insights text={translateText(legacyProject.insights, locale)} />
        </div>
      )}

      {hasNews && (
        <div id="news" className="max-w-6xl mx-auto px-6 py-16">
          <NewsBlock news={legacyProject.news || []} locale={locale} />
        </div>
      )}

      {hasContact && (
        <div id="contact" className="max-w-6xl mx-auto px-6 py-16">
          <ContactBlock
            contact={legacyProject.contact}
            projectName={
              translateText(legacyProject.projectName, locale) || legacyProject.slug
            }
            developer={legacyProject.developer}
            slug={legacyProject.slug}
          />
        </div>
      )}

      {related.length > 0 && (
        <div id="related" className="max-w-6xl mx-auto px-6 py-16">
          <RelatedCarousel projects={related} locale={locale} />
        </div>
      )}
    </div>
  );
}
