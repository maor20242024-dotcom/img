import type { Project as DataProject, Locale } from './schema';
import type { Project as LegacyProject } from '@/lib/types';
import { getSlug } from './filters';

const toLocalized = (value?: string) =>
  value ? { en: value, ar: value } : undefined;

export function toLegacyProject(project: DataProject, locale: Locale): LegacyProject {
  const legacyProject = project as unknown as LegacyProject;
  const slug = legacyProject.slug ?? getSlug(project, locale);
  const developer = legacyProject.developer ?? project.developerKey;

  const projectName = legacyProject.projectName ?? {
    en: project.names?.en ?? slug,
    ar: project.names?.ar ?? slug,
  };

  const galleryImages = legacyProject.galleryImages ?? project.gallery?.map(img => img.src) ?? [];
  const heroImage = legacyProject.heroImage ?? (project.hero?.type === 'image' ? project.hero.src : undefined);
  const videoLink = legacyProject.videoLink ?? (project.hero?.type === 'video' ? project.hero.src : undefined);
  const minPriceAED = legacyProject.minPriceAED ?? project.priceRangeAED?.min;
  const maxPriceAED = legacyProject.maxPriceAED ?? project.priceRangeAED?.max;
  const projectStatus = legacyProject.projectStatus ?? project.status;
  const startingPrice = legacyProject.startingPrice ?? minPriceAED;
  const brochure = legacyProject.brochurePdfLink
    ?? project.assets?.brochure?.[locale]
    ?? project.assets?.brochure?.en
    ?? project.assets?.brochure?.ar
    ?? undefined;
  const tour3d = legacyProject['3D_TourLink']
    ?? project.assets?.tour3d?.matterport
    ?? project.assets?.tour3d?.propvr
    ?? undefined;
  const latitude = legacyProject.latitude ?? project.location?.lat;
  const longitude = legacyProject.longitude ?? project.location?.lng;
  const area = legacyProject.area ?? (project.community?.slugs
    ? toLocalized(project.community.slugs[locale]) ?? toLocalized(project.community.slugs.en)
    : undefined);
  const location = legacyProject.location ?? (project.location?.city ? toLocalized(project.location.city) : undefined);

  return {
    ...legacyProject,
    slug,
    developer,
    projectName,
    galleryImages,
    heroImage,
    videoLink,
    minPriceAED,
    maxPriceAED,
    startingPrice,
    projectStatus,
    brochurePdfLink: brochure,
    ['3D_TourLink']: tour3d,
    latitude,
    longitude,
    area,
    location,
  };
}

export function toLegacyProjects(projects: DataProject[], locale: Locale): LegacyProject[] {
  return projects.map(project => toLegacyProject(project, locale));
}
