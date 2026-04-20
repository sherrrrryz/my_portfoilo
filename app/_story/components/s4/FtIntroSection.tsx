'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps the first S3 `.ft-section` (eyebrow + lead) and scrubs the
 * background from --stage-cream → --stage-light as the section enters.
 *
 * The section carries a large top padding (var(--vspace-2xl) = 60vh) so
 * the scrub fully completes before the eyebrow is ever visible — user
 * sees cream → white settle into place above the fold, then the S3
 * content reveals on pure white. Reverses on scroll-up via scrub.
 */
export default function FtIntroSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { backgroundColor: '#f2ebd9' }, // --stage-cream
      {
        backgroundColor: '#f8f8f7', // --stage-light
        ease: 'none',
        scrollTrigger: {
          trigger: el,
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
    <section
      ref={ref}
      className="ft-section"
      style={{
        minHeight: 'unset',
        paddingTop: 'var(--vspace-2xl)',
        paddingBottom: 0,
      }}
    >
      {children}
    </section>
  );
}
