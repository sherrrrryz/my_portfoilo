'use client';

import EvervaultCard from './EvervaultCard';

type Method = {
  text: string;
  image: string;
  aspectRatio: number;
};

const METHODS: Method[] = [
  { text: 'Competitive analysis', image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'User interviews',      image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'Usability testing',    image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'A/B testing',          image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'Survey design',        image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'Heuristic evaluation', image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'Contextual inquiry',   image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'Affinity mapping',     image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'Card sorting',         image: '/s4/placeholder.svg', aspectRatio: 1 },
  { text: 'Journey mapping',      image: '/s4/placeholder.svg', aspectRatio: 1 },
];

const ROW_SPLIT = [3, 4, 3];

export default function MethodGrid() {
  const rows: Method[][] = [];
  let cursor = 0;
  for (const count of ROW_SPLIT) {
    rows.push(METHODS.slice(cursor, cursor + count));
    cursor += count;
  }

  return (
    <div className="fe-grid">
      {rows.map((row, i) => (
        <div key={i} className="fe-row">
          {row.map((m) => (
            <EvervaultCard
              key={m.text}
              text={m.text}
              imageSrc={m.image}
              aspectRatio={m.aspectRatio}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
