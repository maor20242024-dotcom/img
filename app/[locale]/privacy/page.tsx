'use client';

import { useLocale } from '@/lib/i18n-client';

export default function PrivacyPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 md:p-12">
          <h1 className={`text-4xl md:text-5xl font-bold text-gold mb-8 ${isRTL ? 'font-amiri text-right' : 'font-inter'}`}>
            {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          
          <div className={`prose prose-invert prose-gold max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'المعلومات التي نجمعها' : 'Information We Collect'}
                </h2>
                <p>
                  {isRTL 
                    ? 'نحن في Imperium Gate نلتزم بحماية خصوصيتك. نجمع المعلومات التي تقدمها لنا طوعياً عند استخدام موقعنا الإلكتروني أو خدماتنا.'
                    : 'At Imperium Gate, we are committed to protecting your privacy. We collect information that you voluntarily provide to us when using our website or services.'
                  }
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'كيف نستخدم معلوماتك' : 'How We Use Your Information'}
                </h2>
                <p>
                  {isRTL 
                    ? 'نستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسينها، والتواصل معك بشأن العقارات والخدمات التي قد تهمك.'
                    : 'We use the information we collect to provide and improve our services, and to communicate with you about properties and services that may interest you.'
                  }
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'حماية البيانات' : 'Data Protection'}
                </h2>
                <p>
                  {isRTL 
                    ? 'نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.'
                    : 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
                  }
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'اتصل بنا' : 'Contact Us'}
                </h2>
                <p>
                  {isRTL 
                    ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على info@imperiumgate.com'
                    : 'If you have any questions about this Privacy Policy, please contact us at info@imperiumgate.com'
                  }
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}