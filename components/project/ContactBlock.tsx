'use client';

import LuxuryButton from '@/components/ui/LuxuryButton';
import { useLocale } from '@/lib/i18n-client';
import { useMemo, useState } from 'react';

type Props = {
  projectName?: string;
  developer?: string;
  slug?: string;
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    agentName?: string;
  };
};

export default function ContactBlock({
  projectName = '',
  developer = '',
  slug = '',
  contact,
}: Props) {
  const locale = useLocale();
  const rtl = locale === 'ar';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '',
    unitType: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Imperium Gate unified contact - customers should contact Imperium Gate, not developers
  const IMPERIUM_PHONE_E164 = '971567022702';
  const IMPERIUM_PHONE_DISPLAY = '+971 56 702 2702';
  
  const actualPhoneE164 = IMPERIUM_PHONE_E164;
  const actualPhoneDisplay = IMPERIUM_PHONE_DISPLAY;

  const whatsAppHref = useMemo(() => {
    const msg =
      `Hello Imperium Gate,%0A` +
      `I'm interested in: ${projectName}${developer ? ` (${developer})` : ''}.%0A` +
      (slug ? `Project URL: https://imperium-gate.com/projects/${developer}/${slug}%0A` : '') +
      `Please contact me.`;
    return `https://wa.me/${actualPhoneE164}?text=${msg}`;
  }, [projectName, developer, slug, actualPhoneE164]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return alert(rtl ? 'الاسم والهاتف إجباريان' : 'Name and phone are required');

    try {
      setSubmitting(true);
      // TODO: اربط مع API لاحقاً. مؤقتًا نرسل بريد/ويب هوك أو نحفظ في لوج.
      console.log('Lead:', { projectName, developer, slug, ...form });
      alert(rtl ? 'تم إرسال طلبك. سنعاود الاتصال قريبًا.' : 'Submitted! We will contact you shortly.');
      setForm({ name: '', phone: '', email: '', budget: '', unitType: '', message: '', });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gold/30 bg-black/60 backdrop-blur p-5 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold text-gold mb-3">{rtl ? 'تواصل' : 'Contact'}</h3>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-5 ${rtl ? 'text-right' : 'text-left'}`}>
        {/* CTAs */}
        <div className="space-y-3">
          <a
            href={whatsAppHref}
            target="_blank"
            className="block w-full rounded-xl border border-green-500/50 bg-green-500/10 px-4 py-3 font-semibold hover:bg-green-500/20 transition"
          >
            {rtl ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
          </a>
          <a
            href={`tel:+${actualPhoneE164}`}
            className="block w-full rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 font-semibold hover:bg-gold/20 transition"
          >
            {rtl ? `اتصال مباشر (${actualPhoneDisplay})` : `Call Now (${actualPhoneDisplay})`}
          </a>
          <LuxuryButton
            variant="outline"
            size="md"
            fullWidth
            className="rounded-xl font-semibold"
            onClick={() => alert(rtl ? 'واجهة حجز المعاينة ستُربط قريبًا.' : 'Schedule UI coming soon.')}
          >
            {rtl ? 'حجز معاينة' : 'Schedule a Viewing'}
          </LuxuryButton>

          {/* Agent Card (اختياري) */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <div className="font-semibold">{rtl ? 'مستشارك العقاري' : 'Your Advisor'}</div>
            <div className="text-white/70">
              {contact?.agentName || (rtl ? 'فريق Imperium Gate' : 'Imperium Gate Team')}
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <input className="rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-3 py-2" placeholder={rtl ? 'الاسم *' : 'Name *'} value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-3 py-2" placeholder={rtl ? 'هاتف/واتساب *' : 'Phone/WhatsApp *'} value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <input className="rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input className="rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-3 py-2" placeholder={rtl ? 'ميزانية تقريبية' : 'Approx. Budget'} value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})}/>
          <input className="rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-3 py-2" placeholder={rtl ? 'نوع الوحدة' : 'Unit Type'} value={form.unitType} onChange={e=>setForm({...form, unitType:e.target.value})}/>
          <textarea className="sm:col-span-2 min-h-[96px] rounded-lg bg-zinc-900/70 border border-zinc-700/50 px-3 py-2" placeholder={rtl ? 'رسالتك' : 'Message'} value={form.message} onChange={e=>setForm({...form, message:e.target.value})}/>
          <LuxuryButton
            type="submit"
            variant="primary"
            size="md"
            disabled={submitting}
            className="sm:col-span-2 rounded-xl font-semibold"
          >
            {submitting ? (rtl ? 'جار الإرسال...' : 'Submitting...') : (rtl ? 'إرسال' : 'Send')}
          </LuxuryButton>
        </form>
      </div>
    </section>
  );
}
