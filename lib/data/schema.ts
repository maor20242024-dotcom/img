export type Locale = 'en' | 'ar';

export type Project = {
  id: string;
  developerKey: 'emaar' | 'damac' | 'nakheel' | 'sobha' | 'binghatti';
  entity: 'project';
  slugs: { en: string; ar: string };
  names: { en: string; ar: string };
  community?: { key: string; slugs: { en: string; ar: string } };
  location?: { city?: string; lat?: number; lng?: number };
  priceRangeAED?: { min?: number; max?: number };
  bedrooms?: number[];
  hero?: { type: 'video' | 'image'; src: string; poster?: string };
  gallery?: { src: string; alt?: { en?: string; ar?: string } }[];
  assets?: {
    brochure?: { en?: string | null; ar?: string | null };
    tour3d?: { matterport?: string | null; propvr?: string | null };
  };
  status?: 'under_construction' | 'completed';
  tags?: string[];
  relatedBy?: ('developer' | 'community')[];
};

export type Developer = {
  key: Project['developerKey'];
  name: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  logoWhite?: string; // /media/logo/{key}-logo-white.png
};
