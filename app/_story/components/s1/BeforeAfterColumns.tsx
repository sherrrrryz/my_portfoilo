'use client';

/**
 * BeforeAfterColumns — G2 single-column-each-side Before/After flow (markup only).
 *
 * Layout: left column = Before stack (3 images), right column = After stack
 * (3 images), one-to-one horizontal alignment per pair.
 *   col widths: clamp(260, 29vw, 420)
 *   row gap:    clamp(60, 8.3vw, 120) — large to keep G2 ≈ 1vh
 *
 * Both columns scrub 1:1 with scroll (no parallax). MillionsSection.tsx
 * owns the timeline.
 *
 * Source: /public/miui/ — 6 images, 3 pairs, all 1392x1536 (9:10).
 *
 * Pairing order (Sherry's PRD §4.3.4):
 *   1. Components            (components-before / components-after)
 *   2. Design Tokens         (designtoken-before / designtoken-after)
 *   3. Localization          (localization-before / localization-after)
 *
 * "Before" / "After" labels are the first row of each column — they scroll
 * out with the column (not sticky).
 */

const PAIRS = [
  { before: '/miui/components-before.png',   after: '/miui/components-after.png',   alt: 'Components' },
  { before: '/miui/designtoken-before.png',  after: '/miui/designtoken-after.png',  alt: 'Design Tokens' },
  { before: '/miui/localization-before.png', after: '/miui/localization-after.png', alt: 'Localization' },
];

export default function BeforeAfterColumns() {
  return (
    <div className="fm-g2" data-fm-g2>
      <div className="fm-g2__rail">
        <div className="fm-g2-col fm-g2-col--left" data-fm-g2-col="before">
          <div className="fm-g2__label">Before</div>
          {PAIRS.map((p, i) => (
            <div key={i} className="fm-g2-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.before} alt={`${p.alt} — before`} loading="lazy" decoding="async" draggable={false} />
            </div>
          ))}
        </div>
        <div className="fm-g2-col fm-g2-col--right" data-fm-g2-col="after">
          <div className="fm-g2__label">After</div>
          {PAIRS.map((p, i) => (
            <div key={i} className="fm-g2-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.after} alt={`${p.alt} — after`} loading="lazy" decoding="async" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
