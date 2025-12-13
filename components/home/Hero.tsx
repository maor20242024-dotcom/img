// components/home/Hero.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import LazyVideo from '@/components/ui/LazyVideo';

type Props = {
  titleAr: string;
  subtitleAr: string;
  titleEn: string;
  subtitleEn: string;
  locale: 'ar' | 'en';
};

export default function Hero({
  titleAr,
  subtitleAr,
  titleEn,
  subtitleEn,
  locale,
}: Props) {
  const title = locale === 'ar' ? titleAr : titleEn;
  const subtitle = locale === 'ar' ? subtitleAr : subtitleEn;

  return (
    <section className="relative h-screen min-h-[100svh] overflow-hidden">
      {/* خلفية فيديو + تدرّج */}
      <div className="absolute inset-0 -z-10">
        <LazyVideo
          src="https://ggfx-onebrokergroup.s3.eu-west-2.amazonaws.com/i/Homepage_Banner_Video2_8328_Bdd5c7_f31f1b5265.mp4"
          autoPlay
          loop
          muted
          controls={false}
          poster="/images/hero-fallback.png"
          className="w-full h-full object-cover"
          alt="Homepage hero video"
        />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0a0f1a]/40 via-black/20 to-black/70" />
      </div>

      {/* المحتوى */}
      <div
        className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex items-end pb-24 ${
          locale === 'ar' ? 'text-right' : 'text-left'
        }`}
      >
        <div className={`text-white max-w-3xl ${locale === 'ar' ? 'ml-auto' : ''}`}>
          <h1
            className="luxury-title text-4xl md:text-6xl lg:text-7xl font-bold gold-gradient luxury-text-shadow"
            dir="auto"
          >
            <span className="font-display">{title}</span>
          </h1>

          <p
            className={`mt-6 text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed ${
              locale === 'ar' ? 'font-arabic' : 'font-sans'
            }`}
          >
            {subtitle}
          </p>

          <div className="mt-8 flex gap-4">
            {/* ✅ استخدم مسارات ثابتة جاهزة كسلاسل، بدون params أو أقواس مربعة */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/${locale}/projects`}
                prefetch={false}
                className="gold-btn luxury-glow hover:animate-gold-pulse transition-all duration-300 will-change-transform"
              >
                {locale === 'ar' ? 'استكشف المشاريع' : 'Explore Projects'}
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={`/${locale}/contact`}
                prefetch={false}
                className="gold-outline luxury-border hover:luxury-glow transition-all duration-300 will-change-transform"
              >
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}