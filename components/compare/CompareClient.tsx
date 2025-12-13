'use client';

import React from 'react';
import { useCompare } from '@/lib/compare';
import { useLocale } from '@/lib/i18n-client';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/lib/types';

interface CompareClientProps {
  allProjects: Project[];
}

export default function CompareClient({ allProjects }: CompareClientProps) {
  const { ids } = useCompare();
  const locale = useLocale();
  const isAr = locale === 'ar';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] text-light px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-amber-300">
          {isAr ? 'مقارنة المشاريع' : 'Compare Projects'}
        </h1>
        {ids.length === 0 ? (
          <p className="text-gray-400">
            {isAr ? 'لم تقم بإضافة أي مشاريع للمقارنة' : 'No projects added for comparison'}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ids.map((id) => (
              <div key={id} className="text-gray-400">Project: {id}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
