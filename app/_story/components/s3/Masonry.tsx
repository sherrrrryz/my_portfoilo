'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Masonry.css';

export type MasonryItem = {
  id: string | number;
  img?: string;
  height: number;
  label?: string;
};

type Props = {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  onItemClick?: (item: MasonryItem) => void;
};

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number,
) => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState(get);
  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener('change', handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener('change', handler),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);
  return value;
};

const useMeasure = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  onItemClick,
}: Props) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)'],
    [4, 3, 2],
    1,
  );
  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (item: {
    x: number;
    y: number;
    w: number;
    h: number;
  }) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };
    const dir =
      animateFrom === 'random'
        ? (['top', 'bottom', 'left', 'right'] as const)[
            Math.floor(Math.random() * 4)
          ]
        : animateFrom;
    switch (dir) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    const imgUrls = items.map((i) => i.img).filter(Boolean) as string[];
    if (imgUrls.length > 0) {
      preloadImages(imgUrls).then(() => setImagesReady(true));
    } else {
      setImagesReady(true);
    }
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];
      colHeights[col] += height;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;
    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };
      if (!hasMounted.current) {
        const init = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: init.x,
            y: init.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(8px)' }),
          },
          {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          },
        );
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: 'auto',
        });
      }
    });
    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady]);

  return (
    <div ref={containerRef} className="msn-list">
      {grid.map((item) => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          className="msn-item"
          onClick={() => onItemClick?.(item)}
          onMouseEnter={() => {
            if (scaleOnHover)
              gsap.to(`[data-masonry-key="${item.id}"]`, {
                scale: hoverScale,
                duration: 0.25,
                ease: 'power2.out',
              });
          }}
          onMouseLeave={() => {
            if (scaleOnHover)
              gsap.to(`[data-masonry-key="${item.id}"]`, {
                scale: 1,
                duration: 0.25,
                ease: 'power2.out',
              });
          }}
        >
          <div
            className="msn-item__img"
            style={
              item.img ? { backgroundImage: `url(${item.img})` } : undefined
            }
          >
            {!item.img && <div className="msn-item__placeholder" />}
          </div>
          {item.label && <span className="msn-item__label">{item.label}</span>}
        </div>
      ))}
    </div>
  );
}
