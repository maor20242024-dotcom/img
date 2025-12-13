import { getDictionary } from '@/lib/i18n';
import { Metadata } from 'next';
import MapCanvas from '@/components/ai-map/MapCanvas';

interface Props {
  params: Promise<{ locale: 'ar' | 'en' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return {
    title: dict.ai.mapChat,
    description: dict.ai.mapChatDesc,
  };
}

export default async function AIMapPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]">
      {/* Header */}
      <div className="relative pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${isRtl ? 'font-amiri' : 'font-inter'}`}>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#e6c55a] via-[#d4af37] to-[#e6c55a] bg-clip-text text-transparent mb-4">
              {dict.ai.mapChat}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {dict.ai.mapChatDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative">
        <MapCanvas locale={locale} />
      </div>
    </div>
  );
}