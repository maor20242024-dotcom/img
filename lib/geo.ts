import type { Project } from './types';
export function deriveProjectLatLon(p: Project): {lat?:number; lon?:number} {
  const valid = (x?:number)=> typeof x==='number' && Number.isFinite(x) && Math.abs(x)>0;
  if (valid(p.latitude) && valid(p.longitude)) return { lat: p.latitude, lon: p.longitude };
  const pois = p.mapPointsOfInterest || [];
  const first = pois.find(po=>po.coordinates)?.coordinates;
  if (first) return { lat: first.lat, lon: first.lon };
  if (pois.length){
    const arr = pois.map(po=>po.coordinates).filter(Boolean) as {lat:number;lon:number}[];
    if (arr.length){ const lat = arr.reduce((a,c)=>a+c.lat,0)/arr.length; const lon = arr.reduce((a,c)=>a+c.lon,0)/arr.length; return {lat,lon}; }
  }
  return {};
}
