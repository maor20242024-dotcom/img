'use client';

import { Project } from '@/lib/types';
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Download,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface MapStats {
  total: number;
  withCoordinates: number;
  withoutCoordinates: number;
  withPOIs: number;
  byDeveloper: Record<string, number>;
  byStatus: Record<string, number>;
  errors: string[];
}

export default function AdminMapsPage() {
  const [stats, setStats] = useState<MapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'projects' | 'errors'>('overview');

  // تحميل البيانات
  const loadMapData = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/maps/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setProjects(data.projects);
      } else {
        throw new Error(data.error || 'Failed to load data');
      }
    } catch (error) {
      console.error('Error loading map data:', error);
      setStats({
        total: 0,
        withCoordinates: 0,
        withoutCoordinates: 0,
        withPOIs: 0,
        byDeveloper: {},
        byStatus: {},
        errors: ['Failed to load project data']
      });
    } finally {
      setLoading(false);
    }
  };

  // تحديث البيانات يدوياً
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMapData();
    setRefreshing(false);
  };

  // تصدير التقرير
  const exportReport = () => {
    if (!stats) return;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_projects: stats.total,
        projects_with_coordinates: stats.withCoordinates,
        projects_without_coordinates: stats.withoutCoordinates,
        projects_with_pois: stats.withPOIs,
        coverage_percentage: Math.round((stats.withCoordinates / stats.total) * 100)
      },
      by_developer: stats.byDeveloper,
      by_status: stats.byStatus,
      errors: stats.errors
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `map-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadMapData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">جاري تحميل بيانات الخرائط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🗺️ إدارة الخرائط
              </h1>
              <p className="text-gray-600">
                مراقبة وإدارة بيانات الخرائط والمواقع الجغرافية للمشاريع
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                تحديث البيانات
              </button>
              <button
                onClick={exportReport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                تصدير التقرير
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
                { id: 'projects', label: 'المشاريع', icon: MapPin },
                { id: 'errors', label: 'الأخطاء', icon: AlertCircle }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {selectedTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المشاريع</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مع إحداثيات</p>
                    <p className="text-2xl font-bold text-green-600">{stats.withCoordinates}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((stats.withCoordinates / stats.total) * 100)}% من المجموع
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">بدون إحداثيات</p>
                    <p className="text-2xl font-bold text-red-600">{stats.withoutCoordinates}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((stats.withoutCoordinates / stats.total) * 100)}% من المجموع
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مع نقاط اهتمام</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.withPOIs}</p>
                    <p className="text-xs text-gray-500">
                      {Math.round((stats.withPOIs / stats.total) * 100)}% من المجموع
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* By Developer */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">التوزيع حسب المطور</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byDeveloper).map(([developer, count]) => (
                    <div key={developer} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{developer}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Status */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">التوزيع حسب الحالة</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'projects' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">قائمة المشاريع</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المشروع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المطور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإحداثيات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نقاط الاهتمام
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.slice(0, 50).map((project, index) => {
                    const hasCoords = project.latitude && project.longitude &&
                      project.latitude !== 0 && project.longitude !== 0;
                    const hasPOIs = project.mapPointsOfInterest &&
                      Object.keys(project.mapPointsOfInterest).length > 0;

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {typeof project.projectName === 'string'
                              ? project.projectName
                              : (project.projectName as any)?.ar || (project.projectName as any)?.en || 'Unknown'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.developer || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasCoords ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              متوفر
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              غير متوفر
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasPOIs ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {Object.keys(project.mapPointsOfInterest!).length} فئة
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">لا توجد</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {typeof project.projectStatus === 'string'
                            ? project.projectStatus
                            : (project.projectStatus as any)?.ar || (project.projectStatus as any)?.en || 'Unknown'
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'errors' && stats && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">سجل الأخطاء</h3>
            </div>
            <div className="p-6">
              {stats.errors.length > 0 ? (
                <div className="space-y-3">
                  {stats.errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-800">{error}</p>
                        <p className="text-xs text-red-600 mt-1">
                          {new Date().toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">لا توجد أخطاء مسجلة</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
