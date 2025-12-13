// lib/units.ts
import { getProjectBySlug } from './projects';

export type UnitSummary = {
  unit_code: string;
  title: {
    ar?: string;
    en?: string;
  } | undefined;
  status: string | undefined;
  pricing: {
    aed?: number;
    usd?: number;
  } | undefined;
  area: {
    sqft?: number;
    sqm?: number;
  } | undefined;
};

export type ProjectUnitsSummary = {
  project_slug: string;
  count: number;
  units: UnitSummary[];
};

export async function listUnitsSummary(
  projectSlug: string,
  developer: string
): Promise<ProjectUnitsSummary> {
  const project = await getProjectBySlug(developer, projectSlug);

  if (!project || !project.units || !Array.isArray(project.units)) {
    return {
      project_slug: projectSlug,
      count: 0,
      units: [],
    };
  }

  const units: UnitSummary[] = project.units.map((u: any) => ({
    unit_code: u.unit_code || u.id || 'N/A',
    title: u.title || u.name,
    status: u.status,
    pricing: u.pricing,
    area: u.area,
  }));

  return {
    project_slug: projectSlug,
    count: units.length,
    units,
  };
}
