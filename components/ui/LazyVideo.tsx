'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  width?: string | number;
  height?: string | number;
  alt?: string;
  style?: React.CSSProperties;
  // When not in view, display poster image as placeholder
  // Set to false when the parent already renders a background (e.g., ProjectHero)
  showPosterWhenIdle?: boolean;
}

export default function LazyVideo({
  src,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  width,
  height,
  alt = 'Video content',
  style,
  showPosterWhenIdle = true
}: LazyVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          setIsLoading(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
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
  }, [isInView]);

  // Cleanup effect to handle video element when component unmounts
  useEffect(() => {
    return () => {
      // Clean up video element if it exists
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, []);

  const handleVideoLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    setError(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    
    // Only set error state for actual errors, not aborted requests
    if (error && error.code !== MediaError.MEDIA_ERR_ABORTED) {
      console.warn('Video loading error:', {
        code: error.code,
        message: error.message,
        src: src
      });
      setError(true);
    }
    
    setIsLoading(false);
  };

  const handleVideoAbort = () => {
    // Video loading was aborted (normal during navigation)
    setIsLoading(false);
    // Don't set error state for aborted requests
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!isInView && (
        showPosterWhenIdle && poster ? (
          <div className="absolute inset-0 w-full h-full bg-gray-900/40 flex items-center justify-center pointer-events-none">
            <img
              src={poster}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          // No poster when idle — parent background will be visible
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true" />
        )
      )}

      {isInView && (
        <>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-white mt-4">Loading video...</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="text-center text-red-400">
                <div className="text-4xl mb-2">⚠️</div>
                <p>Failed to load video</p>
              </div>
            </motion.div>
          )}

          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            preload="none"
            style={style}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onAbort={handleVideoAbort}
          />
        </>
      )}
    </div>
  );
}
