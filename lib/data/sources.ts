import { Project, MaybeLocalized } from '@/lib/types';

// Developer names mapping
export const DEVELOPERS = {
  emaar: 'Emaar',
  damac: 'DAMAC',
  nakheel: 'Nakheel',
  sobha: 'Sobha'
} as const;

export type DeveloperKey = keyof typeof DEVELOPERS;

// Project file mappings for each developer (fallback static list)
const PROJECT_FILES: Record<DeveloperKey, string[]> = {
  emaar: [
    '52-42',
    'act-one-act-two-at-downtown-dubai',
    'address-al-marjan-island',
    'address-grand-downtown',
    'address-residences-al-marjan-island',
    'address-residences-the-bay',
    'address-residences-zabeel',
    'address-residences-–-dubai-opera',
    'aurea-at-rashid-yachts-&-marina',
    'baystar-by-vida',
    'bayview-by-address-resorts-at-emaar-beachfront',
    'beach-isle',
    'beach-mansion',
    'beach-vista',
    'beachgate-by-address',
    'boulevard-heights-at-downtown-dubai',
    'boulevard-point',
    'burj-crown',
    'downtown-views-ii',
    'forte',
    'grande-signature-residences',
    'il-primo',
    'marina-cove-at-dubai-marina',
    'marina-shores',
    'marina-vista',
    'opera-grand-at-downtown-dubai',
    'south-beach',
    'sunrise-bay',
    'the-bristol-luxury-hotels-&-resorts',
    'the-oasis-by-emaar',
    'the-residence-burj-khalifa',
    'the-st.-regis-residences,-downtown-dubai',
    'vida-dubai-mall',
    'vida-residences-dubai-marina',
    'vindera-at-the-valley'
  ],
  damac: [
    'altitude-de-grisogono',
    'aykon-city-tower-b',
    'belair-villas-the-trump-estates-ii',
    'canal-heights-de-grisogono',
    'cavalli-estates-villas',
    'chelsea-residences',
    'couture-by-cavalli',
    'damac-bay-by-cavalli',
    'damac-district',
    'damac-majestine',
    'damac-residenze',
    'damac-riverside',
    'damac-volta-tower',
    'elo-2-damac-hills-2',
    'elo-3-apartments-damac-hills-2-for-sale-in-dubai',
    'evergreens',
    'golf-gate-2-damac-hills',
    'golf-town',
    'harbour-lights-de-grisogono',
    'kiara-at-damac-hills',
    'safa-one-de-grisogono',
    'vera-residences'
  ],
  nakheel: [
    'bay-grove-residences',
    'bay-villas,-dubai-islands',
    'canal-front-residences',
    'club-vista-mare',
    'como-residences',
    'discovery-gardens',
    'district-one',
    'golden-mile',
    'jebel-ali-village',
    'jumeirah-heights',
    'jumeirah-islands',
    'jumeirah-park',
    'jumeirah-village-circle',
    'jumeirah-village-triangle',
    'marina-residences',
    'masakin-al-furjan',
    'meydan',
    'murooj-al-furjan',
    'nad-al-sheba-villas',
    'palm-jebel-ali',
    'palm-jumeirah',
    'palma-residences',
    'shoreline-apartments',
    'the-world',
    'tilal-al-furjan',
    'veneto',
    'warsan-village'
  ],
  sobha: [
    'creek-vistas-grande',
    'sobha-aquamont',
    'sobha-estates',
    'sobha-garden-houses',
    'sobha-gardenia-villas',
    'sobha-hartland',
    'sobha-seahaven',
    'the-eden',
    'the-tranquil'
  ]
};

// Dynamically fetch slugs from the filesystem via API, with static fallback
export async function fetchDeveloperSlugs(developer: DeveloperKey): Promise<string[]> {
  try {
    const res = await fetch(`/api/public-data/${developer}`, { cache: 'no-store' });
    if (!res.ok) return PROJECT_FILES[developer];
    const data = await res.json();
    const slugs = Array.isArray(data?.slugs) ? data.slugs as string[] : [];
    return slugs.length ? slugs : PROJECT_FILES[developer];
  } catch (e) {
    return PROJECT_FILES[developer];
  }
}

// Interface for map marker data
export interface MapMarker {
  id: string;
  name: string;
  developer: string;
  latitude: number;
  longitude: number;
  slug: string;
  location?: string;
  price?: string;
  status?: string;
  type?: string;
  image?: string;
}

// Load a single project
export async function loadProject(developer: DeveloperKey, slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`/data/${developer}/${slug}.json`);
    if (!response.ok) return null;

    const project = await response.json();
    return {
      ...project,
      developer: DEVELOPERS[developer],
      slug
    };
  } catch (error) {
    console.error(`Error loading project ${developer}/${slug}:`, error);
    return null;
  }
}

// Load all projects for a developer
export async function loadDeveloperProjects(developer: DeveloperKey): Promise<Project[]> {
  const projects: Project[] = [];
  const files = await fetchDeveloperSlugs(developer);

  for (const slug of files) {
    const project = await loadProject(developer, slug);
    if (project) {
      projects.push(project);
    }
  }

  return projects;
}

// Load all projects from all developers
export async function loadAllProjects(): Promise<Project[]> {
  const allProjects: Project[] = [];

  for (const developer of Object.keys(DEVELOPERS) as DeveloperKey[]) {
    const projects = await loadDeveloperProjects(developer);
    allProjects.push(...projects);
  }

  return allProjects;
}

// Helper function to safely extract text from MaybeLocalized values
function getLocalizedText(value: MaybeLocalized | undefined, fallback: string = ''): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return (value as any).en || (value as any).ar || fallback;
}

// Convert projects to map markers
export function projectsToMapMarkers(projects: Project[]): MapMarker[] {
  return projects
    .filter(project => {
      // Only include projects with valid coordinates
      const lat = project.latitude;
      const lng = project.longitude;
      return lat && lng &&
        typeof lat === 'number' && typeof lng === 'number' &&
        !isNaN(lat) && !isNaN(lng) &&
        Math.abs(lat) > 0.001 && Math.abs(lng) > 0.001; // Avoid placeholder coordinates
    })
    .map(project => ({
      id: `${project.developer}-${project.slug}`,
      name: getLocalizedText(project.projectName, 'Unknown Project'),
      developer: project.developer || 'Unknown Developer',
      latitude: project.latitude!,
      longitude: project.longitude!,
      slug: project.slug,
      location: getLocalizedText(project.location) || getLocalizedText(project.area) || getLocalizedText(project.city),
      price: typeof project.minPriceAED === 'number' ? `AED ${project.minPriceAED.toLocaleString()}` : undefined,
      status: getLocalizedText(project.projectStatus),
      type: getLocalizedText(project.propertyTypes?.[0]),
      image: project.galleryImages?.[0] || project.heroImage || '/media/logo.png'
    }));
}

// Load all map markers
export async function loadAllMapMarkers(): Promise<MapMarker[]> {
  const projects = await loadAllProjects();
  return projectsToMapMarkers(projects);
}

// Get projects by location/area
export function getProjectsByArea(projects: Project[], area: string): Project[] {
  return projects.filter(project => {
    const location = typeof project.location === 'string'
      ? project.location
      : (project.location as any)?.en || '';
    return location.toLowerCase().includes(area.toLowerCase());
  });
}

// Get projects by developer
export function getProjectsByDeveloper(projects: Project[], developer: string): Project[] {
  return projects.filter(project =>
    project.developer && project.developer.toLowerCase() === developer.toLowerCase()
  );
}

// Get projects by price range
export function getProjectsByPriceRange(projects: Project[], minPrice: number, maxPrice: number): Project[] {
  return projects.filter(project => {
    const priceVal = project.price;
    const priceStr = typeof priceVal === 'object' && priceVal !== null && 'en' in priceVal 
      ? (priceVal as any).en 
      : (priceVal || '');
    const price = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
    return price >= minPrice && price <= maxPrice;
  });
}
