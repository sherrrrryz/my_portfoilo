'use client';

import type { CSSProperties, ReactNode } from 'react';

/**
 * WordSplit — wraps each word in a <span class="fm-word"> for GSAP targeting.
 * Whitespace preserved verbatim. Used by S1's word-by-word fade swaps
 * (Q→A pin, G1↔G2↔G3 inter-group text crossfades).
 *
 * Word index is also exposed via data-word-i so callers can opt into
 * staggered timelines that need to know the position.
 */
export default function WordSplit({
  text,
  as = 'span',
  className,
  style,
}: {
  text: string;
  as?: 'span' | 'h1' | 'h2' | 'p';
  className?: string;
  style?: CSSProperties;
}) {
  const Tag = as;
  const parts = text.split(/(\s+)/);
  let wordIndex = 0;
  const nodes: ReactNode[] = parts.map((p, i) => {
    if (/^\s+$/.test(p)) {
      return (
        <span key={i} style={{ whiteSpace: 'pre' }}>
          {p}
        </span>
      );
    }
    const idx = wordIndex++;
    return (
      <span
        key={i}
        className="fm-word"
        data-word-i={idx}
        style={{ display: 'inline-block', willChange: 'opacity, filter' }}
      >
        {p}
      </span>
    );
  });
  return (
    <Tag className={className} style={style}>
      {nodes}
    </Tag>
  );
}
