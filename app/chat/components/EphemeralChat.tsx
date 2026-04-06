'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import CharStream, { type CharUnit } from './CharStream';
import Divider from './Divider';
import { useKeyCapture } from './useKeyCapture';
import { useFadeManager } from './useFadeManager';
import { useAIEngine } from './useAIEngine';

interface EphemeralChatProps {
  onContextChange?: (contextId: string | null) => void;
}

export default function EphemeralChat({ onContextChange }: EphemeralChatProps) {
  const [userChars, setUserChars] = useState<CharUnit[]>([]);
  const [aiChars, setAiChars] = useState<CharUnit[]>([]);
  const idRef = useRef(0);

  const { aiState, budgetExhausted, onUserKeystroke, sendGreeting, deleteLastWord } = useAIEngine({
    setAiChars,
    setUserChars,
    idRef,
    onContextChange,
  });

  // Auto-greet visitor 1.5s after mount.
  // Use a ref so the effect has zero deps and only fires on mount/unmount.
  const sendGreetingRef = useRef(sendGreeting);
  sendGreetingRef.current = sendGreeting;
  useEffect(() => {
    const timer = setTimeout(() => sendGreetingRef.current(), 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <CharStream chars={aiChars} side="ai" showCursor={showAiCursor} />
      <Divider active={isActive} dying={budgetExhausted} />
      <CharStream chars={userChars} side="user" showCursor={true} />
    </div>
  );
}
