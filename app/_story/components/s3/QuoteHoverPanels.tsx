'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ScatterTag, { type ScatterTagColor } from './ScatterTag';
import ScatteredTags from './ScatteredTags';
import TiltedCard from './TiltedCard';
import Masonry, { type MasonryItem } from './Masonry';
import DraggableScatter from './DraggableScatter';

/* ---------- 面板1："a newcomer" ---------- */
export function Panel1Newcomer() {
  return <ScatteredTags />;
}

/* ---------- 共用：位置调试模式 ---------- */
const DESIGN_MODE_TILTED =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_TAGS_DRAG === '1';

type CardDef = {
  id: string;
  imageSrc?: string;
  captionText: string;
  tag: string;
  x: number;
  y: number;
  rotate: number;
};

/* ---------- 面板2："a team of senior people" ---------- */
const PANEL2_CARDS: CardDef[] = [
  { id: 'c1', captionText: 'Figma learning doc', tag: 'Learned together',         x: 9,  y: -2, rotate: -13 },
  { id: 'c2', captionText: 'Interview findings', tag: 'Gathered evidence',        x: 44, y: -8, rotate: 8   },
  { id: 'c3', captionText: 'Competitive audit',  tag: 'Set a clear direction',    x: 74, y: -8, rotate: 4   },
  { id: 'c4', captionText: 'Goals doc',          tag: 'Set a clear direction',    x: 27, y: 42, rotate: 14  },
  { id: 'c5', captionText: 'Popup spec v1',      tag: 'Took the first step alone', x: 59, y: 36, rotate: 1  },
];

type PillTag = {
  id: string;
  text: string;
  color: ScatterTagColor;
  x: number;
  y: number;
  rotate: number;
};

const PANEL2_TAGS: PillTag[] = [
  { id: 'p2t1', text: 'Grew the team from 2 to 7',                        color: 'rose',     x: 59, y: 27, rotate: 30  },
  { id: 'p2t2', text: 'Helped everyone understand the current state',     color: 'amber',    x: 3,  y: 54, rotate: 4   },
  { id: 'p2t3', text: 'Gathered evidence to set a clear direction',       color: 'mint',     x: 79, y: 42, rotate: -7  },
  { id: 'p2t4', text: 'Learned together as a team',                       color: 'sky',      x: 41, y: 41, rotate: -18 },
  { id: 'p2t5', text: 'Took the first step alone so others could follow', color: 'lavender', x: 22, y: 24, rotate: -17 },
];

export function Panel2SeniorTeam() {
  const [cards, setCards] = useState<CardDef[]>(PANEL2_CARDS);
  const [tags, setTags] = useState<PillTag[]>(PANEL2_TAGS);
  const [copied, setCopied] = useState(false);

  function handleDragEnd(
    id: string,
    info: { offset: { x: number; y: number } },
  ) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              x: Math.round(c.x + (info.offset.x / window.innerWidth) * 100),
              y: Math.round(c.y + (info.offset.y / 560) * 100),
            }
          : c,
      ),
    );
  }

  function handleTagDragEnd(
    id: string,
    info: { offset: { x: number; y: number } },
  ) {
    setTags((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              x: Math.round(t.x + (info.offset.x / window.innerWidth) * 100),
              y: Math.round(t.y + (info.offset.y / 560) * 100),
            }
          : t,
      ),
    );
  }

  useEffect(() => {
    if (!DESIGN_MODE_TILTED) return;
    const cleanups: Array<() => void> = [];
    PANEL2_CARDS.forEach(({ id }) => {
      const el = document.querySelector<HTMLElement>(
        `[data-scatter-id="p2-${id}"]`,
      );
      if (!el) return;
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 3;
        const delta = e.deltaY > 0 ? step : -step;
        setCards((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, rotate: c.rotate + delta } : c,
          ),
        );
      };
      el.addEventListener('wheel', handler, { passive: false });
      cleanups.push(() => el.removeEventListener('wheel', handler));
    });
    PANEL2_TAGS.forEach(({ id }) => {
      const el = document.querySelector<HTMLElement>(
        `[data-scatter-id="${id}"]`,
      );
      if (!el) return;
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 3;
        const delta = e.deltaY > 0 ? step : -step;
        setTags((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, rotate: t.rotate + delta } : t,
          ),
        );
      };
      el.addEventListener('wheel', handler, { passive: false });
      cleanups.push(() => el.removeEventListener('wheel', handler));
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <>
      <div className="ft-tilted-grid" style={{ height: 560 }}>
        {cards.map((card, i) => (
          <DraggableScatter
            key={card.id}
            id={`p2-${card.id}`}
            x={card.x}
            y={card.y}
            rotate={card.rotate}
            zIndex={i + 1}
            dragMode={DESIGN_MODE_TILTED}
            onDragEnd={(_id, info) => handleDragEnd(card.id, info)}
            entrance={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
            }}
          >
            <TiltedCard
              imageSrc={card.imageSrc}
              captionText={card.captionText}
              containerWidth="220px"
              imageWidth="220px"
              containerHeight="280px"
              imageHeight="280px"
              showTooltip={!!card.imageSrc}
              displayOverlayContent
              overlayContent={
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 8,
                    right: 8,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ScatterTag text={card.tag} />
                </div>
              }
            />
          </DraggableScatter>
        ))}

        {tags.map((tag, i) => (
          <DraggableScatter
            key={tag.id}
            id={tag.id}
            x={tag.x}
            y={tag.y}
            rotate={tag.rotate}
            zIndex={100 + i}
            dragMode={DESIGN_MODE_TILTED}
            hoverJitter={!DESIGN_MODE_TILTED}
            onDragEnd={(_id, info) => handleTagDragEnd(tag.id, info)}
            entrance={{
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1 },
              transition: {
                delay: 0.35 + i * 0.06,
                duration: 0.3,
                ease: 'backOut',
              },
            }}
          >
            <ScatterTag text={tag.text} color={tag.color} />
          </DraggableScatter>
        ))}
      </div>

      {DESIGN_MODE_TILTED && (
        <div className="ft-drag-debug">
          <pre>{JSON.stringify({ cards, tags }, null, 2)}</pre>
          <button
            type="button"
            className="ft-drag-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify({ cards, tags }, null, 2),
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? '✓ Copied!' : 'Copy positions'}
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- 面板3："multiple departments" ---------- */
const PANEL3_CARDS: CardDef[] = [
  { id: 'd1', captionText: 'Workshop photo', tag: '40-person workshop', x: 5, y: 8, rotate: -3 },
  { id: 'd2', captionText: 'Workshop deck', tag: '40-person workshop', x: 36, y: 5, rotate: 2 },
  { id: 'd3', captionText: 'Eng alignment deck', tag: 'Aligned with 6 SDK engineers', x: 62, y: 10, rotate: -4 },
  { id: 'd4', captionText: 'Engineer feedback', tag: 'Engineers shared pain points', x: 20, y: 50, rotate: 4 },
];

const DEPT_TAGS = [
  '40-person workshop with design, PM, research',
  'Invited engineers to share pain points',
  'Aligned rules with 6 SDK engineers',
  'Cross-role review: 10 designers + 10 PMs + 10 engineers',
];

export function Panel3Departments() {
  const [cards, setCards] = useState<CardDef[]>(PANEL3_CARDS);
  const [copied, setCopied] = useState(false);

  function handleDragEnd(
    id: string,
    info: { offset: { x: number; y: number } },
  ) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              x: Math.round(c.x + (info.offset.x / window.innerWidth) * 100),
              y: Math.round(c.y + (info.offset.y / 560) * 100),
            }
          : c,
      ),
    );
  }

  useEffect(() => {
    if (!DESIGN_MODE_TILTED) return;
    const cleanups: Array<() => void> = [];
    PANEL3_CARDS.forEach(({ id }) => {
      const el = document.querySelector<HTMLElement>(
        `[data-scatter-id="p3-${id}"]`,
      );
      if (!el) return;
      const handler = (e: WheelEvent) => {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 3;
        const delta = e.deltaY > 0 ? step : -step;
        setCards((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, rotate: c.rotate + delta } : c,
          ),
        );
      };
      el.addEventListener('wheel', handler, { passive: false });
      cleanups.push(() => el.removeEventListener('wheel', handler));
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
    >
      <div className="ft-tilted-grid" style={{ height: 480 }}>
        {cards.map((card, i) => (
          <DraggableScatter
            key={card.id}
            id={`p3-${card.id}`}
            x={card.x}
            y={card.y}
            rotate={card.rotate}
            zIndex={i + 1}
            dragMode={DESIGN_MODE_TILTED}
            onDragEnd={(_id, info) => handleDragEnd(card.id, info)}
            entrance={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: i * 0.07, duration: 0.4 },
            }}
          >
            <TiltedCard
              imageSrc={card.imageSrc}
              captionText={card.captionText}
              containerWidth="240px"
              imageWidth="240px"
              containerHeight="300px"
              imageHeight="300px"
              displayOverlayContent
              overlayContent={
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 8,
                    right: 8,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ScatterTag text={card.tag} />
                </div>
              }
            />
          </DraggableScatter>
        ))}
      </div>

      <motion.div
        className="ft-results-tags"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {DEPT_TAGS.map((tag) => (
          <motion.div
            key={tag}
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <ScatterTag text={tag} />
          </motion.div>
        ))}
      </motion.div>

      {DESIGN_MODE_TILTED && (
        <div className="ft-drag-debug">
          <pre>{JSON.stringify(cards, null, 2)}</pre>
          <button
            type="button"
            className="ft-drag-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(cards, null, 2));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? '✓ Copied!' : 'Copy positions'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- 面板4："a terrible idea" ---------- */
const MASONRY_ITEMS: MasonryItem[] = [
  { id: 'm1', height: 320, label: '8 core components documented' },
  { id: 'm2', height: 260, label: 'First-ever foundation guidelines' },
  { id: 'm3', height: 280, label: 'Design tokens introduced' },
  { id: 'm4', height: 300, label: '8.9 / 10 satisfaction score' },
];

export function Panel4Terrible() {
  return (
    <div>
      <div className="ft-masonry-wrap">
        <Masonry
          items={MASONRY_ITEMS}
          animateFrom="bottom"
          blurToFocus
          scaleOnHover
        />
      </div>
      <p className="ft-twist">Turns out it wasn&apos;t a terrible idea.</p>
    </div>
  );
}
