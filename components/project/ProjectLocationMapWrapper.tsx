"use client";

import dynamic from 'next/dynamic';
import { useLocale } from '@/lib/i18n-client';

// Dynamic import for Leaflet map to avoid SSR issues with window object
const ProjectLocationMap = dynamic(
  () => import('@/components/project/ProjectLocationMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-[var(--gold)] bg-black/20 flex items-center justify-center" style={{ height: '400px' }}>
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }
);

type Props = {
  latitude?: number | null;
  longitude?: number | null;
  title?: string;
  locationText?: string | null;
  height?: string;
  className?: string;
};

export default function ProjectLocationMapWrapper(props: Props) {
  return <ProjectLocationMap {...props} />;
}
