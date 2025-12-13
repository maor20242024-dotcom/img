import { getDictionary } from '@/lib/i18n';

interface VisionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function VisionPage({ params }: VisionPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'en' | 'ar');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gold-gradient mb-6">
            {dict.vision.title}
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            {dict.vision.subtitle}
          </p>
        </div>

        {/* Vision Statement */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-3xl p-12 border border-gold/30 text-center">
            <div className="text-gold text-6xl mb-8">🌟</div>
            <h2 className="text-3xl font-bold text-white mb-8">
              {dict.vision.title}
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed max-w-4xl mx-auto">
              {dict.vision.description}
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 rounded-3xl p-12 border border-zinc-700/50 text-center">
            <div className="text-gold text-6xl mb-8">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-8">
              {locale === 'ar' ? 'مهمتنا' : 'Our Mission'}
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed max-w-4xl mx-auto">
              {locale === 'ar' ? 'نسعى لتوفير أفضل الحلول العقارية في دبي من خلال التكنولوجيا المتطورة والخدمة المتميزة' : 'We strive to provide the best real estate solutions in Dubai through advanced technology and exceptional service'}
            </p>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {locale === 'ar' ? 'أهدافنا' : 'Our Goals'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300">
              <div className="text-gold text-4xl mb-6">🏗️</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {locale === 'ar' ? 'التطوير المستدام' : 'Sustainable Development'}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {locale === 'ar' ? 'نركز على المشاريع التي تحقق التوازن بين الربحية والاستدامة البيئية' : 'We focus on projects that balance profitability with environmental sustainability'}
              </p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300">
              <div className="text-gold text-4xl mb-6">🤖</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {locale === 'ar' ? 'التكنولوجيا المتقدمة' : 'Advanced Technology'}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {locale === 'ar' ? 'نستخدم أحدث التقنيات لتوفير تجربة عقارية متطورة ومبتكرة' : 'We use cutting-edge technology to provide an advanced and innovative real estate experience'}
              </p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300">
              <div className="text-gold text-4xl mb-6">🌍</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {locale === 'ar' ? 'الاستدامة البيئية' : 'Environmental Sustainability'}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {locale === 'ar' ? 'نلتزم بالمعايير البيئية العالمية في جميع مشاريعنا' : 'We commit to global environmental standards in all our projects'}
              </p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300">
              <div className="text-gold text-4xl mb-6">👥</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {locale === 'ar' ? 'خدمة المجتمع' : 'Community Service'}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {locale === 'ar' ? 'نساهم في بناء مجتمعات متطورة ومترابطة في دبي' : 'We contribute to building advanced and connected communities in Dubai'}
              </p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300">
              <div className="text-gold text-4xl mb-6">📈</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {locale === 'ar' ? 'النمو المستمر' : 'Continuous Growth'}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {locale === 'ar' ? 'نسعى للنمو المستدام والتوسع في الأسواق الجديدة' : 'We strive for sustainable growth and expansion into new markets'}
              </p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 hover:border-gold/50 transition-all duration-300">
              <div className="text-gold text-4xl mb-6">🏆</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {locale === 'ar' ? 'التميز والجودة' : 'Excellence & Quality'}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {locale === 'ar' ? 'نحافظ على أعلى معايير الجودة في جميع خدماتنا' : 'We maintain the highest quality standards in all our services'}
              </p>
            </div>
          </div>
        </div>

        {/* Future Outlook */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-2xl p-12 border border-zinc-700/50">
            <div className="text-center">
              <div className="text-gold text-5xl mb-8">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-6">
                {locale === 'ar' ? 'نظرة للمستقبل' : 'Future Outlook'}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto mb-8">
                {locale === 'ar' ? 'نتطلع إلى مستقبل مشرق مليء بالابتكار والنمو في قطاع العقارات' : 'We look forward to a bright future full of innovation and growth in the real estate sector'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold gold-gradient mb-2">2025</div>
                  <div className="text-gray-400 text-sm">{locale === 'ar' ? 'توسع في الذكاء الاصطناعي' : 'AI Expansion'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gold-gradient mb-2">2027</div>
                  <div className="text-gray-400 text-sm">{locale === 'ar' ? 'تقنيات الواقع الافتراضي' : 'Virtual Reality Tech'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gold-gradient mb-2">2030</div>
                  <div className="text-gray-400 text-sm">{locale === 'ar' ? 'التوسع العالمي' : 'Global Expansion'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}