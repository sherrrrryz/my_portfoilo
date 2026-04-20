'use client';

import { motion, useMotionValue, type MotionProps } from 'framer-motion';
import { useRef, type CSSProperties, type ReactNode } from 'react';

type Props = {
  id: string;
  x: number;
  y: number;
  rotate: number;
  zIndex?: number;
  dragMode: boolean;
  /* When true (and not in dragMode), apply a small randomized hover
     transform — scale 1.05–1.10 plus ±4° rotation wobble relative to the
     base rotation. Target is computed once per mount so each item has
     its own stable "wiggle." */
  hoverJitter?: boolean;
  containerHeightPx?: number;
  onDragEnd?: (
    id: string,
    info: { offset: { x: number; y: number } },
  ) => void;
  entrance?: MotionProps;
  className?: string;
  children: ReactNode;
};

/* Draggable wrapper with drag-offset reset after drop.
   Fixes the "落点双倍偏移" issue: framer-motion's drag leaves a transform
   on the element; if we just update left/top via state, the new layout
   stacks with the leftover transform. We zero out the motion values on
   the next frame so the committed left/top replaces the drag offset. */
export default function DraggableScatter({
  id,
  x,
  y,
  rotate,
  zIndex = 1,
  dragMode,
  hoverJitter = false,
  onDragEnd,
  entrance,
  className,
  children,
}: Props) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  /* Per-mount random hover target. useRef so it's stable across re-renders
     but unique per instance — every item gets its own little wiggle. */
  const hoverTargetRef = useRef<{ scale: number; rotate: number } | null>(null);
  if (hoverJitter && hoverTargetRef.current === null) {
    hoverTargetRef.current = {
      scale: 1.05 + Math.random() * 0.05,
      rotate: rotate + (Math.random() - 0.5) * 8,
    };
  }

  const style: CSSProperties & Record<string, unknown> = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    zIndex,
    x: mx,
    y: my,
    rotate,
  };

  if (!dragMode) {
    const hover = hoverTargetRef.current;
    return (
      <motion.div
        className={className}
        style={style}
        {...entrance}
        whileHover={
          hover
            ? {
                scale: hover.scale,
                rotate: hover.rotate,
                transition: { type: 'spring', stiffness: 260, damping: 18 },
              }
            : undefined
        }
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      data-scatter-id={id}
      className={className}
      style={style}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onDragEnd?.(id, info);
        /* Defer reset until after React commits the new left/top — otherwise
           the element snaps to the old layout for one frame. */
        requestAnimationFrame(() => {
          mx.set(0);
          my.set(0);
        });
      }}
      whileDrag={{ scale: 1.05, zIndex: 99 }}
    >
      {children}
    </motion.div>
  );
}
