'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 600);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [pathname]);

  return (
    <div
      className="fixed left-0 top-0 z-[10000] h-[2px] bg-gold shadow-[0_0_12px_rgba(230,195,106,.65)]"
      style={{ width: visible ? '100%' : '0%', transition: 'width 400ms ease' }}
    />
  );
}