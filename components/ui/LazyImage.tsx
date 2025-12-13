'use client';

import { directAccess } from '@/lib/contentful-utils';
import Image from 'next/image';
import { Suspense, useEffect, useRef, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

function isValidSrc(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v) return false;
  return (
    v.startsWith('/') ||
    v.startsWith('http://') ||
    v.startsWith('https://') ||
    v.startsWith('data:') ||
    v.startsWith('blob:')
  );
}

function ImageComponent({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  style,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      setIsLoading(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          setIsLoading(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isInView, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    setError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    onError?.();
  };

  // Generate a simple blur placeholder if none provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Loading placeholder */}
      {!isInView && !priority && (
        <div 
          className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center"
          style={{ 
            minHeight: height || '200px',
            width: width || '100%'
          }}
        >
          <div className="text-zinc-600 text-center">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <p className="text-xs">Loading...</p>
          </div>
        </div>
      )}

      {/* Loading spinner overlay */}
      {isInView && isLoading && !isLoaded && (
        <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center z-10 transition-opacity">
          <div className="text-center">
            <LoadingSpinner size="md" />
            <p className="text-white/70 mt-2 text-sm">Loading image...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center transition-opacity">
          <div className="text-center text-red-400">
            <div className="w-8 h-8 mx-auto mb-2">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <div className="w-full h-full" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <Image
            src={isValidSrc(src) ? directAccess(src) : '/media/logo.png'}
            alt={alt}
            width={fill ? undefined : (width || 200)}
            height={fill ? undefined : (height || 200)}
            fill={fill}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL || defaultBlurDataURL}
            sizes={sizes}
            className={`${fill ? 'object-cover' : ''} transition-opacity duration-300`}
            style={fill ? undefined : { width: 'auto', height: 'auto' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      )}
    </div>
  );
}

export default function LazyImage(props: LazyImageProps) {
  return (
    <Suspense 
      fallback={
        <div className={`bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center ${props.className}`}>
          <LoadingSpinner size="md" />
        </div>
      }
    >
      <ImageComponent {...props} />
    </Suspense>
  );
}
