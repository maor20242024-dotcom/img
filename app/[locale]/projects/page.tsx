import type { Locale } from '@/lib/i18n-utils';
import Filters from '@/components/projects/Filters';
import type { Project } from '@/lib/types';
import { loadAllProjects } from '@/lib/unifiedDataService';

// ISR Configuration - Revalidate every hour
export const revalidate = 3600;

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  // Load dynamic projects
  const allProjects = await loadAllProjects();

  // Transform to match what Filters expects (legacy interface adjustment if needed)
  // Filters component expects Project[]
  // The 'allProjects' are already unified Project type but might need some defaults.

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-gold mb-6">
        {locale === 'ar' ? 'كل المشاريع' : 'All Projects'}
      </h1>
      <Filters initial={allProjects} />
    </div>
  );
}
