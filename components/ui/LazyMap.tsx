'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import LuxuryButton from './LuxuryButton';

interface LazyMapProps {
  children: React.ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
  placeholder?: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  retryText?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyMap({
  children,
  className = '',
  width = '100%',
  height = '400px',
  placeholder,
  loadingText = 'Loading map...',
  errorText = 'Failed to load map',
  retryText = 'Retry',
  onLoad,
  onError
}: LazyMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          setIsLoading(true);
          
          // Simulate map loading time
          const timer = setTimeout(() => {
            setIsLoaded(true);
            setIsLoading(false);
            onLoad?.();
          }, 1000);

          return () => clearTimeout(timer);
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
  }, [isInView, onLoad]);

  const handleRetry = () => {
    setError(false);
    setIsLoading(true);
    setIsLoaded(false);
    
    // Retry loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    }, 1000);

    return () => clearTimeout(timer);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    onError?.();
  };

  const defaultPlaceholder = (
    <div className="w-full h-full bg-gray-900/50 flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <p>Map will load when visible</p>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-yellow-400/30 ${className}`}
      style={{ width, height }}
    >
      {!isInView && (placeholder || defaultPlaceholder)}

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
                zIndex: 10
              }}
            >
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-white mt-4">{loadingText}</p>
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
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <div className="text-center text-red-400">
                <div className="text-4xl mb-2">⚠️</div>
                <p className="mb-4">{errorText}</p>
                <LuxuryButton
                  variant="primary"
                  size="md"
                  onClick={handleRetry}
                >
                  🔄 {retryText}
                </LuxuryButton>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%' }}
          >
            {isLoaded && children}
          </motion.div>
        </>
      )}
    </div>
  );
}