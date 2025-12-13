import { getDictionary } from '@/lib/i18n';
import Link from 'next/link';

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'en' | 'ar');

  // Sample news data - in a real app, this would come from a CMS or API
  const newsArticles = [
    {
      id: 1,
      category: dict.news.categories.market,
      title: locale === 'ar' ? 'سوق العقارات في دبي يشهد نمواً قوياً في 2024' : 'Dubai Real Estate Market Shows Strong Growth in 2024',
      excerpt: locale === 'ar' ? 'تشهد أسعار العقارات في دبي ارتفاعاً مستمراً مع زيادة الطلب من المستثمرين الدوليين' : 'Property prices in Dubai continue to rise with increased demand from international investors',
      date: '2024-01-15',
      readTime: '5 min',
      image: '📈'
    },
    {
      id: 2,
      category: dict.news.categories.projects,
      title: locale === 'ar' ? 'إطلاق مشاريع جديدة في منطقة الخليج التجاري' : 'New Projects Launched in Business Bay Area',
      excerpt: locale === 'ar' ? 'مطورون عقاريون كبار يعلنون عن مشاريع سكنية وتجارية جديدة' : 'Major developers announce new residential and commercial projects',
      date: '2024-01-12',
      readTime: '3 min',
      image: '🏗️'
    },
    {
      id: 3,
      category: dict.news.categories.investment,
      title: locale === 'ar' ? 'نصائح استثمارية للمشترين الجدد في سوق دبي' : 'Investment Tips for New Buyers in Dubai Market',
      excerpt: locale === 'ar' ? 'دليل شامل للمستثمرين الجدد في السوق العقاري الإماراتي' : 'Comprehensive guide for new investors in the UAE real estate market',
      date: '2024-01-10',
      readTime: '7 min',
      image: '💡'
    },
    {
      id: 4,
      category: dict.news.categories.technology,
      title: locale === 'ar' ? 'الذكاء الاصطناعي يغير مشهد البحث العقاري' : 'AI Transforms Real Estate Search Landscape',
      excerpt: locale === 'ar' ? 'تقنيات جديدة تسهل عملية البحث عن العقارات وتحسن تجربة المستخدم' : 'New technologies streamline property search and enhance user experience',
      date: '2024-01-08',
      readTime: '4 min',
      image: '🤖'
    },
    {
      id: 5,
      category: dict.news.categories.market,
      title: locale === 'ar' ? 'توقعات السوق العقاري لعام 2024' : 'Real Estate Market Predictions for 2024',
      excerpt: locale === 'ar' ? 'خبراء يتوقعون استمرار النمو مع تركيز على الاستدامة والتكنولوجيا' : 'Experts predict continued growth with focus on sustainability and technology',
      date: '2024-01-05',
      readTime: '6 min',
      image: '🔮'
    },
    {
      id: 6,
      category: dict.news.categories.projects,
      title: locale === 'ar' ? 'مشاريع صديقة للبيئة في دبي الجنوب' : 'Eco-Friendly Projects in Dubai South',
      excerpt: locale === 'ar' ? 'مبادرات جديدة للبناء المستدام والطاقة المتجددة في المشاريع السكنية' : 'New initiatives for sustainable construction and renewable energy in residential projects',
      date: '2024-01-03',
      readTime: '5 min',
      image: '🌱'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a]">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gold-gradient mb-6">
            {dict.news.title}
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            {dict.news.subtitle}
          </p>
        </div>

        {/* Featured Article */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-8 border border-gold/30">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-gold text-black px-3 py-1 rounded-full text-sm font-semibold">
                {locale === 'ar' ? 'مميز' : 'Featured'}
              </span>
              <span className="text-gray-400 text-sm">{newsArticles[0].date}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {newsArticles[0].title}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {newsArticles[0].excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-gold text-sm">{newsArticles[0].category}</span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{newsArticles[0].readTime}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-4">{newsArticles[0].image}</div>
                <Link 
                  href={`/${locale}/news/${newsArticles[0].id}` as any}
                  className="inline-block bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-300"
                >
                  {dict.news.readMore}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-12">
{dict.news.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.slice(1).map((article) => (
              <Link 
                key={article.id}
                href={`/${locale}/news/${article.id}` as any}
                className="group bg-zinc-900/50 rounded-xl border border-zinc-700/50 hover:border-gold/50 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {article.image}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gold text-xs font-semibold bg-gold/10 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-xs">{article.date}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{article.readTime}</span>
                    <span className="text-gold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {locale === 'ar' ? 'اقرأ المزيد ←' : 'Read More →'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50 text-center">
            <div className="text-gold text-4xl mb-6">📧</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {locale === 'ar' ? 'اشترك في النشرة الإخبارية' : 'Subscribe to Newsletter'}
            </h2>
            <p className="text-gray-300 mb-6">
              {locale === 'ar' ? 'احصل على آخر الأخبار والتحديثات في عقارات دبي' : 'Get the latest news and updates in Dubai real estate'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold"
              />
              <button className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-300">
                {locale === 'ar' ? 'اشترك' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
