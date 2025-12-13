import { NextResponse } from 'next/server';
import { loadAllProjects } from '@/lib/unifiedDataService';

export const dynamic = 'force-dynamic';

export async function GET() {
  // 🚀 DYNAMIC LOADING: Read projects directly from individual JSON files
  const all = await loadAllProjects();
  const dubaiProjects = all.filter(p => p.city === "Dubai"); // Filter by city 'Dubai'

  // The original code was transforming the data into a 'Slide' type with video links.
  // We need to ensure the output format is consistent with what the client expects.
  // Assuming the client expects a list of projects, potentially with a video link.
  const formattedProjects = dubaiProjects.map(p => ({
    src: p.videoLink || '', // Assuming videoLink is directly available or needs to be derived
    name: typeof p.projectName === 'string' ? p.projectName : ((p.projectName as any)?.en || (p.projectName as any)?.ar || ''), // Handle MaybeLocalized type
    developer: p.developer, // Use developer instead of developerSlug
    slug: p.slug,
    // Add other fields as needed by the client that were in the original 'Slide' type
  }));

  // The original code sliced to 40 projects. Re-applying that logic.
  return NextResponse.json({ projects: formattedProjects.slice(0, 40) });
}
