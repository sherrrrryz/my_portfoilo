'use client';

/* ============================================================
   Workshop Wall — S3 第二层 "把不同部门拉到同一页"
   ----------------------------------------------------------------
   - 两行无限横向滚动（CSS keyframes marquee），方向相反
   - 行 hover 时整行暂停，便于看清 tooltip
   - 每张图 hover 弹出 tooltip card（非滚动驱动动画 → framer-motion）
   - 内容：三个 workshop 的现场+素材混排
   ============================================================ */

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type Item = {
  src: string;
  alt: string;
  /* 源图宽高，用于 Image component 的 intrinsic ratio */
  width: number;
  height: number;
  workshop: string;
  title: string;
  desc: string;
};

/* 第一行：workshop 的 PPT / 白板产出截图 */
const ROW_1: Item[] = [
  {
    src: '/section3-3/1-1.png',
    alt: 'Design-thinking opener slide',
    width: 2391,
    height: 1107,
    workshop: 'Design system workshop',
    title: 'Opener: "How might we"',
    desc: 'Setting the frame before 40 people split into breakout groups.',
  },
  {
    src: '/section3-3/1-2.png',
    alt: 'Problem-redefinition worksheet',
    width: 2400,
    height: 1107,
    workshop: 'Design system workshop',
    title: 'Redefining the problem',
    desc: 'Madlib template forcing each team to name the real user friction.',
  },
  {
    src: '/section3-3/1-3.png',
    alt: 'Affinity map output',
    width: 2391,
    height: 1107,
    workshop: 'Desktop feature workshop',
    title: 'Clustered user needs',
    desc: 'Two days of sticky notes collapsed into five opportunity areas.',
  },
  {
    src: '/section3-3/1-4.png',
    alt: 'Scoring matrix board',
    width: 2400,
    height: 1107,
    workshop: 'Desktop feature workshop',
    title: 'Impact × effort matrix',
    desc: 'PMs, engineers, designers scored the same list side by side.',
  },
  {
    src: '/section3-3/1-5.png',
    alt: 'Next-steps summary slide',
    width: 2400,
    height: 1107,
    workshop: 'Lock screen brainstorm',
    title: 'Final recap',
    desc: 'One deck to carry the decisions back to each department.',
  },
];

/* 第二行：现场照片 */
const ROW_2: Item[] = [
  {
    src: '/section3-3/2-1.png',
    alt: 'Small-group sketching',
    width: 2379,
    height: 1080,
    workshop: 'Design system workshop',
    title: 'Small-group sketching',
    desc: 'Senior engineers drew their own components. Nobody stayed quiet.',
  },
  {
    src: '/section3-3/2-2.png',
    alt: 'Cross-team critique',
    width: 2400,
    height: 1080,
    workshop: 'Design system workshop',
    title: 'Cross-team critique',
    desc: 'Three roles reviewed the same screen. Disagreements surfaced fast.',
  },
  {
    src: '/section3-3/2-3.png',
    alt: 'Voting round',
    width: 2373,
    height: 1080,
    workshop: 'Desktop feature workshop',
    title: 'Dot-vote round',
    desc: 'Five dots each. Loudest voice in the room suddenly had to choose.',
  },
  {
    src: '/section3-3/2-4.png',
    alt: 'Focused pair work',
    width: 2400,
    height: 1080,
    workshop: 'Desktop feature workshop',
    title: 'Pair focus block',
    desc: 'Designer + PM working through one flow end to end, together.',
  },
  {
    src: '/section3-3/2-5.png',
    alt: 'Lock-screen card sort',
    width: 2400,
    height: 2013,
    workshop: 'Lock screen brainstorm',
    title: 'Card-sorting the catalog',
    desc: 'Every lock-screen style on the wall. One afternoon to re-group them all.',
  },
];

function Card({ item, height }: { item: Item; height: number }) {
  const [hovered, setHovered] = useState(false);
  /* 根据源图比例算出卡片宽度，保持行内高度统一 */
  const width = Math.round((item.width / item.height) * height);

  return (
    <div
      className="ww-card"
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={`${item.workshop}: ${item.title}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        className="ww-card__img"
        sizes="(max-width: 768px) 80vw, 40vw"
        draggable={false}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="ww-tooltip"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <span className="ww-tooltip__tag">{item.workshop}</span>
            <p className="ww-tooltip__title">{item.title}</p>
            <p className="ww-tooltip__desc">{item.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({
  items,
  direction,
  durationSec,
  height,
}: {
  items: Item[];
  direction: 'left' | 'right';
  durationSec: number;
  height: number;
}) {
  /* 复制一次，配合 keyframes 0→-50% 实现无缝循环 */
  const doubled = [...items, ...items];
  return (
    <div className="ww-row">
      <div
        className={`ww-track ww-track--${direction}`}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {doubled.map((item, i) => (
          <Card key={`${item.src}-${i}`} item={item} height={height} />
        ))}
      </div>
    </div>
  );
}

export default function WorkshopWall() {
  return (
    <div className="ww-wall" aria-label="Workshop scenes">
      <Row items={ROW_1} direction="left" durationSec={60} height={260} />
      <Row items={ROW_2} direction="right" durationSec={75} height={260} />
    </div>
  );
}
