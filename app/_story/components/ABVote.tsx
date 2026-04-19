'use client';

import { useState, type CSSProperties } from 'react';
import { useSwiperSlide } from 'swiper/react';
import { useReportVoted } from './FoldableCarousel';

export type ABVoteProps = {
  labelA: string;
  labelB: string;
  srcA?: string;
  srcB?: string;
  foldSrc?: string;
  premise: string;
  percentA: number;
  takeaway: string;
  open?: boolean;
  aspectRatio?: string;
  foldAspectRatio?: string;
};

type Side = 'A' | 'B';

export default function ABVote({
  labelA,
  labelB,
  srcA,
  srcB,
  foldSrc,
  premise,
  percentA,
  takeaway,
  open = false,
  aspectRatio = '1280 / 1440',
  foldAspectRatio = '610 / 1440',
}: ABVoteProps) {
  const { isActive } = useSwiperSlide();
  const reportVoted = useReportVoted();
  const [voted, setVoted] = useState<Side | null>(null);
  const percentB = 100 - percentA;

  const vote = (side: Side) => {
    if (!isActive) return;
    if (voted) return;
    setVoted(side);
    reportVoted();
  };

  return (
    <div style={groupWrap}>
      <div style={trioRow}>
        <FoldCard src={foldSrc} aspectRatio={foldAspectRatio} />
        <OptionCard
          side="A"
          ariaLabel={labelA}
          src={srcA}
          aspectRatio={aspectRatio}
          voted={voted}
          percent={percentA}
          onVote={() => vote('A')}
        />
        <OptionCard
          side="B"
          ariaLabel={labelB}
          src={srcB}
          aspectRatio={aspectRatio}
          voted={voted}
          percent={percentB}
          onVote={() => vote('B')}
        />
      </div>

      <div style={premiseText}>{premise}</div>

      <div
        style={{
          ...takeawayWrap,
          opacity: voted ? 1 : 0,
          transform: voted ? 'translateY(0)' : 'translateY(6px)',
        }}
        aria-live="polite"
      >
        {voted && (
          <>
            <div style={takeawayHeader}>
              {open
                ? 'Split the room'
                : `${voted === 'A' ? percentA : percentB}% chose ${voted}`}
            </div>
            <div style={{ ...takeawayBody, ...(open ? openBody : {}) }}>
              {takeaway}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FoldCard({
  src,
  aspectRatio,
}: {
  src?: string;
  aspectRatio: string;
}) {
  return (
    <div
      style={{
        ...foldFrame,
        aspectRatio,
      }}
      aria-label="Folded state"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          draggable={false}
          style={cardImg}
        />
      ) : (
        <div style={{ ...placeholder, ...placeholderFold }}>
          <span style={foldTinyLabel}>Folded</span>
        </div>
      )}
      <div style={{ ...cornerBadge, ...foldBadgeTint }}>Folded</div>
    </div>
  );
}

function OptionCard({
  side,
  ariaLabel,
  src,
  aspectRatio,
  voted,
  percent,
  onVote,
}: {
  side: Side;
  ariaLabel: string;
  src?: string;
  aspectRatio: string;
  voted: Side | null;
  percent: number;
  onVote: () => void;
}) {
  const revealed = voted !== null;
  const isWinner = voted === side;

  return (
    <button
      type="button"
      onClick={onVote}
      aria-label={ariaLabel}
      aria-pressed={isWinner}
      aria-disabled={revealed}
      style={{
        ...card,
        aspectRatio,
        cursor: revealed ? 'default' : 'pointer',
        opacity: revealed && !isWinner ? 0.58 : 1,
        transform: isWinner ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isWinner
          ? '0 8px 24px rgba(0,0,0,0.18), 0 0 0 2px #1a1a1a'
          : '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" draggable={false} style={cardImg} />
      ) : (
        <div
          style={{
            ...placeholder,
            ...(side === 'A' ? placeholderA : placeholderB),
          }}
        >
          <span style={placeholderLetter}>{side}</span>
        </div>
      )}
      <div style={{ ...cornerBadge, ...optionBadgeTint }}>{side}</div>
      {revealed && (
        <div style={percentOverlay}>
          <div style={percentNumber}>{percent}%</div>
          {isWinner && <div style={youLabel}>you</div>}
        </div>
      )}
    </button>
  );
}

// ============ styles ============

const groupWrap: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

const trioRow: CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'center',
  justifyContent: 'center',
  // Row height derived from the slide width (kept in sync with
  // .foldable-slide in flashlight.css: clamp(320px, 88vw, 1100px)) minus
  // the 2 x 14 gap, divided by the sum of image aspect ratios
  // (610/1440 + 2 x 1280/1440 ≈ 0.4236 + 1.7778 = 2.2014).
  height: 'calc((clamp(320px, 88vw, 1100px) - 28px) / 2.2014)',
};

const foldFrame: CSSProperties = {
  position: 'relative',
  flex: '0 0 auto',
  height: '100%',
  width: 'auto',
  borderRadius: 24,
  overflow: 'hidden',
  background: '#1a1a1a',
};

const cornerBadge: CSSProperties = {
  position: 'absolute',
  left: 10,
  top: 10,
  padding: '3px 8px',
  fontSize: 9.5,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  fontWeight: 600,
  borderRadius: 4,
  backdropFilter: 'blur(4px)',
  pointerEvents: 'none',
  zIndex: 2,
};

const foldBadgeTint: CSSProperties = {
  background: 'rgba(255,255,255,0.88)',
  color: '#1a1a1a',
};

const optionBadgeTint: CSSProperties = {
  background: 'rgba(26,26,26,0.82)',
  color: 'var(--stage-light)',
};

const card: CSSProperties = {
  position: 'relative',
  flex: '0 0 auto',
  height: '100%',
  width: 'auto',
  padding: 0,
  border: 'none',
  borderRadius: 24,
  overflow: 'hidden',
  background: '#1a1a1a',
  transition: 'transform 0.3s ease, opacity 0.35s ease, box-shadow 0.3s ease',
  fontFamily: 'inherit',
};

const cardImg: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  userSelect: 'none',
  pointerEvents: 'none',
};

const placeholder: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(26,26,26,0.5)',
};

const placeholderA: CSSProperties = {
  background: 'linear-gradient(135deg, #d6d1c7 0%, #bdb7ac 100%)',
};

const placeholderB: CSSProperties = {
  background: 'linear-gradient(135deg, #cac4ba 0%, #a8a299 100%)',
};

const placeholderFold: CSSProperties = {
  background: 'linear-gradient(180deg, #2a2a32 0%, #1a1a1e 100%)',
};

const placeholderLetter: CSSProperties = {
  fontSize: 72,
  fontWeight: 300,
  letterSpacing: '-0.02em',
};

const foldTinyLabel: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
};

const percentOverlay: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.38)',
  color: '#fff',
  letterSpacing: '-0.01em',
  pointerEvents: 'none',
};

const percentNumber: CSSProperties = {
  fontSize: 'clamp(24px, 2.6vw, 44px)',
  fontWeight: 600,
};

const youLabel: CSSProperties = {
  marginTop: 4,
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  opacity: 0.8,
};

const premiseText: CSSProperties = {
  maxWidth: 640,
  margin: '0 auto',
  fontSize: 15,
  lineHeight: 1.55,
  color: 'rgba(26,26,26,0.75)',
  textAlign: 'center',
};

const takeawayWrap: CSSProperties = {
  maxWidth: 640,
  margin: '0 auto',
  minHeight: 64,
  transition: 'opacity 0.45s ease, transform 0.45s ease',
  textAlign: 'center',
};

const takeawayHeader: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(26,26,26,0.5)',
  fontWeight: 600,
  marginBottom: 6,
};

const takeawayBody: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.55,
  color: 'rgba(26,26,26,0.85)',
};

const openBody: CSSProperties = {
  fontStyle: 'italic',
  color: 'rgba(26,26,26,0.7)',
};
