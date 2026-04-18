'use client';

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactElement,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from './useMotion';

gsap.registerPlugin(ScrollTrigger);

export type RevealMode = 'chars' | 'words' | 'lines' | 'element';
export type RevealEffect = 'float' | 'blur' | 'slide' | 'fade';
export type RevealTrigger = 'once' | 'scrub' | 'toggle';

export type RevealProps = {
  children: string;
  mode?: RevealMode;
  effect?: RevealEffect;
  trigger?: RevealTrigger;
  duration?: number;
  stagger?: number;
  start?: string;
  end?: string;
  ease?: string;
  initialY?: number;
  initialBlur?: number;
  initialOpacity?: number;
  markers?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Reveal({
  children,
  mode = 'words',
  effect = 'fade',
  trigger = 'once',
  duration = 0.8,
  stagger = 0.05,
  start = 'top 80%',
  end = 'bottom 60%',
  ease = 'power2.out',
  initialY = 40,
  initialBlur = 8,
  initialOpacity = 0,
  markers = false,
  className,
  style,
}: RevealProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const motion = useMotion();

  const eff = useMemo(() => {
    if (motion === 'reduced') {
      return {
        effect: 'fade' as RevealEffect,
        trigger: 'once' as RevealTrigger,
        stagger: 0,
        duration: 0.2,
        initialY: 0,
        initialBlur: 0,
      };
    }
    return { effect, trigger, stagger, duration, initialY, initialBlur };
  }, [motion, effect, trigger, stagger, duration, initialY, initialBlur]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = buildTargets(root, mode);
    if (!targets.length) return;

    const fromVars = buildFromVars(
      eff.effect,
      eff.initialY,
      eff.initialBlur,
      initialOpacity,
    );
    const toVars = buildToVars(eff.effect);

    const stVars: ScrollTrigger.Vars = {
      trigger: root,
      start,
      markers,
    };
    if (eff.trigger === 'once') {
      stVars.once = true;
    } else if (eff.trigger === 'scrub') {
      stVars.scrub = true;
      stVars.end = end;
    } else {
      stVars.toggleActions = 'play reverse play reverse';
      stVars.end = end;
    }

    const tween = gsap.fromTo(targets, fromVars, {
      ...toVars,
      duration: eff.duration,
      ease,
      stagger: eff.stagger,
      scrollTrigger: stVars,
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      if (mode === 'lines') {
        unwrapLines(root);
      }
    };
  }, [
    children,
    mode,
    ease,
    start,
    end,
    markers,
    initialOpacity,
    eff.effect,
    eff.trigger,
    eff.stagger,
    eff.duration,
    eff.initialY,
    eff.initialBlur,
  ]);

  return (
    <div ref={rootRef} className={className} style={style}>
      {renderSplit(children, mode)}
    </div>
  );
}

function renderSplit(text: string, mode: RevealMode) {
  if (mode === 'element') return text;

  if (mode === 'chars') {
    return Array.from(text).map((c, i) => (
      <span
        key={i}
        className="reveal-char"
        style={{ display: 'inline-block', whiteSpace: 'pre' }}
      >
        {c}
      </span>
    ));
  }

  const parts = text.split(/(\s+)/);
  const wordClass = mode === 'lines' ? 'reveal-word-for-line' : 'reveal-word';
  return parts.map((p, i) =>
    /^\s+$/.test(p) ? (
      <span key={i} style={{ whiteSpace: 'pre' }}>
        {p}
      </span>
    ) : (
      <span key={i} className={wordClass} style={{ display: 'inline-block' }}>
        {p}
      </span>
    ),
  );
}

function buildTargets(root: HTMLElement, mode: RevealMode): Element[] {
  if (mode === 'element') return [root];
  if (mode === 'chars') return Array.from(root.querySelectorAll('.reveal-char'));
  if (mode === 'words') return Array.from(root.querySelectorAll('.reveal-word'));

  // lines: group words by visual top, wrap each group in a .reveal-line span.
  const words = Array.from(
    root.querySelectorAll<HTMLElement>('.reveal-word-for-line'),
  );
  if (!words.length) return [];

  const groups: HTMLElement[][] = [];
  let currentTop: number | null = null;
  for (const w of words) {
    const top = Math.round(w.getBoundingClientRect().top);
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      groups.push([w]);
      currentTop = top;
    } else {
      groups[groups.length - 1].push(w);
    }
  }

  const lineEls: HTMLElement[] = [];
  for (const group of groups) {
    const line = document.createElement('span');
    line.className = 'reveal-line';
    line.style.display = 'inline-block';
    const firstWord = group[0];
    firstWord.parentNode?.insertBefore(line, firstWord);
    for (const w of group) {
      // preserve any whitespace sibling right after each word (except the last)
      const next = w.nextSibling;
      line.appendChild(w);
      if (next && next.nodeType === Node.ELEMENT_NODE) {
        const el = next as HTMLElement;
        if (!el.classList.contains('reveal-word-for-line')) {
          line.appendChild(el);
        }
      }
    }
    lineEls.push(line);
  }
  return lineEls;
}

function unwrapLines(root: HTMLElement) {
  const lines = root.querySelectorAll<HTMLElement>('.reveal-line');
  lines.forEach((line) => {
    const parent = line.parentNode;
    while (line.firstChild) parent?.insertBefore(line.firstChild, line);
    line.remove();
  });
}

function buildFromVars(
  effect: RevealEffect,
  y: number,
  blur: number,
  opacity: number,
): gsap.TweenVars {
  const base: gsap.TweenVars = { opacity };
  if (effect === 'float' || effect === 'slide') return { ...base, y };
  if (effect === 'blur') return { ...base, filter: `blur(${blur}px)` };
  return base;
}

function buildToVars(effect: RevealEffect): gsap.TweenVars {
  const base: gsap.TweenVars = { opacity: 1 };
  if (effect === 'float' || effect === 'slide') return { ...base, y: 0 };
  if (effect === 'blur') return { ...base, filter: 'blur(0px)' };
  return base;
}
