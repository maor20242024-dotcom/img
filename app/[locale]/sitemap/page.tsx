'use client';

import { useLocale } from '@/lib/i18n-client';
import Link from 'next/link';

export default function SitemapPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const siteLinks = [
    { href: `/${locale}`, label: isRTL ? 'الرئيسية' : 'Home' },
    { href: `/${locale}/about`, label: isRTL ? 'من نحن' : 'About' },
    { href: `/${locale}/properties`, label: isRTL ? 'العقارات' : 'Properties' },
    { href: `/${locale}/services`, label: isRTL ? 'الخدمات' : 'Services' },
    { href: `/${locale}/contact`, label: isRTL ? 'اتصل بنا' : 'Contact' },
    { href: `/${locale}/privacy`, label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy' },
    { href: `/${locale}/terms`, label: isRTL ? 'الشروط والأحكام' : 'Terms & Conditions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 md:p-12">
          <h1 className={`text-4xl md:text-5xl font-bold text-gold mb-8 ${isRTL ? 'font-amiri text-right' : 'font-inter'}`}>
            {isRTL ? 'خريطة الموقع' : 'Sitemap'}
          </h1>
          
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-gray-300 mb-8 text-lg">
              {isRTL 
                ? 'استكشف جميع صفحات موقع Imperium Gate للعقارات الفاخرة'
                : 'Explore all pages of Imperium Gate luxury real estate website'
              }
            </p>

            <div className="grid gap-4">
              {siteLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href as any}
                  className="group block p-4 bg-black/30 border border-gold/10 rounded-lg hover:border-gold/30 transition-all duration-300 hover:bg-black/50"
                >
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                    <div className="w-2 h-2 bg-gold rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className={`text-gray-300 group-hover:text-gold transition-colors duration-300 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                      {link.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 p-6 bg-black/20 border border-gold/10 rounded-lg">
              <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                {isRTL ? 'معلومات إضافية' : 'Additional Information'}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {isRTL 
                  ? 'موقع Imperium Gate هو منصتك الموثوقة للعقارات الفاخرة في دولة الإمارات العربية المتحدة. نحن نقدم خدمات شاملة في مجال الوساطة العقارية والاستشارات العقارية.'
                  : 'Imperium Gate is your trusted platform for luxury real estate in the United Arab Emirates. We provide comprehensive services in real estate brokerage and consultation.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}