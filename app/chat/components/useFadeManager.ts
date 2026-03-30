'use client';

import { useEffect, useRef } from 'react';
import { CHAR_LIFETIME, CLEANUP_INTERVAL } from './constants';
import type { CharUnit } from './CharStream';

/**
 * Periodically removes expired characters from state.
 * CSS handles the visual fade; this hook cleans up DOM/state.
 */
export function useFadeManager(
  setChars: React.Dispatch<React.SetStateAction<CharUnit[]>>
) {
  const setCharsRef = useRef(setChars);
  setCharsRef.current = setChars;

  useEffect(() => {
    const interval = setInterval(() => {
      const cutoff = Date.now() - CHAR_LIFETIME - 500; // 500ms grace after animation ends
      setCharsRef.current((prev) => {
        const filtered = prev.filter((c) => c.time > cutoff);
        return filtered.length === prev.length ? prev : filtered;
      });
    }, CLEANUP_INTERVAL);

    return () => clearInterval(interval);
  }, []);
}
