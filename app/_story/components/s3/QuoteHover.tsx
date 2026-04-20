'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScatteredTags from './ScatteredTags';
import StepGrid from './StepGrid';

gsap.registerPlugin(ScrollTrigger);

type PhraseKey = 'newcomer' | 'senior' | 'departments' | 'terrible';

export default function QuoteHover() {
  const quoteRef = useRef<HTMLQuoteElement>(null);

  /* Scroll-driven "镜头 zoom": scrub --q-scroll-scale 1 → 0.7.
     CSS: transform: translateX(-50%) scale(var(--q-scroll-scale)).
     手机端 CSS 里 transform: none 兜底。 */
  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const state = { scale: 1 };
    const apply = () => {
      el.style.setProperty('--q-scroll-scale', state.scale.toFixed(4));
    };
    apply();

    const tween = gsap.to(state, {
      scale: 0.7,
      ease: 'none',
      onUpdate: apply,
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'top 40%',
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  /* Per-mount random hover jitter for each of the 4 phrases.
     scale 1.05–1.10, rotate ±4°. Stable across re-renders via useRef. */
  const jitterRef = useRef<Record<PhraseKey, { scale: number; rot: number }>>();
  if (!jitterRef.current) {
    const make = () => ({
      scale: 1.05 + Math.random() * 0.05,
      rot: (Math.random() - 0.5) * 8,
    });
    jitterRef.current = {
      newcomer: make(),
      senior: make(),
      departments: make(),
      terrible: make(),
    };
  }

  function makePhrase(
    id: PhraseKey,
    colorClass: '1' | '2' | '3' | '4',
    children: React.ReactNode,
  ) {
    const j = jitterRef.current![id];
    return (
      <span
        className={`ft-phrase ft-phrase--${colorClass}`}
        style={
          {
            '--jitter-scale': j.scale.toFixed(3),
            '--jitter-rot': j.rot.toFixed(2),
          } as React.CSSProperties
        }
      >
        {children}
      </span>
    );
  }

  return (
    <div className="ft-quote-root">
      <blockquote ref={quoteRef} className="ft-quote">
        <span className="ft-quote__line">
          &ldquo;We just put {makePhrase('newcomer', '1', 'a newcomer')} in
          charge, leading
        </span>
        <span className="ft-quote__line">
          {makePhrase('senior', '2', 'a team of senior people')}, across{' '}
          {makePhrase('departments', '3', 'multiple departments')}.
        </span>
        <span className="ft-quote__line">
          Honestly? It sounded like{' '}
          {makePhrase('terrible', '4', 'a terrible idea')}.&rdquo;
        </span>
      </blockquote>

      <div className="ft-panel">
        <ScatteredTags />
      </div>

      <StepGrid />
    </div>
  );
}
