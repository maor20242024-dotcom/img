import { getDictionary } from '@/lib/i18n';
import Link from 'next/link';

interface AIPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AIPage({ params }: AIPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'en' | 'ar');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]">
      <div className="container mx-auto px-4 py-8">
        {/* Simplified Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gold-gradient mb-4">
            {dict.ai.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {dict.ai.subtitle}
          </p>
        </div>

        {/* Three Main Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href={`/${locale}/ai/assistant` as any}
            className="group bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300 hover:bg-zinc-800/50"
          >
            <div className="text-gold text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h3 className="text-white font-semibold mb-3 text-lg">
              {dict.ai.smartAssistant}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {dict.ai.smartAssistantDesc}
            </p>
            <div className="mt-4 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {locale === 'ar' ? 'ابدأ المحادثة ←' : 'Start Chat →'}
            </div>
          </Link>
          
          <Link 
            href={`/${locale}/ai/personalized-projects` as any}
            className="group bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300 hover:bg-zinc-800/50"
          >
            <div className="text-gold text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🏢</div>
            <h3 className="text-white font-semibold mb-3 text-lg">
              {dict.ai.personalizedProjects}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {dict.ai.personalizedProjectsDesc}
            </p>
            <div className="mt-4 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {locale === 'ar' ? 'استكشف المشاريع ←' : 'Explore Projects →'}
            </div>
          </Link>
          
          <Link 
            href={`/${locale}/ai/invest-advice` as any}
            className="group bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300 hover:bg-zinc-800/50"
          >
            <div className="text-gold text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">💡</div>
            <h3 className="text-white font-semibold mb-3 text-lg">
              {dict.ai.investmentTips}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {dict.ai.investmentTipsDesc}
            </p>
            <div className="mt-4 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {locale === 'ar' ? 'احصل على النصائح ←' : 'Get Advice →'}
            </div>
          </Link>
        </div>

        {/* AI Map Chat Card */}
        <div className="max-w-4xl mx-auto mt-8">
          <Link 
            href={`/${locale}/ai/map` as any}
            className="group block bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-xl p-8 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300"
          >
            <div className="flex items-center gap-6">
              <div className="text-gold text-4xl group-hover:scale-110 transition-transform duration-300">🗺️</div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2 text-xl">
                  {dict.ai.mapChat}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {dict.ai.mapChatDesc}
                </p>
              </div>
              <div className="text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {locale === 'ar' ? 'افتح الخريطة ←' : 'Open Map →'}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
