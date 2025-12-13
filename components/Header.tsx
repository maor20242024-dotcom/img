'use client';

import React from 'react';
import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/i18n-client';
import { motion } from 'framer-motion';
import logoAsset from '@/public/brand/imperium-gate.png';
import { path } from '@/lib/paths';

function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const [pathname, setPathname] = React.useState('');

  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const toggleLocale = currentLocale === 'ar' ? 'en' : 'ar';
  const newPath = pathname.replace(/^\/(ar|en)/, `/${toggleLocale}`);

  return (
    <Link
      href={newPath || `/${toggleLocale}`}
      className="flex items-center gap-1 text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-md bg-zinc-800/60 hover:bg-gold/20 border border-gold/30 hover:border-gold text-gray-300 hover:text-gold font-medium transition-all duration-300"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span>{currentLocale === 'ar' ? '🇬🇧' : '🇦🇪'}</span>
      <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
    </Link>
  );
}

export default function Header() {
  const locale = useLocale() as 'ar' | 'en';
  const pathname = usePathname();

  const navItems = [
    { href: path.home(locale), label: locale === 'ar' ? 'الرئيسية' : 'Home', match: `/${locale}$` },
    { href: path.projectsHome(locale), label: locale === 'ar' ? 'المشاريع' : 'Projects', match: `/${locale}/projects` },
    { href: path.developersHome(locale), label: locale === 'ar' ? 'المطورون' : 'Developers', match: `/${locale}/developers` },
    { href: path.favorites(locale), label: locale === 'ar' ? 'المفضلة' : 'Favorites', match: `/${locale}/favorites` },
    { href: path.compare(locale), label: locale === 'ar' ? 'المقارنة' : 'Compare', match: `/${locale}/compare` },
    { href: path.contact(locale), label: locale === 'ar' ? 'تواصل معنا' : 'Contact', match: `/${locale}/contact` },
  ];

  return (
    <header className="bg-gradient-to-r from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] backdrop-blur-md border-b border-gold/30 sticky top-0 z-50 shadow-lg shadow-gold/10">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={path.home(locale)} className="group flex items-center gap-2 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={logoAsset as StaticImageData}
                alt="Imperium Gate"
                priority
                width={200}
                height={50}
                sizes="200px"
                className="h-10 md:h-14 w-auto"
              />
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-2 md:gap-4 lg:gap-6 items-center flex-wrap justify-end">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs md:text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 relative group whitespace-nowrap ${
                    isActive ? 'text-gold' : 'text-gray-300 hover:text-gold'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}

            {/* Language Switcher */}
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </div>
      </nav>
    </header>
  );
}
