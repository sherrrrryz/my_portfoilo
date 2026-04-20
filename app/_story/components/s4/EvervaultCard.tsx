'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

type Props = {
  text: string;
  imageSrc: string;
  imageAlt?: string;
  aspectRatio?: number;
  className?: string;
};

export default function EvervaultCard({
  text,
  imageSrc,
  imageAlt,
  aspectRatio = 1,
  className,
}: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [randomString, setRandomString] = useState('');

  useEffect(() => {
    setRandomString(generateRandomString(1500));
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
    setRandomString(generateRandomString(1500));
  }

  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const maskStyle = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      className={`fe-tile${className ? ` ${className}` : ''}`}
      style={{ '--ar': aspectRatio } as React.CSSProperties}
    >
      <PlusIcon className="fe-tile__corner fe-tile__corner--tl" />
      <PlusIcon className="fe-tile__corner fe-tile__corner--tr" />
      <PlusIcon className="fe-tile__corner fe-tile__corner--bl" />
      <PlusIcon className="fe-tile__corner fe-tile__corner--br" />

      <div
        className="fe-tile__card"
        onMouseMove={onMouseMove}
        role="img"
        aria-label={imageAlt ?? text}
      >
        {/* Hover layer 1: image revealed through radial mask */}
        <motion.div
          className="fe-tile__image"
          style={{ ...maskStyle, backgroundImage: `url(${imageSrc})` }}
          aria-hidden="true"
        />

        {/* Hover layer 2: encrypted random chars revealed through the same radial mask */}
        <motion.div className="fe-tile__chars" style={maskStyle} aria-hidden="true">
          <p>{randomString}</p>
        </motion.div>

        {/* Centered label with soft dark halo behind */}
        <div className="fe-tile__label">
          <span className="fe-tile__halo" aria-hidden="true" />
          <span className="fe-tile__text">{text}</span>
        </div>
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
}

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomString(length: number) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return out;
}
