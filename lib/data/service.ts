/**
 * Unified Data Service for Imperium Gate
 * Single source of truth for all project and developer data
 * 
 * @module lib/data/service
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import type { Project, Developer, DeveloperKey } from './types';

// ============================================================================
// CONSTANTS
// ============================================================================

const DATA_DIR = join(process.cwd(), 'public', 'data');
const CACHE_DURATION = 300; // 5 minutes
const CACHE_TAGS = {
  PROJECTS: 'projects',
  DEVELOPERS: 'developers',
} as const;

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/**
 * Load raw JSON data from disk
 */
async function loadJSON<T>(filePath: string): Promise<T | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to load JSON from ${filePath}:`, error);
    return null;
  }
}

/**
 * Normalize project data to ensure consistency
 * Maps from various legacy formats to unified format
 */
function normalizeProject(raw: any, developerKey: DeveloperKey): Project | null {
  if (!raw || !raw.slug) return null;
  
  return {
    slug: raw.slug,
    developer: developerKey,
    name: raw.projectName || raw.name,
    description: raw.description,
    shortDescription: raw.shortDescription,
    location: {
      city: raw.city || raw.location?.city,
      area: raw.area || raw.location?.area,
      address: raw.address || raw.location?.address,
      lat: raw.lat || raw.location?.lat,
      lng: raw.lng || raw.location?.lng,
    },
    media: {
      heroImage: raw.heroImage || raw.media?.heroImage,
      galleryImages: raw.galleryImages || raw.media?.galleryImages || [],
      floorPlans: raw.floorPlans || raw.media?.floorPlans || [],
      videoUrl: raw.videoUrl || raw.videoLink || raw.media?.videoUrl,
      tour3dUrl: raw['3D_TourLink'] || raw.media?.tour3dUrl,
      brochureUrl: raw.brochureUrl || raw.media?.brochureUrl,
    },
    pricing: {
      min: raw.priceMin || raw.pricing?.min,
      max: raw.priceMax || raw.pricing?.max,
      currency: raw.currency || raw.pricing?.currency || 'AED',
      paymentPlan: raw.paymentPlan || raw.pricing?.paymentPlan,
    },
    bedrooms: raw.bedrooms || [],
    amenities: raw.amenities || [],
    features: raw.features || [],
    status: raw.status || raw.projectStatus,
    launchDate: raw.launchDate,
    deliveryDate: raw.deliveryDate || raw.completionDate,
    totalUnits: raw.totalUnits,
    availableUnits: raw.availableUnits,
    projectType: raw.projectType,
  };
}

/**
 * Load all projects from a developer's directory
 */
async function loadDeveloperProjects(developer: DeveloperKey): Promise<Project[]> {
  const developerDir = join(DATA_DIR, developer, 'projects');
  
  try {
    const projectDirs = await readdir(developerDir);
    const projects: Project[] = [];
    
    for (const projectDir of projectDirs) {
      const jsonPath = join(developerDir, projectDir, 'index.json');
      const raw = await loadJSON(jsonPath);
      
      if (raw) {
        const normalized = normalizeProject(raw, developer);
        if (normalized) {
          projects.push(normalized);
        }
      }
    }
    
    return projects;
  } catch (error) {
    console.error(`Failed to load projects for ${developer}:`, error);
    return [];
  }
}

// ============================================================================
// CACHED DATA FETCHERS
// ============================================================================

/**
 * Get all projects from all developers
 * Cached for 5 minutes
 */
export const getAllProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const developers: DeveloperKey[] = ['emaar', 'damac', 'nakheel', 'sobha', 'binghatti'];
    const allProjects: Project[] = [];
    
    for (const developer of developers) {
      const projects = await loadDeveloperProjects(developer);
      allProjects.push(...projects);
    }
    
    return allProjects;
  },
  ['all-projects'],
  {
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.PROJECTS],
  }
);

/**
 * Get a specific project by developer and slug
 * Cached for 5 minutes
 */
export const getProjectBySlug = unstable_cache(
  async (developer: string, slug: string): Promise<Project | null> => {
    const projects = await getAllProjects();
    return projects.find(p => 
      p.developer === developer && p.slug === slug
    ) || null;
  },
  ['project-by-slug'],
  {
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.PROJECTS],
  }
);

/**
 * Get all projects from a specific developer
 * Cached for 5 minutes
 */
export const getProjectsByDeveloper = unstable_cache(
  async (developer: string): Promise<Project[]> => {
    const projects = await getAllProjects();
    return projects.filter(p => p.developer === developer);
  },
  ['projects-by-developer'],
  {
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.PROJECTS],
  }
);

/**
 * Get all developers with their project counts
 * Cached for 5 minutes
 */
export const getAllDevelopers = unstable_cache(
  async (): Promise<Developer[]> => {
    const projects = await getAllProjects();
    const developers: DeveloperKey[] = ['emaar', 'damac', 'nakheel', 'sobha', 'binghatti'];
    
    return developers.map(key => {
      const projectsCount = projects.filter(p => p.developer === key).length;
      
      return {
        key,
        name: {
          en: key.charAt(0).toUpperCase() + key.slice(1),
          ar: getDeveloperNameAr(key),
        },
        projectsCount,
      };
    });
  },
  ['all-developers'],
  {
    revalidate: CACHE_DURATION,
    tags: [CACHE_TAGS.DEVELOPERS],
  }
);

/**
 * Search projects by query
 */
export async function searchProjects(
  query: string,
  filters?: {
    developer?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number[];
    status?: string;
  }
): Promise<Project[]> {
  const allProjects = await getAllProjects();
  const lowerQuery = query.toLowerCase();
  
  return allProjects.filter(project => {
    // Text search
    const matchesQuery = 
      project.name?.en?.toLowerCase().includes(lowerQuery) ||
      project.name?.ar?.includes(query) ||
      project.description?.en?.toLowerCase().includes(lowerQuery) ||
      project.description?.ar?.includes(query);
    
    if (!matchesQuery) return false;
    
    // Apply filters
    if (filters?.developer && project.developer !== filters.developer) {
      return false;
    }
    
    if (filters?.minPrice && (project.pricing?.min || 0) < filters.minPrice) {
      return false;
    }
    
    if (filters?.maxPrice && (project.pricing?.max || Infinity) > filters.maxPrice) {
      return false;
    }
    
    if (filters?.bedrooms && filters.bedrooms.length > 0) {
      const hasMatchingBedroom = project.bedrooms?.some(b => 
        filters.bedrooms!.includes(b)
      );
      if (!hasMatchingBedroom) return false;
    }
    
    if (filters?.status && project.status !== filters.status) {
      return false;
    }
    
    return true;
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDeveloperNameAr(key: DeveloperKey): string {
  const names: Record<DeveloperKey, string> = {
    emaar: 'إعمار',
    damac: 'داماك',
    nakheel: 'نخيل',
    sobha: 'سوبها',
    binghatti: 'بنغاطي',
  };
  return names[key] || key;
}
