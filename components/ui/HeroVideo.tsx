'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import LazyVideo from './LazyVideo';

interface HeroVideoProps {
  video?: string;
  image: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

export default function HeroVideo({ 
  video, 
  image, 
  alt, 
  className = "w-full h-[85vh] object-cover", 
  overlay = true,
  children 
}: HeroVideoProps) {
  const isValidSrc = (v?: string) => !!v && (
    v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://') || v.startsWith('data:') || v.startsWith('blob:')
  );
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video && videoRef.current) {
      const videoElement = videoRef.current;
      
      const handleLoadedData = () => {
        setVideoLoaded(true);
      };

      const handleError = () => {
        setVideoError(true);
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [video]);

  const shouldShowVideo = video && !videoError && videoLoaded;

  return (
    <div className="relative overflow-hidden">
      {/* Video Element */}
      {video && !videoError && (
        <LazyVideo
          src={video}
          autoPlay
          loop
          muted
          controls={false}
          className={`${className} ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          alt={alt}
        />
      )}

      {/* Fallback Image */}
      {(!video || videoError || !videoLoaded) && (
        <div className={`${shouldShowVideo ? 'absolute inset-0' : 'relative'}`}>
          <Image
            src={isValidSrc(image) ? image : '/media/logo.png'}
            alt={alt}
            fill
            className={`${className} ${shouldShowVideo ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            style={{ 
              filter: overlay ? 'brightness(0.75)' : 'none',
              objectFit: 'cover'
            }}
            priority
          />
        </div>
      )}

      {/* Overlay Content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}

      {/* Golden Gradient Overlay for Luxury Effect */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      )}
    </div>
  );
}
