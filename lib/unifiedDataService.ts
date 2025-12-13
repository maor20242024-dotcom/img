// lib/unifiedDataService.ts
import 'server-only';
import fs from 'fs';
import path from 'path';
import type { MaybeLocalized, Project } from './types';

// Load Glossaries
const loadJSON = (p: string) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/i18n', p), 'utf-8'));
  } catch (e) { return {}; }
};

const arGlossary = loadJSON('ar_glossary.json');
const projectTypes = loadJSON('project_types_glossary.json');
const poiCategories = loadJSON('poi_categories_en_ar.json');

function slugify(input: string): string {
  const base = (input || '').toString()
    .replace(/\.[^.]+$/, '') // drop extension
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return base || 'project';
}

function generateSlug(p: any, filename: string): string {
  if (typeof p?.slug === 'string' && p.slug.trim()) {
    return slugify(p.slug.trim());
  }
  const name = typeof p?.projectName === 'string'
    ? p.projectName
    : (typeof p?.projectName === 'object' ? (p.projectName.en || p.projectName.ar || '') : '');
  if (name && name.trim()) {
    return slugify(name.trim());
  }
  return slugify(filename);
}

// Arabic-to-English fallback system with Glossary Support
function applyLanguageFallback(field: any, context?: 'amenity' | 'status' | 'category'): MaybeLocalized | undefined {
  if (!field) return undefined;

  if (typeof field === 'string') {
    const val = field.trim();
    if (!val) return undefined;

    // Try to auto-translate usage glossary
    if (context === 'amenity' && arGlossary[val.toLowerCase()]) {
      return { en: val, ar: arGlossary[val.toLowerCase()].ar };
    }
    return val;
  }

  if (typeof field === 'object' && field !== null) {
    const en = typeof field.en === 'string' ? field.en.trim() : '';
    const ar = typeof field.ar === 'string' ? field.ar.trim() : '';

    // Auto-fill Arabic if missing using Glossary
    let finalAr = ar;
    if (!finalAr && en && context) {
      // Check gloassaries
      if (context === 'amenity' && arGlossary[en.toLowerCase()]) {
        finalAr = arGlossary[en.toLowerCase()].ar;
      }
      else if (context === 'category') {
        const cat = poiCategories.categories?.find((c: any) => c.en.toLowerCase() === en.toLowerCase());
        if (cat) finalAr = cat.ar;
      }
    }

    // If Arabic is missing or empty, use English
    finalAr = finalAr || en;
    // If English is missing or empty, use Arabic
    const finalEn = en || ar;

    // Only return if we have at least one valid value
    if (finalEn || finalAr) {
      return {
        en: finalEn || undefined,
        ar: finalAr || undefined
      };
    }
  }

  return undefined;
}

// Helper to filter out banned domains
function isAllowedUrl(url: any): boolean {
  if (typeof url !== 'string') return false;
  if (!url.trim()) return false;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  
  // Must start with http:// or https://
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) return false;
  
  // User requested to remove any link that resolves to 'bayut-production'
  if (lower.includes('bayut-production')) return false;
  // Block invalid placeholder images (e.g. Binghatti currency symbol)
  if (lower.includes('uae_dirham_symbol')) return false;
  // Block description text that might be in image fields
  if (lower.includes('description') || lower.includes('no direct link')) return false;
  
  return true;
}

// Enhanced field validation and normalization
function validateAndNormalizeProject(rawProject: any, filename: string, developerName: string): Project | null {
  try {
    // Essential fields validation
    const projectName = applyLanguageFallback(
      rawProject.projectName || 
      rawProject.title || 
      rawProject.name || 
      { en: rawProject.name_en, ar: rawProject.name_ar }
    );
    if (!projectName) {
      console.warn(`⚠️ Skipping project in ${filename}: missing projectName/title`);
      return null;
    }

    // Generate slug with fallback
    const slug = generateSlug(rawProject, filename);

    // Create base project with required fields
    const project: Project = {
      slug,
      id: rawProject.id || `${developerName.toLowerCase()}-${slug}`,
      developer: developerName,
      communitySlug: rawProject.community_slug || rawProject.communitySlug,
      projectName,

      // Apply fallback to all localized fields
      country: applyLanguageFallback(rawProject.country || rawProject.extra?.country),
      city: applyLanguageFallback(rawProject.city || rawProject.extra?.city),
      area: applyLanguageFallback(rawProject.area || rawProject.extra?.area),
      location: applyLanguageFallback(rawProject.location || rawProject.extra?.location),
      description: applyLanguageFallback(rawProject.description || rawProject.extra?.description || { en: rawProject.description_en, ar: rawProject.description_ar }),
      summary: applyLanguageFallback(rawProject.summary || rawProject.extra?.summary),
      insights: applyLanguageFallback(rawProject.insights || rawProject.extra?.insights),
      mapDescription: applyLanguageFallback(rawProject.mapDescription || rawProject.extra?.map_description),
      projectStatus: applyLanguageFallback(rawProject.projectStatus || rawProject.extra?.project_status || rawProject.status, 'status'),

      // Numeric fields with validation - prioritize extra (snake_case)
      minPriceAED: typeof rawProject.minPriceAED === 'number' ? rawProject.minPriceAED :
        typeof rawProject.minPrice === 'number' ? rawProject.minPrice :
          typeof rawProject.extra?.min_price_a_e_d === 'number' ? rawProject.extra.min_price_a_e_d :
            typeof rawProject.price_aed_min === 'number' ? rawProject.price_aed_min : undefined,
      maxPriceAED: typeof rawProject.maxPriceAED === 'number' ? rawProject.maxPriceAED :
        typeof rawProject.maxPrice === 'number' ? rawProject.maxPrice :
          typeof rawProject.extra?.max_price_a_e_d === 'number' ? rawProject.extra.max_price_a_e_d :
            typeof rawProject.price_aed_max === 'number' ? rawProject.price_aed_max : undefined,

      minAreaSqft: typeof rawProject.minAreaSqft === 'number' ? rawProject.minAreaSqft :
        typeof rawProject.areaMin === 'number' ? rawProject.areaMin :
          typeof rawProject.extra?.min_area_sqft === 'number' ? rawProject.extra.min_area_sqft :
            typeof rawProject.area_sqft_min === 'number' ? rawProject.area_sqft_min : undefined,
      maxAreaSqft: typeof rawProject.maxAreaSqft === 'number' ? rawProject.maxAreaSqft :
        typeof rawProject.areaMax === 'number' ? rawProject.areaMax :
          typeof rawProject.extra?.max_area_sqft === 'number' ? rawProject.extra.max_area_sqft :
            typeof rawProject.area_sqft_max === 'number' ? rawProject.area_sqft_max : undefined,

      // Coordinates with validation
      latitude: typeof rawProject.latitude === 'number' ? rawProject.latitude :
        typeof rawProject.extra?.latitude === 'number' ? rawProject.extra.latitude :
          typeof rawProject.coordinates?.lat === 'number' ? rawProject.coordinates.lat : undefined,
      longitude: typeof rawProject.longitude === 'number' ? rawProject.longitude :
        typeof rawProject.extra?.longitude === 'number' ? rawProject.extra.longitude :
          typeof rawProject.coordinates?.lng === 'number' ? rawProject.coordinates.lng : undefined,
      // Media links with validation and fallback to extra (snake_case)
      // Supports unified engine format: hero: {type,src,poster} + gallery: [{src}]
      heroImage: (
        (rawProject?.hero?.type === 'image' && isAllowedUrl(rawProject?.hero?.src) ? String(rawProject.hero.src).trim() : undefined) ||
        (rawProject?.hero?.type === 'video' && isAllowedUrl(rawProject?.hero?.poster) ? String(rawProject.hero.poster).trim() : undefined) ||
        (isAllowedUrl(rawProject.heroImage) ? rawProject.heroImage.trim() :
          isAllowedUrl(rawProject.image_hero) ? rawProject.image_hero.trim() :
            isAllowedUrl(rawProject.extra?.hero_image) ? rawProject.extra.hero_image.trim() : undefined)
      ) || undefined,

      videoLink: (
        (rawProject?.hero?.type === 'video' && isAllowedUrl(rawProject?.hero?.src) ? String(rawProject.hero.src).trim() : undefined) ||
        (isAllowedUrl(rawProject.videoLink) ? rawProject.videoLink.trim() :
          isAllowedUrl(rawProject.video_url) ? rawProject.video_url.trim() :
            isAllowedUrl(rawProject.extra?.video_link) ? rawProject.extra.video_link.trim() : undefined)
      ) || undefined,

      // 🔍 ENHANCED MEDIA MAPPING (User Request: "english" (brochure) or "3d")
      brochurePdfLink: (
        isAllowedUrl(rawProject.brochurePdfLink) ? rawProject.brochurePdfLink.trim() :
          isAllowedUrl(rawProject.brochure_url) ? rawProject.brochure_url.trim() :
            isAllowedUrl(rawProject.pdf) ? rawProject.pdf.trim() :
              isAllowedUrl(rawProject.extra?.brochure_pdf_link) ? rawProject.extra.brochure_pdf_link.trim() :
                isAllowedUrl(rawProject.extra?.brochure_url) ? rawProject.extra.brochure_url.trim() :
                  // Nested checks common in some scraping output
                  isAllowedUrl(rawProject.extra?.brochure?.english) ? rawProject.extra.brochure.english.trim() :
                    isAllowedUrl(rawProject.extra?.brochure?.en) ? rawProject.extra.brochure.en.trim() :
                      isAllowedUrl(rawProject.extra?.english) ? rawProject.extra.english.trim() : // Direct "english" key
                        undefined
      ) || undefined,

      '3D_TourLink': (
        isAllowedUrl(rawProject['3D_TourLink']) ? rawProject['3D_TourLink'].trim() :
          isAllowedUrl(rawProject.tour_3d_url) ? rawProject.tour_3d_url.trim() :
            isAllowedUrl(rawProject.extra?.['3_d__tour_link']) ? rawProject.extra['3_d__tour_link'].trim() :
              isAllowedUrl(rawProject.extra?.tour_3d) ? rawProject.extra.tour_3d.trim() :
                isAllowedUrl(rawProject.extra?.virtual_tour) ? rawProject.extra.virtual_tour.trim() :
                  isAllowedUrl(rawProject.extra?.['3d']) ? rawProject.extra['3d'].trim() : // Direct "3d" key
                    undefined
      ) || undefined,
      // Arrays with validation
      galleryImages: (
        Array.isArray(rawProject?.gallery) && rawProject.gallery.length > 0
          ? rawProject.gallery
            .map((g: any) => (typeof g === 'string' ? g : g?.src))
            .filter(isAllowedUrl)
          : Array.isArray(rawProject.galleryImages) && rawProject.galleryImages.length > 0
            ? rawProject.galleryImages.filter(isAllowedUrl)
            : Array.isArray(rawProject.images_gallery) && rawProject.images_gallery.length > 0
              ? rawProject.images_gallery.filter(isAllowedUrl)
              : Array.isArray(rawProject.extra?.gallery_images)
                ? rawProject.extra.gallery_images.filter(isAllowedUrl)
                : []
      ),

      bedrooms: Array.isArray(rawProject.bedrooms) ? rawProject.bedrooms : undefined,

      // Dates with validation
      launchDate: typeof rawProject.launchDate === 'string' ? rawProject.launchDate.trim() || undefined :
        typeof rawProject.launch_date === 'string' ? rawProject.launch_date.trim() || undefined : undefined,
      deliveryDate: typeof rawProject.deliveryDate === 'string' ? rawProject.deliveryDate.trim() || undefined :
        typeof rawProject.handover === 'string' ? rawProject.handover.trim() || undefined :
          typeof rawProject.handover_date === 'string' ? rawProject.handover_date.trim() || undefined : undefined,

      // Boolean fields
      goldenVisaEligible: typeof rawProject.goldenVisaEligible === 'boolean' ? rawProject.goldenVisaEligible :
        typeof rawProject.golden_visa_eligible === 'boolean' ? rawProject.golden_visa_eligible : undefined,
      sellable: typeof rawProject.sellable === 'boolean' ? rawProject.sellable : true,

      // Complex objects
      amenities: Array.isArray(rawProject.amenities) ?
        rawProject.amenities.map((amenity: any) => {
          // Normalize amenity input (string or object)
          const nameInput = typeof amenity === 'string' ? amenity : amenity.name || amenity.en;
          return {
            name: applyLanguageFallback(nameInput, 'amenity') || { en: 'Amenity', ar: 'مرفق' },
            description: applyLanguageFallback(amenity.description)
          };
        }).filter((a: any) => a.name) : [],

      mapPointsOfInterest: [],
      news: Array.isArray(rawProject.news) ? rawProject.news : [],
      contact: typeof rawProject.contact === 'object' ? rawProject.contact : undefined,

      // Additional fields
      projectPageLink: typeof rawProject.projectPageLink === 'string' ? rawProject.projectPageLink.trim() || undefined : undefined,
      projectID: rawProject.projectID || rawProject.id || slug,
    };

    // Normalize POIs with fallback
    if (rawProject.mapPointsOfInterest) {
      if (Array.isArray(rawProject.mapPointsOfInterest)) {
        project.mapPointsOfInterest = rawProject.mapPointsOfInterest.map((poi: any) => ({
          name: applyLanguageFallback(poi.name) || { en: 'Point of Interest', ar: 'نقطة اهتمام' },
          distance: applyLanguageFallback(poi.distance),
          category: typeof poi.category === 'string' ? poi.category : 'general',
          coordinates: (typeof poi.coordinates === 'object' && poi.coordinates &&
            typeof poi.coordinates.lat === 'number' && typeof poi.coordinates.lon === 'number') ?
            poi.coordinates : { lat: 0, lon: 0 }
        }));
      } else if (typeof rawProject.mapPointsOfInterest === 'object') {
        const poisArray: any[] = [];
        Object.entries(rawProject.mapPointsOfInterest).forEach(([category, items]) => {
          if (Array.isArray(items)) {
            items.forEach((item: any) => {
              if (typeof item === 'string') {
                poisArray.push({
                  name: applyLanguageFallback(item, 'category') || { en: item, ar: item },
                  category: category,
                  coordinates: { lat: 0, lon: 0 }
                });
              } else if (typeof item === 'object') {
                poisArray.push({
                  name: applyLanguageFallback(item.name, 'category') || { en: item, ar: item },
                  distance: applyLanguageFallback(item.distance),
                  category: category,
                  coordinates: (typeof item.coordinates === 'object' && item.coordinates) ?
                    item.coordinates : { lat: 0, lon: 0 }
                });
              }
            });
          }
        });
        project.mapPointsOfInterest = poisArray;
      }
    }

    return project;
  } catch (error) {
    console.warn(`⚠️ Error normalizing project in ${filename}:`, error);
    return null;
  }
}

function readJSONFile(filePath: string): any[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.trim()) {
      console.warn(`⚠️ Empty file: ${filePath}`);
      return [];
    }

    const json = JSON.parse(content);
    if (Array.isArray(json)) return json;
    return [json];
  } catch (error) {
    console.warn(`⚠️ Failed to parse JSON file ${filePath}:`, error);
    return [];
  }
}

function loadFromDeveloperDir(developerDir: string, developerName: string): Project[] {
  // ✅ Unified Data Engine (public/data/developers/{dev}/projects.json)
  const unifiedProjectsFile = path.join(developerDir, 'projects.json');
  if (fs.existsSync(unifiedProjectsFile)) {
    const items = readJSONFile(unifiedProjectsFile);
    const normalized: Project[] = [];
    for (const raw of items) {
      const np = validateAndNormalizeProject(raw, 'projects.json', developerName);
      if (np) normalized.push(np);
    }
    return normalized;
  }

  const results: Project[] = [];

  try {
    // ✅ Check for projects subdirectory first (most common structure)
    const projectsSubdir = path.join(developerDir, 'projects');
    const hasProjectsSubdir = fs.existsSync(projectsSubdir) && fs.statSync(projectsSubdir).isDirectory();

    // If projects/ subdirectory exists, load from there
    if (hasProjectsSubdir) {
      const projectEntries = fs.readdirSync(projectsSubdir, { withFileTypes: true });

      for (const entry of projectEntries) {
        try {
          if (entry.isDirectory()) {
            // Each subdirectory is a project folder
            const projectDir = path.join(projectsSubdir, entry.name);
            const indexFile = path.join(projectDir, 'index.json');

            // Try index.json first
            if (fs.existsSync(indexFile)) {
              const items = readJSONFile(indexFile);
              items.forEach((rawProject: any) => {
                const normalizedProject = validateAndNormalizeProject(rawProject, entry.name, developerName);
                if (normalizedProject) {
                  results.push(normalizedProject);
                }
              });
            } else {
              // Try any JSON file in the directory
              try {
                const files = fs.readdirSync(projectDir, { withFileTypes: true });
                for (const file of files) {
                  if (file.isFile() && file.name.endsWith('.json')) {
                    const filePath = path.join(projectDir, file.name);
                    const items = readJSONFile(filePath);
                    items.forEach((rawProject: any) => {
                      const normalizedProject = validateAndNormalizeProject(rawProject, file.name, developerName);
                      if (normalizedProject) {
                        results.push(normalizedProject);
                      }
                    });
                  }
                }
              } catch (error) {
                console.warn(`⚠️ Failed to read project directory ${projectDir}:`, error);
              }
            }
          } else if (entry.isFile() && entry.name.endsWith('.json')) {
            // JSON file directly in projects/ folder
            const filePath = path.join(projectsSubdir, entry.name);
            const items = readJSONFile(filePath);
            items.forEach((rawProject: any) => {
              const normalizedProject = validateAndNormalizeProject(rawProject, entry.name, developerName);
              if (normalizedProject) {
                results.push(normalizedProject);
              }
            });
          }
        } catch (error) {
          console.warn(`⚠️ Failed to process project entry ${entry.name}:`, error);
        }
      }
    } else {
      // Fallback: Load from root developer directory (old structure)
      const entries = fs.readdirSync(developerDir, { withFileTypes: true });

      for (const entry of entries) {
        try {
          if (entry.isFile() && entry.name.endsWith('.json')) {
            const filePath = path.join(developerDir, entry.name);
            const items = readJSONFile(filePath);

            items.forEach((rawProject: any) => {
              const normalizedProject = validateAndNormalizeProject(rawProject, entry.name, developerName);
              if (normalizedProject) {
                results.push(normalizedProject);
              }
            });

          } else if (entry.isDirectory()) {
            if (entry.name === 'communities' || entry.name === 'projects') continue;

            const subdir = path.join(developerDir, entry.name);
            const canonical = path.join(subdir, `${entry.name}.json`);
            let items: any[] = [];

            if (fs.existsSync(canonical)) {
              items = readJSONFile(canonical);
            } else {
              try {
                const subentries = fs.readdirSync(subdir, { withFileTypes: true });
                for (const se of subentries) {
                  if (se.isFile() && se.name.endsWith('.json')) {
                    const fp = path.join(subdir, se.name);
                    const read = readJSONFile(fp);
                    items.push(...read);
                  }
                }
              } catch (error) {
                console.warn(`⚠️ Failed to read subdirectory ${subdir}:`, error);
              }
            }

            items.forEach((rawProject: any) => {
              const normalizedProject = validateAndNormalizeProject(rawProject, entry.name, developerName);
              if (normalizedProject) {
                results.push(normalizedProject);
              }
            });
          }
        } catch (error) {
          console.warn(`⚠️ Failed to process entry ${entry.name} in ${developerDir}:`, error);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️ Failed to read developer directory ${developerDir}:`, error);
  }

  return results;
}

// 🔥 DYNAMIC LOADING SYSTEM - No more all_projects.json dependency!
let projectsCache: Project[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function loadAllProjects(): Promise<Project[]> {
  // Use cache if available and not expired
  if (projectsCache && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return projectsCache;
  }

  const dataRoot = path.join(process.cwd(), 'public', 'data');
  let projects: Project[] = [];

  try {
    const devEntries = fs.readdirSync(dataRoot, { withFileTypes: true });

    for (const d of devEntries) {
      if (!d.isDirectory()) continue;

      const developerName = d.name;
      // Skip non-developer directories and the redundant 'developers' folder
      if (['node_modules', '.git', '.next', '.DS_Store', 'developers'].includes(developerName)) continue;

      const developerDir = path.join(dataRoot, developerName);

      try {
        const items = loadFromDeveloperDir(developerDir, developerName);
        if (items.length > 0) {
          projects.push(...items);
          console.log(`✅ Loaded ${items.length} projects from ${developerName}`);
        } else {
          console.warn(`⚠️ No valid projects found in ${developerName}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to load projects from ${developerName}:`, error);
        // Continue with other developers - don't break the entire system
        continue;
      }
    }
  } catch (error) {
    console.warn(`⚠️ Failed to read developer directories:`, error);
  }

  console.log(`🚀 DYNAMIC LOADING: Total ${projects.length} projects loaded from individual JSON files`);

  // Update cache
  projectsCache = projects;
  cacheTimestamp = Date.now();

  // إرجاع مصفوفة فارغة بدلاً من إيقاف التطبيق في حالة عدم وجود بيانات
  return projects;
}

export async function getProjectBySlug(dev: string, slug: string): Promise<Project | undefined> {
  const all = await loadAllProjects();
  return all.find(p => (p.developer === dev) && (p.slug === slug));
}

export async function getProjectsByDeveloper(dev: string): Promise<Project[]> {
  const allProjects = await loadAllProjects();
  return allProjects.filter(p => p.developer === dev);
}

export async function listDevelopers(): Promise<{ developer: string; count: number }[]> {
  const counts = new Map<string, number>();
  const allProjects = await loadAllProjects();
  for (const p of allProjects) {
    if (!p.developer) continue;
    counts.set(p.developer, (counts.get(p.developer) || 0) + 1);
  }
  return Array.from(counts.entries()).map(([developer, count]) => ({ developer, count }));
}


// Server-only synchronous loader moved to a separate file to avoid
// bundling Node modules like 'fs' into client builds.

// --- COMMUNITY LOADER ---

// Helper to normalize community
function titleCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function normalizeCommunity(raw: any, developer: string, slug: string): any {
  const fallbackName = titleCase(slug);
  
  // Combine image fields - only use valid URLs
  const candidateHero = raw.image_hero || raw.heroImage || raw.hero_image;
  const heroImage = isAllowedUrl(candidateHero) ? candidateHero : null;
  const galleryImages = (raw.images_gallery || raw.galleryImages || raw.images || []).filter(isAllowedUrl);
  const allMedia = heroImage ? [heroImage, ...galleryImages] : galleryImages;
  
  return {
    slug: raw.slug || slug,
    developer: raw.developer || developer,
    name: applyLanguageFallback(raw.name_en || raw.name || raw.communityName) || { en: fallbackName, ar: fallbackName }, // Enable i18n
    description: applyLanguageFallback(raw.description_en || raw.description) || { en: '', ar: '' },
    media: allMedia.length > 0 ? allMedia.filter(isAllowedUrl) : (raw.media || []).filter(isAllowedUrl),
    heroImage: heroImage,
    hero_prefer: raw.hero_prefer || 'image',
    location: raw.location || raw.coordinates || {
      address: { en: raw.district_en || raw.city_en, ar: raw.district_ar || raw.city_ar },
      city: { en: raw.city_en, ar: raw.city_ar },
      country: { en: raw.country_en, ar: raw.country_ar },
      lat: raw.coordinates?.lat,
      lng: raw.coordinates?.lng
    },
    amenities: raw.amenities || [],
    nearbyLandmarks: raw.nearby_landmarks || raw.nearbyLandmarks || [],
    videoUrl: raw.video_url || raw.videoUrl,
    tour3dUrl: raw.tour_3d_url || raw.tour3dUrl,
    brochureUrl: raw.brochure_url || raw.brochureUrl,
    type: 'community',
    extra: raw
  };
}

export async function getCommunitiesByDeveloper(dev: string): Promise<any[]> {
  // Check for projects/communities.json or projects/communities/index.json in public/data/{dev}
  const root = path.join(process.cwd(), 'public', 'data', dev);

  // 1. Try public/data/{dev}/communities.json
  const unifiedFile = path.join(root, 'communities.json');
  if (fs.existsSync(unifiedFile)) {
    try {
      const json = JSON.parse(fs.readFileSync(unifiedFile, 'utf-8'));
      const arr = Array.isArray(json) ? json : [json];
      return arr.map((c: any) => normalizeCommunity(c, dev, c?.slug || 'community')).filter(Boolean);
    } catch (e) {
      console.warn(`Failed to parse unified communities for ${dev}`, e);
      return [];
    }
  }

  // 2. Try public/data/{dev}/communities/ folder
  const dataRoot = path.join(root, 'communities');
  const results: any[] = [];

  if (!fs.existsSync(dataRoot)) return [];

  try {
    const entries = fs.readdirSync(dataRoot, { withFileTypes: true });
    for (const entry of entries) {
      try {
        if (entry.isDirectory()) {
          const indexFile = path.join(dataRoot, entry.name, 'index.json');
          if (fs.existsSync(indexFile)) {
            const content = fs.readFileSync(indexFile, 'utf-8');
            const json = JSON.parse(content);
            results.push(normalizeCommunity(json, dev, entry.name));
          }
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
          const content = fs.readFileSync(path.join(dataRoot, entry.name), 'utf-8');
          const json = JSON.parse(content);
          results.push(normalizeCommunity(json, dev, entry.name.replace('.json', '')));
        }
      } catch (e) {
        console.warn(`Failed to load community ${entry.name}`, e);
      }
    }
  } catch (e) {
    console.warn(`Failed to read communities dir for ${dev}`, e);
  }
  return results;
}

export async function getCommunityBySlug(dev: string, slug: string): Promise<any | null> {
  const all = await getCommunitiesByDeveloper(dev);
  return all.find(c => c.slug === slug) || null;
}

export async function getAllCommunities(): Promise<any[]> {
  const dataRoot = path.join(process.cwd(), 'public', 'data');
  let communities: any[] = [];

  try {
    const devEntries = fs.readdirSync(dataRoot, { withFileTypes: true });
    for (const d of devEntries) {
      if (!d.isDirectory()) continue;
      const developerName = d.name;
      if (['node_modules', '.git', '.next', '.DS_Store'].includes(developerName)) continue;

      const items = await getCommunitiesByDeveloper(developerName);
      communities.push(...items);
    }
  } catch (e) {
    console.warn('Failed to load all communities', e);
  }
  return communities;
}

export async function getCommunityBySlugGlobal(slug: string): Promise<any | null> {
  const all = await getAllCommunities();
  return all.find(c => c.slug === slug) || null;
}

// Developer Summary - combines projects and communities data
export async function getDeveloperSummary(devSlug: string) {
  const communities = await getCommunitiesByDeveloper(devSlug);
  const projects = await getProjectsByDeveloper(devSlug);

  // Calculate unique communities in projects if not present in communities list
  const projectCommunitySlugs = new Set(
    projects.map((p: any) => p.communitySlug || p.community_slug).filter(Boolean)
  );

  const totalProjects = projects.length;
  const totalCommunities = communities.length > 0 ? communities.length : projectCommunitySlugs.size;

  return {
    communities,
    projects,
    counts: {
      projects: totalProjects,
      communities: totalCommunities,
    },
  };
}

// Get community details with projects
export async function getCommunityDetails(devSlug: string, communitySlug: string) {
  const community = await getCommunityBySlug(devSlug, communitySlug);
  const projects = await getProjectsByDeveloper(devSlug);
  const projectsInCommunity = projects.filter((p: any) => 
    (p.communitySlug || p.community_slug) === communitySlug
  );

  return {
    community,
    projects: projectsInCommunity
  };
}
