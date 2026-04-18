'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Expose globally so other components (e.g. ScrollSnap) can drive smooth scrollTo.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Feed every Lenis scroll tick into ScrollTrigger so scrub animations stay in sync.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis in its own rAF loop — tying it to gsap.ticker breaks when gsap sleeps
    // between tween activations, leaving Lenis unticked and scroll frozen.
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
