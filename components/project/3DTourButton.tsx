'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ThreeDTourModal from './3DTourModal';

interface ThreeDTourButtonProps {
  tourUrl: string;
  projectName: string;
  locale: 'ar' | 'en';
}

export default function ThreeDTourButton({ tourUrl, projectName, locale }: ThreeDTourButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!tourUrl) return null;

  const buttonText = locale === 'ar' ? 'جولة افتراضية 3D' : '3D Virtual Tour';

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-gold via-amber-400 to-gold text-black font-bold text-lg rounded-lg shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        <span>{buttonText}</span>
      </button>

      <ThreeDTourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourUrl={tourUrl}
        projectName={projectName}
        locale={locale}
      />
    </>
  );
}
