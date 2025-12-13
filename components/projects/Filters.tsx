'use client';
import ProjectCard from '@/components/ProjectCard';
import { useLocale } from '@/lib/i18n-client';
import type { Project } from '@/lib/types';
import { useMemo, useState, useEffect, useRef } from 'react';

// Elegant dropdown component
function LuxuryDropdown({
  label,
  value,
  options,
  onSelect,
  isOpen,
  onToggle,
  dropdownRef,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="w-full bg-[#0d1526]/80 backdrop-blur-sm border border-[#2a3441] rounded-lg px-5 py-3.5 text-white text-left flex justify-between items-center hover:border-[#c9a962] transition-all duration-300 group"
        onClick={onToggle}
      >
        <span className="truncate text-[#e8e8e8] group-hover:text-white transition-colors">
          {value || label}
        </span>
        <span className={`text-[#c9a962] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1526]/95 backdrop-blur-md border border-[#2a3441] rounded-lg shadow-2xl z-20 max-h-64 overflow-y-auto">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={option.value || index}
                className={`w-full px-5 py-3 text-left transition-all duration-200 ${
                  value === option.value 
                    ? 'bg-[#c9a962]/20 text-[#c9a962]' 
                    : 'text-[#e8e8e8] hover:bg-[#1a2535] hover:text-white'
                }`}
                onClick={() => {
                  onSelect(option.value);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Filters({ initial }: { initial: Project[] }) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [q, setQ] = useState('');
  const [dev, setDev] = useState<string>('');
  const [beds, setBeds] = useState<string>('');
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showDevDropdown, setShowDevDropdown] = useState(false);
  const [showBedsDropdown, setShowBedsDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Refs for click outside detection
  const devRef = useRef<HTMLDivElement>(null);
  const bedsRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (devRef.current && !devRef.current.contains(event.target as Node)) {
        setShowDevDropdown(false);
      }
      if (bedsRef.current && !bedsRef.current.contains(event.target as Node)) {
        setShowBedsDropdown(false);
      }
      if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
        setShowAreaDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // استخراج القيم الفريدة للقوائم المنبثقة
  const uniqueDevelopers = useMemo(() => {
    const developers = initial.map(p => p.developer || '').filter(Boolean);
    return [...new Set(developers)].sort();
  }, [initial]);

  const uniqueBedrooms = useMemo(() => {
    const allBeds = initial.flatMap(p => p.bedrooms || []);
    // Remove duplicates and sort
    return [...new Set(allBeds)].filter(b => b > 0).sort((a, b) => a - b);
  }, [initial]);

  const uniqueAreas = useMemo(() => {
    const areas = initial.map(p => {
      const area = p.area;
      if (typeof area === 'string') return area;
      if (area && typeof area === 'object') return (area as any)[locale] || (area as any).en || '';
      return '';
    }).filter(Boolean);
    return [...new Set(areas)].sort();
  }, [initial, locale]);

  const uniqueStatuses = useMemo(() => {
    const statuses = initial.map(p => {
      const status = p.projectStatus;
      if (typeof status === 'string') return status;
      if (status && typeof status === 'object') return (status as any)[locale] || (status as any).en || '';
      return '';
    }).filter(Boolean);
    return [...new Set(statuses)].sort();
  }, [initial, locale]);

  const filtered = useMemo(() => {
    return initial.filter(p => {
      const name = typeof p.projectName === 'string' ? p.projectName : ((p.projectName as any)?.[locale] || (p.projectName as any)?.en || '');
      const hitQ = !q || name.toLowerCase().includes(q.toLowerCase());
      const hitDev = !dev || (p.developer || '').toLowerCase() === dev.toLowerCase();

      const projectMinPrice = p.minPriceAED || 0;
      const projectMaxPrice = p.maxPriceAED || 0;
      const minOk = !min || projectMinPrice >= Number(min);
      const maxOk = !max || (projectMaxPrice > 0 && projectMaxPrice <= Number(max));

      const bedOk = !beds || (Array.isArray(p.bedrooms) && p.bedrooms.some(b => String(b) === beds));

      const projectArea = p.area;
      const areaString = typeof projectArea === 'string' ? projectArea : ((projectArea as any)?.[locale] || (projectArea as any)?.en || '');
      const areaOk = !area || areaString.toLowerCase() === area.toLowerCase();

      const projectStatus = p.projectStatus;
      const statusString = typeof projectStatus === 'string' ? projectStatus : ((projectStatus as any)?.[locale] || (projectStatus as any)?.en || '');
      const statusOk = !status || statusString.toLowerCase() === status.toLowerCase();

      return hitQ && hitDev && minOk && maxOk && bedOk && areaOk && statusOk;
    });
  }, [initial, q, dev, min, max, beds, area, status, locale]);

  const clearFilters = () => {
    setQ('');
    setDev('');
    setBeds('');
    setMin('');
    setMax('');
    setArea('');
    setStatus('');
  };

  const hasActiveFilters = q || dev || beds || min || max || area || status;

  // Text translations
  const t = {
    searchPlaceholder: isRTL ? 'ابحث عن مشروع...' : 'Search projects...',
    allDevelopers: isRTL ? 'جميع المطورين' : 'All Developers',
    allBedrooms: isRTL ? 'عدد الغرف' : 'Bedrooms',
    allAreas: isRTL ? 'جميع المناطق' : 'All Areas',
    allStatuses: isRTL ? 'جميع الحالات' : 'All Statuses',
    minPrice: isRTL ? 'السعر الأدنى' : 'Min Price',
    maxPrice: isRTL ? 'السعر الأقصى' : 'Max Price',
    found: isRTL ? 'تم العثور على' : 'Found',
    projects: isRTL ? 'مشروع' : 'projects',
    clearAll: isRTL ? 'مسح الفلاتر' : 'Clear Filters',
    noResults: isRTL ? 'لم نعثر على مشاريع مطابقة' : 'No matching projects found',
    tryDifferent: isRTL ? 'جرّب تغيير معايير البحث' : 'Try adjusting your search criteria',
    bedroom: isRTL ? 'غرفة' : 'BR',
    studio: isRTL ? 'استوديو' : 'Studio',
  };

  // Format bedroom label
  const formatBedroom = (bed: number) => {
    if (bed === 0) return t.studio;
    return `${bed} ${t.bedroom}`;
  };

  return (
    <div className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Filter Section Header */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#c9a962] to-transparent mx-auto mb-4" />
          <h2 className={`text-xl text-[#c9a962] tracking-wider ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {isRTL ? 'تصفية المشاريع' : 'FILTER PROJECTS'}
          </h2>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#c9a962] to-transparent mx-auto mt-4" />
        </div>
      </div>

      {/* Main Filters Grid */}
      <div className="bg-[#0a0f1a]/60 backdrop-blur-sm border border-[#1a2535] rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              className="w-full bg-[#0d1526]/80 backdrop-blur-sm border border-[#2a3441] rounded-lg pl-12 pr-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c9a962] transition-all duration-300"
              placeholder={t.searchPlaceholder}
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Developer Dropdown */}
          <LuxuryDropdown
            label={t.allDevelopers}
            value={dev}
            options={[
              { value: '', label: t.allDevelopers },
              ...uniqueDevelopers.map(d => ({ value: d, label: d }))
            ]}
            onSelect={(v) => { setDev(v); setShowDevDropdown(false); }}
            isOpen={showDevDropdown}
            onToggle={() => setShowDevDropdown(!showDevDropdown)}
            dropdownRef={devRef as React.RefObject<HTMLDivElement>}
          />

          {/* Bedrooms Dropdown */}
          <LuxuryDropdown
            label={t.allBedrooms}
            value={beds ? formatBedroom(Number(beds)) : ''}
            options={[
              { value: '', label: t.allBedrooms },
              ...uniqueBedrooms.map(b => ({ value: String(b), label: formatBedroom(b) }))
            ]}
            onSelect={(v) => { setBeds(v); setShowBedsDropdown(false); }}
            isOpen={showBedsDropdown}
            onToggle={() => setShowBedsDropdown(!showBedsDropdown)}
            dropdownRef={bedsRef as React.RefObject<HTMLDivElement>}
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Min Price */}
          <div className="relative">
            <input
              type="number"
              className="w-full bg-[#0d1526]/80 backdrop-blur-sm border border-[#2a3441] rounded-lg px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c9a962] transition-all duration-300"
              placeholder={t.minPrice}
              value={min}
              onChange={e => setMin(e.target.value)}
            />
            {min && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">
                AED
              </span>
            )}
          </div>

          {/* Max Price */}
          <div className="relative">
            <input
              type="number"
              className="w-full bg-[#0d1526]/80 backdrop-blur-sm border border-[#2a3441] rounded-lg px-5 py-3.5 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c9a962] transition-all duration-300"
              placeholder={t.maxPrice}
              value={max}
              onChange={e => setMax(e.target.value)}
            />
            {max && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">
                AED
              </span>
            )}
          </div>

          {/* Area Dropdown */}
          <LuxuryDropdown
            label={t.allAreas}
            value={area}
            options={[
              { value: '', label: t.allAreas },
              ...uniqueAreas.map(a => ({ value: a, label: a }))
            ]}
            onSelect={(v) => { setArea(v); setShowAreaDropdown(false); }}
            isOpen={showAreaDropdown}
            onToggle={() => setShowAreaDropdown(!showAreaDropdown)}
            dropdownRef={areaRef as React.RefObject<HTMLDivElement>}
          />

          {/* Status Dropdown */}
          <LuxuryDropdown
            label={t.allStatuses}
            value={status}
            options={[
              { value: '', label: t.allStatuses },
              ...uniqueStatuses.map(s => ({ value: s, label: s }))
            ]}
            onSelect={(v) => { setStatus(v); setShowStatusDropdown(false); }}
            isOpen={showStatusDropdown}
            onToggle={() => setShowStatusDropdown(!showStatusDropdown)}
            dropdownRef={statusRef as React.RefObject<HTMLDivElement>}
          />
        </div>

        {/* Results Count & Clear */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#1a2535]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#c9a962]" />
            <span className="text-[#e8e8e8]">
              {t.found}{' '}
              <span className="text-[#c9a962] font-semibold text-lg">{filtered.length}</span>{' '}
              {t.projects}
            </span>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="group flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#2a3441] rounded-lg text-[#e8e8e8] hover:border-[#c9a962] hover:text-[#c9a962] transition-all duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-90 transition-transform duration-300">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t.clearAll}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#0d1526] border border-[#2a3441] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#6b7280]">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[#e8e8e8] text-lg mb-2">{t.noResults}</p>
          <p className="text-[#6b7280]">{t.tryDifferent}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      )}
    </div>
  );
}
