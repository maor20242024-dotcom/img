'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n-client';
import { path } from '@/lib/paths';
import ProjectCard from '@/components/ProjectCard';
import LuxuryButton from '@/components/ui/LuxuryButton';
import { Building2, Search, Home } from 'lucide-react';
import type { Project } from '@/lib/types';

interface DeveloperProjectsNotFoundProps {
  developer: string;
  otherProjects: Project[];
}

export default function DeveloperProjectsNotFound({
  developer,
  otherProjects
}: DeveloperProjectsNotFoundProps) {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  // أفضل فلترة ممكنة + استخراج أقصى النتائج
  const suggestions =
    (otherProjects || [])
      .filter(p => p && p.slug && p.developer && p.developer !== developer)
      .slice(0, 9); // زيادة النتائج لأقصى حد مفيد

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] text-light">

      {/* Hero Section */}
      <div className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gold" />
            </div>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 gold-gradient-static ${isArabic ? 'font-arabic' : 'font-display'
              }`}
          >
            {isArabic ? 'لا توجد مشاريع' : 'No Projects Found'}
          </h1>

          {/* Description */}
          <p
            className={`text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed ${isArabic ? 'font-arabic' : 'font-sans'
              }`}
          >
            {isArabic
              ? `لم نتمكن من العثور على أي مشاريع للمطور "${developer}". قد تكون البيانات قيد التحديث أو أن المطور لا يملك مشاريع متاحة حالياً.`
              : `We couldn't find any projects for developer "${developer}". The data may be updating or this developer currently has no available projects.`}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link href={path.projectsHome(locale) as any}>
              <LuxuryButton
                variant="primary"
                size="lg"
                className={isArabic ? 'font-arabic' : 'font-sans'}
              >
                <Search className="w-5 h-5 mr-2" />
                {isArabic ? 'تصفح جميع المشاريع' : 'Browse All Projects'}
              </LuxuryButton>
            </Link>

            <Link href={path.developersHome(locale) as any}>
              <LuxuryButton
                variant="outline"
                size="lg"
                className={isArabic ? 'font-arabic' : 'font-sans'}
              >
                <Building2 className="w-5 h-5 mr-2" />
                {isArabic ? 'جميع المطورين' : 'All Developers'}
              </LuxuryButton>
            </Link>

          </div>
        </div>
      </div>

      {/* Alternative Projects */}
      {suggestions.length > 0 && (
        <section className="py-16 border-t border-gold/20">
          <div className="max-w-6xl mx-auto px-6">

            <h2
              className={`text-3xl font-bold mb-8 text-center gold-gradient-static ${isArabic ? 'font-arabic' : 'font-display'
                }`}
            >
              {isArabic
                ? 'مشاريع مقترحة من مطورين آخرين'
                : 'Suggested Projects from Other Developers'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map(project => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href={path.projectsHome(locale) as any}>
                <LuxuryButton
                  variant="outline"
                  size="lg"
                  className={isArabic ? 'font-arabic' : 'font-sans'}
                >
                  {isArabic ? 'عرض جميع المشاريع' : 'View All Projects'}
                </LuxuryButton>
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 border-t border-gold/20">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h3
            className={`text-2xl font-bold mb-6 gold-gradient-static ${isArabic ? 'font-arabic' : 'font-display'
              }`}
          >
            {isArabic ? 'هل تبحث عن شيء محدد؟' : 'Looking for Something Specific?'}
          </h3>

          <p
            className={`text-white/70 mb-8 ${isArabic ? 'font-arabic' : 'font-sans'
              }`}
          >
            {isArabic
              ? 'فريقنا جاهز لمساعدتك في العثور على المشروع المثالي.'
              : 'Our team is ready to help you find the perfect project.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link href={path.contact(locale) as any}>
              <LuxuryButton
                variant="primary"
                size="lg"
                className={isArabic ? 'font-arabic' : 'font-sans'}
              >
                {isArabic ? 'تواصل معنا' : 'Contact Us'}
              </LuxuryButton>
            </Link>

            <Link href={path.home(locale) as any}>
              <LuxuryButton
                variant="outline"
                size="lg"
                className={isArabic ? 'font-arabic' : 'font-sans'}
              >
                <Home className="w-5 h-5 mr-2" />
                {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
              </LuxuryButton>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}