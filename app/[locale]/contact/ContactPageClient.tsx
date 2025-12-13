'use client';

import { useState } from 'react';
import { Locale } from '@/lib/i18n-config';
import LuxuryButton from '@/components/ui/LuxuryButton';

type Props = {
  locale: Locale;
  dict: any;
};

export default function ContactPageClient({ locale, dict }: Props) {
  const rtl = locale === 'ar';
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      return alert(rtl ? 'الاسم والهاتف والرسالة إجبارية' : 'Name, phone and message are required');
    }

    try {
      setSubmitting(true);
      // TODO: اربط مع API لاحقاً
      console.log('Contact form:', form);
      alert(rtl ? 'تم إرسال رسالتك. سنعاود الاتصال قريبًا.' : 'Message sent! We will contact you shortly.');
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  // Imperium Gate unified contact number
  const PHONE_E164 = '971567022702';
  const PHONE_DISPLAY = '+971 56 702 2702';
  
  const whatsAppHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    rtl 
      ? 'مرحباً Imperium Gate، أود التواصل معكم بخصوص الخدمات العقارية.'
      : 'Hello Imperium Gate, I would like to inquire about your real estate services.'
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#0d1526] to-zinc-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0a0f1a]/80 to-zinc-900/80 py-20">
        <div className="absolute inset-0 bg-[url('/media/logo.png')] bg-center bg-no-repeat opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gold">
              {rtl ? 'تواصل معنا' : 'Contact Us'}
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto">
            {rtl 
              ? 'نحن هنا لمساعدتك في رحلتك الاستثمارية العقارية في دبي'
              : 'We are here to help you with your real estate investment journey in Dubai'
            }
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className={`space-y-8 ${rtl ? 'text-right' : 'text-left'}`}>
            <div>
              <h2 className="text-3xl font-bold text-gold mb-6">
                {rtl ? 'معلومات التواصل' : 'Contact Information'}
              </h2>
              <p className="text-white/80 text-lg mb-8">
                {rtl 
                  ? 'تواصل معنا اليوم واكتشف أفضل الفرص الاستثمارية في دبي'
                  : 'Get in touch today and discover the best investment opportunities in Dubai'
                }
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="rounded-2xl border border-gold/30 bg-black/60 backdrop-blur p-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gold">
                      {rtl ? 'هاتف' : 'Phone'}
                    </h3>
                    <p className="text-white/80">{PHONE_DISPLAY}</p>
                    <a 
                      href={`tel:+${PHONE_E164}`}
                      className="text-gold hover:text-gold/80 transition text-sm"
                    >
                      {rtl ? 'اتصل الآن' : 'Call Now'}
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="rounded-2xl border border-green-500/30 bg-black/60 backdrop-blur p-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-500">WhatsApp</h3>
                    <p className="text-white/80">{PHONE_DISPLAY}</p>
                    <a 
                      href={whatsAppHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400 transition text-sm"
                    >
                      {rtl ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-blue-500/30 bg-black/60 backdrop-blur p-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-500">
                      {rtl ? 'بريد إلكتروني' : 'Email'}
                    </h3>
                    <p className="text-white/80">info@imperiumgate.com</p>
                    <a 
                      href="mailto:info@imperiumgate.com"
                      className="text-blue-500 hover:text-blue-400 transition text-sm"
                    >
                      {rtl ? 'أرسل بريد إلكتروني' : 'Send Email'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Location */}
              <div className="rounded-2xl border border-purple-500/30 bg-black/60 backdrop-blur p-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-500">
                      {rtl ? 'المكتب' : 'Office'}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {rtl 
                        ? 'دبي، الإمارات العربية المتحدة'
                        : 'Dubai, United Arab Emirates'
                      }
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      {rtl 
                        ? 'الأحد - الخميس: 9:00 ص - 6:00 م'
                        : 'Sun - Thu: 9:00 AM - 6:00 PM'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-gold/30 bg-black/60 backdrop-blur p-8">
            <h2 className="text-2xl font-bold text-gold mb-6">
              {rtl ? 'أرسل لنا رسالة' : 'Send us a Message'}
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={rtl ? 'الاسم *' : 'Name *'}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-4 py-3 text-white placeholder-white/50 focus:border-gold/50 focus:outline-none transition"
                  required
                />
                <input
                  type="tel"
                  placeholder={rtl ? 'رقم الهاتف *' : 'Phone Number *'}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-4 py-3 text-white placeholder-white/50 focus:border-gold/50 focus:outline-none transition"
                  required
                />
              </div>
              
              <input
                type="email"
                placeholder={rtl ? 'البريد الإلكتروني' : 'Email'}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-4 py-3 text-white placeholder-white/50 focus:border-gold/50 focus:outline-none transition"
              />
              
              <input
                type="text"
                placeholder={rtl ? 'الموضوع' : 'Subject'}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-4 py-3 text-white placeholder-white/50 focus:border-gold/50 focus:outline-none transition"
              />
              
              <textarea
                placeholder={rtl ? 'رسالتك *' : 'Your Message *'}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                className="w-full rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-4 py-3 text-white placeholder-white/50 focus:border-gold/50 focus:outline-none transition resize-none"
                required
              />
              
              <LuxuryButton
                type="submit"
                disabled={submitting}
                variant="primary"
                size="lg"
                fullWidth
              >
                {submitting 
                  ? (rtl ? 'جار الإرسال...' : 'Sending...') 
                  : (rtl ? 'إرسال الرسالة' : 'Send Message')
                }
              </LuxuryButton>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {rtl ? 'موقعنا' : 'Our Location'}
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              {rtl 
                ? 'زورنا في مكتبنا في دبي أو تواصل معنا عبر الهاتف أو البريد الإلكتروني'
                : 'Visit us at our Dubai office or get in touch via phone or email'
              }
            </p>
          </div>
          
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6828318443!2d54.89782!3d25.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1703000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}