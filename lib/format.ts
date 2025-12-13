export type Locale = 'ar' | 'en';

export function formatAED(n?: number, locale: Locale = 'ar') {
  if (typeof n !== 'number') return '—';
  const suffix = locale === 'ar' ? ' درهم' : ' AED';
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M${suffix}`;
  }
  return `${n.toLocaleString('en-US').replace(/\.\d+/, '')}${suffix}`;
}

export function formatArea(min?: number, max?: number, unit: 'sqm' | 'sqft' = 'sqm', locale: Locale = 'ar') {
  const unitText = locale === 'ar' ? (unit === 'sqm' ? 'م²' : 'قدم²') : unit;
  if (typeof min !== 'number' && typeof max !== 'number') return '—';
  if (typeof min === 'number' && typeof max === 'number' && max > min) {
    return `${min.toLocaleString('en-US')} – ${max.toLocaleString('en-US')} ${unitText}`;
  }
  const val = min ?? max;
  return `${val?.toLocaleString('en-US')} ${unitText}`;
}

export function formatBedrooms(arr?: number[] | string, locale: Locale = 'ar') {
  if (!arr) return '—';
  
  // If it's already a string, return it as-is (it's already formatted)
  if (typeof arr === 'string') {
    return arr;
  }
  
  // If it's an array but empty, return dash
  if (Array.isArray(arr) && !arr.length) return '—';
  
  // If it's an array, format it
  if (Array.isArray(arr)) {
    const suffix = locale === 'ar' ? ' غرف' : ' BR';
    return `${arr.join(', ')}${suffix}`;
  }
  
  return '—';
}

export const proxify = (url: string) => {
  if (!url) return url;
  
  // If it's already a local URL or data URL, return as-is
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // If missing protocol (e.g. 'youtu.be/...' or 'example.com/file'), assume https
  if (!/^([a-zA-Z]+:\/\/)/.test(url)) {
    url = `https://${url}`;
  }

  // Only proxy static media files from specific domains (ctfassets.net, amazonaws.com)
  // Do NOT proxy navigation links, 3D tour links, or other interactive content
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol === 'https:' || urlObj.protocol === 'http:') {
      // Only proxy if it's a static media file from trusted CDN domains
      if (url.includes('ctfassets.net') || url.includes('amazonaws.com')) {
        return `/api/proxy/file?url=${encodeURIComponent(url)}`;
      }
      // For all other external URLs (PropVR, 3D tours, etc.), return as-is
      return url;
    }
  } catch (e) {
    // If URL parsing fails, return original
    console.warn('Failed to parse URL for proxying:', url);
  }
  
  return url;
};

export const currencyAED = (n: number | null | undefined) => {
  if (n === null || n === undefined) return '';
  return n.toLocaleString('en-US').replace(/\.\d+/, '') + ' AED';
};
