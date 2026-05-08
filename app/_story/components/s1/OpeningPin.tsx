'use client';

/**
 * OpeningPin — §4.2 Q→A pin region (markup only).
 *
 * Holds ONLY the question. The answer (and its sub + project link) live
 * exclusively in CentralIsland and are revealed by the same pin scrub
 * timeline — keeping a single source of truth so there's no double-text
 * moment when the pin releases.
 *
 * The pin + scrub timeline is owned by MillionsSection.tsx.
 */

import WordSplit from './WordSplit';

export default function OpeningPin() {
  return (
    <div className="fm-opening">
      <div className="fm-opening__pin">
        <div className="fm-opening__stage">
          <div className="fm-opening__layer fm-opening__layer--q">
            <WordSplit
              as="h1"
              className="fm-q-text"
              text="What does it mean to design for 700 million people?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
