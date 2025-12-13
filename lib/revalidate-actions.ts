// lib/revalidate-actions.ts - Server Actions for ISR Revalidation
'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { PROJECT_CACHE_TAGS } from './projects';

/**
 * Server action to revalidate all project-related caches
 */
export async function revalidateAllProjects() {
  try {
    revalidateTag(PROJECT_CACHE_TAGS.ALL_PROJECTS);
    revalidateTag(PROJECT_CACHE_TAGS.DEVELOPERS);
    revalidateTag(PROJECT_CACHE_TAGS.PROJECT_BY_SLUG);
    revalidateTag(PROJECT_CACHE_TAGS.PROJECTS_BY_DEVELOPER);

    // Also revalidate main pages
    revalidatePath('/ar/projects');
    revalidatePath('/en/projects');
    revalidatePath('/ar');
    revalidatePath('/en');

    console.log('🔄 Revalidated all project caches');
    return { success: true, message: 'All project caches revalidated successfully' };
  } catch (error) {
    console.error('❌ Error revalidating all projects:', error);
    return { success: false, message: 'Failed to revalidate caches' };
  }
}

/**
 * Server action to revalidate a specific project
 */
export async function revalidateProject(developer: string, slug: string) {
  try {
    revalidateTag(PROJECT_CACHE_TAGS.PROJECT_BY_SLUG);
    revalidateTag(PROJECT_CACHE_TAGS.PROJECTS_BY_DEVELOPER);

    // Revalidate specific project pages
    revalidatePath(`/ar/projects/${developer}/${slug}`);
    revalidatePath(`/en/projects/${developer}/${slug}`);

    // Also revalidate projects listing
    revalidatePath('/ar/projects');
    revalidatePath('/en/projects');

    console.log(`🔄 Revalidated project: ${developer}/${slug}`);
    return { success: true, message: `Project ${developer}/${slug} revalidated successfully` };
  } catch (error) {
    console.error(`❌ Error revalidating project ${developer}/${slug}:`, error);
    return { success: false, message: 'Failed to revalidate project' };
  }
}

/**
 * Server action to revalidate all projects by a specific developer
 */
export async function revalidateDeveloperProjects(developer: string) {
  try {
    revalidateTag(PROJECT_CACHE_TAGS.PROJECTS_BY_DEVELOPER);
    revalidateTag(PROJECT_CACHE_TAGS.ALL_PROJECTS);

    // Revalidate projects listing
    revalidatePath('/ar/projects');
    revalidatePath('/en/projects');

    console.log(`🔄 Revalidated projects for developer: ${developer}`);
    return { success: true, message: `Projects for ${developer} revalidated successfully` };
  } catch (error) {
    console.error(`❌ Error revalidating developer ${developer}:`, error);
    return { success: false, message: 'Failed to revalidate developer projects' };
  }
}

/**
 * Server action to revalidate developers list
 */
export async function revalidateDevelopers() {
  try {
    revalidateTag(PROJECT_CACHE_TAGS.DEVELOPERS);

    // Revalidate pages that show developers
    revalidatePath('/ar/projects');
    revalidatePath('/en/projects');
    revalidatePath('/ar/developers');
    revalidatePath('/en/developers');

    console.log('🔄 Revalidated developers list');
    return { success: true, message: 'Developers list revalidated successfully' };
  } catch (error) {
    console.error('❌ Error revalidating developers:', error);
    return { success: false, message: 'Failed to revalidate developers' };
  }
}

/**
 * Server action to revalidate home page and featured projects
 */
export async function revalidateHomePage() {
  try {
    revalidateTag(PROJECT_CACHE_TAGS.ALL_PROJECTS);

    // Revalidate home pages
    revalidatePath('/ar');
    revalidatePath('/en');

    console.log('🔄 Revalidated home page');
    return { success: true, message: 'Home page revalidated successfully' };
  } catch (error) {
    console.error('❌ Error revalidating home page:', error);
    return { success: false, message: 'Failed to revalidate home page' };
  }
}

/**
 * Server action to revalidate specific paths
 */
export async function revalidateCustomPath(path: string) {
  try {
    revalidatePath(path);

    console.log(`🔄 Revalidated path: ${path}`);
    return { success: true, message: `Path ${path} revalidated successfully` };
  } catch (error) {
    console.error(`❌ Error revalidating path ${path}:`, error);
    return { success: false, message: 'Failed to revalidate path' };
  }
}

/**
 * Server action to revalidate specific cache tags
 */
export async function revalidateCustomTag(tag: string) {
  try {
    revalidateTag(tag);

    console.log(`🔄 Revalidated tag: ${tag}`);
    return { success: true, message: `Tag ${tag} revalidated successfully` };
  } catch (error) {
    console.error(`❌ Error revalidating tag ${tag}:`, error);
    return { success: false, message: 'Failed to revalidate tag' };
  }
}

/**
 * Utility function to get all available cache tags
 */
export function getAvailableCacheTags() {
  return Object.values(PROJECT_CACHE_TAGS);
}

/**
 * Utility function to get cache statistics (for admin dashboard)
 */
export async function getCacheInfo() {
  return {
    tags: Object.values(PROJECT_CACHE_TAGS),
    lastRevalidated: new Date().toISOString(),
    availableActions: [
      'revalidateAllProjects',
      'revalidateProject',
      'revalidateDeveloperProjects',
      'revalidateDevelopers',
      'revalidateHomePage',
      'revalidateCustomPath',
      'revalidateCustomTag'
    ]
  };
}