'use client';

import { CHAR_LIFETIME, USER_TEXT_COLOR, AI_TEXT_COLOR } from './constants';

export interface CharUnit {
  id: number;
  char: string;
  time: number;
}

interface CharStreamProps {
  chars: CharUnit[];
  side: 'user' | 'ai';
  showCursor: boolean;
}

export default function CharStream({ chars, side, showCursor }: CharStreamProps) {
  const color = side === 'user' ? USER_TEXT_COLOR : AI_TEXT_COLOR;
  // AI: text grows from bottom up (flex-end), User: text grows from top down (flex-start)
  const justify = side === 'ai' ? 'flex-end' : 'flex-start';

  return (
    <div
      style={{
        flex: '1 1 0%',
        overflow: 'hidden',
        paddingLeft: 'clamp(48px, 8vw, 120px)',
        paddingRight: 'clamp(48px, 8vw, 120px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justify,
      }}
    >
      <div
        style={{
          color,
          fontSize: 'clamp(36px, 4vw, 48px)',
          lineHeight: 1.7,
          letterSpacing: '0.02em',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {chars.map((c) => (
          <span
            key={c.id}
            className="char-fade"
            style={{
              animationDuration: `${CHAR_LIFETIME}ms`,
            }}
          >
            {c.char}
          </span>
        ))}
        {showCursor && <span className="cursor-blink">{'\u258E'}</span>}
      </div>
    </div>
  );
}
