// lib/projects.ts - ISR Cache Implementation for Imperium Gate
import { unstable_cache } from 'next/cache';
import type { Project } from './types';
import { 
  loadAllProjects as _loadAllProjects,
  getProjectBySlug as _getProjectBySlug,
  getProjectsByDeveloper as _getProjectsByDeveloper,
  listDevelopers as _listDevelopers
} from './unifiedDataService';

// Cache tags for selective revalidation
export const CACHE_TAGS = {
  ALL_PROJECTS: 'all-projects',
  DEVELOPERS: 'developers',
  PROJECT_BY_SLUG: 'project-by-slug',
  PROJECTS_BY_DEVELOPER: 'projects-by-developer'
} as const;

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  ALL_PROJECTS: 3600, // 1 hour
  DEVELOPERS: 7200, // 2 hours
  PROJECT_DETAILS: 1800, // 30 minutes
  DEVELOPER_PROJECTS: 1800 // 30 minutes
} as const;

/**
 * Cached version of loadAllProjects with ISR
 * Revalidates every hour or on-demand
 */
export const loadAllProjects = unstable_cache(
  async (): Promise<Project[]> => {
    console.log('🔄 Loading all projects (cache miss)');
    return await _loadAllProjects();
  },
  ['all-projects'],
  {
    tags: [CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.ALL_PROJECTS
  }
);

/**
 * Cached version of getProjectBySlug with ISR
 * Revalidates every 30 minutes or on-demand
 */
export const getProjectBySlug = unstable_cache(
  async (developer: string, slug: string): Promise<Project | undefined> => {
    console.log(`🔄 Loading project ${developer}/${slug} (cache miss)`);
    return await _getProjectBySlug(developer, slug);
  },
  ['project-by-slug'],
  {
    tags: [CACHE_TAGS.PROJECT_BY_SLUG, CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.PROJECT_DETAILS
  }
);

/**
 * Cached version of getProjectsByDeveloper with ISR
 * Revalidates every 30 minutes or on-demand
 */
export const getProjectsByDeveloper = unstable_cache(
  async (developer: string): Promise<Project[]> => {
    console.log(`🔄 Loading projects for developer ${developer} (cache miss)`);
    return await _getProjectsByDeveloper(developer);
  },
  ['projects-by-developer'],
  {
    tags: [CACHE_TAGS.PROJECTS_BY_DEVELOPER, CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.DEVELOPER_PROJECTS
  }
);

/**
 * Cached version of listDevelopers with ISR
 * Revalidates every 2 hours or on-demand
 */
export const listDevelopers = unstable_cache(
  async (): Promise<{ developer: string; count: number }[]> => {
    console.log('🔄 Loading developers list (cache miss)');
    return await _listDevelopers();
  },
  ['developers-list'],
  {
    tags: [CACHE_TAGS.DEVELOPERS, CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.DEVELOPERS
  }
);

/**
 * Generate static params for all projects (for generateStaticParams)
 * This helps with static generation at build time
 */
export const getAllProjectParams = unstable_cache(
  async (): Promise<{ developer: string; slug: string }[]> => {
    console.log('🔄 Generating static params for all projects');
    const projects = await _loadAllProjects();
    return projects
      .filter(project => project.developer) // Filter out projects without developers
      .map(project => ({
        developer: project.developer!,
        slug: project.slug
      }));
  },
  ['all-project-params'],
  {
    tags: [CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.ALL_PROJECTS
  }
);

/**
 * Get all unique developers for static generation
 */
export const getAllDeveloperParams = unstable_cache(
  async (): Promise<string[]> => {
    console.log('🔄 Generating static params for all developers');
    const developers = await _listDevelopers();
    return developers.map(dev => dev.developer);
  },
  ['all-developer-params'],
  {
    tags: [CACHE_TAGS.DEVELOPERS, CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.DEVELOPERS
  }
);

/**
 * Utility function to get project count by developer (cached)
 */
export const getProjectCountByDeveloper = unstable_cache(
  async (developer: string): Promise<number> => {
    const projects = await _getProjectsByDeveloper(developer);
    return projects.length;
  },
  ['project-count-by-developer'],
  {
    tags: [CACHE_TAGS.PROJECTS_BY_DEVELOPER, CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.DEVELOPER_PROJECTS
  }
);

/**
 * Get featured projects (cached)
 * Returns projects marked as featured or top projects by views
 */
export const getFeaturedProjects = unstable_cache(
  async (limit: number = 6): Promise<Project[]> => {
    console.log(`🔄 Loading ${limit} featured projects (cache miss)`);
    const allProjects = await _loadAllProjects();
    
    // Filter featured projects or fallback to first projects
    const featured = allProjects.filter(p => p.featured === true);
    if (featured.length >= limit) {
      return featured.slice(0, limit);
    }
    
    // If not enough featured projects, return first projects
    return allProjects.slice(0, limit);
  },
  ['featured-projects'],
  {
    tags: [CACHE_TAGS.ALL_PROJECTS],
    revalidate: CACHE_DURATIONS.ALL_PROJECTS
  }
);

// Export cache tags for use in revalidation API
export { CACHE_TAGS as PROJECT_CACHE_TAGS };