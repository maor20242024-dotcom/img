import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Project } from '@/lib/types';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const developers = ['Emaar', 'DAMAC', 'Sobha', 'Nakheel'];
    const allProjects: Project[] = [];

    // قراءة جميع ملفات المشاريع
    for (const developer of developers) {
      try {
        const developerDir = path.join(dataDir, developer);
        const files = await fs.readdir(developerDir);

        for (const file of files) {
          if (file.endsWith('.json')) {
            try {
              const filePath = path.join(developerDir, file);
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const project: Project = JSON.parse(fileContent);
              project.developer = developer; // إضافة اسم المطور
              allProjects.push(project);
            } catch (error) {
              console.error(`Error reading ${file}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`Error reading ${developer} directory:`, error);
      }
    }

    // حساب الإحصائيات
    const stats = {
      total: allProjects.length,
      withCoordinates: allProjects.filter(p =>
        typeof p.latitude === 'number' &&
        typeof p.longitude === 'number' &&
        p.latitude !== 0 &&
        p.longitude !== 0 &&
        !isNaN(p.latitude) &&
        !isNaN(p.longitude)
      ).length,
      withoutCoordinates: allProjects.filter(p =>
        !p.latitude ||
        !p.longitude ||
        p.latitude === 0 ||
        p.longitude === 0 ||
        isNaN(p.latitude as number) ||
        isNaN(p.longitude as number)
      ).length,
      withPOIs: allProjects.filter(p =>
        p.mapPointsOfInterest &&
        Object.keys(p.mapPointsOfInterest).length > 0
      ).length,
      byDeveloper: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      errors: [] as string[]
    };

    // حساب التوزيع حسب المطور
    allProjects.forEach(project => {
      const developer = project.developer || 'Unknown';
      stats.byDeveloper[developer] = (stats.byDeveloper[developer] || 0) + 1;
    });

    // حساب التوزيع حسب الحالة
    allProjects.forEach(project => {
      const status = typeof project.projectStatus === 'string'
        ? project.projectStatus
        : (project.projectStatus as any)?.en || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats,
      projects: allProjects.slice(0, 100) // إرجاع أول 100 مشروع فقط
    });

  } catch (error) {
    console.error('Error calculating map stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate map statistics',
        stats: {
          total: 0,
          withCoordinates: 0,
          withoutCoordinates: 0,
          withPOIs: 0,
          byDeveloper: {},
          byStatus: {},
          errors: ['Failed to load project data']
        },
        projects: []
      },
      { status: 500 }
    );
  }
}