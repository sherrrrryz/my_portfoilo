'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '../../lib/useMotion';
import { Reveal } from '../../lib/Reveal';
import StepCard from './StepCard';
import { STEP_CARDS } from './stepGridData';

gsap.registerPlugin(ScrollTrigger);

export default function StepGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const motion = useMotion();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Mirror LockscreenPile pattern exactly: sort by visual top so stagger
    // reads top-left → bottom-right rather than following DOM order.
    const items = Array.from(
      grid.querySelectorAll<HTMLElement>('[data-step-card]'),
    ).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    const fromVars =
      motion === 'reduced'
        ? { opacity: 0 }
        : { y: 120, opacity: 0, filter: 'blur(6px)' };

    const toVars =
      motion === 'reduced'
        ? { opacity: 1, duration: 0.2, stagger: 0 }
        : {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power2.out',
            stagger: 0.18,
          };

    const tween = gsap.fromTo(items, fromVars, {
      ...toVars,
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [motion]);

  return (
    <section className="sg-section" aria-label="Step by step">
      <Reveal
        mode="words"
        effect="blur"
        trigger="once"
        duration={0.9}
        stagger={0.04}
        start="top 80%"
        className="sg-header"
      >
        Step by step
      </Reveal>

      <div ref={gridRef} className="sg-grid">
        {STEP_CARDS.map((card) => (
          <StepCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
