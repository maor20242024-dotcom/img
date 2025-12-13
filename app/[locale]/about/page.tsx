import { getDictionary } from '@/lib/i18n';
import Image from 'next/image';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'en' | 'ar');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gold-gradient mb-6">
            {dict.about.title}
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            {dict.about.subtitle}
          </p>
        </div>

        {/* Company Overview */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                {dict.about.title}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {dict.about.description}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold gold-gradient mb-2">160+</div>
                  <div className="text-gray-400 text-sm">Premium Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gold-gradient mb-2">50+</div>
                  <div className="text-gray-400 text-sm">Top Developers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gold/20 to-transparent rounded-2xl p-8 border border-gold/30">
                <div className="text-gold text-6xl mb-4 text-center">🏢</div>
                <h3 className="text-white text-xl font-semibold text-center mb-4">
                  {dict.about.excellence}
                </h3>
                <p className="text-gray-300 text-center">
                  {dict.about.excellenceDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {dict.about.valuesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 text-center">
              <div className="text-gold text-4xl mb-4">🎯</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {dict.about.innovation}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {dict.about.innovationDesc}
              </p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 text-center">
              <div className="text-gold text-4xl mb-4">🤝</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {dict.about.trust}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {dict.about.trustDesc}
              </p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-700/50 text-center">
              <div className="text-gold text-4xl mb-4">⭐</div>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {dict.about.excellence}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {dict.about.excellenceDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {dict.about.whyChooseTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <p className="text-gray-300">{dict.about.whyChoose1}</p>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <p className="text-gray-300">{dict.about.whyChoose2}</p>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <p className="text-gray-300">{dict.about.whyChoose3}</p>
            </div>
            <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-xl p-6 border border-zinc-700/50">
              <p className="text-gray-300">{dict.about.whyChoose4}</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-8 border border-gold/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-gray-300 mb-6">
              Contact our expert team today and let us help you discover the perfect investment opportunity in Dubai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+971-4-123-4567" 
                className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-300"
              >
                Call Us Now
              </a>
              <a 
                href="mailto:info@imperiumgate.ae" 
                className="border border-gold text-gold px-6 py-3 rounded-lg font-semibold hover:bg-gold/10 transition-colors duration-300"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}