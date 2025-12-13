'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageTransitionProps {
  children: ReactNode;
}

// Optimized page variants for better performance
const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.99,
    boxShadow: '0 0 0 rgba(230,195,106,0)',
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    boxShadow: '0 0 32px rgba(230,195,106,0.08)',
  },
  out: {
    opacity: 0,
    y: -16,
    scale: 0.99,
    boxShadow: '0 0 0 rgba(230,195,106,0)',
  },
};

// Faster transition settings for better UX
const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoother feel
  duration: 0.35,
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Header always visible; SplashScreen is handled in RootLayout */}
      <Header />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition as any}
          style={{
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{
              background:
                'radial-gradient(circle at center, rgba(230,195,106,0.18), rgba(230,195,106,0))',
            }}
          />
          {children}
        </motion.div>
      </AnimatePresence>

      <Footer />
    </>
  );
}
