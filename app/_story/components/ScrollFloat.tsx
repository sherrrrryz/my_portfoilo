'use client';

import React, { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import '../styles/ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  scrub?: boolean;
  highlight?: string;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  scrub = true,
  highlight,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const hlStart = highlight ? text.indexOf(highlight) : -1;
    const hlEnd = hlStart >= 0 ? hlStart + highlight!.length : -1;

    let cursor = 0;
    const segments = text.split(/(\s+)/);
    return segments.map((segment, i) => {
      const start = cursor;
      cursor += segment.length;
      if (segment === '') return null;
      if (/^\s+$/.test(segment)) return <span key={`sp-${i}`}>{segment}</span>;
      return (
        <span className="word" key={`w-${i}`}>
          {segment.split('').map((ch, j) => {
            const absIdx = start + j;
            const isHl = absIdx >= hlStart && absIdx < hlEnd;
            return (
              <span className={isHl ? 'char char--accent' : 'char'} key={j}>
                {ch}
              </span>
            );
          })}
        </span>
      );
    });
  }, [children, highlight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let tween: gsap.core.Tween | null = null;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const setup = () => {
      if (cancelled || !el.isConnected) return;

      const charElements = el.querySelectorAll('.char');

      const fromVars = scrub
        ? { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: '50% 0%' }
        : { opacity: 0, yPercent: 60 };

      tween = gsap.fromTo(
        charElements,
        { willChange: 'opacity, transform', ...fromVars },
        {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          duration: animationDuration,
          ease,
          stagger,
          scrollTrigger: {
            trigger: el,
            scroller: window,
            start: scrollStart,
            ...(scrub
              ? { end: scrollEnd, scrub: true }
              : { toggleActions: 'play none none none' }),
            invalidateOnRefresh: true,
          },
        },
      );

      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };

    // Wait for fonts so the trigger's start/end math reflects final layout.
    if (document.fonts?.ready) {
      document.fonts.ready.then(setup).catch(setup);
    } else {
      setup();
    }

    return () => {
      cancelled = true;
      if (refreshTimer) clearTimeout(refreshTimer);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, scrub]);

  return (
    <h2 ref={containerRef} className="scroll-float">
      <span className="scroll-float-text">{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
