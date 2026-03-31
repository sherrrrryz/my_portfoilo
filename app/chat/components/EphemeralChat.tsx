'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import CharStream, { type CharUnit } from './CharStream';
import Divider from './Divider';
import { useKeyCapture } from './useKeyCapture';
import { useFadeManager } from './useFadeManager';
import { useAIEngine } from './useAIEngine';

export default function EphemeralChat() {
  const [userChars, setUserChars] = useState<CharUnit[]>([]);
  const [aiChars, setAiChars] = useState<CharUnit[]>([]);
  const idRef = useRef(0);

  const { aiState, budgetExhausted, onUserKeystroke, sendGreeting, deleteLastWord } = useAIEngine({
    setAiChars,
    setUserChars,
    idRef,
  });

  // Auto-greet visitor 1.5s after page load
  const greetedRef = useRef(false);
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const timer = setTimeout(() => sendGreeting(), 1500);
    return () => clearTimeout(timer);
  }, [sendGreeting]);

  const handleChar = useCallback(
    (char: string) => {
      const newChar: CharUnit = {
        id: idRef.current++,
        char,
        time: Date.now(),
      };
      setUserChars((prev) => [...prev, newChar]);
      onUserKeystroke(char);
    },
    [onUserKeystroke]
  );

  const handleDeleteWord = useCallback(() => {
    const count = deleteLastWord();
    if (count > 0) {
      setUserChars((prev) => prev.slice(0, -count));
    }
  }, [deleteLastWord]);

  useKeyCapture({ onChar: handleChar, onDeleteWord: handleDeleteWord });
  useFadeManager(setUserChars);
  useFadeManager(setAiChars);

  const isActive = aiState === 'listening' || aiState === 'speaking';
  const showAiCursor = aiState === 'speaking';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: 24,
          right: 32,
          zIndex: 10,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 24,
          letterSpacing: '0.05em',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
      >
        EXIT
      </Link>
      <CharStream chars={aiChars} side="ai" showCursor={showAiCursor} />
      <Divider active={isActive} dying={budgetExhausted} />
      <CharStream chars={userChars} side="user" showCursor={true} />
    </div>
  );
}
