import { useParams } from 'next/navigation';

export type Locale = 'ar' | 'en';

export function useLocale(): Locale {
  const params = useParams();
  return (params?.locale === 'en' ? 'en' : 'ar') as Locale;
}