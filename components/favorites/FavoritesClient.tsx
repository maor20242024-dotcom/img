'use client';
import { useFavorites } from '@/lib/favorites';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';
import LuxuryButton from '@/components/ui/LuxuryButton';

export default function FavoritesClient({ projects }:{ projects: Project[] }){
  const { ids, clear } = useFavorites();
  const items = projects.filter(p=> ids.includes(p.id||p.slug));
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gold-grad">المفضلة</h1>
        <LuxuryButton variant="outline" size="sm" onClick={clear}>مسح</LuxuryButton>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {items.map((p)=> <ProjectCard key={p.slug} project={p} />)}
      </div>
    </div>
  );
}
