'use client';

import { useLocale } from '@/lib/i18n-client';
import type { Map, Marker } from 'leaflet';
import React, { useEffect, useRef } from 'react';

interface SimpleGoogleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  title?: string;
  className?: string;
  height?: string;
}

const SimpleGoogleMap: React.FC<SimpleGoogleMapProps> = ({ 
  latitude, 
  longitude, 
  title,
  className = '',
  height = '400px'
}) => {
  const locale = useLocale();
  const rtl = locale === 'ar';
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // التحقق من صحة الإحداثيات
  const isValidCoordinate = (coord: number): boolean => {
    return typeof coord === 'number' && !isNaN(coord) && isFinite(coord) && Math.abs(coord) > 0;
  };

  // إذا كانت الإحداثيات غير صالحة، لا تعرض الخريطة
  if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
    return (
      <div className={`w-full ${className} flex items-center justify-center bg-gray-100 rounded-lg`} style={{ height }}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-gray-600">
            {rtl ? 'موقع المشروع غير متوفر حالياً' : 'Project location is currently unavailable'}
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!mapRef.current) return;

    // تحميل Leaflet ديناميكياً لتجنب مشاكل SSR
    import('leaflet').then((L) => {
      // تنظيف الخريطة السابقة إذا كانت موجودة
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // إنشاء الخريطة
      const map = L.default.map(mapRef.current!, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true
      });

      // إضافة طبقة OpenStreetMap
      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // إضافة علامة الموقع
      const marker = L.default.marker([latitude, longitude]).addTo(map);
      
      // إضافة نافذة معلومات
      const popupContent = `
        <div class="text-center">
          <strong>${title || (rtl ? 'موقع المشروع' : 'Project Location')}</strong><br>
          ${rtl ? 'الإحداثيات:' : 'Coordinates:'} ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
        </div>
      `;
      marker.bindPopup(popupContent);

      // حفظ نسخة من الخريطة للتنظيف
      mapInstanceRef.current = map;

      // إعادة ضبط الخريطة بعد التحميل
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });

    // تنظيف الخريطة عند إلغاء التحميل
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title, rtl]);

  return (
    <div className={`w-full ${className}`}>
      {/* خريطة Leaflet التفاعلية داخل الصفحة */}
      <div 
        ref={mapRef}
        className="w-full rounded-xl border-2 border-yellow-400/40 shadow-[0_0_30px_rgba(255,215,0,0.3)] overflow-hidden bg-gray-200"
        style={{ height }}
      >
        {/* رسالة تحميل */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🗺️</div>
            <p className="text-gray-700 font-medium">
              {rtl ? 'جاري تحميل الخريطة...' : 'Loading map...'}
            </p>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="mt-4 text-center text-gray-500 text-sm">
        {rtl 
          ? 'خريطة تفاعلية - يمكنك التكبير والتحريك لعرض الموقع'
          : 'Interactive map - You can zoom and pan to view the location'
        }
      </div>
    </div>
  );
};

export default SimpleGoogleMap;
