'use client';

type Row = {
  words: string[];
  direction: 'left' | 'right';
  durationSec: number;
};

const TOP_ROWS: Row[] = [
  {
    words: ['wind', 'lightning', 'snow', 'thunder', 'ocean', 'tide', 'horizon', 'fog', 'bloom'],
    direction: 'left',
    durationSec: 203,
  },
  {
    words: ['delight', 'tender', 'alive', 'restless', 'curious', 'gentle', 'fierce', 'warmth', 'playful'],
    direction: 'right',
    durationSec: 158,
  },
  {
    words: ['hope', 'faith', 'self', 'balance', 'tension', 'clarity', 'chaos', 'presence', 'becoming'],
    direction: 'left',
    durationSec: 123,
  },
];

const BOTTOM_ROWS: Row[] = [
  {
    words: ['light', 'spark', 'gravity', 'silence', 'speed', 'rhythm', 'flow', 'depth', 'surface'],
    direction: 'right',
    durationSec: 123,
  },
  {
    words: ['courage', 'patient', 'stubborn', 'free', 'honest', 'intuition', 'intention', 'wonder', 'contradiction'],
    direction: 'left',
    durationSec: 158,
  },
  {
    words: ['dialectics', 'expected yet surprising', 'a thousand worlds', 'order', 'form', 'craft', 'edge', 'detail', 'layer', 'space'],
    direction: 'right',
    durationSec: 203,
  },
];

function renderItems(words: string[], prefix: string) {
  return words.flatMap((w, i) => [
    <span key={`${prefix}-w-${i}`} data-fl-text className="fl-flow-word">
      {w}
    </span>,
    <span key={`${prefix}-s-${i}`} className="fl-flow-sep" aria-hidden="true">
      ·
    </span>,
  ]);
}

function MarqueeRow({ row }: { row: Row }) {
  return (
    <div className="fl-flow-row">
      <div
        className={`fl-flow-inner fl-flow-${row.direction}`}
        style={{ animationDuration: `${row.durationSec}s` }}
      >
        {renderItems(row.words, 'a')}
        {renderItems(row.words, 'b')}
      </div>
    </div>
  );
}

export function FlowingRowsTop() {
  return (
    <div className="fl-flow-stack" aria-hidden="true">
      {TOP_ROWS.map((row, i) => (
        <MarqueeRow key={`top-${i}`} row={row} />
      ))}
    </div>
  );
}

export function FlowingRowsBottom() {
  return (
    <div className="fl-flow-stack" aria-hidden="true">
      {BOTTOM_ROWS.map((row, i) => (
        <MarqueeRow key={`bottom-${i}`} row={row} />
      ))}
    </div>
  );
}
