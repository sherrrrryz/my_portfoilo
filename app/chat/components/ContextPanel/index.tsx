'use client';

import { useState, useEffect } from 'react';
import ContextCard from './ContextCard';
import cardsData from '../../../../src/data/context/cards.json';

type CardData = (typeof cardsData)[keyof typeof cardsData];

export default function ContextPanel({ contextId }: { contextId: string | null }) {
  const [displayedCard, setDisplayedCard] = useState<CardData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!contextId) return;

    const card = (cardsData as Record<string, CardData>)[contextId];
    if (!card || card.id === displayedCard?.id) return;

    if (!displayedCard) {
      // First card: fade in
      setDisplayedCard(card);
      // Trigger animation on next frame
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    // Switch: fade out, swap, fade in
    setVisible(false);
    const timer = setTimeout(() => {
      setDisplayedCard(card);
      requestAnimationFrame(() => setVisible(true));
    }, 350); // 250ms fade-out + 100ms gap
    return () => clearTimeout(timer);
  }, [contextId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!displayedCard) return null;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: visible
          ? 'opacity 350ms ease-out, transform 350ms ease-out'
          : 'opacity 250ms ease-in',
      }}
    >
      <ContextCard card={displayedCard} />
    </div>
  );
}
