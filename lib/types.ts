export type Locale = 'ar' | 'en';
export type LocalizedString = { ar?: string; en?: string };
export type LocationObject = { city?: string; lat?: number; lng?: number };
export type MaybeLocalized = string | LocalizedString | LocationObject;

export interface Community {
  slug: string;
  developer: string;
  name: string;
  description: string;
  media: string[];
  hero_prefer: 'image' | 'video';
  location?: { lat: number; lng: number; city?: string };
  type: 'community';
  extra: Record<string, any>;
}

export interface Amenity {
  name: LocalizedString;
  description?: LocalizedString;
}

export interface MapPOI {
  name: MaybeLocalized;
  distance?: MaybeLocalized;
  category?: string | Record<string, unknown>;
  coordinates: { lat: number; lon: number };
  title?: MaybeLocalized;
}

export interface Contact {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export interface NewsItem {
  title: MaybeLocalized;
  url?: string;
  date?: string;
  source?: string;
}

export interface Project {
  slug: string;
  id?: string;
  developer?: string;
  developer_slug?: string; // New field

  projectName: MaybeLocalized; // Old field, mapped from 'name' in data? No, new data uses 'name'
  name?: string; // New field



  country?: MaybeLocalized;
  city?: MaybeLocalized;
  area?: MaybeLocalized;
  location?: MaybeLocalized;

  description?: MaybeLocalized; // Old field
  summary?: MaybeLocalized;
  insights?: MaybeLocalized;

  hero_prefer?: 'image' | 'video'; // New field
  media?: string[]; // New field
  extra?: Record<string, any>; // New field
  community?: string | { key: string; slugs: { en: string; ar: string } };
  community_slug?: string;
  type?: 'project'; // New field
  units?: any[]; // New field


  amenities?: Amenity[];
  mapDescription?: MaybeLocalized;
  mapPointsOfInterest?: MapPOI[];

  bedrooms?: number[];
  propertyTypes?: Array<MaybeLocalized>;

  brochurePdfLink?: string;
  brochure_url?: string;
  videoLink?: string;
  videoUrl?: string;
  "3D_TourLink"?: string;

  galleryImages?: string[];
  images_gallery?: string[];
  heroImage?: string;
  image_hero?: string;

  launchDate?: string;
  deliveryDate?: string;

  goldenVisaEligible?: boolean;
  views?: LocalizedString[];
  highlights?: LocalizedString[];

  minAreaSqft?: number;
  maxAreaSqft?: number;
  minAreaSqmt?: number;
  maxAreaSqmt?: number;

  minPriceAED?: number;
  maxPriceAED?: number;
  startingPrice?: number;
  price?: MaybeLocalized;
  paymentPlan?: MaybeLocalized;

  projectPageLink?: string;
  projectStatus?: MaybeLocalized;

  sellable?: boolean;
  projectID?: string;

  latitude?: number;
  longitude?: number;

  news?: NewsItem[];
  contact?: Contact;
  
  // Additional fields from data normalization
  communitySlug?: string;
  communityName?: string;
  developerKey?: string;
  featured?: boolean;
  assets?: {
    brochure?: { en?: string | null; ar?: string | null };
    tour3d?: { matterport?: string | null; propvr?: string | null };
  };
  hero?: { type: 'video' | 'image'; src: string; poster?: string };
}
