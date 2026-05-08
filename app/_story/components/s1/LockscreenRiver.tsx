'use client';

/**
 * LockscreenRiver — G1 4-column parallax river (markup only).
 *
 * Layout: 4 columns flanking the central text island
 *   outer-left (w160 ref, +48 raised) | inner-left (w240) | center safe | inner-right (w240) | outer-right (+48 raised)
 *
 * Parallax: outer columns scrub at 0.667 of inner columns (further "feels"
 * slower). MillionsSection.tsx owns the timeline.
 *
 * Asset library: /public/story-lockscreens/ ls-01 → ls-13 (13 unique).
 * Plan calls for 18 slots (5 outer × 2 + 4 inner × 2). 5 missing slots
 * filled with intentional repeats picked to avoid same-viewport duplicates;
 * swap to fresh ls-14…ls-18 when assets land.
 */

const SRC = (n: number) => `/story-lockscreens/ls-${String(n).padStart(2, '0')}.jpg`;

// 13 unique images filling the first 13 slots, then 5 repeats picked from
// columns the originals are NOT in, so within any viewport you don't see a
// duplicate (outer columns offset +48 + slower scrub keep them visually
// separated from their inner-column twins).
const COLUMNS: { kind: 'outer' | 'inner'; side: 'left' | 'right'; images: string[] }[] = [
  { kind: 'outer', side: 'left',  images: [SRC(1),  SRC(2),  SRC(3),  SRC(4),  SRC(5)] },
  { kind: 'inner', side: 'left',  images: [SRC(6),  SRC(7),  SRC(8),  SRC(9)] },
  { kind: 'inner', side: 'right', images: [SRC(10), SRC(11), SRC(12), SRC(13)] },
  { kind: 'outer', side: 'right', images: [SRC(13), SRC(2),  SRC(11), SRC(4),  SRC(7)] },
];

export default function LockscreenRiver() {
  return (
    <div className="fm-g1" data-fm-g1>
      <div className="fm-g1__rail">
        {COLUMNS.map((col, i) => (
          <div
            key={i}
            className={`fm-ls-col fm-ls-col--${col.kind}`}
            data-fm-ls-col={col.kind}
            style={{ gridColumn: i < 2 ? i + 1 : i + 2 /* skip center safe column */ }}
          >
            {col.images.map((src, j) => (
              <div key={`${i}-${j}`} className="fm-ls-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
