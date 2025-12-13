/**
 * Unified Type Definitions for Imperium Gate
 * @module lib/data/types
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type Locale = 'en' | 'ar';

export type DeveloperKey = 'emaar' | 'damac' | 'nakheel' | 'sobha' | 'binghatti';

export interface LocalizedText {
  en?: string;
  ar?: string;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Location {
  city?: LocalizedText;
  area?: LocalizedText;
  address?: LocalizedText;
  lat?: number;
  lng?: number;
}

export interface Media {
  heroImage?: string;
  galleryImages?: string[];
  floorPlans?: string[];
  videoUrl?: string;
  tour3dUrl?: string;
  brochureUrl?: string;
}

export interface Pricing {
  min?: number;
  max?: number;
  currency?: string;
  paymentPlan?: LocalizedText;
}

export interface Amenity {
  name: LocalizedText;
  icon?: string;
}

export type ProjectStatus = 'planning' | 'under_construction' | 'completed';

export interface Project {
  // Basic Information (Required)
  slug: string;
  developer: DeveloperKey;
  
  // Content (Optional)
  name?: LocalizedText;
  description?: LocalizedText;
  shortDescription?: LocalizedText;
  
  // Location
  location?: Location;
  
  // Media
  media?: Media;
  
  // Pricing
  pricing?: Pricing;
  
  // Details
  bedrooms?: number[];
  amenities?: Amenity[];
  features?: LocalizedText[];
  
  // Status & Dates
  status?: ProjectStatus;
  launchDate?: string;
  deliveryDate?: string;
  
  // Additional Info
  totalUnits?: number;
  availableUnits?: number;
  projectType?: string;
}

// ============================================================================
// DEVELOPER TYPES
// ============================================================================

export interface Developer {
  key: DeveloperKey;
  name: LocalizedText;
  description?: LocalizedText;
  logo?: string;
  website?: string;
  projectsCount?: number;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface ProjectFilters {
  developer?: DeveloperKey;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number[];
  status?: ProjectStatus;
  searchQuery?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
