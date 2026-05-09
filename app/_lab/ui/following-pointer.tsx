'use client';

/**
 * FollowerPointerCard — adapted from Aceternity UI.
 *
 * Rewritten for this repo:
 *  - motion/react → framer-motion (already installed)
 *  - single token color instead of random Tailwind array
 *  - tooltip portals to document.body so it escapes any ancestor
 *    stacking-context / transform (Reveal wrappers leave inline
 *    transform+filter after GSAP tweens, which would otherwise
 *    trap `z-index` and clip the tooltip behind later siblings)
 *
 * Non-scroll UI motion (enter/exit on hover) — framer-motion is the
 * correct animation tool per CLAUDE.md's animation stack rule.
 */

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
};

export function FollowerPointerCard({ children, className, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInside, setIsInside] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={(e) => {
        setPos({ x: e.clientX, y: e.clientY });
        setIsInside(true);
      }}
      onMouseLeave={() => setIsInside(false)}
      onMouseMove={handleMouseMove}
      className={cn('relative', className)}
      style={{ cursor: 'none' }}
    >
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isInside && <FollowPointer x={pos.x} y={pos.y} title={title} />}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

function FollowPointer({
  x,
  y,
  title,
}: {
  x: number;
  y: number;
  title?: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
    >
      {/* Arrow cursor */}
      <svg
        viewBox="0 0 16 16"
        height="18"
        width="18"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: 'translate(-2px, -2px) rotate(-70deg)',
          color: 'var(--theme-accent-2)',
          fill: 'currentColor',
          stroke: 'currentColor',
          strokeWidth: 1,
        }}
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          position: 'absolute',
          top: 18,
          left: 16,
          background: 'var(--theme-text-1)',
          color: 'var(--theme-ink-inverted)',
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.35,
          letterSpacing: 'var(--tracking-tight)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-pill)',
          whiteSpace: 'nowrap',
          boxShadow: '0 6px 20px rgb(var(--theme-shadow-rgb) / 0.18)',
        }}
      >
        {title}
      </motion.div>
    </motion.div>
  );
}
