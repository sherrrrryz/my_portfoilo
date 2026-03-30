'use client';

import { useState, useCallback, useRef } from 'react';
import CharStream, { type CharUnit } from './CharStream';
import Divider from './Divider';
import { useKeyCapture } from './useKeyCapture';
import { useFadeManager } from './useFadeManager';
import { useAIEngine } from './useAIEngine';

export default function EphemeralChat() {
  const [userChars, setUserChars] = useState<CharUnit[]>([]);
  const [aiChars, setAiChars] = useState<CharUnit[]>([]);
  const idRef = useRef(0);

  const { aiState, budgetExhausted, onUserKeystroke } = useAIEngine({
    setAiChars,
    idRef,
  });

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

  useKeyCapture({ onChar: handleChar });
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
      }}
    >
      <CharStream chars={aiChars} side="ai" showCursor={showAiCursor} />
      <Divider active={isActive} dying={budgetExhausted} />
      <CharStream chars={userChars} side="user" showCursor={true} />
    </div>
  );
}
