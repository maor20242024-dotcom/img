'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  message?: string;
  sub?: string;
  logoSrc?: string;
  onComplete?: () => void;
  duration?: number;
};

export default function IGSplash({
  message = 'جارٍ فتح صفحة المشروع...',
  sub = 'Imperium Gate',
  logoSrc = '/brand/imperium-gate.png',
  onComplete,
  duration = 2000,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const fadeOutDuration = 500;

  useEffect(() => {
    if (onComplete && duration > 0) {
      let completionTimer: ReturnType<typeof setTimeout> | undefined;
      const timer = setTimeout(() => {
        setIsVisible(false);
        completionTimer = setTimeout(() => {
          onComplete();
        }, fadeOutDuration); // Wait for fade out animation
      }, duration);

      return () => {
        clearTimeout(timer);
        if (completionTimer) {
          clearTimeout(completionTimer);
        }
      };
    }
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-items-center bg-gradient-to-br from-[#0a0f1a] via-[#0d1526] to-[#0a0f1a] backdrop-blur-sm transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Golden particles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-500 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute bottom-1/3 right-2/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-30"></div>
      </div>

      <div className="relative flex flex-col items-center gap-6">
        {/* توهج خلفي نابض محسّن */}
        <div
          className="absolute -z-10 h-64 w-64 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              'radial-gradient(closest-side, rgba(230,195,106,.4), rgba(230,195,106,0.15), transparent 70%)',
            animationDuration: '1.6s',
          }}
        />

        {/* حلقة ذهبية دوّارة حول الشعار */}
        <div className="relative h-36 w-36">
          <div
            className="absolute inset-0 -z-10 rounded-full animate-spin"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(230,195,106,0.9), rgba(230,195,106,0.1), rgba(230,195,106,0.9))',
              mask:
                'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
              WebkitMask:
                'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
              animationDuration: '1.4s',
            }}
          />
          <div
            className={`relative w-full h-full transition-all duration-1000 ${
              logoLoaded ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
          >
            <Image
              src={logoSrc}
              alt="Imperium Gate Logo"
              fill
              priority
              className="select-none pointer-events-none object-contain drop-shadow-[0_0_40px_rgba(230,195,106,.8)]"
              sizes="144px"
              onLoad={() => setLogoLoaded(true)}
            />
          </div>
        </div>

        {/* نصوص محسّنة */}
        <div
          className={`text-center transition-all duration-1000 delay-300 ${
            logoLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="text-gold/90 text-sm tracking-wide mb-2">{message}</div>
          <div className="text-[11px] text-gold/70 font-light tracking-wider">{sub}</div>
        </div>

        {/* Loading indicator */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            logoLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}