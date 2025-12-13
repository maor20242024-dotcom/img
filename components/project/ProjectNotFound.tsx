'use client';

import React from 'react';
import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';
import LuxuryButton from '@/components/ui/LuxuryButton';
import ProjectCard from '@/components/ProjectCard';
import { useLocale } from '@/lib/i18n-client';
import { path } from '@/lib/paths';

type Project = any; // استخدم النوع الصحيح من lib/types

type Props = {
  developer?: string;
  slug?: string;
  developerProjects?: Project[];
  otherProjects?: Project[];
};

export default function ProjectNotFound({
  developer,
  slug,
  developerProjects = [],
  otherProjects = []
}: Props) {
  const hasRelated = developerProjects.length > 0 || otherProjects.length > 0;
  const locale = useLocale();
  const isAr = locale === 'ar';
  const developerKey = developer?.toLowerCase?.() || undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] text-light px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 text-[var(--gold)] mx-auto animate-pulse" />
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-amber-300">
          {isAr ? 'المشروع غير موجود' : 'Project Not Found'}
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          {isAr ? 'عذراً، لم نتمكن من العثور على المشروع المطلوب' : 'Sorry, we could not find the requested project'}
          <br />
          <span className="text-[var(--gold)]">{developer}/{slug}</span>
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link href={path.home(locale)}>
            <LuxuryButton className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {isAr ? 'العودة للرئيسية' : 'Home'}
            </LuxuryButton>
          </Link>
          <Link href={path.projectsHome(locale)}>
            <LuxuryButton className="flex items-center gap-2">
              {isAr ? 'جميع المشاريع' : 'All Projects'}
            </LuxuryButton>
          </Link>
          {developerKey && (
            <Link href={path.developerProjects(locale, developerKey)}>
              <LuxuryButton className="flex items-center gap-2">
                {isAr ? `مشاريع ${developer}` : `${developer} Projects`}
              </LuxuryButton>
            </Link>
          )}
        </div>

        {/* Related Projects */}
        {hasRelated && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-gray-200">
              {developerProjects.length > 0
                ? (isAr ? `مشاريع أخرى من ${developer}` : `Other projects from ${developer}`)
                : (isAr ? 'مشاريع قد تهمك' : 'Projects you might like')}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(developerProjects.length > 0 ? developerProjects : otherProjects)
                .slice(0, 6)
                .map((project: any) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
