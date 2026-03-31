'use client';

import { useRef, useCallback, useState } from 'react';
import type { CharUnit } from './CharStream';
import {
  PAUSE_THRESHOLD,
  MAX_CONTEXT_TURNS,
  TYPING_DELAY,
} from './constants';

type AIState = 'idle' | 'listening' | 'speaking';

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

function getDelay(char: string, prevChar: string): number {
  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  if (char === '\n') return rand(...TYPING_DELAY.newline);
  if (char === '.' && prevChar === '.') return rand(...TYPING_DELAY.ellipsisDot);
  if (char === '.' || char === '?' || char === '!') return rand(...TYPING_DELAY.period);
  if (char === ',') return rand(...TYPING_DELAY.comma);
  if (char === ' ') return rand(...TYPING_DELAY.space);
  return rand(...TYPING_DELAY.normal);
}

interface UseAIEngineOptions {
  setAiChars: React.Dispatch<React.SetStateAction<CharUnit[]>>;
  setUserChars: React.Dispatch<React.SetStateAction<CharUnit[]>>;
  idRef: React.MutableRefObject<number>;
}

export function useAIEngine({ setAiChars, setUserChars, idRef }: UseAIEngineOptions) {
  const [aiState, setAiState] = useState<AIState>('idle');
  const [budgetExhausted, setBudgetExhausted] = useState(false);

  const userBufferRef = useRef('');
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiAbortRef = useRef(false);
  const historyRef = useRef<Turn[]>([]);
  const sessionIdRef = useRef(crypto.randomUUID());
  const aiStateRef = useRef<AIState>('idle');
  const pendingRequestRef = useRef(false);

  // Keep ref in sync with state
  const updateState = useCallback((s: AIState) => {
    aiStateRef.current = s;
    setAiState(s);
  }, []);

  const typeOutText = useCallback(
    async (text: string): Promise<string> => {
      aiAbortRef.current = false;
      let displayed = '';

      for (let i = 0; i < text.length; i++) {
        if (aiAbortRef.current) break;

        const char = text[i];
        const prevChar = i > 0 ? text[i - 1] : '';
        const delay = getDelay(char, prevChar);

        const newChar: CharUnit = {
          id: idRef.current++,
          char,
          time: Date.now(),
        };
        setAiChars((prev) => [...prev, newChar]);
        displayed += char;

        await new Promise((r) => setTimeout(r, delay));
      }

      return displayed;
    },
    [setAiChars, idRef]
  );

  const callAI = useCallback(async () => {
    if (budgetExhausted || pendingRequestRef.current) return;

    const userText = userBufferRef.current.trim();
    if (!userText) return;

    // Record user turn
    historyRef.current.push({ role: 'user', content: userText });
    userBufferRef.current = '';
    // Immediately add newline after user message
    setUserChars((prev) => [...prev, { id: idRef.current++, char: '\n', time: Date.now() }]);

    // Trim context
    if (historyRef.current.length > MAX_CONTEXT_TURNS) {
      historyRef.current = historyRef.current.slice(-MAX_CONTEXT_TURNS);
    }

    updateState('speaking');
    pendingRequestRef.current = true;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          messages: historyRef.current,
        }),
      });

      const data = await res.json();
      pendingRequestRef.current = false;

      if (data.budgetExhausted && !data.text) {
        setBudgetExhausted(true);
        updateState('idle');
        return;
      }

      if (data.budgetExhausted) {
        setBudgetExhausted(true);
      }

      const text = data.text || '...';

      // If user already started typing during API wait, abort
      if (aiAbortRef.current) {
        aiAbortRef.current = false;
        // Don't push empty assistant content (Anthropic rejects it)
        // The user's new input will be appended to the previous user turn
        updateState('listening');
        return;
      }

      const displayed = await typeOutText(text);
      // Newline after AI response
      setAiChars((prev) => [...prev, { id: idRef.current++, char: '\n', time: Date.now() }]);

      // Record what was actually displayed
      historyRef.current.push({ role: 'assistant', content: displayed });

      if (aiStateRef.current === 'speaking') {
        updateState('idle');
      }
    } catch {
      pendingRequestRef.current = false;
      // Error -> AI says "..."
      const displayed = await typeOutText('...');
      setAiChars((prev) => [...prev, { id: idRef.current++, char: '\n', time: Date.now() }]);
      historyRef.current.push({ role: 'assistant', content: displayed });
      if (aiStateRef.current === 'speaking') {
        updateState('idle');
      }
    }
  }, [budgetExhausted, updateState, typeOutText, setUserChars]);

  const sendGreeting = useCallback(async () => {
    if (budgetExhausted || pendingRequestRef.current) return;

    updateState('speaking');
    pendingRequestRef.current = true;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          messages: [],
        }),
      });

      const data = await res.json();
      pendingRequestRef.current = false;

      if (data.budgetExhausted && !data.text) {
        setBudgetExhausted(true);
        updateState('idle');
        return;
      }

      if (data.budgetExhausted) {
        setBudgetExhausted(true);
      }

      const text = data.text || '...';

      if (aiAbortRef.current) {
        aiAbortRef.current = false;
        updateState('listening');
        return;
      }

      const displayed = await typeOutText(text);
      setAiChars((prev) => [...prev, { id: idRef.current++, char: '\n', time: Date.now() }]);
      historyRef.current.push({ role: 'assistant', content: displayed });

      if (aiStateRef.current === 'speaking') {
        updateState('idle');
      }
    } catch {
      pendingRequestRef.current = false;
      const displayed = await typeOutText('...');
      setAiChars((prev) => [...prev, { id: idRef.current++, char: '\n', time: Date.now() }]);
      historyRef.current.push({ role: 'assistant', content: displayed });
      if (aiStateRef.current === 'speaking') {
        updateState('idle');
      }
    }
  }, [budgetExhausted, updateState, typeOutText]);

  const onUserKeystroke = useCallback(
    (char: string) => {
      if (budgetExhausted) return;

      userBufferRef.current += char;

      // If AI is speaking, interrupt it
      if (aiStateRef.current === 'speaking') {
        aiAbortRef.current = true;
        updateState('listening');
      } else if (aiStateRef.current === 'idle') {
        updateState('listening');
      }

      // Reset pause timer
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => {
        if (aiStateRef.current === 'listening') {
          callAI();
        }
      }, PAUSE_THRESHOLD);
    },
    [budgetExhausted, callAI, updateState]
  );

  // Delete last word + trailing punctuation from user buffer, return count removed
  const deleteLastWord = useCallback((): number => {
    const buf = userBufferRef.current;
    if (!buf) return 0;

    let i = buf.length;
    // Strip trailing spaces/punctuation
    while (i > 0 && /[\s.,!?;:'")\-]/.test(buf[i - 1])) i--;
    // Strip the word (non-space chars)
    while (i > 0 && !/[\s]/.test(buf[i - 1])) i--;

    const removed = buf.length - i;
    userBufferRef.current = buf.slice(0, i);
    return removed;
  }, []);

  return {
    aiState,
    budgetExhausted,
    onUserKeystroke,
    sendGreeting,
    deleteLastWord,
  };
}
