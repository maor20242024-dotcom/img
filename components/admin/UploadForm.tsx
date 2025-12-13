'use client';
import { useState } from 'react';
import LuxuryButton from '@/components/ui/LuxuryButton';

export default function UploadForm(){
  const [msg, setMsg] = useState('');
  async function onUpload(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    // Upload disabled in offline/dev mode. Show placeholder message.
    setMsg('تم تعطيل الرفع في وضع التطوير. ضع ملفات JSON في المسار public/data/<developer>/<slug>/<slug>.json');
    e.currentTarget.reset();
  }
  return (
    <div className="mt-8 rounded-lg border border-gold/20 p-4">
      <div className="text-gold font-semibold mb-3">إضافة مشروع جديد (JSON)</div>
      <p className="text-xs text-gray-400 mb-3">يحفظ أثناء التطوير ضمن /public/data/&lt;developer&gt;/&lt;slug&gt;/&lt;slug&gt;.json</p>
      <form onSubmit={onUpload} className="space-y-3">
        <input required name="developer" placeholder="developer مثل: damac" className="w-full bg-black/40 border border-gold/20 rounded px-3 py-2" />
        <input required name="slug" placeholder="slug مثل: altitude-de-grisogono" className="w-full bg-black/40 border border-gold/20 rounded px-3 py-2" />
        <input required type="file" name="file" accept="application/json" className="w-full text-sm" />
        <LuxuryButton variant="primary" size="sm" type="submit">
          رفع JSON
        </LuxuryButton>
      </form>
      {msg && <div className="mt-3 text-sm">{msg}</div>}
    </div>
  );
}
