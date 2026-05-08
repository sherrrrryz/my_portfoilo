'use client';

/**
 * CentralIsland — sticky text island that hosts the three "It means…"
 * variants for G1 / G2 / G3.
 *
 * Markup-only; MillionsSection.tsx owns the ScrollTriggers that:
 *   - swap which variant is .is-active (with word-by-word crossfade overlap)
 *   - toggle .is-g3 on the carrier to shift position from vertical center
 *     to top-of-viewport
 *   - reveal the .fm-island__feedback line when a vote lands
 *
 * Position: parent <div class="fm-body"> establishes the sticky context;
 * sticky behavior releases naturally when fm-body's bottom passes.
 */

import Link from 'next/link';
import WordSplit from './WordSplit';

export default function CentralIsland() {
  return (
    <div className="fm-island" data-island>
      {/* G1 — Lockscreen */}
      <div className="fm-island__variant is-active" data-island-variant="g1">
        <WordSplit
          as="h2"
          className="fm-island__main"
          text="It means making something personal."
        />
        <p className="fm-island__sub">
          <WordSplit
            as="span"
            text="— at a scale where nothing feels personal."
          />
        </p>
        <p className="fm-island__link">
          Xiaomi Lock Screen ·{' '}
          <Link href="/projects/lockscreen">View →</Link>
        </p>
      </div>

      {/* G2 — MIUI Design System */}
      <div className="fm-island__variant" data-island-variant="g2">
        <WordSplit
          as="h2"
          className="fm-island__main"
          text="It means building the system"
        />
        <p className="fm-island__sub">
          <WordSplit as="span" text="— others build on." />
        </p>
        <p className="fm-island__link">
          Xiaomi MIUI Design System 2.0 ·{' '}
          <a href="#" title="Case study coming soon">View →</a>
        </p>
      </div>

      {/* G3 — Foldable */}
      <div className="fm-island__variant" data-island-variant="g3">
        <WordSplit
          as="h2"
          className="fm-island__main"
          text="It means &lsquo;just make it bigger&rsquo;"
        />
        <p className="fm-island__sub">
          <WordSplit as="span" text="— is never the answer." />
        </p>
        <p className="fm-island__link">
          Xiaomi Foldable Screen ·{' '}
          <a href="#" title="Case study coming soon">View →</a>
        </p>
        {/* Vote feedback row — opacity animated by JS when a vote lands */}
        <p className="fm-island__feedback" data-island-feedback>
          {/* JS injects: "73% chose B · short Sherry analysis" */}
        </p>
      </div>
    </div>
  );
}
