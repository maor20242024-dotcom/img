// 🔄 Unified Project Service - دمج مع unifiedDataService
// هذا الملف أصبح legacy ويتم استخدام unifiedDataService بدلاً منه
// للحفاظ على التوافق، نعيد تصدير الوظائف من unifiedDataService

export {
  getProjectBySlug,
  getProjectsByDeveloper,
  listDevelopers, loadAllProjects
} from './unifiedDataService';

// الحفاظ على التوافق مع الكود الحالي
export async function getDevelopers(): Promise<{ developer: string; count: number }[]> {
  return (await import('./unifiedDataService')).listDevelopers();
}
