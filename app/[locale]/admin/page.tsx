import StatsPanel from '@/components/admin/StatsPanel';
import UploadForm from '@/components/admin/UploadForm';
import { loadAllProjects } from '@/lib/unifiedDataService';
import { useLocale } from '@/lib/i18n-client';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 🚀 DYNAMIC LOADING: Read projects directly from individual JSON files
  const all = await loadAllProjects();
  const map = new Map<string, number>();
  for (const p of all) {
    const dev = (p.developer || 'Unknown') as string;
    map.set(dev, (map.get(dev) || 0) + 1);
  }
  const counts = Array.from(map.entries()).map(([developer, count]) => ({ developer, count }));
  
  // إحصائيات إضافية
  const totalProjects = all.length;
  const projectsWithImages = all.filter(p => p.heroImage || (p.galleryImages && p.galleryImages.length > 0)).length;
  const projectsWithVideos = all.filter(p => p.videoLink).length;
  const projectsWith3DTours = all.filter(p => p["3D_TourLink"]).length;
  const projectsWithCoordinates = all.filter(p => p.latitude && p.longitude).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold gold-gradient gold-glow-strong mb-4">
          {locale === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
        </h1>
        <p className="text-gray-400 text-lg">
          {locale === 'ar' ? 'إدارة المشاريع والإحصائيات' : 'Manage projects and view statistics'}
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 text-center">
          <div className="text-2xl text-gold mb-2">🏢</div>
          <div className="text-white font-bold text-xl">{totalProjects}</div>
          <div className="text-gray-400 text-sm">{locale === 'ar' ? 'المشاريع' : 'Projects'}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 text-center">
          <div className="text-2xl text-gold mb-2">🖼️</div>
          <div className="text-white font-bold text-xl">{projectsWithImages}</div>
          <div className="text-gray-400 text-sm">{locale === 'ar' ? 'بالصور' : 'With Images'}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 text-center">
          <div className="text-2xl text-gold mb-2">🎬</div>
          <div className="text-white font-bold text-xl">{projectsWithVideos}</div>
          <div className="text-gray-400 text-sm">{locale === 'ar' ? 'بفيديوهات' : 'With Videos'}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 text-center">
          <div className="text-2xl text-gold mb-2">🏠</div>
          <div className="text-white font-bold text-xl">{projectsWith3DTours}</div>
          <div className="text-gray-400 text-sm">{locale === 'ar' ? 'بجولات 3D' : 'With 3D Tours'}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 text-center">
          <div className="text-2xl text-gold mb-2">📍</div>
          <div className="text-white font-bold text-xl">{projectsWithCoordinates}</div>
          <div className="text-gray-400 text-sm">{locale === 'ar' ? 'بإحداثيات' : 'With Coordinates'}</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50 text-center">
          <div className="text-2xl text-gold mb-2">📊</div>
          <div className="text-white font-bold text-xl">{counts.length}</div>
          <div className="text-gray-400 text-sm">{locale === 'ar' ? 'مطورين' : 'Developers'}</div>
        </div>
      </div>

      {/* لوحة الإحصائيات */}
      <div className="mb-8">
        <StatsPanel total={totalProjects} counts={counts} />
      </div>

      {/* نموذج الرفع */}
      <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 gold-glow">
          {locale === 'ar' ? 'إضافة مشاريع جديدة' : 'Add New Projects'}
        </h2>
        <UploadForm />
      </div>

      {/* إجراءات سريعة */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
          <div className="text-gold text-2xl mb-3">🔄</div>
          <h3 className="text-white font-semibold mb-2">
            {locale === 'ar' ? 'تحديث البيانات' : 'Update Data'}
          </h3>
          <p className="text-gray-400 text-sm">
            {locale === 'ar' 
              ? 'تحديث جميع بيانات المشاريع تلقائياً'
              : 'Automatically update all project data'
            }
          </p>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
          <div className="text-gold text-2xl mb-3">📈</div>
          <h3 className="text-white font-semibold mb-2">
            {locale === 'ar' ? 'تقارير الأداء' : 'Performance Reports'}
          </h3>
          <p className="text-gray-400 text-sm">
            {locale === 'ar' 
              ? 'عرض تقارير أداء الموقع والتحليلات'
              : 'View site performance reports and analytics'
            }
          </p>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
          <div className="text-gold text-2xl mb-3">⚙️</div>
          <h3 className="text-white font-semibold mb-2">
            {locale === 'ar' ? 'إعدادات متقدمة' : 'Advanced Settings'}
          </h3>
          <p className="text-gray-400 text-sm">
            {locale === 'ar' 
              ? 'تخصيص إعدادات النظام والميزات'
              : 'Customize system settings and features'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
