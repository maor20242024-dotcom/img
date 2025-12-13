'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n-client';
import { stringRoutes } from '@/lib/routes';
import LuxuryButton from '@/components/ui/LuxuryButton';
import { AlertTriangle, Home, RefreshCw, Building2 } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Developers page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] text-light flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 text-red-400 ${isArabic ? 'font-arabic' : 'font-display'}`}>
          {isArabic ? 'حدث خطأ' : 'Something went wrong'}
        </h1>

        {/* Description */}
        <p className={`text-xl text-white/70 mb-8 max-w-xl mx-auto leading-relaxed ${isArabic ? 'font-arabic' : 'font-sans'}`}>
          {isArabic 
            ? 'عذراً، حدث خطأ أثناء تحميل صفحة المطورين. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.'
            : 'Sorry, an error occurred while loading the developers page. Please try again or return to the home page.'
          }
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
            <p className="text-red-300 text-sm font-mono">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LuxuryButton 
            variant="primary" 
            size="lg"
            onClick={reset}
            className={`${isArabic ? 'font-arabic' : 'font-sans'}`}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {isArabic ? 'إعادة المحاولة' : 'Try Again'}
          </LuxuryButton>
          
          <Link href={stringRoutes.projectsIndex(locale) as any}>
            <LuxuryButton 
              variant="outline" 
              size="lg"
              className={`${isArabic ? 'font-arabic' : 'font-sans'}`}
            >
              <Building2 className="w-5 h-5 mr-2" />
              {isArabic ? 'تصفح المشاريع' : 'Browse Projects'}
            </LuxuryButton>
          </Link>
          
          <Link href={stringRoutes.home(locale) as any}>
            <LuxuryButton 
              variant="outline" 
              size="lg"
              className={`${isArabic ? 'font-arabic' : 'font-sans'}`}
            >
              <Home className="w-5 h-5 mr-2" />
              {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
            </LuxuryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}