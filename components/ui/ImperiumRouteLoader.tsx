'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import IGSplash from '@/components/ui/IGSplash';

const SPLASH_DURATION = 500;

export default function ImperiumRouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [instanceKey, setInstanceKey] = useState(0);
  const isFirstNavigation = useRef(true);

  const triggerSplash = () => {
    setInstanceKey((prev) => prev + 1);
    setVisible(true);
  };

  useEffect(() => {
    triggerSplash();
  }, []);

  useEffect(() => {
    if (isFirstNavigation.current) {
      isFirstNavigation.current = false;
      return;
    }
    triggerSplash();
  }, [pathname]);

  if (!visible) {
    return null;
  }

  return (
    <IGSplash
      key={instanceKey}
      duration={SPLASH_DURATION}
      onComplete={() => setVisible(false)}
    />
  );
}
