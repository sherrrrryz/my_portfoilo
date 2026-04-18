'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/LockscreenPile.css';

gsap.registerPlugin(ScrollTrigger);

type Column = {
  offsetY: number;
  images: string[];
};

// Desktop: 5 columns, 2/3/3/3/2 = 13 images. Outer columns sit lower; center rises highest.
const DESKTOP_COLUMNS: Column[] = [
  { offsetY: 260, images: ['/story-lockscreens/ls-01.jpg', '/story-lockscreens/ls-06.jpg'] },
  { offsetY: 120, images: ['/story-lockscreens/ls-09.jpg', '/story-lockscreens/ls-02.jpg', '/story-lockscreens/ls-12.jpg'] },
  { offsetY: 0,   images: ['/story-lockscreens/ls-07.jpg', '/story-lockscreens/ls-04.jpg', '/story-lockscreens/ls-13.jpg'] },
  { offsetY: 120, images: ['/story-lockscreens/ls-10.jpg', '/story-lockscreens/ls-08.jpg', '/story-lockscreens/ls-03.jpg'] },
  { offsetY: 260, images: ['/story-lockscreens/ls-11.jpg', '/story-lockscreens/ls-05.jpg'] },
];

// Mobile: 3 columns, 4/5/4 = 13 images. Same mountain silhouette — side columns drop 120px.
const MOBILE_COLUMNS: Column[] = [
  { offsetY: 120, images: ['/story-lockscreens/ls-01.jpg', '/story-lockscreens/ls-09.jpg', '/story-lockscreens/ls-06.jpg', '/story-lockscreens/ls-02.jpg'] },
  { offsetY: 0,   images: ['/story-lockscreens/ls-07.jpg', '/story-lockscreens/ls-04.jpg', '/story-lockscreens/ls-13.jpg', '/story-lockscreens/ls-12.jpg', '/story-lockscreens/ls-03.jpg'] },
  { offsetY: 120, images: ['/story-lockscreens/ls-11.jpg', '/story-lockscreens/ls-10.jpg', '/story-lockscreens/ls-05.jpg', '/story-lockscreens/ls-08.jpg'] },
];

export default function LockscreenPile() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Sort items by visual top (highest on screen first) so the reveal order
    // reads top-to-bottom across the pile, not left-to-right by DOM order.
    const items = Array.from(wrap.querySelectorAll<HTMLElement>('.ls-item')).sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
    );

    const tween = gsap.fromTo(
      items,
      { y: 120, opacity: 0, filter: 'blur(6px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.4,
        ease: 'power2.out',
        stagger: 0.18,
        scrollTrigger: {
          trigger: wrap,
          start: 'top 85%',
          once: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isMobile]);

  const columns = isMobile ? MOBILE_COLUMNS : DESKTOP_COLUMNS;

  return (
    <div ref={wrapRef} className="ls-pile">
      {columns.map((col, ci) => (
        <div key={ci} className="ls-col" style={{ marginTop: col.offsetY }}>
          {col.images.map((src) => (
            <div key={src} className="ls-item">
              <img src={src} alt="" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
