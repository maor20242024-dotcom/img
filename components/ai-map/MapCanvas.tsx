'use client';

import React from 'react';

interface MapCanvasProps {
  locale: 'ar' | 'en';
}

export default function MapCanvas({ locale }: MapCanvasProps) {
  return (
    <div className="w-full h-[600px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <p className="text-gray-400">AI Map Canvas - Coming Soon</p>
    </div>
  );
}
