'use client';

import { Suspense, ReactNode } from 'react';
// Removed framer-motion to avoid TS typing issues in build
import LoadingSpinner from './LoadingSpinner';

interface MediaSuspenseProps {
  children: ReactNode;
  type?: 'image' | 'video' | 'pdf' | 'gallery' | 'general';
  className?: string;
  height?: string | number;
  width?: string | number;
  loadingText?: string;
}

const getMediaIcon = (type: string) => {
  switch (type) {
    case 'image':
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      );
    case 'video':
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
      );
    case 'pdf':
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      );
    case 'gallery':
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11.5-6L8 13.5l2.5 3.01L14.5 12 18 16H8l2.5-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
        </svg>
      );
    default:
      return (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
      );
  }
};

const getLoadingText = (type: string, customText?: string) => {
  if (customText) return customText;
  
  switch (type) {
    case 'image':
      return 'Loading image...';
    case 'video':
      return 'Loading video...';
    case 'pdf':
      return 'Loading document...';
    case 'gallery':
      return 'Loading gallery...';
    default:
      return 'Loading content...';
  }
};

function MediaFallback({ 
  type = 'general', 
  className = '', 
  height, 
  width, 
  loadingText 
}: Omit<MediaSuspenseProps, 'children'>) {
  return (
    <div
      className={`
        bg-gradient-to-br from-zinc-900 to-zinc-800 
        border border-zinc-700/50 
        rounded-lg 
        flex flex-col items-center justify-center 
        text-zinc-400
        ${className}
      `}
      style={{ 
        height: height || '300px', 
        width: width || '100%',
        minHeight: '200px',
        transition: 'opacity 0.3s ease',
        opacity: 1
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-r from-gold/10 via-transparent to-gold/10 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon with subtle animation */}
        <div className="mb-4 text-zinc-500 animate-pulse">
          {getMediaIcon(type)}
        </div>

        {/* Loading spinner */}
        <div className="mb-4">
          <LoadingSpinner size="md" />
        </div>

        {/* Loading text */}
        <p className="text-sm font-medium animate-pulse">
          {getLoadingText(type, loadingText)}
        </p>

        {/* Progress dots */}
        <div className="flex space-x-1 mt-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gold/40 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MediaSuspense({
  children,
  type = 'general',
  className = '',
  height,
  width,
  loadingText
}: MediaSuspenseProps) {
  return (
    <Suspense 
      fallback={
        <MediaFallback 
          type={type}
          className={className}
          height={height}
          width={width}
          loadingText={loadingText}
        />
      }
    >
      {children}
    </Suspense>
  );
}
