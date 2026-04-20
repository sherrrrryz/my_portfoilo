'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Panel1Newcomer,
  Panel2SeniorTeam,
  Panel3Departments,
  Panel4Terrible,
} from './QuoteHoverPanels';

gsap.registerPlugin(ScrollTrigger);

type PhraseKey = 'newcomer' | 'senior' | 'departments' | 'terrible';

const PANELS: Record<PhraseKey, React.ReactNode> = {
  newcomer: <Panel1Newcomer />,
  senior: <Panel2SeniorTeam />,
  departments: <Panel3Departments />,
  terrible: <Panel4Terrible />,
};

const MOBILE_ORDER: PhraseKey[] = ['newcomer', 'senior', 'departments', 'terrible'];

function useIsMobile(query = '(max-width: 767px)') {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return isMobile;
}

export default function QuoteHover() {
  const [active, setActive] = useState<PhraseKey | null>(null);
  const isMobile = useIsMobile();
  const quoteRef = useRef<HTMLQuoteElement>(null);

  /* 滚动驱动的镜头 zoom：scrub --q-scroll-scale 1 → 0.7（只在桌面，手机
     CSS 里 transform: none 兜底）。和响应式 zoom 叠加，transform 在后
     → 最终视觉 = zoom * transform.scale。 */
  useEffect(() => {
    if (isMobile) return;
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
  }, [isMobile]);

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

  function toggle(key: PhraseKey) {
    if (isMobile) return;
    setActive((cur) => (cur === key ? null : key));
  }

  function makePhrase(
    id: PhraseKey,
    colorClass: '1' | '2' | '3' | '4',
    children: React.ReactNode,
  ) {
    const j = jitterRef.current![id];
    return (
      <span
        className={`ft-phrase ft-phrase--${colorClass}${
          active === id ? ' ft-phrase--active' : ''
        }`}
        style={
          {
            '--jitter-scale': j.scale.toFixed(3),
            '--jitter-rot': j.rot.toFixed(2),
          } as React.CSSProperties
        }
        onClick={() => toggle(id)}
        onKeyDown={(e) => {
          if (isMobile) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle(id);
          }
        }}
        role={isMobile ? undefined : 'button'}
        tabIndex={isMobile ? -1 : 0}
        aria-expanded={isMobile ? undefined : active === id}
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

      {/* 桌面：点击 phrase 切换单个 panel */}
      <AnimatePresence mode="wait">
        {!isMobile && active && (
          <motion.div
            key={active}
            className="ft-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          >
            {PANELS[active]}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isMobile && !active && (
          <motion.p
            className="ft-lead"
            style={{
              marginTop: 'var(--space-5)',
              opacity: 0.45,
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Click any highlighted phrase to expand.
          </motion.p>
        )}
      </AnimatePresence>

      {/* 手机：4 panel 顺序堆叠，全部渲染 */}
      {isMobile && (
        <div className="ft-panels-mobile">
          {MOBILE_ORDER.map((key) => (
            <div key={key} className="ft-panel-mobile" data-panel={key}>
              {PANELS[key]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
