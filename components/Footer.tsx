'use client';
import { useLocale } from '@/lib/i18n-client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const linkVariants = {
    hover: { 
      color: '#f1d07e',
      transition: { duration: 0.2 }
    }
  };

  const quickLinks = [
    { href: `/${locale}`, label: isRTL ? 'الرئيسية' : 'Home' },
    { href: `/${locale}/projects`, label: isRTL ? 'المشاريع' : 'Projects' },
    { href: `/${locale}/developers`, label: isRTL ? 'المطورين' : 'Developers' },
    { href: `/${locale}/contact`, label: isRTL ? 'تواصل معنا' : 'Contact' },
    { href: `/${locale}/privacy`, label: isRTL ? 'الخصوصية' : 'Privacy' },
    { href: `/${locale}/terms`, label: isRTL ? 'الشروط' : 'Terms' }
  ];

  return (
    <footer className="bg-black py-8 border-t border-gold-400/20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href as any}>
              <motion.span
                variants={linkVariants}
                whileHover="hover"
                {...({ className: "text-gold-400/70 hover:text-gold-400 transition-colors duration-200 text-sm cursor-pointer" } as any)}
              >
                {link.label}
              </motion.span>
            </Link>
          ))}
        </div>
        
        {/* Main Footer Text */}
        <div className="text-center">
          <p className="text-gold-400 text-sm font-medium">
            Imperium Gate Real Estate © 2025 — Powered by AI
          </p>
        </div>
      </div>
    </footer>
  );
}