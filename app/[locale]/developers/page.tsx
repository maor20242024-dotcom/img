import Image from 'next/image';
import Link from 'next/link';
import DevelopersGrid from '@/components/developers/DevelopersGrid';
import { getAllDevelopers, getProjectsByDeveloper } from '@/lib/data/store';
import { path } from '@/lib/paths';
import type { Locale } from '@/lib/data/schema';

// ISR - Revalidate every 5 minutes
export const revalidate = 300;

export default async function DevelopersPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale = 'ar' } = await params;
  const developers = await getAllDevelopers();

  // Get project counts for each developer
  const developersWithCounts = await Promise.all(
    developers.map(async (dev) => {
      const projects = await getProjectsByDeveloper(dev.key);
      return { ...dev, projectCount: projects.length };
    })
  );

  // Helper to safely get localized string
  const getLocalized = (obj: any, loc: string): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    // Check if expected key exists and is a string
    const val = obj[loc];
    if (typeof val === 'string') return val;
    // Fallback to en or any string property
    if (typeof obj.en === 'string') return obj.en;
    if (typeof obj.ar === 'string') return obj.ar;
    return JSON.stringify(val); // Last resort debug
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] text-light">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">
            {locale === 'ar' ? 'المطورون العقاريون' : 'Real Estate Developers'}
          </h1>
          <p className="text-xl text-gray-400">
            {locale === 'ar'
              ? 'اكتشف المطورين الرائدين في دبي'
              : 'Discover leading developers in Dubai'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developersWithCounts.map((developer) => (
            <Link
              key={developer.key}
              href={path.developer(locale as Locale, developer.key)}
              className="group relative bg-zinc-900/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 hover:border-gold/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              {/* Logo */}
              {developer.logoWhite && (
                <div className="relative h-24 mb-6 flex items-center justify-center">
                  <Image
                    src={developer.logoWhite}
                    alt={getLocalized(developer.name, locale)}
                    width={200}
                    height={96}
                    className="object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                  />
                </div>
              )}

              {/* Name */}
              <h2 className="text-2xl font-bold text-gold mb-2 text-center">
                {getLocalized(developer.name, locale)}
              </h2>

              {/* Description */}
              {developer.description && (
                <p className="text-gray-400 text-sm mb-4 text-center">
                  {getLocalized(developer.description, locale)}
                </p>
              )}

              {/* Project Count */}
              <div className="text-center pt-4 border-t border-gold/20">
                <p className="text-sm text-gray-500">
                  {locale === 'ar' ? 'المشاريع' : 'Projects'}
                </p>
                <p className="text-3xl font-bold text-gold">
                  {developer.projectCount}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
