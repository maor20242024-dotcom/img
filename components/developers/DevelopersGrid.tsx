'use client';

import React from 'react';

type Developer = {
  developer: string;
  count: number;
};

type Props = {
  developers: Developer[];
  locale: 'ar' | 'en';
};

export default function DevelopersGrid({ developers, locale }: Props) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {developers.map((dev) => (
        <div
          key={dev.developer}
          className="bg-gradient-to-br from-zinc-900 to-black border border-[var(--gold)]/30 rounded-lg p-6 hover:border-[var(--gold)] transition-all"
        >
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-amber-300 mb-2">
            {dev.developer}
          </h3>
          <p className="text-gray-400">
            {dev.count} {locale === 'ar' ? 'مشروع' : 'projects'}
          </p>
        </div>
      ))}
    </div>
  );
}
