/**
 * Unified Data Layer - Central Exports
 * @module lib/data
 */

// Export all types
export type {
  Locale,
  DeveloperKey,
  LocalizedText,
  Location,
  Media,
  Pricing,
  Amenity,
  ProjectStatus,
  Project,
  Developer,
  ProjectFilters,
  PaginatedResponse,
  ApiError,
} from './types';

// Export all service functions
export {
  getAllProjects,
  getProjectBySlug,
  getProjectsByDeveloper,
  getAllDevelopers,
  searchProjects,
} from './service';
