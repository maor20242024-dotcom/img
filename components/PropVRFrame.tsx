'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n-client';

type Props = {
  url: string;
  title?: string;
  height?: string;
};

export default function PropVRFrame({ url, title, height = '600px' }: Props) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  
  if (!url) return null;

  const defaultTitle = isAr ? '🏗️ جولة افتراضية ثلاثية الأبعاد' : '🏗️ 3D Virtual Tour';

  return (
    <div className="w-full rounded-lg overflow-hidden border border-[var(--gold)] shadow-lg">
      <div className="bg-gradient-to-r from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] p-4">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-amber-300">
          {title || defaultTitle}
        </h3>
      </div>
      <div style={{ height, position: 'relative' }}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="xr-spatial-tracking; gyroscope; accelerometer"
          title={title || '3D Virtual Tour'}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
