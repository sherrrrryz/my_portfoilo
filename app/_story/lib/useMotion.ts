'use client';

import { useEffect, useState } from 'react';

export type MotionMode = 'full' | 'reduced';

export function useMotion(): MotionMode {
  const [mode, setMode] = useState<MotionMode>('full');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMode(mq.matches ? 'reduced' : 'full');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return mode;
}
