
import { notFound } from 'next/navigation';
import { getCommunityBySlug, getCommunitiesByDeveloper, getProjectsByDeveloper } from '@/lib/unifiedDataService';
import Link from 'next/link';
import Image from 'next/image';
import ProjectCard from '@/components/ProjectCard';
import { MapPin, Building2, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Locale, Project } from '@/lib/types';

// ISR - Revalidate every 5 minutes
export const revalidate = 300;

interface CommunityPageProps {
    params: Promise<{ locale: string; slug: string; communitySlug: string }>;
}

export default async function CommunityPage({ params }: CommunityPageProps) {
    const { locale, slug, communitySlug } = await params;
    const isRTL = locale === 'ar';

    // 1. Fetch the specific community
    const community = await getCommunityBySlug(slug, communitySlug);

    // 2. Fetch all communities for sidebar
    const allCommunities = await getCommunitiesByDeveloper(slug);

    if (!community) {
        notFound();
    }

    // 3. Fetch projects to filter by this community (if applicable, using 'area' or 'location')
    // Note: unifiedDataService might not have a direct 'getProjectsByCommunity'.
    // We can filter all projects of the developer where area/location matches community name or slug.
    const allProjects = await getProjectsByDeveloper(slug);

    // Robust filtering: Check if project area/location matches community name (en/ar) or slug
    const communityProjects = allProjects.filter((p: Project) => {
        // 1. Precise match via communitySlug
        if (p.communitySlug && p.communitySlug === communitySlug) return true;

        const commNameEn = community.name?.en?.toLowerCase() || '';
        const commNameAr = community.name?.ar || '';
        const pAreaEn = (typeof p.area === 'object' && 'en' in p.area!) ? (p.area as any).en?.toLowerCase() : (typeof p.area === 'string' ? p.area.toLowerCase() : '');
        const pLocationEn = (typeof p.location === 'object' && 'en' in p.location!) ? (p.location as any).en?.toLowerCase() : (typeof p.location === 'string' ? p.location.toLowerCase() : '');

        return (
            pAreaEn?.includes(communitySlug) ||
            pLocationEn?.includes(communitySlug) ||
            (commNameEn && pAreaEn?.includes(commNameEn)) ||
            (commNameEn && pLocationEn?.includes(commNameEn))
        );
    });


    // Helper for localized text
    const t = (obj: any): string => {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        const val = obj?.[locale as Locale] || obj?.en || '';
        if (typeof val === 'string') return val;
        // If val is still an object (nested?), try to stringify or return empty
        return '';
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">

                <div className="absolute inset-0">
                    <Image
                        src={community.heroImage || community.media?.[0] || '/images/hero-fallback.png'}
                        alt={t(community.name)}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/50 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                    <Link
                        href={`/${locale}/developers/${slug}`}
                        className="inline-flex items-center text-gold-400 hover:text-gold-300 mb-4 transition-colors"
                    >
                        {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                        {isRTL ? 'العودة للمطور' : 'Back to Developer'}
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t(community.name)}</h1>
                    <div className="flex items-center text-gray-300 mb-6">
                        <MapPin className="w-5 h-5 text-gold-500 mx-2" />
                        <span>{t(community.location?.address) || t(community.name)}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="lg:w-2/3">
                    {/* Description */}
                    <div className="bg-white/5 rounded-2xl p-8 mb-12 border border-white/10">
                        <h2 className="text-2xl font-bold mb-4 text-gold-400">
                            {isRTL ? 'عن المجتمع' : 'About the Community'}
                        </h2>
                        <div className="prose prose-invert max-w-none text-gray-300">
                            <p>{t(community.description)}</p>
                        </div>

                        {/* Amenities Grid */}
                        {community.amenities && community.amenities.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4 text-white">
                                    {isRTL ? 'المرافق والخدمات' : 'Amenities'}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {community.amenities.map((amenity: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="w-2 h-2 bg-gold-500 rounded-full" />
                                            <span className="text-sm text-gray-300">
                                                {typeof amenity === 'string' ? amenity : t(amenity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Projects in Community */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Building2 className="text-gold-500" />
                            {isRTL ? 'المشاريع في هذا المجتمع' : 'Projects in this Community'}
                            <span className="text-sm font-normal text-gray-500 bg-white/10 px-3 py-1 rounded-full">
                                {communityProjects.length}
                            </span>
                        </h2>

                        {communityProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {communityProjects.map((project: Project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 bg-white/5 rounded-xl border border-dashed border-white/20 text-center text-gray-400">
                                {isRTL ? 'لا توجد مشاريع متاحة حالياً في هذا المجتمع.' : 'No projects currently listed in this community.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: All Communities */}
                <div className="lg:w-1/3">
                    <div className="sticky top-24">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold mb-6 text-gold-400 border-b border-white/10 pb-4">
                                {isRTL ? 'مجتمعات أخرى' : 'Other Communities'}
                            </h3>
                            <div className="flex flex-col gap-3">
                                {allCommunities.map((c: any) => {
                                    const isActive = c.slug === communitySlug;
                                    return (
                                        <Link
                                            key={c.slug}
                                            href={`/${locale}/developers/${slug}/communities/${c.slug}`}
                                            className={`
                                        group flex items-center p-3 rounded-lg transition-all
                                        ${isActive
                                                    ? 'bg-gold-500/20 border border-gold-500/50 text-white'
                                                    : 'hover:bg-white/10 text-gray-400 hover:text-white'}
                                    `}
                                        >
                                            <div className={`
                                        w-12 h-12 rounded-lg bg-cover bg-center mr-4 shrink-0
                                        ${isActive ? 'ring-2 ring-gold-500' : 'group-hover:opacity-100 opacity-70'}
                                    `}
                                                style={{ backgroundImage: `url(${c.media?.[0] || '/images/hero-fallback.png'})` }}
                                            />
                                            <span className="font-medium">{t(c.name)}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
