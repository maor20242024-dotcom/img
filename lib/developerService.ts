import { listDevelopers, loadAllProjects } from './unifiedDataService';
import type { Project } from './types';

// Developer profile data
const developerProfiles = {
  damac: {
    slug: 'damac',
    name: 'DAMAC Properties',
    logo: '/media/damac-logo-white.png',
    description: 'DAMAC Properties is a leading luxury real estate developer in the Middle East, delivering world-class residential, commercial, and leisure properties since 2002.',
    founded: '2002',
    headquarters: 'Dubai, UAE',
  },
  emaar: {
    slug: 'emaar',
    name: 'Emaar Properties',
    logo: '/media/emaar-logo-white.png',
    description: 'Emaar Properties is a global property developer and provider of premium lifestyles, with a significant presence across the Middle East, North Africa, and Asia since 1997.',
    founded: '1997',
    headquarters: 'Dubai, UAE',
  },
  nakheel: {
    slug: 'nakheel',
    name: 'Nakheel Properties',
    logo: '/media/nakheel-logo-white.png',
    description: 'Nakheel is a world-leading master developer whose innovative, landmark projects form an iconic portfolio of master communities and retail, hospitality, and leisure developments.',
    founded: '2000',
    headquarters: 'Dubai, UAE',
  },
  sobha: {
    slug: 'sobha',
    name: 'Sobha Realty',
    logo: '/media/Sobha-logo-white.png',
    description: 'Sobha Realty is a leading international property developer committed to redefining residential and commercial luxury in Dubai and beyond.',
    founded: '2003',
    headquarters: 'Dubai, UAE',
  },
  binghatti: {
    slug: 'binghatti',
    name: 'Binghatti Developers',
    logo: '/media/binghatti-logo-white.png',
    description: 'Binghatti is the UAE\'s leading property development company, renowned for innovative architectural designs and luxurious residential communities.',
    founded: '2008',
    headquarters: 'Dubai, UAE',
  },
};

export function getDeveloperCounts() {
  return listDevelopers();
}

export async function getDeveloperBySlug(slug: string) {
  const profile = developerProfiles[slug as keyof typeof developerProfiles];
  if (!profile) return null;
  
  return profile;
}

export async function getDeveloperProjects(slug: string): Promise<Project[]> {
  const allProjects = await loadAllProjects();
  return allProjects.filter(p => p.developer?.toLowerCase() === slug.toLowerCase());
}