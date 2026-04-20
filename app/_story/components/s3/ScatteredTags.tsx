'use client';

import ScatterTag, {
  EmojiBadge,
  type ScatterTagColor,
} from './ScatterTag';
import DraggableScatter from './DraggableScatter';

type TagItem = {
  id: string;
  kind: 'tag';
  text: string;
  color: ScatterTagColor;
  x: number;
  y: number;
  rotate: number;
};

type EmojiItem = {
  id: string;
  kind: 'emoji';
  emoji: string;
  x: number;
  y: number;
  rotate: number;
};

export type ScatterItem = TagItem | EmojiItem;

const ITEMS: ScatterItem[] = [
  { id: 't1', kind: 'tag',   text: 'Only 1 year of experience',                           color: 'rose',     x: 18, y: 7,   rotate: -21 },
  { id: 't2', kind: 'tag',   text: 'Already leading another key project',                 color: 'amber',    x: 42, y: 3,   rotate: 9   },
  { id: 't3', kind: 'tag',   text: "Started with 2 teammates who weren't sure about me",  color: 'sky',      x: 25, y: 26,  rotate: -3  },
  { id: 't4', kind: 'tag',   text: 'The entire dev team got reshuffled midway',           color: 'lavender', x: 52, y: 20,  rotate: -14 },
  { id: 't5', kind: 'tag',   text: 'Constantly playing "customer service"',               color: 'mint',     x: 40, y: 41,  rotate: 10  },
  { id: 't6', kind: 'tag',   text: 'Rules: scattered, incomplete, sometimes wrong',       color: 'peach',    x: 62, y: -2,  rotate: 19  },
  { id: 'e1', kind: 'emoji', emoji: '😅',                                                                      x: 9,  y: -14, rotate: -8  },
  { id: 'e2', kind: 'emoji', emoji: '🫠',                                                                      x: 75, y: 57,  rotate: 6   },
  { id: 'e3', kind: 'emoji', emoji: '😬',                                                                      x: 45, y: 17,  rotate: 10  },
  { id: 'e4', kind: 'emoji', emoji: '💀',                                                                      x: 88, y: 48,  rotate: -12 },
  { id: 'e5', kind: 'emoji', emoji: '🙃',                                                                      x: 21, y: 42,  rotate: 14  },
  { id: 'e6', kind: 'emoji', emoji: '🤡',                                                                      x: 84, y: 3,   rotate: -5  },
];

export default function ScatteredTags() {
  const renderItem = (item: ScatterItem) =>
    item.kind === 'tag' ? (
      <ScatterTag text={item.text} color={item.color} />
    ) : (
      <EmojiBadge emoji={item.emoji} />
    );

  return (
    <div className="ft-scattered">
      {ITEMS.map((item, i) => (
        <DraggableScatter
          key={item.id}
          id={item.id}
          className={`ft-scatter-item ft-scatter-item--${item.kind}`}
          x={item.x}
          y={item.y}
          rotate={item.rotate}
          zIndex={i + 1}
          dragMode={false}
          hoverJitter
          entrance={{
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: {
              delay: i * 0.05,
              duration: 0.3,
              ease: 'backOut',
            },
          }}
        >
          {renderItem(item)}
        </DraggableScatter>
      ))}
    </div>
  );
}
