'use client';
import React from "react";
import dynamic from 'next/dynamic';

type Props = {
  latitude?: number | null;
  longitude?: number | null;
  title?: string;
  locationText?: string | null;
  height?: string; // e.g., "400px"
  className?: string;
};

const isValidCoordinate = (value: unknown): value is number => {
  return typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);
};

const LeafletMap = dynamic(() => import('@/components/ui/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-800 animate-pulse rounded-lg" />
});

export default function ProjectLocationMap({
  latitude,
  longitude,
  title,
  locationText,
  height = "400px",
  className,
}: Props) {
  const hasLatLon =
    isValidCoordinate(latitude) &&
    isValidCoordinate(longitude) &&
    Math.abs(latitude as number) > 0.0001 &&
    Math.abs(longitude as number) > 0.0001;

  return (
    <div
      className={
        "rounded-lg overflow-hidden border border-[var(--gold)] shadow-[0_0_0_1px_rgba(var(--gold-rgb),0.35)] relative bg-zinc-900 " +
        (className ?? "")
      }
      style={{ height }}
    >
      {hasLatLon ? (
        <LeafletMap lat={latitude as number} lng={longitude as number} title={title || "Project Location"} />
      ) : (
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          {/* Matrix / Data Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          <div className="bg-black/80 p-8 rounded-2xl border border-[var(--gold)]/30 backdrop-blur-md max-w-md w-full relative z-10">
            <h3 className="text-xl font-bold text-[var(--gold)] mb-2">{title}</h3>
            <p className="text-gray-400">{locationText || "Location data pending..."}</p>
          </div>
        </div>
      )}
    </div>
  );
}

