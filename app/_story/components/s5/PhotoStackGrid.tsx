'use client';

/* ============================================================
   S5 Block 2 — 2×2 grid of polaroid stacks.
   Each cell shows one polaroid at rest. On hover, four back
   polaroids fan out around it (top-left, top-right, bottom-left,
   bottom-right), fully emerging so each is clearly visible.
   Front card shrinks slightly so the fan reads as a hand of
   photos spread around a centered anchor.
   Uses framer-motion (non-scroll UI motion — allowed per CLAUDE.md).
   ============================================================ */

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

type Photo = { src: string; alt: string };

type Stack = {
  front: Photo & { caption: string };
  back: Photo[];    // exactly 4
};

/* Fan positions — symmetric 4-way spread around the front card.
   Cards are 260px wide, shrink to scale 0.85 on hover. Offsets
   tuned so each back card clears the front by a comfortable
   margin while still fitting inside the stack cell. */
const FAN = [
  { x: -190, y: -115, rot: -18 },   // top-left
  { x:  190, y: -115, rot:  18 },   // top-right
  { x: -170, y:  120, rot:  14 },   // bottom-left
  { x:  170, y:  120, rot: -14 },   // bottom-right
];

const HOVER_SCALE = 0.85;

const STACKS: Stack[] = [
  {
    front: { src: '/photos/photo1.jpg', alt: 'Morning light', caption: 'where things come together' },
    back: [
      { src: '/photos/photo3.jpg', alt: '' },
      { src: '/photos/photo5.jpg', alt: '' },
      { src: '/photos/photo6.jpg', alt: '' },
      { src: '/photos/photo2.jpg', alt: '' },
    ],
  },
  {
    front: { src: '/photos/photo2.jpg', alt: 'Another chase', caption: 'just me and colors again' },
    back: [
      { src: '/photos/photo4.jpg', alt: '' },
      { src: '/photos/photo6.jpg', alt: '' },
      { src: '/photos/photo1.jpg', alt: '' },
      { src: '/photos/photo5.jpg', alt: '' },
    ],
  },
  {
    front: { src: '/photos/photo3.jpg', alt: 'Off the slope', caption: 'colors were my first love' },
    back: [
      { src: '/photos/photo2.jpg', alt: '' },
      { src: '/photos/photo5.jpg', alt: '' },
      { src: '/photos/photo4.jpg', alt: '' },
      { src: '/photos/photo1.jpg', alt: '' },
    ],
  },
  {
    front: { src: '/photos/photo6.jpg', alt: 'A quieter day', caption: 'behind the pixels' },
    back: [
      { src: '/photos/photo1.jpg', alt: '' },
      { src: '/photos/photo3.jpg', alt: '' },
      { src: '/photos/photo2.jpg', alt: '' },
      { src: '/photos/photo4.jpg', alt: '' },
    ],
  },
];

export default function PhotoStackGrid() {
  return (
    <div className="cu-grid">
      {STACKS.map((s, i) => (
        <StackCell key={i} stack={s} />
      ))}
    </div>
  );
}

function StackCell({ stack }: { stack: Stack }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="cu-stack"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={stack.front.alt}
    >
      {stack.back.map((p, i) => {
        const target = FAN[i];
        return (
          <motion.div
            key={`back-${i}`}
            className="cu-stack__card"
            style={{ zIndex: i + 1 }}
            initial={false}
            animate={{
              x: hovered ? target.x : 0,
              y: hovered ? target.y : 0,
              rotate: hovered ? target.rot : 1 - i * 0.4,
              scale: hovered ? HOVER_SCALE : 0.88,
              opacity: hovered ? 1 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 24,
              delay: hovered ? i * 0.04 : 0,
            }}
          >
            <PolaroidInner photo={p} />
          </motion.div>
        );
      })}

      {/* Front card — always on top, shrinks slightly on hover
          so the fan reads as a centered spread. */}
      <motion.div
        className="cu-stack__card"
        style={{ zIndex: 10 }}
        initial={false}
        animate={{
          scale: hovered ? HOVER_SCALE : 1,
          rotate: hovered ? 0 : 1.5,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <PolaroidInner photo={stack.front} caption={stack.front.caption} />
      </motion.div>
    </div>
  );
}

function PolaroidInner({
  photo,
  caption,
}: {
  photo: Photo;
  caption?: string;
}) {
  return (
    <div className="cu-polaroid" style={{ ['--rot' as string]: '0deg' }}>
      <span className="cu-polaroid__pin" aria-hidden="true" />
      <div className="cu-polaroid__frame" style={{ aspectRatio: '3 / 4' }}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="240px"
          draggable={false}
        />
      </div>
      {caption && <div className="cu-polaroid__caption">{caption}</div>}
    </div>
  );
}
