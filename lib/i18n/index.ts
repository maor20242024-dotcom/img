import arGloss from './ar_glossary.json';
import travel from './area_travel_times_km_min.json';
import coords from './areas_coordinates.json';
import units from './distance_units.json';
import areas from './dubai_areas_en_ar.json';
import biGloss from './glossary_ar_en.json';
import poiCats from './poi_categories_en_ar.json';
import poiList from './poi_landmarks_en_ar.json';
import types from './project_types_glossary.json';
import transport from './transport_profiles.json';
export const I18N = { arGloss, travel, coords, units, areas, biGloss, poiCats, poiList, types, transport };
export type Locale = 'ar'|'en';

// Client-safe helpers for distance and phrasing
export type LatLon = { lat: number; lon: number };

export function distanceKm(a: LatLon, b: LatLon): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.atan2(
    Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon),
    Math.sqrt(1 - (sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon))
  );
  return Math.max(0, R * c);
}

export function estimateMinutes(km: number, profile: 'urban' | 'highway' = 'urban'): number {
  const kph = I18N.transport?.profiles?.[profile]?.avgKph ?? (profile === 'highway' ? 80 : 45);
  const minutes = (km / Math.max(1, kph)) * 60;
  return Math.round(minutes);
}

export function formatDistancePhrase(locale: Locale, km: number, min: number, landmark: string): string {
  const tpl = I18N.transport?.phrases?.[locale] ?? (locale === 'ar'
    ? 'يبعد ~{km} كم (≈{min} دقيقة) عن {landmark}'
    : '~{km} km (≈{min} min) from {landmark}');
  const kmStr = (Math.round(km * 10) / 10).toString();
  const minStr = Math.max(1, Math.round(min)).toString();
  return tpl
    .replace('{km}', kmStr)
    .replace('{min}', minStr)
    .replace('{landmark}', landmark);
}
