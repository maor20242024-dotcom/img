'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        style={{
          width: size === 'sm' ? '1rem' : size === 'md' ? '2rem' : '3rem',
          height: size === 'sm' ? '1rem' : size === 'md' ? '2rem' : '3rem',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          borderTop: '2px solid rgb(212, 175, 55)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}