// app/[locale]/page.tsx
import { loadAllProjects } from '@/lib/unifiedDataService';
import Hero from '@/components/home/Hero';
import OrbitCarousel from '@/components/home/OrbitCarousel';
import ProjectCard from '@/components/ProjectCard';
import MediaSuspense from '@/components/ui/MediaSuspense';
import type { Metadata } from 'next';

type Locale = 'ar' | 'en';

/**
 * Home metadata — Next.js 16 requires awaiting params (Promise-based).
 */
export async function generateMetadata({ params }: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const { locale = 'en' } = await params;
  const title =
    locale === 'ar'
      ? 'بوابة الإمبراطورية العقارية - دبي'
      : 'Imperium Real Estate Gate - Dubai';
  const description =
    locale === 'ar'
      ? 'اكتشف أفخم العقارات في دبي، حيث تلتقي الفخامة بالاستثمار.'
      : "Discover Dubai's most luxurious properties, where opulence meets investment.";

  // NOTE: OG should ideally be an image, but we keep current behavior.
  const ogImage =
    'https://ggfx-onebrokergroup.s3.eu-west-2.amazonaws.com/i/Homepage_Banner_Video2_8328_Bdd5c7_f31f1b5265.mp4';

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImage }] },
  };
}

/**
 * Server Component: DO NOT add 'use client' here.
 * Renders the Hero first (full viewport), then the rest of the sections.
 */
export default async function HomePage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params;
  // 🚀 DYNAMIC LOADING: Read projects directly from individual JSON files
  const all = await loadAllProjects();

  // Build slides: fixed 4 specific projects requested by user
  const targetVideos = [
    {
      videoLink: 'https://videos.ctfassets.net/zoq5l15g49wj/74M6IoNAeWTuuFXiNZe031/6c563f86ff25ccba05ce2958a19ccb79/ALTITUDE_Hero_video_16x9.mp4',
      title: 'Altitude',
      developer: 'damac',
      slugHint: 'altitude'
    },
    {
      videoLink: 'https://videos.ctfassets.net/zoq5l15g49wj/y5bdzJndAoZXb2TF59HHA/cfff384cbdd599e94ef7de83f14a3f3e/DAMAC_BAY_Project_video_16x9.mp4',
      title: 'Damac Bay',
      developer: 'damac',
      slugHint: 'damac-bay' // or damac-bay-by-cavalli
    },
    {
      videoLink: 'https://videos.ctfassets.net/zoq5l15g49wj/7L26f6kb2Qal9fSKADSvLj/65b95779cd9c2477e4fda22a9a5ff01d/DP.com_DAMAC_DISTRICT_LAUNCH_16X9_EN.mp4',
      title: 'Damac District', // Potentially 'Park Horizon' or similar, but using safe fallback
      developer: 'damac',
      slugHint: 'damac-district'
    },
    {
      videoLink: 'https://www.nakheel.com/videos/nakheelcorporatelibraries/projects/canal-front-residences.mp4?sfvrsn=9e68b061_1',
      title: 'Canal Front Residences',
      developer: 'nakheel',
      slugHint: 'canal-front-residences'
    }
  ];

  const slides = targetVideos.map(target => {
    // Try to find the real project in our data for better metadata (titles, links)
    // 1. Match by video URL
    let found = all.find(p =>
      (p.videoUrl === target.videoLink) ||
      (p.videoLink === target.videoLink)
    );

    // 2. Match by slug hint if not found by video
    if (!found && target.slugHint) {
      found = all.find(p => p.slug.includes(target.slugHint));
    }

    // 3. Fallback to basic object
    const finalProject = found || {
      videoLink: target.videoLink,
      projectName: target.title,
      developer: target.developer,
      slug: '#' // no link if not found
    };

    return {
      videoLink: target.videoLink, // Always use the high-quality target video
      title: typeof finalProject?.projectName === 'string'
        ? finalProject.projectName
        : ((finalProject?.projectName as any)?.[locale] ?? target.title),
      developer: (finalProject as any).developer || target.developer,
    };
  });


  // 3) Diversify featured projects (Round Robin)
  const developers = Array.from(new Set(all.map((p) => (p as any).developer)));
  const projectsByDev: Record<string, any[]> = {};

  developers.forEach(dev => {
    projectsByDev[dev] = all.filter(p => (p as any).developer === dev);
  });

  const featured: any[] = [];
  const limit = 12;
  let index = 0;

  while (featured.length < limit) {
    let addedInThisRound = false;
    for (const dev of developers) {
      if (featured.length >= limit) break;
      const proj = projectsByDev[dev][index];
      if (proj) {
        featured.push(proj);
        addedInThisRound = true;
      }
    }
    if (!addedInThisRound) break; // No more projects left
    index++;
  }

  // 4) Render
  return (
    <div className="w-full flex flex-col">
      {/* 1) HERO must be first and full viewport height */}
      <MediaSuspense type="video" height="100vh">
        <Hero
          locale={locale}
          titleAr="Imperium Gate — مختارات"
          subtitleAr="عقارات فاخرة منتقاة في دبي."
          titleEn="Imperium Gate — Featured"
          subtitleEn="Curated luxury properties in Dubai."
        />
      </MediaSuspense>

      {/* 2) OrbitCarousel (video-only) */}
      {slides.length > 0 ? (
        <section className="mt-10">
          <MediaSuspense type="gallery" height="600px">
            <OrbitCarousel slides={slides} />
          </MediaSuspense>
        </section>
      ) : null}

      {/* 3) Featured projects grid */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 mt-12 md:mt-16">
        <div className="text-center mb-12">
          <h2
            className={`luxury-title text-3xl md:text-4xl lg:text-5xl font-bold gold-gradient-static luxury-text-shadow ${locale === 'ar' ? 'font-display' : 'font-display'
              }`}
          >
            {locale === 'ar' ? 'مشاريع مختارة' : 'Featured Projects'}
          </h2>
          <p
            className={`luxury-subtitle mt-4 text-white/80 text-lg md:text-xl max-w-2xl mx-auto ${locale === 'ar' ? 'font-arabic' : 'font-sans'
              }`}
          >
            {locale === 'ar'
              ? 'اكتشف مجموعة منتقاة من أفخم العقارات في دبي'
              : "Discover our curated selection of Dubai's most luxurious properties"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {featured.map((p: any) => (
            <ProjectCard key={p?.slug ?? p?.id} project={p} />
          ))}
        </div>
      </section>
    </div>
  );

}
