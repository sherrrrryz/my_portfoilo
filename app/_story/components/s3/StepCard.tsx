'use client';

import Image from 'next/image';
import ScatterTag from './ScatterTag';
import { EmojiBadge } from './ScatterTag';
import type { StepCard as StepCardType } from './stepGridData';

export default function StepCard({ card }: { card: StepCardType }) {
  const style =
    card.kind === 'image' && card.noteColor
      ? ({ '--noteColor': card.noteColor } as React.CSSProperties)
      : undefined;

  return (
    // sg-card-outer is the GSAP target — wraps card + fold sibling so
    // filter:drop-shadow follows the clip-path outline of the card.
    <div className="sg-card-outer" data-step-card>
      <article className={`sg-card sg-card--${card.kind}`} style={style}>
        {card.kind === 'image' ? (
          <div className="sg-card__media">
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="sg-card__img"
            />
          </div>
        ) : (
          <p className="sg-card__body">{card.body}</p>
        )}

        {card.emoji && (
          <div className="sg-card__emoji" aria-hidden="true">
            <EmojiBadge emoji={card.emoji} />
          </div>
        )}

        <footer className="sg-card__footer">
          <ScatterTag text={card.label} color={card.labelColor} />
        </footer>
      </article>

      {/* Fold shadow triangle — sits behind the card, visible through the
          clip-path cut corner. gradient: dark at bottom-right (fold crease),
          transparent at top-left (covered by card). */}
      <span className="sg-card__fold" aria-hidden="true" />
    </div>
  );
}
