'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

export type BeforeAfterSliderProps = {
  title: string;
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  aspectRatio?: string; // e.g. '3 / 4', '4 / 3', '1 / 1'. Default '3 / 4'.
  initialPosition?: number; // 0–100, default 50
};

export default function BeforeAfterSlider({
  title,
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  aspectRatio = '3 / 4',
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromPointer = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(percent);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    updateFromPointer(e.clientX);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      updateFromPointer(e.clientX);
    };
    const up = () => {
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [updateFromPointer]);

  return (
    <div style={cardWrap}>
      <div style={titleStyle}>{title}</div>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        style={{ ...frame, aspectRatio, cursor: 'ew-resize' }}
      >
        {/* Before layer (full width, underneath) */}
        <Layer
          src={beforeSrc}
          alt={beforeAlt ?? `${title} before`}
          label="Before"
          tone="before"
        />

        {/* After layer (clipped from the left based on pos) */}
        <div
          style={{
            ...absolutefill,
            clipPath: `inset(0 0 0 ${pos}%)`,
            WebkitClipPath: `inset(0 0 0 ${pos}%)`,
          }}
        >
          <Layer
            src={afterSrc}
            alt={afterAlt ?? `${title} after`}
            label="After"
            tone="after"
          />
        </div>

        {/* Divider line + handle */}
        <div
          style={{
            ...dividerLine,
            left: `${pos}%`,
          }}
          aria-hidden
        >
          <div style={handleKnob}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 3 L2 8 L6 13"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 3 L14 8 L10 13"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layer({
  src,
  alt,
  label,
  tone,
}: {
  src?: string;
  alt: string;
  label: string;
  tone: 'before' | 'after';
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          ...absolutefill,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    );
  }
  // Placeholder — user will swap in real image later.
  return (
    <div
      style={{
        ...absolutefill,
        ...(tone === 'before' ? placeholderBefore : placeholderAfter),
      }}
      aria-label={alt}
    >
      <div style={placeholderLabel}>{label}</div>
      <div style={placeholderHint}>Image placeholder</div>
    </div>
  );
}

// ============ styles ============

const cardWrap: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const titleStyle: CSSProperties = {
  fontSize: 14,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  fontWeight: 600,
  color: 'rgba(26,26,26,0.75)',
};

const frame: CSSProperties = {
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: 24,
  background: '#1a1a1a',
  touchAction: 'none',
  userSelect: 'none',
};

const absolutefill: CSSProperties = {
  position: 'absolute',
  inset: 0,
};

const placeholderBefore: CSSProperties = {
  background:
    'linear-gradient(135deg, #cfcac2 0%, #b8b2a8 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(26,26,26,0.7)',
};

const placeholderAfter: CSSProperties = {
  background:
    'linear-gradient(135deg, #1e1e24 0%, #2f2f38 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255,255,255,0.85)',
};

const placeholderLabel: CSSProperties = {
  fontSize: 22,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontWeight: 600,
};

const placeholderHint: CSSProperties = {
  marginTop: 10,
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  opacity: 0.55,
};

const dividerLine: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: 2,
  background: 'rgba(255,255,255,0.95)',
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
};

const handleKnob: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)',
  pointerEvents: 'auto',
  cursor: 'ew-resize',
};
