import { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n';
import { Locale } from '@/lib/i18n-config';
import ContactPageClient from './ContactPageClient';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.locale);
  
  return {
    title: resolvedParams.locale === 'ar' ? 'تواصل معنا - Imperium Gate' : 'Contact Us - Imperium Gate',
    description: resolvedParams.locale === 'ar' 
      ? 'تواصل مع فريق Imperium Gate للاستشارات العقارية والاستثمار في دبي'
      : 'Contact Imperium Gate team for real estate consultations and investment opportunities in Dubai',
  };
}

export default async function ContactPage({ params }: Props) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.locale);
  
  return <ContactPageClient locale={resolvedParams.locale} dict={dict} />;
}