
import React from 'react';
import { notFound } from 'next/navigation';
import { getCommunityBySlugGlobal, loadAllProjects } from '@/lib/unifiedDataService';
import ProjectCard from '@/components/ProjectCard';
import { MapPin, Building2, Trees } from 'lucide-react';

// ISR - Revalidate every 5 minutes
export const revalidate = 300;

interface Props {
    params: {
        slug: string;
        locale: string;
    };
}

export default async function CommunityPage({ params }: Props) {
    const { slug, locale } = params;

    // 1. Fetch Community Data
    const community = await getCommunityBySlugGlobal(slug);

    if (!community) {
        notFound();
    }

    // 2. Fetch Related Projects
    const allProjects = await loadAllProjects();
    const communityProjects = allProjects.filter(
        (p) => (p.communityName && p.communityName === community.slug) ||
            (p.extra && p.extra.community_slug === community.slug) ||
            // Fallback fuzzy match if exact slug missing
            (p.location && typeof p.location === 'object' && (p.location as any).en === (community.name as any).en)
    );

    // Helper for localized text
    const t = (field: any) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        return field[locale] || field['en'] || '';
    };

    const heroImage = community.media && community.media.length > 0
        ? community.media[0]
        : '/images/hero-fallback.jpg';

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-gray-100 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a]/60 via-[#0a0f1a]/40 to-[#0a0f1a]" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-amber-200 mb-4 animate-fade-in-up">
                        {t(community.name)}
                    </h1>
                    {community.location && (
                        <div className="flex items-center gap-2 text-gray-300 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <MapPin className="w-4 h-4 text-[var(--gold)]" />
                            <span>{t(community.location.name) || t(community.name)}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-zinc-900/80 backdrop-blur-md border border-[var(--gold)]/20 p-8 rounded-2xl shadow-2xl">
                            <h2 className="text-2xl font-bold text-[var(--gold)] mb-4 flex items-center gap-2">
                                <Building2 className="w-6 h-6" />
                                {locale === 'ar' ? 'عن المجتمع' : 'About the Community'}
                            </h2>
                            <p className="text-gray-300 leading-relaxed dark:text-gray-300 text-lg">
                                {t(community.description)}
                            </p>
                        </div>

                        {/* Projects Grid */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8 border-b border-[var(--gold)]/30 pb-4 flex items-center gap-2">
                                <Building2 className="w-8 h-8 text-[var(--gold)]" />
                                {locale === 'ar' ? 'المشاريع في هذا المجتمع' : 'Projects in this Community'}
                                <span className="text-sm font-normal text-gray-400 ms-auto">
                                    {communityProjects.length} {locale === 'ar' ? 'مشاريع' : 'Projects'}
                                </span>
                            </h2>

                            {communityProjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {communityProjects.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-dashed border-white/10">
                                    <p className="text-gray-500">
                                        {locale === 'ar'
                                            ? 'لا توجد مشاريع متاحة حالياً في هذا المجتمع.'
                                            : 'No projects currently listed in this community.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Amenities */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/90 border border-[var(--gold)]/20 p-6 rounded-xl sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
                                <Trees className="w-5 h-5 text-[var(--gold)]" />
                                {locale === 'ar' ? 'المرافق والمميزات' : 'Amenities & Features'}
                            </h3>

                            {community.amenities && community.amenities.length > 0 ? (
                                <ul className="space-y-3">
                                    {community.amenities.map((amenity: any, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-black/40 hover:bg-black/60 transition-colors border border-white/5">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-[var(--gold)] shrink-0" />
                                            <span className="text-gray-300">{t(amenity.name || amenity)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic text-sm">
                                    {locale === 'ar' ? 'معلومات المرافق غير متوفرة' : 'Amenities information not available'}
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
