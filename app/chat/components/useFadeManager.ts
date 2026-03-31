'use client';

import { useEffect, useRef } from 'react';
import { DOM_REMOVAL_DELAY, CLEANUP_INTERVAL } from './constants';
import type { CharUnit } from './CharStream';

/**
 * Periodically removes expired lines from state.
 * A "line" = chars between \n boundaries.
 * A line is only removed when ALL its chars have expired.
 */
export function useFadeManager(
  setChars: React.Dispatch<React.SetStateAction<CharUnit[]>>
) {
  const setCharsRef = useRef(setChars);
  setCharsRef.current = setChars;

  useEffect(() => {
    const interval = setInterval(() => {
      const cutoff = Date.now() - DOM_REMOVAL_DELAY - 500;
      setCharsRef.current((prev) => {
        // Group chars into lines (split by \n)
        const lines: CharUnit[][] = [];
        let cur: CharUnit[] = [];
        for (const c of prev) {
          cur.push(c);
          if (c.char === '\n') {
            lines.push(cur);
            cur = [];
          }
        }
        if (cur.length > 0) lines.push(cur);

        // Keep lines where at least one char is still alive
        const kept = lines.filter((line) => line.some((c) => c.time > cutoff));
        const filtered = kept.flat();

        return filtered.length === prev.length ? prev : filtered;
      });
    }, CLEANUP_INTERVAL);

    return () => clearInterval(interval);
  }, []);
}
