'use client';

import { useLocale } from '@/lib/i18n-client';

export default function TermsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-black/50 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 md:p-12">
          <h1 className={`text-4xl md:text-5xl font-bold text-gold mb-8 ${isRTL ? 'font-amiri text-right' : 'font-inter'}`}>
            {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </h1>
          
          <div className={`prose prose-invert prose-gold max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'قبول الشروط' : 'Acceptance of Terms'}
                </h2>
                <p>
                  {isRTL 
                    ? 'باستخدام موقع Imperium Gate الإلكتروني وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.'
                    : 'By using the Imperium Gate website and services, you agree to be bound by these terms and conditions.'
                  }
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'الخدمات' : 'Services'}
                </h2>
                <p>
                  {isRTL 
                    ? 'نحن نقدم خدمات الوساطة العقارية والاستشارات العقارية في دولة الإمارات العربية المتحدة. جميع الخدمات تخضع لهذه الشروط والأحكام.'
                    : 'We provide real estate brokerage and consultation services in the United Arab Emirates. All services are subject to these terms and conditions.'
                  }
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'المسؤوليات' : 'Responsibilities'}
                </h2>
                <p>
                  {isRTL 
                    ? 'أنت مسؤول عن تقديم معلومات دقيقة وحديثة عند استخدام خدماتنا. نحن غير مسؤولين عن أي أضرار ناتجة عن معلومات غير صحيحة.'
                    : 'You are responsible for providing accurate and up-to-date information when using our services. We are not liable for any damages resulting from incorrect information.'
                  }
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'القانون المطبق' : 'Governing Law'}
                </h2>
                <p>
                  {isRTL 
                    ? 'تخضع هذه الشروط والأحكام لقوانين دولة الإمارات العربية المتحدة.'
                    : 'These terms and conditions are governed by the laws of the United Arab Emirates.'
                  }
                </p>
              </section>

              <section>
                <h2 className={`text-2xl font-semibold text-gold mb-4 ${isRTL ? 'font-amiri' : 'font-inter'}`}>
                  {isRTL ? 'اتصل بنا' : 'Contact Us'}
                </h2>
                <p>
                  {isRTL 
                    ? 'للاستفسارات حول هذه الشروط والأحكام، يرجى الاتصال بنا على info@imperiumgate.com'
                    : 'For inquiries about these terms and conditions, please contact us at info@imperiumgate.com'
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