'use client';

import type { ReactNode } from 'react';
import { Reveal } from '../lib/Reveal';

type Props = {
  id: string;
  title: string;
  meta?: ReactNode;
  hint?: ReactNode;
};

export default function MonoCornerLabel({ id, title, meta, hint }: Props) {
  return (
    <Reveal
      mode="element"
      effect="fade"
      trigger="once"
      duration={0.5}
      start="top 90%"
      className="fb-corner"
    >
      <span className="fb-corner__id">
        {id} · {title}
      </span>
      {meta ? <span className="fb-corner__meta">{meta}</span> : null}
      {hint ? <span className="fb-corner__hint">{hint}</span> : null}
    </Reveal>
  );
}
