'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

// Validate that src is actually a valid URL or path
function isValidImageSrc(src: any): src is string {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  // Must start with http://, https://, or / (for local paths)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return true;
  }
  return false;
}

export default function SafeImage({ 
  src, 
  alt, 
  fill, 
  width, 
  height, 
  className = '', 
  priority = false,
  sizes,
  quality = 85
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Placeholder image - use local PNG fallback
  const placeholderSrc = '/images/hero-fallback.png';

  // Use placeholder if src is invalid or errored
  const imageSrc = !isValidImageSrc(src) || error ? placeholderSrc : src;

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          sizes={sizes}
          quality={quality}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          quality={quality}
        />
      )}
      
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]">
          <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
