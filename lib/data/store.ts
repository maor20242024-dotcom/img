import type { Locale, Project, Developer } from './schema';

// Note: This is a compatibility layer that wraps the existing data loading
// In production, you should migrate to a unified JSON structure

/**
 * Get all projects from the existing data service
 * This is a wrapper around the existing loadAllProjects function
 */
export async function getAllProjects(): Promise<Project[]> {
  // Import dynamically to avoid circular dependencies
  const { loadAllProjects } = await import('../projects');
  const projects = await loadAllProjects();

  // Map existing data to new schema format
  return projects.map((p: any) => ({
    ...p,
    id: p.id || p.slug,
    developerKey: (p.developer?.toLowerCase() || 'emaar') as Project['developerKey'],
    entity: 'project' as const,
    slugs: {
      en: p.slug || p.seoSlug || p.id,
      ar: p.slug || p.seoSlug || p.id, // TODO: Add proper Arabic slugs
    },
    names: {
      en: p.projectName?.en || p.name?.en || p.projectName || p.name || 'Unnamed',
      ar: p.projectName?.ar || p.name?.ar || p.projectName || p.name || 'غير مسمى',
    },
    community: p.community
      ? {
          key: p.community.key || p.community,
          slugs: { en: p.community.slug || p.community, ar: p.community.slug || p.community },
        }
      : undefined,
    location: {
      city: p.city?.en || p.location?.en || 'Dubai',
      lat: p.latitude || p.lat,
      lng: p.longitude || p.lng,
    },
    priceRangeAED: {
      min: p.minPriceAED || p.price_from,
      max: p.maxPriceAED || p.price_to,
    },
    bedrooms: p.bedrooms || p.beds || [],
    hero: p.videoLink
      ? {
          type: 'video' as const,
          src: p.videoLink,
          poster: p.heroImage || p.images?.[0],
        }
      : p.heroImage
      ? {
          type: 'image' as const,
          src: p.heroImage,
        }
      : undefined,
    gallery: p.galleryImages?.map((src: string) => ({ src })) ||
      p.images?.map((src: string) => ({ src })) || [],
    assets: {
      brochure: {
        en: p.brochurePdfLink || null,
        ar: p.brochurePdfLink || null,
      },
      tour3d: {
        matterport: p['3D_TourLink'] || p.tour3d || null,
        propvr: null,
      },
    },
    status: p.status === 'completed' ? 'completed' : 'under_construction',
    tags: p.tags || [],
    relatedBy: ['developer'],
  } as Project));
}

/**
 * Get all developers
 */
export async function getAllDevelopers(): Promise<Developer[]> {
  return [
    {
      key: 'emaar',
      name: { en: 'Emaar Properties', ar: 'إعمار العقارية' },
      description: { en: 'Leading real estate developer in Dubai', ar: 'مطور عقاري رائد في دبي' },
      logoWhite: '/media/logo/emaar-logo-white.png',
    },
    {
      key: 'damac',
      name: { en: 'DAMAC Properties', ar: 'داماك العقارية' },
      description: { en: 'Luxury real estate developer', ar: 'مطور عقارات فاخرة' },
      logoWhite: '/media/logo/damac-logo-white.png',
    },
    {
      key: 'nakheel',
      name: { en: 'Nakheel', ar: 'نخيل' },
      description: { en: 'Master developer in Dubai', ar: 'المطور الرئيسي في دبي' },
      logoWhite: '/media/logo/nakheel-logo-white.png',
    },
    {
      key: 'sobha',
      name: { en: 'Sobha Realty', ar: 'صوبا ريالتي' },
      description: { en: 'Premium real estate developer', ar: 'مطور عقاري متميز' },
      logoWhite: '/media/logo/sobha-logo-white.png',
    },
    {
      key: 'binghatti',
      name: { en: 'Binghatti', ar: 'بن غاطي' },
      description: { en: 'Innovative property developer', ar: 'مطور عقاري مبتكر' },
      logoWhite: '/media/logo/binghatti-logo-white.png',
    },
  ];
}

/**
 * Get developer by key
 */
export async function getDeveloperByKey(key: string): Promise<Developer | null> {
  const devs = await getAllDevelopers();
  return devs.find(d => d.key === key) ?? null;
}

/**
 * Get projects by developer
 */
export async function getProjectsByDeveloper(key: string): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter(p => p.developerKey === key);
}

/**
 * Get project by developer and slug
 */
export async function getProjectByDevAndSlug(
  locale: Locale,
  developerKey: string,
  slug: string
): Promise<Project | null> {
  const list = await getProjectsByDeveloper(developerKey);
  return list.find(p => p.slugs[locale] === slug) ?? null;
}

/**
 * Get project by slug (lenient matching across multiple fields)
 */
export async function getProjectBySlug(
  locale: Locale,
  developerKey: string,
  projectSlug: string
): Promise<Project | null> {
  const normSlug = (v?: any): string =>
    String(v ?? '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const projects = await getProjectsByDeveloper(developerKey);
  const wanted = normSlug(projectSlug);

  // Try exact match first
  const exact = projects.find(p => p.slugs[locale] === wanted);
  if (exact) return exact;

  // Lenient matching
  return projects.find(p => {
    const candidates = [
      p.slugs.en,
      p.slugs.ar,
      p.id,
    ].filter(Boolean).map(normSlug);
    return candidates.includes(wanted);
  }) ?? null;
}

/**
 * Derive unique communities from all projects
 */
export async function deriveCommunities(): Promise<{
  key: string;
  slugs: { en: string; ar: string };
  names: { en: string; ar: string };
  projectCount: number;
}[]> {
  const projects = await getAllProjects();
  const communityMap = new Map<string, {
    key: string;
    slugs: { en: string; ar: string };
    names: { en: string; ar: string };
    projectCount: number;
  }>();

  for (const project of projects) {
    if (!project.community?.key) continue;

    const key = project.community.key;
    if (!communityMap.has(key)) {
      communityMap.set(key, {
        key,
        slugs: project.community.slugs,
        names: {
          en: project.community.key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          ar: project.community.key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        },
        projectCount: 0,
      });
    }

    const community = communityMap.get(key)!;
    community.projectCount++;
  }

  return Array.from(communityMap.values()).sort((a, b) => b.projectCount - a.projectCount);
}

/**
 * Get projects by community
 */
export async function getProjectsByCommunity(communityKey: string): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter(p => p.community?.key === communityKey);
}

/**
 * Get related projects based on community, developer, or location
 * Priority: community → developer → city → random
 */
export async function getRelatedProjects(
  locale: Locale,
  current: Project,
  limit: number = 6
): Promise<Project[]> {
  const all = await getAllProjects();

  // Priority 1: Same community (if exists)
  if (current.community?.key) {
    const poolCommunity = all.filter(
      p => p.community?.key === current.community?.key && p.id !== current.id
    );
    if (poolCommunity.length >= limit) {
      return poolCommunity.slice(0, limit);
    }
  }

  // Priority 2: Same developer
  const poolDeveloper = all.filter(
    p => p.developerKey === current.developerKey && p.id !== current.id
  );
  if (poolDeveloper.length >= limit) {
    return poolDeveloper.slice(0, limit);
  }

  // Priority 3: Same city
  if (current.location?.city) {
    const poolCity = all.filter(
      p => p.location?.city === current.location?.city && p.id !== current.id
    );
    if (poolCity.length >= limit) {
      return poolCity.slice(0, limit);
    }
  }

  // Priority 4: Random from all (excluding current)
  const poolRandom = all.filter(p => p.id !== current.id);
  return poolRandom.slice(0, limit);
}
