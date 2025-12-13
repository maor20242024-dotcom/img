import { loadAllProjects } from '@/lib/unifiedDataService';
import FavoritesClient from '@/components/favorites/FavoritesClient';

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale?: string }>;
}) {
  const { locale = 'en' } = await params;
  // 🚀 DYNAMIC LOADING: Read projects directly from individual JSON files
  const projects = await loadAllProjects();
  return <FavoritesClient projects={projects} />;
}