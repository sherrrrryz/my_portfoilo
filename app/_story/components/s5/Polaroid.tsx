'use client';

/* ============================================================
   Polaroid primitive for Section 5.
   White card + pin + image + italic caption. Rotation is a prop
   so callers can make a shelf of slightly-different cards.
   ============================================================ */

import Image from 'next/image';
import type { CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;          // e.g. "3 / 4", "1 / 1"
  rotate?: number;               // degrees
  style?: CSSProperties;
  className?: string;
  width?: number | string;       // override width
  showPin?: boolean;
};

export default function Polaroid({
  src,
  alt,
  caption,
  aspectRatio = '3 / 4',
  rotate = 0,
  style,
  className,
  width,
  showPin = true,
}: Props) {
  const composed: CSSProperties = {
    ['--rot' as string]: `${rotate}deg`,
    ['--ar' as string]: aspectRatio,
    ...(width ? { width } : {}),
    ...style,
  };

  return (
    <div
      className={`cu-polaroid${className ? ` ${className}` : ''}`}
      style={composed}
    >
      {showPin && <span className="cu-polaroid__pin" aria-hidden="true" />}
      <div className="cu-polaroid__frame">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 900px) 80vw, 420px"
          draggable={false}
        />
      </div>
      {caption && <div className="cu-polaroid__caption">{caption}</div>}
    </div>
  );
}
