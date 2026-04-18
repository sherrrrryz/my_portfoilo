# Scroll Patterns

/flashlight 这一轮迭代攒下的 scroll 动效、官方接口对照、未来 recipe、已踩过的坑。新 section 写之前先扫一遍这份。

参考设计路子：[directionless.webflow.io](https://directionless.webflow.io)（连续叙事 + 分层渐进 reveal，不做 snap）。

---

## 1. 技术栈与原则

| 层 | 库 | 版本 | 职责 |
|---|---|---|---|
| 平滑滚动 | [Lenis](https://github.com/darkroomengineering/lenis) | 1.3.x | 接管 wheel / touch，在 rAF 里驱动滚动动画 |
| 滚动触发 | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | 3.x | 按 scroll 位置触发 tween / timeline |
| 滚动吸附（可选）| [`lenis/snap`](https://github.com/darkroomengineering/lenis/tree/main/packages/snap) | 随 Lenis 一起 | section-level snap |
| 字符动画 | 纯 GSAP stagger | | 不用 SplitText plugin（没买），自己 split DOM |

**原则**

- 单栈。不引入 framer-motion / motion one / locomotive-scroll，避免双重 rAF / 双重滚动劫持。
- Lenis 在 rAF 里自己跑，不绑 `gsap.ticker`（gsap ticker 在没有活跃 tween 时会休眠，会把 Lenis 饿死）。参见 [LenisContext.tsx](../app/_story/lib/LenisContext.tsx)。
- 所有 ScrollTrigger 通过 `lenis.on('scroll', ScrollTrigger.update)` 和 Lenis 同步。
- 默认**连续叙事**，不做全屏 snap。snap 只在整屏幻灯片场景才考虑。

---

## 2. 现有组件速查

| 组件 | 文件 | 用途 | 触发模式 | 属于 |
|---|---|---|---|---|
| `LenisProvider` + `useLenis()` | [LenisContext.tsx](../app/_story/lib/LenisContext.tsx) | 全站平滑滚动 + context 暴露 Lenis 实例 | rAF 持续 | Lenis 官方 pattern + React Context |
| `useMotion()` | [useMotion.ts](../app/_story/lib/useMotion.ts) | 读 `prefers-reduced-motion`，返回 `'full' \| 'reduced'` | matchMedia | 自写 hook |
| `.gpu` / `GPU` | [gpu.ts](../app/_story/lib/gpu.ts) + [flashlight.css](../app/_story/styles/flashlight.css) | 促使重变换元素上独立合成层，修 iOS/Safari scrub 卡顿 | CSS class | 自写 helper |
| `ScrollFloat` | [ScrollFloat.tsx](../app/_story/components/ScrollFloat.tsx) | 逐字入场（两种模式）| scrub / toggleActions | GSAP 官方 API |
| `ScrollReveal` | [ScrollReveal.tsx](../app/_story/components/ScrollReveal.tsx) | 逐词 rotate + opacity + blur | 三个 scrub tween | GSAP 官方，**拆三份是自写决定** |
| `LockscreenPile` | [LockscreenPile.tsx](../app/_story/components/LockscreenPile.tsx) | 图片堆一次性 stagger reveal | `once: true` | GSAP 官方 |
| `ScrollSnap` | [ScrollSnap.tsx](../app/_story/components/ScrollSnap.tsx) | section-level 吸附（当前未挂载）| `lenis/snap` proximity | 官方库 |
| `FlowingRows` | [FlowingRows.tsx](../app/_story/components/FlowingRows.tsx) | 水平 marquee | CSS keyframes | 纯 CSS |
| `PortfolioScene` | [PortfolioScene.tsx](../app/_story/components/PortfolioScene.tsx) | 鼠标 flashlight mask | rAF + mouse 事件 | 全自写（无库可替）|

自写判定：

- **LenisProvider 的 rAF 自驱动**：官方推荐，算不上"自写"。
- **ScrollReveal 的三份 tween**：可以合成一个 `gsap.timeline`，当前是自写选择。见 §6 recipe。
- **LockscreenPile 的 sort-by-visual-top**：官方没有"按视觉位置 stagger"的 primitive，自写是正确的。
- **PortfolioScene 的 mask + 光源颜色插值**：无库可替，全自写正确。

---

## 3. ScrollTrigger 三种模式

**A. scrub — 随滚动进度同步**

```ts
gsap.fromTo(el, { opacity: 0 }, {
  opacity: 1,
  scrollTrigger: {
    trigger: el,
    start: 'top 80%',
    end: 'bottom 60%',
    scrub: true,        // or scrub: 0.5 (0.5s 跟手延迟)
  },
});
```

用于"边滚边变"，比如 ScrollFloat 的字漂浮、ScrollReveal 的逐词解模糊。用户反滚会倒放。

**B. toggleActions — 分别响应入场 / 离场 / 回入 / 回离**

```ts
scrollTrigger: {
  trigger: el,
  start: 'top 80%',
  toggleActions: 'play pause resume reset',
  // 四个槽位：onEnter | onLeave | onEnterBack | onLeaveBack
}
```

用于细粒度控制。比如 video 进入播放、离开暂停、回来继续。

**C. once — 一次入场，播完销毁**

```ts
scrollTrigger: {
  trigger: el,
  start: 'top 85%',
  once: true,
}
```

用于"只想看一次"的 reveal。最稳，不怕 refresh 或其他 trigger 干扰。LockscreenPile 用的就是这个。

**选型决策树**

```
要边滚边变吗？     → 是 → scrub
              否 ↓
元素离开后会回来吗？  → 是（且要重播）→ toggleActions 'play none play none'
              否 ↓
只播一次？       → 是 → once
```

---

## 4. Snap 三种类型（`lenis/snap`）

| type | 行为 | 适用 | 已验证坑 |
|---|---|---|---|
| `proximity`（默认）| 停下后离最近 snap 点 < threshold 才吸附 | 宽松的 section snap | 有 Lenis 惯性会冲过头再弹回，视觉上"回弹"。可通过减小 Lenis `duration` 或缩小 `distanceThreshold` 缓解 |
| `mandatory` | 任何停顿都吸到最近点（threshold = ∞）| 全屏 slideshow、无自由滚区域 | 没 snap 点的"自由滚区"会被错误吸走 |
| `lock` | wheel 一次跳到下一个点，不允许停中间 | 纯幻灯片 | 自由滚区间彻底不可用 |

**用法**

```ts
import Snap from 'lenis/snap';

const snap = new Snap(lenis, {
  type: 'proximity',
  distanceThreshold: '55%',   // 相对视口高度
  debounce: 140,              // ms，停止滚动后等多久吸附
  duration: 0.9,              // 吸附 tween 时长（秒）
  easing: t => 1 - Math.pow(1 - t, 3),
});

snap.addElement(el, { align: 'start' | 'center' | 'end' });
// 返回一个 remove() 函数用于清理
```

**选型决策**

```
有"自由滚"区域（比如长 pile、可交互列表）？ → 不用 snap
全屏幻灯片？                         → mandatory 或 lock
宽松锚点（停在附近就吸）？              → proximity
```

当前 /flashlight 页因为 pile 段要自由滚，**三种都不理想**，因此 snap 目前未挂载。如果未来 Overview / Projects 页是整屏叙事，可以考虑。

---

## 5. 重复的"自写"片段（共享 hook 候选）

有一段代码在 4 个文件里拷了 4 次，将来可抽共享 hook，当前不改：

```ts
// 等字体加载完（文本宽度稳定）+ 延迟一小段时间（让 layout / pin-spacer / Lenis 就位）
// 然后触发 ScrollTrigger.refresh()
document.fonts.ready.then(setup);
setTimeout(() => ScrollTrigger.refresh(), 200);
```

出现位置：

- [ScrollFloat.tsx:90-98](../app/flashlight/components/ScrollFloat.tsx)
- [ScrollSnap.tsx:51-58](../app/flashlight/components/ScrollSnap.tsx)
- [PillNav.tsx:110-112](../app/flashlight/components/PillNav.tsx)（只等字体，不 refresh）
- LockscreenPile 原本有，切到 `once: true` 时删掉了

**未来共享 hook 签名**（不在本轮做）：

```ts
useScrollReadyRefresh(setup: () => void, options?: { delay?: number }): void
```

做的事：等 `document.fonts.ready`，跑 `setup`，`options.delay` 毫秒后调 `ScrollTrigger.refresh()`。返回 cleanup。

---

## 6. 未来 Recipe

### 6.1 入场淡入 + 轻位移（最常用）

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FadeUpOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tween = gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);
  return <div ref={ref}>{children}</div>;
}
```

适用：section 标题、段落、卡片入场。避坑：`once: true` 不要配 `scrub`，冲突。

### 6.2 逐词滑入（参数化 ScrollReveal）

直接用现成的 `<ScrollReveal baseOpacity={0.1} baseRotation={2} blurStrength={4}>...</ScrollReveal>`，见 [ScrollReveal.tsx](../app/flashlight/components/ScrollReveal.tsx)。参数语义：

- `baseOpacity` 初始透明度（0.05 很隐 / 0.3 较快可读）
- `baseRotation` 初始倾斜角度（度）
- `blurStrength` 初始模糊像素数
- `rotationEnd` / `wordAnimationEnd` 控制 trigger end 位置

### 6.3 分层 parallax

```ts
gsap.to('.parallax-slow', {
  y: (i, el) => -parseFloat(el.dataset.speed ?? '100'),
  ease: 'none',
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});
```

DOM 里给每层加 `data-speed="50"`（快层）、`data-speed="200"`（慢层）。避坑：`ease: 'none'` 必须，不然 scrub 抖。

### 6.4 pin + 背景色切换

```ts
gsap.to('body', {
  backgroundColor: '#0a0a0a',
  ease: 'none',
  scrollTrigger: {
    trigger: el,
    start: 'top top',
    end: '+=100%',
    scrub: true,
    pin: true,
  },
});
```

适用：长 section 背景从浅到深过渡，比如叙事高潮。避坑：`pin: true` 会创建 pin-spacer，影响下方 trigger 的 Y 坐标。测完先调 `ScrollTrigger.refresh()`。

### 6.5 grid 图片 stagger reveal（参考 LockscreenPile）

技巧：先按 DOM 收集 items，再用 `getBoundingClientRect().top` 排序，GSAP stagger 就按视觉顺序（而非 DOM 顺序）来。

```ts
const items = Array.from(wrap.querySelectorAll<HTMLElement>('.item')).sort(
  (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
);

gsap.fromTo(items,
  { y: 120, opacity: 0, filter: 'blur(6px)' },
  {
    y: 0, opacity: 1, filter: 'blur(0px)',
    duration: 1.4,
    stagger: 0.18,
    scrollTrigger: { trigger: wrap, start: 'top 85%', once: true },
  }
);
```

### 6.6 水平横滚段落（GSAP 官方 horizontal scroll）

```ts
const tracks = gsap.utils.toArray<HTMLElement>('.h-panel');
gsap.to(tracks, {
  xPercent: -100 * (tracks.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-container',
    pin: true,
    scrub: 1,
    snap: 1 / (tracks.length - 1),
    end: () => '+=' + document.querySelector('.h-container')!.scrollWidth,
  },
});
```

适用：图片画廊、项目列表。避坑：`end` 必须是函数，不然 resize 时算错。

### 6.7 合并 ScrollReveal 三 tween 为单 timeline（重构样板）

当前 [ScrollReveal.tsx:55-108](../app/flashlight/components/ScrollReveal.tsx) 是三个独立 tween。如果将来合并：

```ts
const tl = gsap.timeline({
  scrollTrigger: { trigger: el, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
});
tl.fromTo(el, { rotate: baseRotation }, { rotate: 0 }, 0);
tl.fromTo(words, { opacity: baseOpacity }, { opacity: 1, stagger: 0.05 }, 0);
tl.fromTo(words, { filter: `blur(${blurStrength}px)` }, { filter: 'blur(0px)', stagger: 0.05 }, 0);
return () => { tl.scrollTrigger?.kill(); tl.kill(); };
```

优势：一个 ScrollTrigger 而非 3 个、cleanup 只 kill 一份、三段 tween 强保证同步。

---

## 7. 已踩过的坑

| 坑 | 症状 | 正解 |
|---|---|---|
| `ScrollTrigger.getAll().forEach(t => t.kill())` 放 cleanup | 杀掉别的组件的 trigger，图片 pile 永不入场 | 每个 tween 留引用，`return () => { tween.scrollTrigger?.kill(); tween.kill(); }` |
| `invalidateOnRefresh: true` + `toggleActions` | 别的 ScrollTrigger 触发 refresh 时可能重播已播的动画 | 改成 `once: true` 或去掉 invalidateOnRefresh |
| `window.scrollTo(y)` 没有 Lenis 平滑 | 瞬移而非滑动 | 用 `lenis.scrollTo(y, { duration, easing })`，新代码用 `useLenis()` 拿实例（见 [LenisContext.tsx](../app/_story/lib/LenisContext.tsx)）。`window.__lenis` 仍保留做 back-compat，**已弃用，新代码不要再写 `window.__lenis`** |
| 不读 `prefers-reduced-motion` 就上动画 | 有运动敏感症的用户看到 scrub / parallax 会眩晕。skill 里 HIGH severity a11y 项 | 任何新动画前先调 `useMotion()`；`reduced` 时：取消 stagger、停用 transform、改成 ≤ 0.2s opacity-only fade（见 [useMotion.ts](../app/_story/lib/useMotion.ts)）|
| `lenis/snap` 不响应 programmatic scroll | 自动测试时 snap 不吸附 | snap 只听 `virtualScroll`（真实 wheel / touch）。测试用 `window.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }))` 模拟 |
| 字体加载前算 ScrollTrigger 位置 | start / end 偏移，最后一句永远不 reveal | 包一层 `document.fonts.ready.then(setup)`，见 §5 |
| `scrub` + `toggleActions` 同时配 | 行为冲突，scrub 优先 | 选一个。要一次性 reveal 用 `once: true` |
| `stagger.from: 'center'` 带 `amount` | 看起来像"中间先出来"但分布是 bell 曲线，两端很晚才动 | 改用 `stagger: 0.1` 数字 + 预先 sort items（见 §6.5） |
| Lenis `duration: 1.1` 太长 | 用户滚到 snap 点附近冲过头，再弹回 | Lenis duration 调到 0.8，或换 `type: 'mandatory'`（若无自由滚段） |

---

## 8. 何时考虑引入新库

目前栈够用。只有这些场景才值得多引一个库：

- **需要 SplitText 能力且准备付费**：GSAP Club 的 SplitText 比自写稳（会处理行包裹、RTL）。当前自写够 90% 场景。
- **需要 3D / WebGL + scroll**：Three.js + Lenis（Lenis 有 WebGL example），场景够复杂才值得。
- **需要声明式 React 动效**：Framer Motion 的 `whileInView` 更贴 React 心智，但会引入第二套 rAF。只在整站重写时考虑。

不要为一个效果引入整个库，先看 §6 recipe 能不能拼出来。

---

**维护**：新 section 写完后，补充到 §2 速查表；踩到新坑记进 §7；发现重复 pattern 第三次时，抽 §5 里的 hook 并升级到 §6 recipe。
