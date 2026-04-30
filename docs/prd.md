# Portfolio Website PRD — Complete Story Page

## 文档信息

| 项目 | Sherry Zhou 个人作品集网站 |
|------|--------------------------|
| 网址 | xueyizhou.xyz |
| 技术栈 | Next.js 15 + React 19 + Tailwind v4 + GSAP ScrollTrigger + Lenis |
| 本文档范围 | 网站整体架构 + Story 页完整内容（Opening + Section 1–5 + Closing） |
| 最后更新 | 2026-04-30 |
| 最近一次大改 | 2026-04-30：**所有过渡句删除（与 §2.3 一致）**——4 条段间过渡（S1→S2 "At Xiaomi..." / S2→S3 "Experiments need..." / S3 内部 "Building a team..." / S3→S4 兼 S5 主题 "Curiosity doesn't stop..."）从 §10 文案表 + §4.4 / §6.3 / §6.5 / §8.1 描述全部清空；S1 §4.3–§4.5 重写为**三组共享 "It means" 锚点 + 卡片堆叠 + 项目链接随锚点 crossfade**；§2.4 S2 主题色由暖深棕改为冷调深蓝灰 `#454F68`；§2.4 intro / 注同步落地状态；§11 待办新增 3 项（S1 unified §4.3 实现 · `var(--theme-*)` consumer 迁移 · Themes tab v2）。 |
| 上一次大改 | 2026-04-29：节奏重构（PRD 第一轮）。提出删除段落间过渡句和 "I design for X" eyebrow 的方向（4-30 完成清理）；nav 上移承担段落导航；6 套主题色板提案首次进 §2.4；保留 MIUI / Lockscreen / 投票交互等已实现内容。 |
| 关于落地 | 本表只追踪 **PRD 文档**的改动；代码落地状态见 [site-status.md](./site-status.md)。 |

---

## 实现现状

代码层落地状态归 [site-status.md](./site-status.md)。本 PRD 描述目标状态。

---

## 一、网站整体架构

### 1.1 三页结构

| 页面 | 导航标签 | 定位 | 目标用户 |
|------|---------|------|---------|
| 长滚动叙事页 | Story | 默认首页。电影式长滚动叙事，展示多面性 | 设计师、设计经理 |
| 简洁总览页 | Overview | 电梯演讲。30秒扫完的简历式呈现 | HR、招聘经理 |
| 项目库 | Projects | 标准作品集。项目卡片网格+筛选+详情页 | 所有人（深入查看） |

### 1.2 导航栏

全站使用同一个 `StoryNav` 组件，桌面端 + 移动端两套布局，按当前路由切换 variant：

- **Story 页 (`/`)** 用 `variant="story"`：左侧 wordmark `I DESIGN FOR ▼` + 右侧 5 个段落 button（渐进揭示 + flip-card）
- **其他页（Overview / Projects / 详情页）** 用 `variant="compact"`：只渲染左侧 wordmark + dropdown，右侧段落 button **直接隐藏**
- 左侧 wordmark hover/focus 展开 dropdown menu，含 `Overview` 和 `Projects` 两条跨页链接（用 shadcn `DropdownMenu`）

完整 nav 设计见 §二 Story 页整体设计语言。

### 1.3 页面间关系

- Story 页是默认首页（输入域名直接进入）
- Story 页每个项目底部有淡字链接 → 跳转到 Projects 页的对应 case study 详情页
- Overview 页底部有 "Want the full story?" → 链接到 Story 页
- Overview 页底部有 "See my work" → 链接到 Projects 页
- Projects 页每张卡片 → 点击进入独立 case study 详情页（与 Story 页共享同一详情页）

---

## 二、Story 页整体设计语言

### 2.1 视觉基底 — 6 套主题色板按段落切换

每个段落不再用同一个浅色底，而是各自对应一套**主题色板**。从 Opening 到 Closing 一路过渡，整体走"从冷神秘到暖个人"的明度渐变。

| # | 段落 | 背景 hex | OKLCH ~ | 文字 | 情绪 |
|---|---|---|---|---|---|
| 01 | S0 Opening | `#000000` | `oklch(0% 0 0)` | 白 | flashlight，纯黑 |
| 02 | S1 Millions | `#222222` | `oklch(15% 0 0)` | 白 | 深炭灰，克制专业 |
| 03 | S2 Business | `#454F68` | `oklch(36% 0.044 261)` | 白 | 冷调深蓝灰，稳重克制 |
| 04 | S3 Teams | `#92A761` | `oklch(67% 0.085 125)` | 白 | 橄榄绿，协作温度 |
| 05 | S4 Evidence | `#EDE9DE` | `oklch(92% 0.013 85)` | 黑 | 暖米白，研究留白 |
| 06 | S5 Curiosity | `#FFFFFF` | `oklch(100% 0 0)` | 黑 | 纯白，干净 |

S6 Closing 不独立配色，继承 S5 的纯白底。

**文字色翻转点在 S3 → S4 之间**（不是 S2→S3）。S0/S1/S2/S3 全是深底白字，到 S4 才翻成浅底黑字。S3 `#92A761` 明度 67% 偏亮但仍用白字——这是设计选择，绿底白字有清爽感。

每套主题不只是一个背景色，而是一组 10 个 token：

| 角色 | Token | 数量 | 用途 |
|---|---|---|---|
| 文字 | `text-1` / `text-2` / `text-3` | 3 | 主标题 / 正文 / 弱化 |
| 背板 | `surface-1` / `surface-2` | 2 | 段落底色 / 卡片或抬升层 |
| 高亮 | `accent-1` / `accent-2` | 2 | 主强调 / 次强调 |
| 按钮 | `btn-1` / `btn-2` / `btn-3` | 3 | 默认 / hover / 按下 |

**6 套主题 × 10 token = 60 个 token**，落在 `app/_styles/tokens.css` 的 `[data-theme="<name>"]` 各 block 里。`/lab/ds` 加一个 Themes tab 用来直观对比 6 套主题的所有 specimen（色卡、文字、卡片、按钮、高亮）。

具体 token 取值见 §2.4。

### 2.2 顶部 nav 系统

#### 视觉结构（桌面端）

```
[I DESIGN FOR ▼]            [Millions]  [Business]  [Teams]  [Evidence]  [Curiosity]
←—— hover 展开 dropdown ——→  ←——— 5 个 button，根据滚动状态变化 ———→
   (Overview / Projects)
```

#### 左侧 wordmark + dropdown

`I DESIGN FOR ▼` 是一个 wordmark，hover 或键盘 focus 时展开一个 shadcn `DropdownMenu`，含两条跨页链接：

- Overview → `/overview`
- Projects → `/projects`

dropdown 视觉跟随当前段落主题色（消费 `var(--surface-2)` / `var(--text-1)`），所以在 S2 是深蓝灰底、在 S5 是白底，跟周围环境融合。

#### 右侧 5 个段落 button — 渐进揭示

每个 button 有 3 种状态：

| 状态 | 显示 | 触发条件 |
|---|---|---|
| `unrevealed` | `???` | 用户尚未滚到这个段落 |
| `revealed inactive` | 段落名（muted） | 曾滚过，但当前不在 |
| `revealed active` | 段落名（高亮 + 下划线） | 当前在这个段落 |

**单向状态**：一旦 revealed 永不退回 `???`。

#### 翻转动画

每个 button 是一个 3D flipper：front face 显示 `???`，back face 显示段落名，rotateX(180deg) 翻转切换。0.7s `cubic-bezier(0.65, 0, 0.35, 1)`。

#### 点击行为

点击任一 button → smooth scroll 到对应段落（`scrollIntoView({ behavior: 'smooth', block: 'start' }`）。点击同时把该 button 标记为 revealed（"提前点过来"也算 revealed）。

#### nav 颜色随主题切换

nav 自身的前景 / 背板用 `var(--text-1)` / `var(--surface-1)`，主题切换时 nav 自动跟上。**不需要单独维护 dark/light class**。

#### 移动端布局（< 768px）

桌面端两侧布局在移动端不可行。改成单行紧凑模式：

```
[I DESIGN FOR  Millions ▾]
←————— 整条可点 —————→
```

- **唯一可见内容**：`I DESIGN FOR` + 当前 active 段落名
- 当前 active 段落名随滚动实时更新——用户滚到哪儿，nav 写到哪儿
- 整条 tap 展开一个 shadcn `Sheet` panel，里面列：
  - 5 个段落（每个显示状态：revealed inactive / revealed active / unrevealed `???`），tap 跳转 + 关闭 panel
  - 分隔线
  - Overview / Projects 跨页链接
- panel 关闭：tap panel 外部 / 滑动关闭 / tap 当前 active 段落

#### 非 Story 页的处理

非 Story 页（`/overview`、`/projects`、详情页）使用 `variant="compact"`：**只渲染左侧 wordmark + dropdown，右侧 5 个段落 button 直接不渲染**。这样保留同一个组件、同一份样式，只切右侧内容。

### 2.3 段落间过渡机制

**不再使用过渡句**。原 PRD 里的 3 条 fb-bridge 全删除（`At Xiaomi, I designed for scale...` / `Experiments need one hypothesis...` / `Building a team was one thing...`）。段落与段落之间靠**主题色平滑切换 + 段落起始的视觉对比**自然分隔。

#### 切换时机（精确定义）

**在一个段落的最后一屏滑走小一半的时候开始变色**。

- 用户正在浏览 sectionN，sectionN 内容 N 个 vh-screens 长
- 当 sectionN 的最后一屏（最底部 1vh）已经向上滑出视口约 40–50% 时
- 触发 `body.dataset.theme` 从 `sectionN` 切到 `sectionN+1`
- CSS 的 0.4s transition 接管，颜色在接下来 0.4s 内从 N 色平滑过渡到 N+1 色
- 视觉感受：在还能看到 sectionN 末尾内容时，背景已经悄悄向新色过渡；等 sectionN+1 完全进入视口时颜色刚好换完

#### 实现（方案 A：硬切 + CSS transition）

每个段落标 `data-section="<name>"`，`<body>` 上挂 `data-theme`，初值 `opening`。每段一个 GSAP ScrollTrigger（`start: 'bottom 55%'`，`onEnter` 切到下一个主题、`onLeaveBack` 回退）。CSS 端：每段 `background-color: 0.4s ease` transition，token 在 `[data-theme="X"]` block 内（已落地，详见 §2.4 + tokens.css LAYER 2.5）。

#### 跨多 sub-section 的处理

S1（Millions）由 3 个独立 `<section>` 组成（Lockscreen / MIUI / Foldable），都属于 `millions` 主题。**ScrollTrigger 只挂在 S1 最后一个 sub-section（Foldable）的 `bottom 55%`**——中间的 sub-section 不触发主题切换。也就是说，从 Lockscreen → MIUI → Foldable 整段都是 `millions` 主题；只有 Foldable 的最后一屏滑走 45% 时才切到 `business`。

S2、S3 同理：

| 段落 | 触发器挂在 | 切换到 |
|---|---|---|
| S0 Opening | `[data-section="opening"]` | millions |
| S1 Millions | Foldable 子 section（最后一个） | business |
| S2 Business | `section-business-data-flip`（最后一个 fb-section） | teams |
| S3 Teams | WorkshopWall 子 section（最后一个） | evidence |
| S4 Evidence | `[data-section="evidence"]` | curiosity |
| S5 Curiosity | （末段，无下一段） | — |

#### 备用方案（B）

如果硬切看起来太突兀，升级为方案 B：在 LenisContext 里加 listener，把 lenis 的 scroll 进度映射到 0–1，每帧 set 60 个 CSS variables 实现真正的连续插值。性能成本较高，方案 A 看了效果再决定是否升级。

### 2.4 主题 token 提案（OKLCH 取值）

每套主题的 10 个 token 都从该主题的色系基调（hue + tone）派生，确保视觉上是"一家人"。下面是每套主题的 OKLCH 数值（已落地到 `app/_styles/tokens.css` LAYER 2.5 + `[data-theme="..."]` 6 个 block，可在 `/lab/ds` → `09 · Themes` 查看 + Apply globally；交互式 live-edit 色板在 v2 接入，现阶段调整需直接改 tokens.css 后回到 lab 看效果）。

**S0 Opening** — 色系基调：纯黑中性

| Token | OKLCH | hex |
|---|---|---|
| surface-1 | `oklch(0% 0 0)` | `#000000` |
| surface-2 | `oklch(12% 0 0)` | `#1f1f1f` |
| text-1 | `oklch(98% 0 0)` | `#fafafa` |
| text-2 | `oklch(78% 0 0)` | `#c2c2c2` |
| text-3 | `oklch(50% 0 0)` | `#777777` |
| accent-1 | `oklch(80% 0.13 75)` | `#ffd27a`（手电筒暖光延续） |
| accent-2 | `oklch(70% 0.09 75)` | `#d4a55c` |
| btn-1 | `oklch(20% 0 0)` | `#2e2e2e` |
| btn-2 | `oklch(28% 0 0)` | `#404040` |
| btn-3 | `oklch(15% 0 0)` | `#262626` |

**S1 Millions** — 色系基调：深炭灰中性

| Token | OKLCH | hex |
|---|---|---|
| surface-1 | `oklch(15% 0 0)` | `#222222` |
| surface-2 | `oklch(22% 0 0)` | `#363636` |
| text-1 | `oklch(98% 0 0)` | `#fafafa` |
| text-2 | `oklch(75% 0 0)` | `#bababa` |
| text-3 | `oklch(50% 0 0)` | `#777777` |
| accent-1 | `oklch(75% 0.04 80)` | `#c5b9a3`（暖中性，柔和强调） |
| accent-2 | `oklch(60% 0.04 80)` | `#988a73` |
| btn-1 | `oklch(28% 0 0)` | `#404040` |
| btn-2 | `oklch(38% 0 0)` | `#5a5a5a` |
| btn-3 | `oklch(22% 0 0)` | `#363636` |

**S2 Business** — 色系基调：冷调深蓝灰（hue ~261）

| Token | OKLCH | hex |
|---|---|---|
| surface-1 | `oklch(36% 0.044 261)` | `#454F68` |
| surface-2 | `oklch(43% 0.044 261)` | `#555F79`（略提亮） |
| text-1 | `oklch(98% 0 0)` | `#fafafa` |
| text-2 | `oklch(78% 0.02 261)` | `#b7bcc8` |
| text-3 | `oklch(58% 0.02 261)` | `#818691` |
| accent-1 | `oklch(72% 0.13 50)` | `#d6a06a`（暖琥珀橙，与冷蓝灰底形成冷暖互补） |
| accent-2 | `oklch(55% 0.1 50)` | `#a07849` |
| btn-1 | `oklch(40% 0.044 261)` | `#4f5974` |
| btn-2 | `oklch(48% 0.044 261)` | `#606a85` |
| btn-3 | `oklch(28% 0.044 261)` | `#353e54` |

**S3 Teams** — 色系基调：橄榄绿（hue ~125）

| Token | OKLCH | hex |
|---|---|---|
| surface-1 | `oklch(67% 0.085 125)` | `#92A761` |
| surface-2 | `oklch(58% 0.085 125)` | `#7a8e4f`（略压暗） |
| text-1 | `oklch(98% 0 0)` | `#fafafa` |
| text-2 | `oklch(85% 0.02 125)` | `#d8dcc8` |
| text-3 | `oklch(70% 0.02 125)` | `#a8b196` |
| accent-1 | `oklch(95% 0.05 95)` | `#f4e9b8`（米黄高亮，与绿对比） |
| accent-2 | `oklch(85% 0.06 95)` | `#d6c890` |
| btn-1 | `oklch(58% 0.085 125)` | `#7a8e4f` |
| btn-2 | `oklch(50% 0.085 125)` | `#677944` |
| btn-3 | `oklch(45% 0.085 125)` | `#586a3a` |

**S4 Evidence** — 色系基调：暖米白（hue ~85）

| Token | OKLCH | hex |
|---|---|---|
| surface-1 | `oklch(92% 0.013 85)` | `#EDE9DE` |
| surface-2 | `oklch(96% 0.008 85)` | `#f6f3eb`（略提亮，卡片层） |
| text-1 | `oklch(20% 0.01 85)` | `#332e22` |
| text-2 | `oklch(40% 0.01 85)` | `#615b4d` |
| text-3 | `oklch(60% 0.01 85)` | `#928b7c` |
| accent-1 | `oklch(55% 0.15 30)` | `#c46b4d`（铁锈橙，研究感强调） |
| accent-2 | `oklch(45% 0.12 30)` | `#9c5238` |
| btn-1 | `oklch(85% 0.013 85)` | `#d4d0c5` |
| btn-2 | `oklch(78% 0.013 85)` | `#beb9ac` |
| btn-3 | `oklch(70% 0.013 85)` | `#a39e91` |

**S5 Curiosity** — 色系基调：纯白中性

| Token | OKLCH | hex |
|---|---|---|
| surface-1 | `oklch(100% 0 0)` | `#FFFFFF` |
| surface-2 | `oklch(96% 0 0)` | `#f4f4f4` |
| text-1 | `oklch(15% 0 0)` | `#1f1f1f` |
| text-2 | `oklch(40% 0 0)` | `#5c5c5c` |
| text-3 | `oklch(65% 0 0)` | `#9c9c9c` |
| accent-1 | `oklch(60% 0.18 25)` | `#d96846`（暖橙，活力） |
| accent-2 | `oklch(50% 0.15 25)` | `#a84d2f` |
| btn-1 | `oklch(95% 0 0)` | `#f0f0f0` |
| btn-2 | `oklch(88% 0 0)` | `#dadada` |
| btn-3 | `oklch(80% 0 0)` | `#bfbfbf` |

**注**：所有 accent / btn 取值是初始提案，会在 lab 里 preview 后逐步定稿（v1 view-only，v2 加 per-swatch live-edit）。这一节的取值表跟 `tokens.css` 里的 `[data-theme="..."]` block 当前**完全同步**——以 tokens.css 为准（Layer 2.5），PRD 这张表是设计意图记录 + 数值复制源。改一处时两处都要改，避免漂移。

### 2.5 Story 页完整 Section 列表

| # | 段落 | 主题 | 节奏 | 长度估算 |
|---|---|---|---|---|
| 0 | Opening（首屏） | opening（黑） | 探索 | 1 vh |
| 1 | Millions（设计师 / 三个项目） | millions（深炭灰） | 紧凑/密集 | ~5 vh |
| 2 | Business（商业） | business（冷调深蓝灰） | 短而有力 | ~3 vh |
| 3 | Teams（团队/协作） | teams（橄榄绿） | 松弛/呼吸 | ~3 vh |
| 4 | Evidence（研究） | evidence（暖米白） | 轻快 | ~1.5 vh |
| 5 | Curiosity（个人 + 生活） | curiosity（纯白） | 自由/松散 | ~2 vh |
| 6 | Closing | curiosity（继承） | 极简 | < 0.5 vh（不开 100vh section） |

整页目标长度 ~11–13 vh-screens（含主题切换过渡区）。

### 2.6 鼠标叙事系统

每个段落有自己的鼠标语义，跟主题色板一起承担"段落质感"的差异。这是已实现的系统，本次重构保留。

| 段落 | 鼠标 / 光标 | 来源 / 实现 | 用户关系 |
|---|---|---|---|
| S0 Opening | 手电筒（柔光圆圈跟随鼠标） | `PortfolioScene` flashlight 效果 | 探索、陌生 |
| S1 Millions — Lockscreen Row | 默认 | — | 浏览 |
| S1 Millions — MIUI Before/After | `ew-resize` 双向拖拽手柄 | `BeforeAfterSlider.tsx` 内联样式 | 主动比较 |
| S1 Millions — Foldable A/B 投票 | **FollowerPointerCard**：hover Option A 显示 "Vote A"，hover Option B 显示 "Vote B"；已投票后回归默认 | `_lab/ui/following-pointer.tsx` + `ABVote.tsx` 改造（每个 OptionCard 包一层 FollowerPointerCard） | 邀请投票 |
| S2 Business — Data Flip 三卡片 | **FollowerPointerCard**：跟随鼠标的浮动 tooltip 显示该卡片的 insight | `_lab/ui/following-pointer.tsx`（Aceternity 改写）+ `ComparisonCard.tsx` | 数据陪读 |
| S3 Teams — manager 引用大字 | `cursor: default`（避免文字选择光标）；高亮词处变 pointer | `for-teams.css:63` + QuoteHover 内部 | 阅读 + hover 探索 |
| S4 Evidence — MethodGrid | `cursor: crosshair`（研究感的十字准星） | `for-evidence.css:112` | 研究、定位 |
| S5 Curiosity | 默认 | — | 自由浏览 |
| S6 Closing | 默认 | — | — |

**移动端**：所有自定义 cursor 在触屏环境下自然降级为 tap 交互。FollowerPointerCard、`ew-resize` 拖拽、`crosshair` 都不存在于触屏，但底下的内容（卡片、滑块、tile）依然可点击/可滑动。**手电筒**在移动端用陀螺仪跟随（手机倾斜控制光源位置）。

### 2.7 移动端方案

| 桌面端 | 移动端替代 |
|---|---|
| 手电筒跟随鼠标 | 陀螺仪跟随（手机倾斜控制光源） |
| FollowerPointerCard 浮动 tooltip（S1 Foldable 投票 + S2 Data Flip） | tap 卡片显示 insight / vote 浮层 |
| BeforeAfterSlider `ew-resize` 拖拽 | touch drag |
| Hover 交互（S1 Foldable 投票、S3 引用 hover、S4 tag hover） | 点击展开 / 切换 |
| nav 左 wordmark + 右 5 button 两侧布局 | 单行 `I DESIGN FOR [当前段落 ▾]` + tap 展开 sheet panel |

---

## 三、首屏（Opening）

### 3.1 概述

页面加载后进入全黑状态。唯一主动发光的元素是中央的角色翻转文字。背景铺满一层极低亮度的文字墙，只有鼠标手电筒扫过时才变亮变清晰。

### 3.2 核心元素

#### 3.2.1 角色翻转文字（中央，自发光）

**格式：**

```
I, AS A ___,
```

其中 `___` 像翻日历一样持续切换角色名。

**翻转内容（按此顺序循环）：**

1. UX DESIGNER
2. TEAM LEADER
3. RESEARCHER
4. FACILITATOR
5. LEARNER
6. HUMAN BEING

**翻转节奏：**

- 每个角色停留：1.5–2 秒
- 翻转动画时长：0.3 秒
- 一轮完整循环：约 12–15 秒
- 无限循环

**排列逻辑：** 前几个符合预期（UX DESIGNER / TEAM LEADER），后面开始意外（FACILITATOR / LEARNER），最后落在最柔软的 HUMAN BEING。

#### 3.2.2 文字墙背景（手电筒触发）

- 整个首屏铺满一层浅色文字，密密麻麻，亮度极低（几乎不可见）
- 文字内容是与 Sherry 相关的关键词和短句
- 排版风格：typographic poster — 大小不一、疏密有致，部分横排部分竖排
- 鼠标手电筒扫过时，扫到的区域文字变亮变清晰

**文字墙内容示例（混排）：**

design system · 700M MAU · Tsinghua · two cats · ENFP · 40-person workshop · skiing · patent · Denmark · LEGO · lock screen · responsive design · foldable · A/B testing · MIUI · HCI research · SwiftUI · Linkly · GDPR · accessibility · 情理之中意料之外 · coffee chat · React · user interview · snowboard · scuba diving · sailing · dinghy · Toronto · Beijing · CLB 7 · Figma

#### 3.2.3 滚动提示

- 首屏加载 3 秒后，底部淡入一个微弱的向下箭头或 "scroll" 提示
- 用户开始滚动后，提示消失

### 3.3 交互流程

1. 页面加载 → 全黑，0.5s 后中央角色翻转文字淡入开始循环
2. 用户移动鼠标 → 手电筒光圈出现，照亮附近的文字墙内容
3. 用户不动鼠标也能看到角色翻转 → 被动层信息传递
4. 3s 后底部出现滚动提示
5. 用户开始向下滚动 → 手电筒淡出，深色背景逐渐过渡到浅色，进入 Section 1

---

## 四、Section 1 — For Millions

### 4.1 概述

Section 1 是 Story 页的第一个内容段落。核心叙事：大规模、系统性、影响面广。用一个提问 (`What does it mean to design for 700 million people?`) 统领三个项目，每个项目用一句 "It means..." 回应。

- **节奏**：紧凑/密集，信息量最大的段落
- **主题**：`millions`（深炭灰 `#222222` + 白字）
- **鼠标**：见 §2.6（Lockscreen 默认 / MIUI Before-After 拖拽 / Foldable A/B FollowerPointer "Vote"）
- **长度估算**：~5 vh-screens（含开场过渡 pin 区）

### 4.2 开场过渡 — Question → Answer 的关键动画

S1 的开场是一段 **GSAP ScrollTrigger pin + scrub** 控制的多步动画，把读者从 S0 的探索心态带入 Millions 的"答案 demo"心态。整段共享同一个空间锚点：**问句和第一个 "It means..." 答句出现在视口的同一个位置**——答句视觉上"接管"问句的位置，叙事意味"这就是答案"非常直接。

#### 用户体感（按滚动顺序）

1. **背景从黑切到深炭灰**（S0→S1 主题过渡，已发生）
2. **大字问句进入** — `What does it mean to design for 700 million people?` 以大字号（接近 hero 字号，约 `clamp(56px, 8vw, 128px)`）出现在视口中上区域
3. **问句缩小并定位** — 用户继续向下滚动，问句尺寸 scrub 缩小（约缩到原来的 50–60%），同时位置略向上移，最终**锁定在视口中上偏 1/3 的位置**
4. **小问句渐隐** — 继续滚，缩小后的问句开始 fade out
5. **答句在同一位置渐显** — `It means making something personal` 在小问句**完全相同的位置**渐显出现（同字号、同居中对齐）。这一步是关键 — 用户视觉上感觉问句"被"答句替换
6. **副标题 + 项目链接渐显** — 答句下方依次浮现：
   - 小灰字：`— at a scale where nothing feels personal.`
   - 项目链接：`Xiaomi Lock Screen · 2023 · View →`
7. **锁屏图组从下方露出 1/4** — 在答句完整显示的同时，视口底部约 1/4 区域开始露出 LockscreenRow 的顶部，提示"下面还有内容"
8. **pin 释放，进入正常滚动** — 用户继续滚，整个容器解 pin，锁屏图组自然向上滚出完整内容

#### 时间轴（pin 区内 0–100% 滚动进度）

| 进度 | "What does it mean..." | "It means making..." | 副标题 + 链接 | 锁屏图组（视口底部） |
|---|---|---|---|---|
| 0% | 大字（100% scale），居中 | 不可见 | 不可见 | 视口外 |
| 0–35% | scale 1.0 → 0.55，translateY 0 → -8vh | 不可见 | 不可见 | 视口外 |
| 35–55% | 小问句保持锁定位置 | 不可见 | 不可见 | 视口外 |
| 55–70% | fade out（opacity 1 → 0） | fade in（opacity 0 → 1），同位置 | 不可见 | 视口外 |
| 70–85% | 完全消失 | 完全显示 | fade in（opacity 0 → 1） | 开始从底部露出（0 → 15%） |
| 85–100% | — | 保持 | 完全显示 | 露出 15% → 25% |

#### 实现要点

GSAP `ScrollTrigger` pin 容器（`start: 'top top', end: '+=180%', scrub: 1`），timeline tween 驱动 scale / opacity / y。问句和答句 **absolute 同坐标叠层**（`top: 33%` 居中），靠 opacity + transform 互相替换。具体落地见代码。

#### 后续两个 "It means..." 共享同一锚点

问句 pin 只发生**一次**——在 S1 开场。但 MIUI 和 Foldable 的 "It means..." **不是各自 Reveal 入场**，而是**在同一锚点位置 crossfade 替换文字**——三句 "It means..." 像同一行字三次换字。详细滚动编排见 §4.3.2。

- 问句 pin 是一次性叙事仪式（`What does it mean? — It means X.`），用一次就够，每个项目都重复就成了套路
- 三句 "It means..." 共享一个锚点（同字号、同字重、同坐标），通过 crossfade（前两次原地、第三次先位移）传达"这是同一个问题的三个答案"
- 节奏上：第一个答句靠 pin 重落地，后两次靠"换字"轻替换 — 重→轻→轻，比每次重新 Reveal 入场更有呼吸感

#### 移动端

`scale + opacity` 的 scrub 动画在移动端保留（GSAP ScrollTrigger 在触屏上 scrub 通过 Lenis 驱动，正常工作）。pin 区在移动端可能需要适当压缩（`end: '+=140%'`），避免过长的 pin 影响触屏滚动手感。具体参数到 dev server 上调试时定。

### 4.3 三个项目：It means × 3 + 卡片堆叠

#### 4.3.1 设计意图

三个项目（小米锁屏 / MIUI 设计规范 / 折叠屏）作为同一个问句的三个回答，用**共享的 "It means..." 锚点**和**卡片堆叠**串成一段连续滚动，而不是三个独立全屏段落。

- "It means..." 不在每个项目里重新出现，而是**作为持续锚点**，文字依次替换为三句答案
- 三组项目内容随滚动**逐组堆叠**：新组从下方进入时，旧组缩小并向上堆，最终形成三层 pile
- 节奏意图：`What does it mean? — It means X. — It means Y. — It means Z.` 一路连绵，让"在不同维度上回答同一个问题"的结构显性化

#### 4.3.2 滚动编排（统一时间轴）

三组内容（**G1 锁屏 / G2 MIUI / G3 折叠屏**）共享同一个 "It means..." 锚点位置（沿用 §4.2 末态：视口中上偏 1/3，缩放后字号）。整段从 §4.2 pin 释放后接续展开，不再额外 pin，靠 ScrollTrigger scrub 驱动各元素的 scale / opacity / translateY。

**项目链接随 It means 一起替换：** 每组的项目链接（`Xiaomi Lock Screen · 2023 · View →` 等）紧贴 "It means..." 文字下方一行，作为锚点的一部分。当 It means crossfade 替换文字时，链接也同步 crossfade 替换为对应项目的链接 — 跟着锚点走，不在各组内容底部出现。

**触发节点（按"剩多少 G1 / G2 / G3"切分）：**

| 节点 | "It means..." 文字 | 锚点位置 | G1 锁屏 | G2 MIUI | G3 折叠屏 |
|---|---|---|---|---|---|
| §4.2 pin 释放 | "It means making something personal..." | 锁定中上 1/3 | 完整露出（瀑布流） | 视口外 | 视口外 |
| 用户继续上滚 | 同上 | 锁定 | 上滚，逐渐离开视口下半部 | 视口外 | 视口外 |
| **G1 剩 1/4** | 原地 crossfade → "It means building the system..." | 锁定（不动） | 开始 scale↓ + translateY↑（向上堆） | 从视口下方露出，围绕 It means 锚点的左右两侧铺开 | 视口外 |
| G2 完整露出 | "It means building..." | 锁定 | 已堆到上方（缩小一档） | 居中（最大） | 视口外 |
| **G2 接近滑完** | 先 translateY↑（带着 G1+G2 上移），再 crossfade → "It means 'just make it bigger'..." | 上移到顶部 | 继续上推（最小一层） | 开始 scale↓ + translateY↑ | 从视口下方露出 |
| 终态 | "It means 'just make it bigger'..." | 顶部 | pile 最上层（最小） | pile 中层 | 居中（最大） |

**为什么前两次 crossfade 原地、第三次要先上移？**

- 前两次是**软替换**（同锚点、仅文字变）：保持节奏稳定
- 第三次是**结构性位移**（It means 带着前两组迁移到 pile 顶部）：标志重心从中央转到上方，是一个有意的视觉拐点 — 三层 pile 此时成型

**回滚行为：** 用户向上回滚时，pile 倒退展开（每组重新放大、It means 倒退替换），保证滚动可逆。

**移动端：** 不做 pile，三组各自全屏顺次播放；It means crossfade 仍保留（同锚点替换字符）。

#### 4.3.3 G1 — 小米锁屏

> **"It means making something personal — at a scale where nothing feels personal."**

**内容：** 锁屏瀑布流。几十张不同风格的锁屏截图平铺在网格中，每个都不一样。视觉效果用数量证明 "personal at scale" — 文字说矛盾，画面解决矛盾。

**组内交互：** 默认鼠标，无额外交互。

**项目链接（紧贴 It means 下方，随锚点一起 crossfade）：**

```
Xiaomi Lock Screen · 2023 · View project →
```

一行淡色小字，不抢注意力。点击跳转到 Projects 页的锁屏 case study 详情页。位置和切换机制详见 §4.3.2。

**进入 / 退场：** 见 §4.3.2 — G1 是第一组，§4.2 pin 释放后即露出；G1 剩 1/4 时开始向上堆叠，作为 pile 最底层（终态最小）。

**素材需求：**

- [ ] 几十张不同风格的锁屏截图（个性化编辑后的效果图）
- [ ] 截图尺寸统一（手机竖屏比例）

---

#### 4.3.4 G2 — MIUI 设计规范 2.0 + 多语言设计规范

> **"It means building the system that other designers build on."**

**内容：** 三块并排 Before/After 滑块。三列横向铺开，**围绕在 "It means..." 锚点的左右两侧**（构图：It means 居中，左/中/右三块对比）。

| 位置 | 标题 | 对比内容 |
|------|------|---------|
| 左 | Components | 组件 Figma 的前后变化 |
| 中 | Design Tokens | 原子级字体/字号/颜色规范的前后变化 |
| 右 | Localization | 多语言规范前后变化 |

**组内交互：**

- 三个滑块各自独立操作
- 每个滑块中间有一条可拖拽的分割线
- 默认分割线在正中间（50/50）

**项目链接（紧贴 It means 下方，随锚点一起 crossfade）：**

```
MIUI Design System 2.0 · View project →
```

**进入 / 退场：** 见 §4.3.2 — G1 剩 1/4 时从视口下方露出；G2 接近滑完时开始向上堆叠，作为 pile 中层。

**移动端：** 三块改为纵向堆叠（pile 不参与，单独走顺序播放）。

**素材需求：**

- [ ] 6 张图（3 组 before/after）
- [ ] 每组 before 和 after 必须完全相同的画幅和尺寸
- [ ] 每组的 before 和 after 内容在同一位置对应（拖拽时才有对比感）

---

#### 4.3.5 G3 — 折叠屏响应式设计框架

> **"It means 'just make it bigger' is never the answer."**

**内容：** 三组 A/B 投票模块。两两一组、共三组，用户投票选择哪个方案更好。

| 组 | 内容 | Sherry 的立场 |
|----|------|--------------|
| 第 1 组 | 折叠屏布局方案 A vs B | 有明确观点 |
| 第 2 组 | 折叠屏布局方案 A vs B | 有明确观点 |
| 第 3 组 | 折叠屏布局方案 A vs B | 开放讨论 |

**组内交互流程：**

1. 用户看到三组对比图，每组两张，无任何文字引导
2. 用户点击选择（每组 A 或 B 二选一）
3. 点击后该组立即显示：
   - 投票比例（如 "73% chose B"）
   - Sherry 的一两句分析/观点
4. 第 1、2 组：显示明确观点（如 "B reveals context above the current view — users don't need to navigate back and forth."）
5. 第 3 组：显示开放态度（如 "I'm still thinking about this one. It depends on context."）

**投票数据：** 初期使用预设数据，后续接入真实后端记录实时投票。

**项目链接（紧贴 It means 下方，随锚点一起 crossfade）：**

```
Foldable Screen Framework · 2022 · View project →
```

**进入 / 退场：** 见 §4.3.2 — G2 接近滑完时从视口下方露出；G3 是 pile 终态最大那一层（居中）。

**移动端：** 三组纵向堆叠（pile 不参与）。

**素材需求：**

- [ ] 6 张图（3 组 A/B 对比）
- [ ] 每组两张图尺寸一致
- [ ] 每组 A 和 B 是同一个使用场景的两种布局方案
- [ ] 3 句 Sherry 的分析文案（前 2 组有明确观点，第 3 组开放讨论）

---

### 4.4 Section 1 过渡到 Section 2

**无过渡句**。三层 pile 终态停留片刻后，用户继续向下滚动，pile 整体上推退场，画面**靠 §2.3 的主题色平滑过渡 + 段落起始的视觉对比**自然进入 Section 2 — For Business。原文案 "At Xiaomi, I designed for scale..." 已删除，详见 §2.3。

---

## 五、Section 2 — For Business

### 5.1 概述

Section 2 只讲一个项目（AppLovin OOBE），但讲得锋利。核心叙事：设计如何直接影响营收，以及设计直觉如何被数据推翻。与 Section 1 的三项目铺广度形成对比——这里一个项目两屏打完就走，快进快出。

**鼠标模式：** 常规
**节奏：** 短而有力，整个 section 只有两屏
**背景：** 浅色

### 5.2 第一屏：开场 + 反直觉预热

#### 开场文案

> **"At AppLovin, design was measured in dollars."**

#### 一句话背景

交代项目场景：这是嵌入手机开箱流程（OOBE）的 App 推荐与下载环节，合作方包括 Samsung、T-Mobile 等，触达数千万新机用户，每季度贡献数百万美元营收。（具体文案待定）

#### 三条"设计常识"

用类似信条/宣言的排版，列出三条设计师普遍认同的直觉：

> *"Fewer steps is always better."*
> *"Cleaner UI converts more."*
> *"Users hate being forced."*

#### 转折

> *"We tested all three. All three were wrong."*

**这一屏不给任何数据，只制造悬念。**

### 5.3 第二屏：数据翻转

三组对比卡片，每组结构相同：左边是被划掉的"预期"，右边是真实数据，配低保真界面辅助理解。

| 组 | 预期（划掉） | 真实结果 | 低保真界面 |
|----|-------------|---------|-----------|
| 1 | 1-step survey should win | 5-step survey drove 18% install growth vs. 14% for 1-step | 1步 vs 5步问卷示意 |
| 2 | Clean collapsed bundle should win | Transparent bundle: 0.47 net lift vs. 0.37 for collapsed | 折叠版 vs 外露版示意 |
| 3 | Free browsing should win | Forced swipe (10 cards): 15.65% CTR | 列表 vs 滑动卡片示意 |

**视觉呈现：**

- 每张卡片左边的"预期"文字有划掉效果（strikethrough）
- 右边的真实数据用醒目的方式呈现
- 每张卡片包含一个低保真界面截图（脱敏/示意），帮助快速理解实验内容
- 三张卡片横排（移动端纵向堆叠）

#### 底部链接

```
AppLovin OOBE · View project →
```

#### 素材需求

- [ ] 3 组低保真界面示意图（脱敏）
- [ ] 一句话背景文案定稿

### 5.4 Section 2 过渡到 Section 3

> **"Experiments need one hypothesis. Teams need one direction."**

---

## 六、Section 3 — For Teams

### 6.1 概述

Section 3 讲团队协作与领导力。分两层：第一层讲带团队（持续性领导力），第二层讲组织 workshop（事件性领导力）。整体氛围松弛、有呼吸感，与前两个 section 的紧凑/锋利形成节奏反差。

**鼠标模式：** 常规
**节奏：** 松弛/呼吸
**背景：** 浅色

### 6.2 第一层：带团队 — 老板的引用 + Hover 展开

#### 6.2.1 引出句（第一屏）

用户进入 S3 后看到引出句，scroll-triggered 渐入：

> **"My manager said this when he put me in charge of the design system:"**

#### 6.2.2 引用原话（第二屏）

引出句之后，引用大字居中占满屏幕：

> **"We just put a newcomer in charge, leading a team of senior people, across multiple departments. Honestly? It sounded like a terrible idea."**

其中四个词组用不同颜色高亮，可 hover 交互：
- **a newcomer**
- **a team of senior people**
- **multiple departments**
- **a terrible idea**

#### 6.2.3 Hover 交互机制

**默认状态：** 引用大字居中占满屏幕，无任何内容展开。

**Hover 触发：** 鼠标 hover 任意高亮词组时：
1. 整句引用缩小并上移至页面顶部约 1/3 空间
2. 下方 2/3 空间展开该词组对应的内容
3. Hover 不同的词组 → 下方内容切换
4. 鼠标离开高亮词后，内容保持显示（不立即消失），直到 hover 另一个词组时切换

**移动端：** 改为点击展开/切换。

#### 6.2.4 四个 Hover 的内容

**"a newcomer" — 散落的 tag + emoji**

氛围：展示"不靠谱"的程度有多深。Tag 随机散落排列，附带 emoji 表情（具体 emoji 待定）。

Tag 内容：
- Only 1 year of experience
- Already leading another key project
- Started with 2 teammates who weren't sure about me
- The entire dev team got reshuffled midway
- Constantly playing "customer service" for other designers
- Organizing rules that were scattered, incomplete, and sometimes wrong

---

**"a team of senior people" — 照片 + tag（混排）**

氛围：展示"我和团队的关系"——我为他们做了什么，如何 align 方向、共同进步。照片是主体，tag 像标签一样附在照片上。

Tag 内容：
- Grew the team from 2 to 7
- Helped everyone understand the current state
- Gathered evidence to set a clear direction
- Learned together as a team
- Took the first step alone so others could follow

照片素材：
- [ ] Figma 用法学习文档截图 → 对应 "learned together"
- [ ] 访谈结果截图 → 对应 "gathered evidence"
- [ ] 竞品调研截图 → 对应 "set a clear direction"
- [ ] 问题和目标截图 → 对应 "set a clear direction"
- [ ] 弹窗规范文档截图 → 对应 "took the first step alone"

---

**"multiple departments" — tag + 照片 + 长文（混排）**

氛围：展示跨部门协作的规模和方式。内容最丰富。

Tag 内容：
- 40-person workshop with design, PM, and research
- Invited engineers to share their pain points
- Aligned rules directly with 6 SDK engineers
- Cross-role review: 10 designers + 10 PMs + 10 engineers

照片素材：
- [ ] Workshop 现场照片
- [ ] Workshop PPT 截图
- [ ] 和研发对齐的 PPT 截图
- [ ] 研发提供的反馈/建议截图

长文内容：待定（描述跨部门协作的具体故事或方法）

---

**"a terrible idea" — 整齐排版的成果展示**

氛围：反转。前三个 hover 都是散落/随意的排版，这个突然**整整齐齐**——排版本身就在讲"从混乱到有序"的结果。

图片：最终成果截图，统一尺寸网格排列，间距一致。
- [ ] 完整的规范文档页面截图
- [ ] 重构后的 Figma 索引页
- [ ] 颜色/字体/动效规范页面
- [ ] Design tokens 的规范页面

Tag（整齐列表排列，非散落）：
- 8 core components documented
- First-ever foundation guidelines
- Design tokens introduced
- 8.9 / 10 satisfaction score

底部总结句：

> *"Turns out it wasn't a terrible idea."*

---

### 6.3 第一层到第二层的过渡

**无过渡句**。引用 + hover 模块结束后，用户继续滚动直接进入 workshop 照片墙；S3 内部的两层之间靠**节奏空白 + 视觉对比**自然分隔（与段落间过渡同一思路，详见 §2.3）。原文案 "Building a team was one thing..." 已删除。

### 6.4 第二层：Workshop 照片墙

#### 6.4.1 概述

引用 + hover 模块结束后，继续滚动进入 workshop 照片墙。三个 workshop 各一组照片，用视差滚动呈现。

#### 6.4.2 呈现方式

**视差滚动照片墙：**
- 大小不等的照片错落排列
- 滚动时不同照片以不同速度浮入（基础的 scroll-triggered 淡入 + 不同速度位移）
- 大图放现场照片，小图放 PPT 截图或白板细节
- 整体氛围：放松、有人气、像在翻相册

**Hover 便利贴：**
- 鼠标悬浮在不同区块的照片上，出现便利贴样式的信息卡
- 三个 workshop 各一张便利贴，显示 workshop 的内容、目标和体量

| Workshop | 便利贴内容 |
|----------|----------|
| 桌面功能 workshop | Desktop feature workshop · 40 people · 3 days — Explore |
| 锁屏脑爆 | Lock screen brainstorm — Focus |
| 设计规范 workshop | Design system workshop · Cross-department — Align |

**移动端：** 照片纵向堆叠，便利贴改为点击触发。

#### 6.4.3 素材需求

- [ ] 三个 workshop 的现场照片（每个 2-4 张，大小可不统一）
- [ ] Workshop PPT 截图
- [ ] 白板/便利贴墙照片
- [ ] 三张便利贴的具体文案定稿

### 6.5 Section 3 过渡到 Section 4

**无过渡句**。S3 workshop 照片墙结束后直接进入 S4，靠 §2.3 的主题色过渡 + S4 开场视觉对比分隔。原文案 "Curiosity doesn't stop at the office door."（曾兼作 S5 主题句）已删除。

---

## 七、Section 4 — For Evidence

### 7.1 概述

Section 4 讲研究能力。整体很轻——一句开场、一堆 tag、快速过渡。跟 Section 3 的厚重形成反差，节奏上是一个快速的呼吸段。

**鼠标模式：** 常规
**节奏：** 轻快
**背景：** 浅色

### 7.2 开场

> **"Every project I've worked on started with a question I couldn't answer from my desk."**

### 7.3 呈现方式：Tag 散落布局

页面上散落着两种 tag，视觉上有明显区分（如实心 vs 描边/半透明），用户直觉知道哪些可以互动。

#### 有 hover 内容的 tag（4 个，实心/主色）

hover 后显示对应的项目图片。

| Tag | Hover 图片内容 |
|-----|-------------|
| Xiaomi's first design research project | 触摸热区实验相关截图 |
| 100+ automotive HCI papers | 论文/文献截图 |
| Cursor research report | 华为光标用研报告截图 |
| Designer workflow survey | 设计师调研相关截图 |

#### 装饰 tag（约 10 个，描边/半透明，hover 无反应）

用于填充画面密度，传达"掌握的研究方法很广"。

Competitive analysis · User interviews · Usability testing · A/B testing · Survey design · Heuristic evaluation · Contextual inquiry · Affinity mapping · Card sorting · Journey mapping

### 7.4 素材需求

- [ ] 触摸热区实验相关图片
- [ ] 论文/文献截图
- [ ] 华为光标用研报告截图（34页报告）
- [ ] 设计师调研相关截图

### 7.5 Section 4 过渡到 Section 5

无过渡句、无文案标题。S5 内容直接以拼贴墙开场（详见 §8.2），靠 §2.3 的主题色过渡 + 视觉节奏自然衔接 S4。原 S3→S4 兼作 S5 主题句的 "Curiosity doesn't stop at the office door." 已删除。

---

## 八、Section 5 — Curiosity

### 8.1 概述

Section 5 展示工作之外的创造力和个人生活。核心信息：好奇心不限于工作——她一直在做各种东西、体验各种事。包含个人设计项目和生活照片混排。

**鼠标模式：** 常规
**节奏：** 自由/松散
**背景：** 浅色

### 8.2 呈现方式：大型拼贴墙

各种图片——成品截图、过程草图、实物照片、界面、生活照——大小不一、角度微倾、互相叠压，像一面灵感墙或工作室墙面。不需要标题、不需要说明文字、不需要整齐网格。纯视觉。

**排版风格：** 酷炫、自由、略带混乱感。CSS grid 加随机 span 和微旋转。

**包含的内容类型：**

设计项目：
- 本科毕设
- 研究生毕设
- 丹麦交换项目（LEGO/Scrapbots）
- 上学期间的课程作业
- Linkly（iOS 个人项目）

个人生活：
- 猫的照片
- 滑雪/潜水/旅行照片
- 其他个人兴趣相关

**Hover 效果：** 每张图 hover 可浮出一行极小淡字——项目名和年份（如 "Undergrad thesis · 2017"）。不想看的人完全不受打扰。

**移动端：** 保持拼贴布局，hover 改为点击。

### 8.3 素材需求

- [ ] 本科毕设相关图片
- [ ] 研究生毕设相关图片
- [ ] 丹麦交换项目照片/截图
- [ ] 课程作业截图
- [ ] Linkly 界面截图
- [ ] 个人生活照片（猫、滑雪、潜水、旅行等）

---

## 九、Closing

### 9.1 概述

拼贴墙结束后，直接进入 Closing。极简，只放联系方式。

### 9.2 内容

- 联系方式（邮箱、LinkedIn 等）
- 简历下载链接
- 社交链接

无特殊交互，无过渡句。

---

## 十、完整文案汇总

### Story 页关键文案一览

| 位置 | 文案 |
|------|------|
| 首屏 | I, AS A ___ （角色翻转） |
| S1 开场 | What does it mean to design for 700 million people? |
| S1 锁屏 | It means making something personal — at a scale where nothing feels personal. |
| S1 规范 | It means building the system that other designers build on. |
| S1 折叠屏 | It means 'just make it bigger' is never the answer. |
| S2 开场 | At AppLovin, design was measured in dollars. |
| S2 三条常识 | Fewer steps is always better. / Cleaner UI converts more. / Users hate being forced. |
| S2 转折 | We tested all three. All three were wrong. |
| S3 引出句 | My manager said this when he put me in charge of the design system: |
| S3 引用 | "We just put a newcomer in charge, leading a team of senior people, across multiple departments. Honestly? It sounded like a terrible idea." |
| S3 反转 | Turns out it wasn't a terrible idea. |
| S4 开场 | Every project I've worked on started with a question I couldn't answer from my desk. |
| Closing | 联系方式（无特殊文案） |

---

## 十一、待解决项

### 内容细化
- [ ] S2 一句话背景文案定稿
- [ ] S3 三个 workshop 便利贴的具体文案定稿
- [ ] S3 "multiple departments" hover 的长文内容
- [ ] S3 "a newcomer" hover 的 emoji 选定
- [ ] 首屏角色翻转列表是否需要更新（去掉 HUMAN BEING？）

### 素材准备
- [ ] S1 锁屏：几十张不同风格的锁屏截图
- [ ] S1 规范：6 张 before/after 对比图（3 组）
- [ ] S1 折叠屏：6 张 A/B 投票对比图（3 组）+ 3 句分析文案
- [ ] S2：3 组低保真界面示意图（脱敏）
- [ ] S3 带团队："a team of senior people" 的 5 张截图
- [ ] S3 带团队："multiple departments" 的照片和截图
- [ ] S3 带团队："a terrible idea" 的 4 张最终成果截图
- [ ] S3 workshop：三个 workshop 的现场照片、PPT 截图、白板照片
- [ ] S4：4 组 hover 图片（触摸热区、论文、光标用研、设计师调研）
- [ ] S5：个人项目截图（本科毕设、研究生毕设、丹麦交换、课程作业、Linkly）
- [ ] S5：个人生活照片（猫、滑雪、潜水、旅行等）

### 设计与开发
- [ ] Overview 页和 Projects 页的详细设计
- [ ] Case study 详情页模板设计
- [ ] 转场动画的具体参数定义
- [ ] 文字墙的完整关键词列表和排版方案
- [ ] S3 hover 交互的移动端点击方案细化
- [ ] S5 拼贴墙的排版/旋转参数定义
- [x] ~~6 套主题色板落地到 tokens.css~~（2026-04-30 完成）
- [x] ~~每段 section 背景接入 `var(--theme-surface-1)` + body 级 ScrollTrigger 切 `data-theme`（PRD §2.3）~~（2026-04-30 完成）
- [x] ~~删除所有段间过渡句（S1→S2 / S2→S3 / S3 内部 / S3→S4 兼 S5 主题）~~（2026-04-30 完成）
- [x] ~~S4 内部 light→dark scrub 移除（与新 §2.4 暖米白 spec 冲突）~~（2026-04-30 完成）
- [ ] **S1 §4.3 unified scroll choreography** — 共享 "It means" 锚点 + 3 组卡片堆叠 + crossfade（替换当前 S1 独立段落布局）
- [ ] **inner text-color 主题迁移** — S1 已示范，S2/S3/S5 内部文字仍消费 legacy `--ink-primary` 等，导致 S5 白底白字、S2/S3 对比度差
- [ ] `/lab/ds` Themes tab v2 — per-swatch live-edit 色板
