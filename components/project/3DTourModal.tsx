'use client';

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

interface ThreeDTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourUrl: string;
  projectName: string;
  locale: 'ar' | 'en';
}

export default function ThreeDTourModal({ 
  isOpen, 
  onClose, 
  tourUrl, 
  projectName, 
  locale 
}: ThreeDTourModalProps) {
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const closeText = locale === 'ar' ? 'إغلاق' : 'Close';
  const titleText = locale === 'ar' 
    ? `جولة افتراضية - ${projectName}` 
    : `Virtual Tour - ${projectName}`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-7xl h-[90vh] bg-zinc-900 rounded-2xl shadow-2xl border border-gold/30 overflow-hidden animate-scaleIn"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#0a0f1a]/80 to-transparent p-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gold truncate pr-16">
              {titleText}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-gold/20 text-white hover:text-gold rounded-full p-2 transition-all duration-300 group"
              aria-label={closeText}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          {/* 3D Tour iFrame */}
          <iframe
            src={tourUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
            title={`3D Tour - ${projectName}`}
          />
        </div>
      </div>
    </AnimatePresence>
  );
}
