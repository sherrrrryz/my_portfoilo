# Section 3 Block 1 — Implementation Plan

> **执行者须知：** 本文档完全自包含。执行前请先阅读 `docs/prd.md` §六（Section 3）和
> `docs/design-system.md`。不需要其他上下文。按文末"执行顺序"一步一步来。

---

## 一、背景与范围

**目标：** 实现 Story 页 Section 3 "For Teams" 的第一大块：
- S2 → S3 过渡句
- S3 引出句
- 核心 manager quote + hover 展开面板（4 个面板）

**不包含：** S3 第二大块（workshop 照片墙）留给后续 session。

**已有基础（勿修改）：**
- `app/_story/styles/for-business.css` — S2 样式，可借鉴模式
- `app/_story/lib/Reveal.tsx` — scroll-triggered 文字动画原语
- `app/_story/components/ComparisonCard.tsx` — S2 卡片，同级参考
- `app/page.tsx` — 现有 S0–S2，新内容追加到文件末尾（`</LenisProvider>` 前）

---

## 二、新增颜色 Token

在 `app/_styles/tokens.css` 的 **LAYER 1 Primitives** 部分，`--terracotta-700` 之后追加：

```css
/* ------ Colors: lavender (S3 phrase-4 marker) ------
   Soft blue-purple for the fourth hover phrase in Section 3.
   Intentionally desaturated to stay monochrome-adjacent. */
--lavender-100: #eceaff;
--lavender-700: #4338ca;
--lavender-900: #312e81;

/* ------ Colors: sage (S3 phrase-3 marker) ------
   Cool gray-green, distinct from the green accent family. */
--sage-100: #e6ede8;
--sage-700: #3a5c44;
```

在 **LAYER 2 Semantic** 部分，`--highlight-ink` 之后追加：

```css
/* ------ S3 phrase marker colors ------
   Used only in Section 3 QuoteHover phrase highlights.
   phrase-1 = accent (reuse), phrase-2 = highlight (reuse),
   phrase-3 = sage, phrase-4 = lavender. */
--phrase-3-pale: var(--sage-100);
--phrase-3-ink:  var(--sage-700);
--phrase-4-pale: var(--lavender-100);
--phrase-4-ink:  var(--lavender-700);
```

---

## 三、文件清单

```
新建文件：
  app/_story/styles/for-teams.css
  app/_story/components/s3/ScatterTag.tsx      ← 散落 tag 专用组件（不依赖 Badge）
  app/_story/components/s3/TiltedCard.tsx
  app/_story/components/s3/TiltedCard.css
  app/_story/components/s3/Masonry.tsx
  app/_story/components/s3/Masonry.css
  app/_story/components/s3/ScatteredTags.tsx
  app/_story/components/s3/QuoteHoverPanels.tsx
  app/_story/components/s3/QuoteHover.tsx

修改文件：
  app/_styles/tokens.css          ← 追加新 primitive/semantic token
  app/page.tsx                    ← 追加 S2→S3 bridge + S3 sections
```

---

## 四、`for-teams.css`

新建 `app/_story/styles/for-teams.css`，内容如下。模式完全照�搬
`for-business.css` 的 `.fb-section` / `.fb-bridge` 命名约定，前缀改为 `ft-`。

```css
/* ===== Section 3 — For Teams ===== */

/* ---- 共用 section 容器 ---- */
.ft-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--stage-light);
  color: var(--ink-primary);
  padding: var(--vspace-xl) var(--hspace-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-sans);
  overflow: hidden;
}

.ft-section__inner {
  width: 100%;
  max-width: var(--container-xl);
}

/* ---- S2→S3 bridge（复用 fb-bridge 类，无需重写） ---- */

/* ---- 引出句 ---- */
.ft-lead {
  max-width: var(--container-md);
  margin: 0 auto;
  text-align: center;
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-tight);
  color: var(--ink-secondary);
}

/* ---- QuoteHover 根容器 ---- */
.ft-quote-root {
  width: 100%;
  max-width: var(--container-xl);
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--vspace-xl) 0;
}

/* ---- 引用大字（默认状态：占满上方空间） ---- */
.ft-quote {
  font-family: var(--font-sans);
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tightest);
  color: var(--ink-primary);
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  cursor: default;
  /* framer-motion layout 会处理过渡，这里只需声明目标样式 */
  transition: font-size var(--duration-slow) var(--ease-out);
}

/* ---- 引用缩小态（有面板激活时） ---- */
.ft-quote--condensed {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--ink-secondary);
  letter-spacing: var(--tracking-tight);
}

/* ---- 高亮短语 base ---- */
.ft-phrase {
  display: inline;
  cursor: pointer;
  border-radius: var(--radius-sm);
  padding: 0.05em 0.25em;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
  /* 笔刷 marker 效果：用 box-decoration-break 让跨行也有 bg */
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

/* ---- 4 种 marker 颜色 ---- */
.ft-phrase--1 {
  background: var(--accent-pale);
  color: var(--accent-ink);
}
.ft-phrase--1:hover,
.ft-phrase--1.ft-phrase--active {
  background: var(--accent-muted);
}

.ft-phrase--2 {
  background: var(--highlight-pale);
  color: var(--highlight-ink);
}
.ft-phrase--2:hover,
.ft-phrase--2.ft-phrase--active {
  background: var(--terracotta-100);
  filter: brightness(0.92);
}

.ft-phrase--3 {
  background: var(--phrase-3-pale);
  color: var(--phrase-3-ink);
}
.ft-phrase--3:hover,
.ft-phrase--3.ft-phrase--active {
  filter: brightness(0.93);
}

.ft-phrase--4 {
  background: var(--phrase-4-pale);
  color: var(--phrase-4-ink);
}
.ft-phrase--4:hover,
.ft-phrase--4.ft-phrase--active {
  filter: brightness(0.93);
}

/* ---- 面板容器 ---- */
.ft-panel {
  width: 100%;
  max-width: var(--container-xl);
  margin: var(--space-6) auto 0;
  min-height: 360px;
}

/* ---- 面板1：ScatteredTags ---- */
.ft-scattered {
  position: relative;
  width: 100%;
  height: 480px;
}

/* ---- 散落 tag 专用样式 ---- */
.ft-scatter-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.4em 1em;
  background: var(--surface-raised);
  border: 1px solid var(--border-hairline);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--ink-primary);
  line-height: var(--leading-snug);
  white-space: nowrap;
  box-shadow: var(--shadow-raised);
  user-select: none;
}

.ft-scatter-tag__emoji {
  font-size: 1.1em;
  line-height: 1;
}

/* ---- 拖拽模式调试面板（仅 DESIGN_MODE） ---- */
.ft-drag-debug {
  position: fixed;
  bottom: var(--space-5);
  right: var(--space-5);
  z-index: var(--z-overlay);
  background: var(--neutral-950);
  color: var(--neutral-0);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  max-width: 380px;
  max-height: 320px;
  overflow: auto;
}

.ft-drag-copy-btn {
  display: block;
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--accent);
  color: var(--neutral-0);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

/* ---- 面板2/3：TiltedCard 容器 ---- */
.ft-tilted-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  justify-content: center;
  align-items: flex-start;
  position: relative;
  min-height: 480px;
  padding: var(--space-4);
}

/* 拖拽锁定：每个可拖拽 wrapper ---- */
.ft-draggable-wrap {
  position: absolute; /* 拖拽锁定后用 absolute + hardcoded top/left */
  cursor: grab;
}
.ft-draggable-wrap:active {
  cursor: grabbing;
}
.ft-draggable-wrap--locked {
  cursor: default;
}

/* ---- 面板4：Masonry 容器 ---- */
.ft-masonry-wrap {
  width: 100%;
  height: 600px; /* Masonry 需要固定高度容器 */
  position: relative;
}

/* ---- 面板4：成果标签行 ---- */
.ft-results-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2-5);
  justify-content: center;
  margin-bottom: var(--space-5);
}

/* ---- S3 footer（底部项目链接） ---- */
.ft-footer {
  margin-top: var(--vspace-lg);
  text-align: center;
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
  color: var(--ink-faint);
  font-family: var(--font-sans);
}
.ft-footer a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* ---- 反转句 ---- */
.ft-twist {
  margin-top: var(--space-6);
  text-align: center;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  font-style: italic;
  color: var(--ink-secondary);
  letter-spacing: var(--tracking-tight);
}
```

---

## 五、`TiltedCard.tsx` + `TiltedCard.css`

**来源：** React Bits（MIT 授权），已在本 session 获取源码。

新建 `app/_story/components/s3/TiltedCard.tsx`：

```tsx
'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedCard.css';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export type TiltedCardProps = {
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  className?: string;
};

export default function TiltedCard({
  imageSrc,
  altText = '',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '260px',
  imageHeight = '300px',
  imageWidth = '260px',
  scaleOnHover = 1.07,
  rotateAmplitude = 12,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false,
  className,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    rotateFigcaption.set(-(offsetY - lastY) * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`tc-figure${className ? ` ${className}` : ''}`}
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tc-inner"
        style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageSrc} alt={altText} className="tc-img" draggable={false} />
        ) : (
          <div className="tc-placeholder" aria-hidden="true" />
        )}
        {displayOverlayContent && overlayContent && (
          <div className="tc-overlay">{overlayContent}</div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <motion.figcaption
          className="tc-caption"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
```

新建 `app/_story/components/s3/TiltedCard.css`：

```css
.tc-figure {
  position: relative;
  perspective: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tc-inner {
  position: relative;
  transform-style: preserve-3d;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.tc-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-lg);
  will-change: transform;
  display: block;
}

/* 无图时的占位方块 */
.tc-placeholder {
  position: absolute;
  inset: 0;
  background: var(--surface-1);
  border-radius: var(--radius-lg);
}

.tc-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  will-change: transform;
  transform: translateZ(30px);
  pointer-events: none;
}

.tc-caption {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  padding: 4px 10px;
  font-size: var(--text-micro);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-wide);
  color: var(--ink-primary);
  opacity: 0;
  z-index: 3;
  white-space: nowrap;
  box-shadow: var(--shadow-raised);
}
```

---

## 六、`Masonry.tsx` + `Masonry.css`

**来源：** React Bits（MIT 授权），已在本 session 获取源码。

改写要点：
- 去掉 `window.open` 点击跳转（改为可选 `onItemClick` prop）
- `colorShiftOnHover` 彩虹渐变 → 替换为 `var(--accent-pale)` 单色
- `box-shadow` hardcode → `var(--shadow-raised)`
- `border-radius: 10px` → `var(--radius-lg)`

新建 `app/_story/components/s3/Masonry.tsx`：

```tsx
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Masonry.css';

export type MasonryItem = {
  id: string | number;
  img?: string;           // 可选：有图用图，没图用占位
  height: number;         // 原始高度（用于比例计算）
  label?: string;         // 可选：图片下方标签文字
};

type Props = {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  onItemClick?: (item: MasonryItem) => void;
};

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number,
) => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState(get);
  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener('change', handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener('change', handler),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);
  return value;
};

const useMeasure = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  onItemClick,
}: Props) {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)'],
    [4, 3, 2],
    1,
  );
  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (
    item: { x: number; y: number; w: number; h: number },
  ) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };
    const dir =
      animateFrom === 'random'
        ? (['top', 'bottom', 'left', 'right'] as const)[
            Math.floor(Math.random() * 4)
          ]
        : animateFrom;
    switch (dir) {
      case 'top': return { x: item.x, y: -200 };
      case 'bottom': return { x: item.x, y: window.innerHeight + 200 };
      case 'left': return { x: -200, y: item.y };
      case 'right': return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default: return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    const imgUrls = items.map((i) => i.img).filter(Boolean) as string[];
    if (imgUrls.length > 0) {
      preloadImages(imgUrls).then(() => setImagesReady(true));
    } else {
      setImagesReady(true);
    }
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];
      colHeights[col] += height;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;
    grid.forEach((item, index) => {
      const selector = `[data-masonry-key="${item.id}"]`;
      const animationProps = { x: item.x, y: item.y, width: item.w, height: item.h };
      if (!hasMounted.current) {
        const init = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: init.x,
            y: init.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(8px)' }),
          },
          {
            opacity: 1,
            ...animationProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          },
        );
      } else {
        gsap.to(selector, { ...animationProps, duration, ease, overwrite: 'auto' });
      }
    });
    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady]);

  return (
    <div ref={containerRef} className="msn-list">
      {grid.map((item) => (
        <div
          key={item.id}
          data-masonry-key={item.id}
          className="msn-item"
          onClick={() => onItemClick?.(item)}
          onMouseEnter={() => {
            if (scaleOnHover)
              gsap.to(`[data-masonry-key="${item.id}"]`, {
                scale: hoverScale,
                duration: 0.25,
                ease: 'power2.out',
              });
          }}
          onMouseLeave={() => {
            if (scaleOnHover)
              gsap.to(`[data-masonry-key="${item.id}"]`, {
                scale: 1,
                duration: 0.25,
                ease: 'power2.out',
              });
          }}
        >
          <div
            className="msn-item__img"
            style={item.img ? { backgroundImage: `url(${item.img})` } : undefined}
          >
            {!item.img && <div className="msn-item__placeholder" />}
          </div>
          {item.label && <span className="msn-item__label">{item.label}</span>}
        </div>
      ))}
    </div>
  );
}
```

新建 `app/_story/components/s3/Masonry.css`：

```css
.msn-list {
  position: relative;
  width: 100%;
  height: 100%;
}

.msn-item {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform, width, height, opacity;
  padding: var(--space-2);
  cursor: pointer;
}

.msn-item__img {
  position: relative;
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-raised);
  overflow: hidden;
}

/* 无图占位 */
.msn-item__placeholder {
  position: absolute;
  inset: 0;
  background: var(--surface-1);
  border-radius: var(--radius-lg);
}

.msn-item__label {
  display: block;
  margin-top: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  color: var(--ink-muted);
  text-align: center;
}
```

---

## 七、`ScatterTag.tsx`（散落 tag 原子组件）

新建 `app/_story/components/s3/ScatterTag.tsx`：

```tsx
import type { ReactNode } from 'react';

type Props = {
  text: string;
  emoji?: string;
  children?: ReactNode; // 备用：直接传 JSX 内容
};

export default function ScatterTag({ text, emoji, children }: Props) {
  return (
    <div className="ft-scatter-tag">
      {emoji && <span className="ft-scatter-tag__emoji" aria-hidden="true">{emoji}</span>}
      <span>{children ?? text}</span>
    </div>
  );
}
```

样式在 `for-teams.css` 的 `.ft-scatter-tag` 里，不依赖 Badge，完全独立。

---

## 八、`ScatteredTags.tsx`（面板1）

**拖拽锁定机制：**
- `NEXT_PUBLIC_TAGS_DRAG=1` 开启拖拽模式（`.env.local` 里加）
- 拖拽结束时实时更新 state 中的 x/y 坐标
- 右下角调试面板显示当前所有位置 JSON，点"Copy"复制
- 将复制的 JSON 粘贴回 `TAGS` 数组的 x/y/rotate 字段，然后关闭 `TAGS_DRAG`

新建 `app/_story/components/s3/ScatteredTags.tsx`：

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ScatterTag from './ScatterTag';

const DESIGN_MODE =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_TAGS_DRAG === '1';

export type TagDef = {
  id: string;
  text: string;
  emoji?: string;
  x: number;   // % of container width
  y: number;   // % of container height
  rotate: number; // degrees
};

/* ------------------------------------------------------------------ */
/* 初始坐标（开完拖拽后换成你的实际数值）                              */
/* ------------------------------------------------------------------ */
const INITIAL_TAGS: TagDef[] = [
  { id: 't1', text: 'Only 1 year of experience',                       emoji: '😅', x: 5,  y: 8,  rotate: -6  },
  { id: 't2', text: 'Already leading another key project',              emoji: '🫠', x: 52, y: 4,  rotate: 3   },
  { id: 't3', text: "Started with 2 teammates who weren't sure about me", emoji: '😬', x: 22, y: 44, rotate: -3 },
  { id: 't4', text: 'The entire dev team got reshuffled midway',         emoji: '💀', x: 63, y: 36, rotate: 7   },
  { id: 't5', text: 'Constantly playing "customer service"',             emoji: '🙃', x: 8,  y: 70, rotate: -8  },
  { id: 't6', text: 'Rules: scattered, incomplete, sometimes wrong',     emoji: '🤡', x: 48, y: 66, rotate: 4   },
];

export default function ScatteredTags() {
  const [tags, setTags] = useState<TagDef[]>(INITIAL_TAGS);
  const [copied, setCopied] = useState(false);

  function handleDragEnd(id: string, info: { offset: { x: number; y: number } }) {
    // 换算 px offset 到相对百分比（480px 高容器，100% 宽容器）
    setTags((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              x: Math.round(t.x + (info.offset.x / window.innerWidth) * 100),
              y: Math.round(t.y + (info.offset.y / 480) * 100),
            }
          : t,
      ),
    );
  }

  function handleCopy() {
    navigator.clipboard.writeText(JSON.stringify(tags, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="ft-scattered">
        {tags.map((tag, i) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            left: `${tag.x}%`,
            top: `${tag.y}%`,
            rotate: `${tag.rotate}deg`,
            zIndex: i + 1,
          };

          if (!DESIGN_MODE) {
            return (
              <motion.div
                key={tag.id}
                style={style}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: 'backOut' }}
              >
                <Badge variant="outline" className="ft-scattered-badge">
                  {tag.emoji && <span style={{ marginRight: 6 }}>{tag.emoji}</span>}
                  {tag.text}
                </Badge>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={tag.id}
              style={style}
              drag
              dragMomentum={false}
              onDragEnd={(_, info) => handleDragEnd(tag.id, info)}
              whileDrag={{ scale: 1.05, zIndex: 99 }}
            >
              <ScatterTag text={tag.text} emoji={tag.emoji} />
            </motion.div>
          );
        })}
      </div>

      {DESIGN_MODE && (
        <div className="ft-drag-debug">
          <pre>{JSON.stringify(tags, null, 2)}</pre>
          <button type="button" className="ft-drag-copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy positions'}
          </button>
        </div>
      )}
    </>
  );
}
```

---

## 八、`QuoteHoverPanels.tsx`（4 个面板内容）

**说明：** 面板1–4 的素材当前全部用占位处理（placeholder bg + 文字tag），
等用户提供真实图片时替换 `img` 或 `imageSrc` 即可。

新建 `app/_story/components/s3/QuoteHoverPanels.tsx`：

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../_lab/ui/badge';
import ScatteredTags from './ScatteredTags';
import TiltedCard from './TiltedCard';
import Masonry, { type MasonryItem } from './Masonry';

/* ---------- 面板1："a newcomer" ---------- */
export function Panel1Newcomer() {
  return <ScatteredTags />;
}

/* ---------- 面板2："a team of senior people" ---------- */

const DESIGN_MODE_TILTED =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_TAGS_DRAG === '1';

type CardDef = {
  id: string;
  imageSrc?: string;
  captionText: string;
  tag: string;
  x: number; // % container
  y: number; // % container
  rotate: number; // deg
};

const PANEL2_CARDS: CardDef[] = [
  { id: 'c1', captionText: 'Figma learning doc', tag: 'Learned together',          x: 5,  y: 10, rotate: -4 },
  { id: 'c2', captionText: 'Interview findings', tag: 'Gathered evidence',          x: 32, y: 5,  rotate: 2  },
  { id: 'c3', captionText: 'Competitive audit',  tag: 'Set a clear direction',      x: 58, y: 12, rotate: -2 },
  { id: 'c4', captionText: 'Goals doc',          tag: 'Set a clear direction',      x: 20, y: 52, rotate: 5  },
  { id: 'c5', captionText: 'Popup spec v1',      tag: 'Took the first step alone',  x: 50, y: 48, rotate: -5 },
];

export function Panel2SeniorTeam() {
  const [cards, setCards] = useState<CardDef[]>(PANEL2_CARDS);
  const [copied, setCopied] = useState(false);

  function handleDragEnd(id: string, info: { offset: { x: number; y: number } }) {
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

  return (
    <>
      <div className="ft-tilted-grid" style={{ height: 560 }}>
        {cards.map((card, i) => {
          const wrapStyle: React.CSSProperties = DESIGN_MODE_TILTED
            ? { position: 'absolute', left: `${card.x}%`, top: `${card.y}%` }
            : { position: 'absolute', left: `${card.x}%`, top: `${card.y}%`, transform: `rotate(${card.rotate}deg)` };

          const inner = (
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
                <div style={{ position: 'absolute', bottom: 10, left: 8, right: 8 }}>
                  <Badge variant="accent">{card.tag}</Badge>
                </div>
              }
            />
          );

          if (!DESIGN_MODE_TILTED) {
            return (
              <motion.div
                key={card.id}
                style={wrapStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
              >
                {inner}
              </motion.div>
            );
          }

          return (
            <motion.div
              key={card.id}
              style={wrapStyle}
              drag
              dragMomentum={false}
              onDragEnd={(_, info) => handleDragEnd(card.id, info)}
              whileDrag={{ scale: 1.03, zIndex: 99 }}
            >
              {inner}
            </motion.div>
          );
        })}
      </div>

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
    </>
  );
}

/* ---------- 面板3："multiple departments" ---------- */

const PANEL3_CARDS: CardDef[] = [
  { id: 'd1', captionText: 'Workshop photo',          tag: '40-person workshop',          x: 5,  y: 8,  rotate: -3 },
  { id: 'd2', captionText: 'Workshop deck',           tag: '40-person workshop',          x: 36, y: 5,  rotate: 2  },
  { id: 'd3', captionText: 'Eng alignment deck',      tag: 'Aligned with 6 SDK engineers', x: 62, y: 10, rotate: -4 },
  { id: 'd4', captionText: 'Engineer feedback',       tag: 'Engineers shared pain points', x: 20, y: 50, rotate: 4  },
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

  function handleDragEnd(id: string, info: { offset: { x: number; y: number } }) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* 上方：照片卡片（同面板2逻辑，复用TiltedCard） */}
      <div className="ft-tilted-grid" style={{ height: 480 }}>
        {cards.map((card, i) => {
          const wrapStyle: React.CSSProperties = DESIGN_MODE_TILTED
            ? { position: 'absolute', left: `${card.x}%`, top: `${card.y}%` }
            : { position: 'absolute', left: `${card.x}%`, top: `${card.y}%`, transform: `rotate(${card.rotate}deg)` };

          return DESIGN_MODE_TILTED ? (
            <motion.div
              key={card.id}
              style={wrapStyle}
              drag
              dragMomentum={false}
              onDragEnd={(_, info) => handleDragEnd(card.id, info)}
              whileDrag={{ scale: 1.03, zIndex: 99 }}
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
                  <div style={{ position: 'absolute', bottom: 10, left: 8 }}>
                    <Badge variant="outline">{card.tag}</Badge>
                  </div>
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key={card.id}
              style={wrapStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
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
                  <div style={{ position: 'absolute', bottom: 10, left: 8 }}>
                    <Badge variant="outline">{card.tag}</Badge>
                  </div>
                }
              />
            </motion.div>
          );
        })}
      </div>

      {/* 下方：4条文字 tag 整齐列 */}
      <motion.div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2-5)', justifyContent: 'center', marginTop: 'var(--space-4)' }}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {DEPT_TAGS.map((tag) => (
          <motion.div
            key={tag}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            <Badge variant="outline">{tag}</Badge>
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
```

---

## 九、`QuoteHover.tsx`（核心外壳）

新建 `app/_story/components/s3/QuoteHover.tsx`：

```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel1Newcomer, Panel2SeniorTeam, Panel3Departments, Panel4Terrible } from './QuoteHoverPanels';

type PhraseKey = 'newcomer' | 'senior' | 'departments' | 'terrible';

const PANELS: Record<PhraseKey, React.ReactNode> = {
  newcomer:    <Panel1Newcomer />,
  senior:      <Panel2SeniorTeam />,
  departments: <Panel3Departments />,
  terrible:    <Panel4Terrible />,
};

export default function QuoteHover() {
  const [active, setActive] = useState<PhraseKey | null>(null);

  // hover 进入某词 → 激活；hover 离开不消失（保持 active），
  // 直到 hover 另一个词时切换。桌面端不需要"click to close"。
  function enter(key: PhraseKey) {
    setActive(key);
  }

  function makePhrase(
    id: PhraseKey,
    colorClass: '1' | '2' | '3' | '4',
    children: React.ReactNode,
  ) {
    return (
      <span
        className={`ft-phrase ft-phrase--${colorClass}${active === id ? ' ft-phrase--active' : ''}`}
        onMouseEnter={() => enter(id)}
        role="button"
        tabIndex={0}
        onFocus={() => enter(id)}
        aria-expanded={active === id}
      >
        {children}
      </span>
    );
  }

  return (
    <div className="ft-quote-root">
      {/* ---- 引用文字（framer-motion layout 自动处理缩放位移） ---- */}
      <motion.blockquote
        layout
        className={`ft-quote${active ? ' ft-quote--condensed' : ''}`}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        &ldquo;We just put{' '}
        {makePhrase('newcomer', '1', 'a newcomer')}{' '}
        in charge, leading{' '}
        {makePhrase('senior', '2', 'a team of senior people')}
        , across{' '}
        {makePhrase('departments', '3', 'multiple departments')}
        . Honestly? It sounded like{' '}
        {makePhrase('terrible', '4', 'a terrible idea')}
        .&rdquo;
      </motion.blockquote>

      {/* ---- 面板区域 ---- */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            className="ft-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          >
            {PANELS[active]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- 面板未激活时的引导提示 ---- */}
      <AnimatePresence>
        {!active && (
          <motion.p
            className="ft-lead"
            style={{ marginTop: 'var(--space-5)', opacity: 0.45, pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Hover any highlighted phrase to expand.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 十、`page.tsx` 新增内容

在现有 `app/page.tsx` 末尾（`</div></LenisProvider>` 之前），追加以下内容。

**新增 import（文件顶部）：**

```tsx
import QuoteHover from './_story/components/s3/QuoteHover';
import './_story/styles/for-teams.css';
```

**新增 section 块（追加到文件末尾，在 `</div></LenisProvider>` 之前）：**

```tsx
{/* ── S2 → S3 bridge ── */}
<section className="fb-bridge" aria-hidden={false}>
  <Reveal
    mode="words"
    effect="blur"
    trigger="once"
    duration={1}
    stagger={0.04}
    initialBlur={4}
    start="top 70%"
    className="fb-bridge__copy"
  >
    Experiments need one hypothesis. Teams need one direction.
  </Reveal>
</section>

{/* ── S3 eyebrow ── */}
<section
  className="ft-section"
  style={{ minHeight: 'unset', paddingBottom: 'var(--vspace-sm)' }}
>
  <Reveal
    mode="words"
    effect="blur"
    trigger="once"
    duration={0.9}
    stagger={0.03}
    start="top 75%"
    style={{
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--eyebrow-size)',
      fontWeight: 'var(--eyebrow-weight)',
      letterSpacing: 'var(--eyebrow-tracking)',
      textTransform: 'uppercase',
      color: 'var(--eyebrow-color)',
      textAlign: 'center',
    }}
  >
    I design for teams.
  </Reveal>
</section>

{/* ── S3 引出句 ── */}
<section
  className="ft-section"
  style={{ minHeight: 'unset', paddingBottom: 'var(--vspace-sm)' }}
>
  <Reveal
    mode="words"
    effect="blur"
    trigger="once"
    duration={1}
    stagger={0.04}
    initialBlur={5}
    start="top 72%"
    className="ft-lead"
  >
    My manager said this when he put me in charge of the design system:
  </Reveal>
</section>

{/* ── S3 QuoteHover ── */}
<section className="ft-section">
  <div className="ft-section__inner">
    <QuoteHover />

    <div className="ft-footer">
      MIUI Design System 2.0 · 2023
    </div>
  </div>
</section>
```

---

## 十一、执行顺序

按以下顺序执行，每步完成后在浏览器预览验证，再进入下一步：

```
1. tokens.css                       — 追加 lavender/sage primitive + semantic token
2. for-teams.css                    — 新建，完整内容如上
3. ScatterTag.tsx                   — 新建（散落 tag 原子组件）
4. TiltedCard.tsx + TiltedCard.css  — 新建
5. Masonry.tsx + Masonry.css        — 新建
6. ScatteredTags.tsx                — 新建（使用 ScatterTag）
7. QuoteHoverPanels.tsx             — 新建
8. QuoteHover.tsx                   — 新建
9. page.tsx                         — 追加 import + section 块
10. pnpm run dev → 验证 / 和 /projects/lockscreen 均正常渲染，console 0 error
11. git commit（不 push）
```

**拖拽调试流程（步骤9之后）：**
```
1. 在 .env.local 加 NEXT_PUBLIC_TAGS_DRAG=1
2. pnpm run dev，打开 /，hover "a newcomer" 进入面板1
3. 拖拽各 tag 到满意位置
4. 点击右下角 "Copy positions"，粘贴到 ScatteredTags.tsx 的 INITIAL_TAGS 数组
5. 同理操作面板2/3（hover "a team of senior people" / "multiple departments"）
6. 调整完毕后 .env.local 里删除 NEXT_PUBLIC_TAGS_DRAG=1 或改为 0
7. 再次验证页面，git commit
```

---

## 十二、已知占位待替换

| 位置 | 当前状态 | 需要 |
|------|---------|------|
| 面板1 ScatteredTags | tag 坐标是估值 | 拖拽调试后换成实际值 |
| 面板2 TiltedCard | `imageSrc` 未传，显示灰色占位 | 提供 5 张截图后填入 `imageSrc` |
| 面板3 TiltedCard | 同上 | 提供 4 张照片/截图 |
| 面板4 Masonry | `img` 未传，显示灰色占位 | 提供 4 张成果截图 |
| `ft-footer` | 只有文字，无链接 | 项目链接确定后加 `href` |

---

## 十三、注意事项

- **动画栈合规：** QuoteHover 全部是 hover/state 驱动，framer-motion OK。
  Masonry 入场用 GSAP，OK（scroll 以外的 GSAP 也不违规）。
- **Lockscreen 隔离：** 本次新增内容不引用任何 `app/components/` 或 `app/globals.css` 里的东西。
- **`motion/react` → `framer-motion`：** TiltedCard 原始源码用的是 `motion/react`，
  本计划已统一改为 `framer-motion`（项目已安装）。
- **`Badge` 路径：** `import { Badge } from '../../_lab/ui/badge'` —
  相对路径从 `app/_story/components/s3/` 出发往上两级。
