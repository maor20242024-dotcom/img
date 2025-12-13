'use client';

import LuxuryButton from '@/components/ui/LuxuryButton';

export default function StatsPanel({ total, counts }: { total: number; counts: { developer: string; count: number }[] }){
  return (
    <div className="mt-6 grid sm:grid-cols-2 gap-4">
      <div className="rounded-lg border border-gold/20 p-4">
        <div className="text-gold font-semibold mb-2">إحصاءات</div>
        <div className="text-sm text-gray-300">المشاريع الكلية: {total}</div>
        <ul className="mt-2 text-sm text-gray-400">
          {counts.map(item => (<li key={item.developer}>{item.developer}: {item.count}</li>))}
        </ul>
      </div>
      <div className="rounded-lg border border-gold/20 p-4">
        <div className="text-gold font-semibold mb-2">تحديث البيانات</div>
        <form action="">
          <LuxuryButton variant="primary" size="sm" type="submit">
            تحديث الآن
          </LuxuryButton>
        </form>
        <p className="text-xs text-gray-500 mt-2">أعد تحميل الصفحة لتنعكس التغييرات.</p>
      </div>
    </div>
  );
}
