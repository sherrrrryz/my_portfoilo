'use client';

import { useEffect } from 'react';
import type Lenis from 'lenis';
import Snap from 'lenis/snap';

interface ScrollSnapProps {
  // CSS selectors of snap targets, in document order. Each element's
  // `data-snap-align` attribute controls alignment: 'start' | 'center' | 'end'
  // (default 'start').
  selectors: string[];
  // Distance from a snap point within which proximity-snap engages. Percentage
  // is relative to viewport height.
  distanceThreshold?: `${number}%` | number;
  // Debounce after scroll stops before snap fires (ms).
  debounceMs?: number;
  // Duration of the snap tween (seconds).
  durationSec?: number;
}

export default function ScrollSnap({
  selectors,
  distanceThreshold = '55%',
  debounceMs = 140,
  durationSec = 0.9,
}: ScrollSnapProps) {
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!lenis) return;

    const snap = new Snap(lenis, {
      type: 'proximity',
      distanceThreshold,
      debounce: debounceMs,
      duration: durationSec,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    const removers: Array<() => void> = [];

    // Wait for layout/fonts so addElement sees final rects.
    const register = () => {
      for (const sel of selectors) {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (!el) continue;
        const align = (el.dataset.snapAlign as string | undefined) ?? 'start';
        removers.push(snap.addElement(el, { align }));
      }
    };

    const ready = (document.fonts?.ready ?? Promise.resolve()).then(() => {
      // small extra tick to let GSAP ScrollTrigger pin-spacers, Lenis, etc. settle
      return new Promise<void>((r) => setTimeout(r, 200));
    });
    let cancelled = false;
    ready.then(() => {
      if (!cancelled) register();
    });

    return () => {
      cancelled = true;
      removers.forEach((fn) => fn());
      snap.destroy();
    };
  }, [selectors.join('|'), distanceThreshold, debounceMs, durationSec]);

  return null;
}
