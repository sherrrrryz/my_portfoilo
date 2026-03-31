'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseKeyCaptureOptions {
  onChar: (char: string) => void;
  onDeleteWord?: () => void;
  enabled?: boolean;
}

// Ctrl/Cmd combos to block
const BLOCKED_COMBOS = new Set(['v', 'z', 'a', 'c', 'x']);

// Keys to let through (browser shortcuts)
const PASSTHROUGH_KEYS = new Set(['F5', 'F11', 'F12']);

export function useKeyCapture({ onChar, onDeleteWord, enabled = true }: UseKeyCaptureOptions) {
  const onCharRef = useRef(onChar);
  onCharRef.current = onChar;
  const onDeleteWordRef = useRef(onDeleteWord);
  onDeleteWordRef.current = onDeleteWord;

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

      // Backspace = delete last word
      if (e.key === 'Backspace') {
        e.preventDefault();
        onDeleteWordRef.current?.();
        return;
      }

      // Block Delete key
      if (e.key === 'Delete') {
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
