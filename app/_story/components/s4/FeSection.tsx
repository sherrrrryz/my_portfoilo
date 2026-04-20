'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 4 wrapper. Scrubs two CSS variables on scroll:
 *   --fe-bg:  --stage-light  →  --stage-dark
 *   --fe-ink: --ink-primary  →  --ink-on-dark-primary
 *
 * The whole palette flips as the section enters view, and reverses on
 * the way up. Lenis is already wired to ScrollTrigger.update via
 * LenisContext, so the scrub stays in sync with smooth scrolling.
 */
export default function FeSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { '--fe-bg': '#f8f8f7', '--fe-ink': '#0a0a0a' },
      {
        '--fe-bg': '#0a0a0a',
        '--fe-ink': '#fafafa',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          // start: the section top enters from the bottom of the viewport.
          // end:   the section top is still 50% down the viewport — which,
          //        with a 60vh top padding, means the eyebrow is still ~10vh
          //        below the fold. The palette flip completes before the
          //        user actually sees any S4 content.
          start: 'top bottom',
          end: 'top 50%',
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={ref} className="fe-section">
      {children}
    </section>
  );
}
