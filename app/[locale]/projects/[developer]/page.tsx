import { getAllDeveloperParams } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';
import DeveloperProjectsNotFound from '@/components/project/DeveloperProjectsNotFound';
import type { Locale } from '@/lib/i18n-utils';
import type { Project } from '@/lib/types';
import { getAllProjects } from '@/lib/data/store';
import { selectProjects, filterProjects, sortProjects } from '@/lib/data/filters';
import { toLegacyProjects } from '@/lib/data/legacy';

// ISR Configuration - Revalidate developer projects every 30 minutes
export const revalidate = 1800;

export const dynamicParams = true;

export async function generateStaticParams() {
  const locales: Locale[] = ['ar', 'en'];
  const developers = await getAllDeveloperParams();
  return locales.flatMap((locale) =>
    developers.map((developer) => ({ locale, developer }))
  );
}

export default async function DeveloperProjectsPage({ params }: { params: Promise<{ locale: Locale; developer: string }> }) {
  const { locale, developer } = await params;
  const canonical = selectProjects(await getAllProjects());
  const scoped = sortProjects(
    filterProjects(canonical, { locale, developerKey: developer }),
    locale
  );

  if (!scoped.length) {
    const universe = sortProjects(filterProjects(canonical, { locale }), locale);
    const otherProjects = toLegacyProjects(universe, locale) as Project[];
    return <DeveloperProjectsNotFound developer={developer} otherProjects={otherProjects} />;
  }

  const projects = toLegacyProjects(scoped, locale) as Project[];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gold-grad">
        {locale === 'ar' ? 'مشاريع' : 'Projects by'} {developer}
      </h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {projects.map((p: Project, index: number) => (
          <ProjectCard key={`${p.id || p.slug}-${index}`} project={p} />
        ))}
      </div>
    </div>
  );
}
