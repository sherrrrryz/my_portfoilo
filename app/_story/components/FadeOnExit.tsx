'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  /* Scrub anchors (trigger element = wrapper div).
     Default: start fading as wrapper top reaches 35% from viewport top,
     fully faded when wrapper top nears the very top edge. */
  start?: string;
  end?: string;
  /* Maximum blur in pixels at fully-faded state. */
  maxBlur?: number;
  className?: string;
  style?: CSSProperties;
};

export default function FadeOnExit({
  children,
  start = 'top 35%',
  end = 'top 5%',
  maxBlur = 5,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const state = { opacity: 1, blur: 0 };
    const apply = () => {
      el.style.opacity = state.opacity.toFixed(3);
      el.style.filter =
        state.blur > 0.05 ? `blur(${state.blur.toFixed(2)}px)` : 'none';
    };
    apply();

    const tween = gsap.to(state, {
      opacity: 0,
      blur: maxBlur,
      ease: 'none',
      onUpdate: apply,
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [start, end, maxBlur]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
