'use client';

import { directAccess } from '@/lib/contentful-utils';

type Props = {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
};

export default function VideoBlock({
  src,
  poster,
  className = 'w-full rounded-2xl overflow-hidden',
  autoPlay = false,
  muted = true,
  controls = true,
  loop = false,
  preload = 'none',
}: Props) {
  // جميع الروابط تمر عبر directAccess:
  // يتخطّى البروكسي للدومينات الموثوقة ويستخدم البروكسي لغيرها
  const v = directAccess(src);
  const p = poster ? directAccess(poster) : undefined;

  return (
    <video
      className={className}
      src={v}
      poster={p}
      autoPlay={autoPlay}
      muted={muted}
      controls={controls}
      loop={loop}
      playsInline
      preload={preload}
    />
  );
}