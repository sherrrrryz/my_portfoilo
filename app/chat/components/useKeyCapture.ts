'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseKeyCaptureOptions {
  onChar: (char: string) => void;
  enabled?: boolean;
}

// Keys to block entirely
const BLOCKED_KEYS = new Set(['Backspace', 'Delete']);

// Ctrl/Cmd combos to block
const BLOCKED_COMBOS = new Set(['v', 'z', 'a', 'c', 'x']);

// Keys to let through (browser shortcuts)
const PASSTHROUGH_KEYS = new Set(['F5', 'F11', 'F12']);

export function useKeyCapture({ onChar, enabled = true }: UseKeyCaptureOptions) {
  const onCharRef = useRef(onChar);
  onCharRef.current = onChar;

  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Let browser shortcuts through
      if (PASSTHROUGH_KEYS.has(e.key)) return;

      // Let Ctrl/Cmd combos through (except blocked ones)
      if (e.ctrlKey || e.metaKey) {
        if (BLOCKED_COMBOS.has(e.key.toLowerCase())) {
          e.preventDefault();
        }
        return;
      }

      // Block Backspace/Delete
      if (BLOCKED_KEYS.has(e.key)) {
        e.preventDefault();
        return;
      }

      // Alt combos pass through
      if (e.altKey) return;

      // Enter = newline
      if (e.key === 'Enter') {
        e.preventDefault();
        onCharRef.current('\n');
        return;
      }

      // Only printable single characters
      if (e.key.length === 1) {
        e.preventDefault();
        onCharRef.current(e.key);
      }
    },
    [enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}
