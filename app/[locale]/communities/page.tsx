import Link from 'next/link';
import { deriveCommunities } from '@/lib/data/store';
import { path } from '@/lib/paths';
import type { Locale } from '@/lib/data/schema';
import { MapPin } from 'lucide-react';

// ISR - Revalidate every 5 minutes
export const revalidate = 300;

export default async function CommunitiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const communities = await deriveCommunities();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] text-light">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gold mb-4">
            {locale === 'ar' ? 'المجتمعات السكنية' : 'Communities'}
          </h1>
          <p className="text-xl text-gray-400">
            {locale === 'ar'
              ? 'اكتشف أفضل المجتمعات السكنية في دبي'
              : 'Discover the best residential communities in Dubai'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map((community) => (
            <Link
              key={community.key}
              href={path.community(locale, community.slugs[locale])}
              className="group relative bg-zinc-900/50 backdrop-blur-sm border border-gold/20 rounded-lg p-8 hover:border-gold/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-all">
                  <MapPin className="w-10 h-10 text-gold" />
                </div>
              </div>

              {/* Name */}
              <h2 className="text-2xl font-bold text-gold mb-2 text-center">
                {community.names[locale]}
              </h2>

              {/* Project Count */}
              <div className="text-center pt-4 border-t border-gold/20">
                <p className="text-sm text-gray-500">
                  {locale === 'ar' ? 'المشاريع' : 'Projects'}
                </p>
                <p className="text-3xl font-bold text-gold">
                  {community.projectCount}
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
