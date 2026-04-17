'use client';

import { useEffect, useState } from 'react';

const SCRAMBLE = '!@#$%^&*()_+-=[]{};:,.<>?/~`|';

export default function DecryptedText({
  text,
  speed = 100,
}: {
  text: string;
  speed?: number;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let revealed = 0;
    const id = setInterval(() => {
      revealed += 1;
      if (revealed > text.length) {
        setDisplay(text);
        clearInterval(id);
        return;
      }
      setDisplay(
        text
          .split('')
          .map((ch, i) =>
            ch === ' '
              ? ' '
              : i < revealed
                ? ch
                : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)],
          )
          .join(''),
      );
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <>{display}</>;
}
