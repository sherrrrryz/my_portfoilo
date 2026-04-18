# Portfolio Website PRD — Complete Story Page

## 文档信息

| 项目 | Sherry Zhou 个人作品集网站 |
|------|--------------------------|
| 网址 | xueyizhou.xyz |
| 技术栈 | Next.js + Tailwind CSS |
| 本文档范围 | 网站整体架构 + Story 页完整内容（Opening + Section 1–5 + Closing） |
| 最后更新 | 2026-04-17 |

---

## 一、网站整体架构

### 1.1 三页结构

| 页面 | 导航标签 | 定位 | 目标用户 |
|------|---------|------|---------|
| 长滚动叙事页 | Story | 默认首页。电影式长滚动叙事，展示多面性 | 设计师、设计经理 |
| 简洁总览页 | Overview | 电梯演讲。30秒扫完的简历式呈现 | HR、招聘经理 |
| 项目库 | Projects | 标准作品集。项目卡片网格+筛选+详情页 | 所有人（深入查看） |

### 1.2 导航栏

- 固定顶部：**Story · Overview · Projects**
- 右侧：Let's Connect 按钮
- 左侧：Sherry Zhou

### 1.3 页面间关系

- Story 页是默认首页（输入域名直接进入）
- Story 页每个项目底部有淡字链接 → 跳转到 Projects 页的对应 case study 详情页
- Overview 页底部有 "Want the full story?" → 链接到 Story 页
- Overview 页底部有 "See my work" → 链接到 Projects 页
- Projects 页每张卡片 → 点击进入独立 case study 详情页（与 Story 页共享同一详情页）

---

## 二、Story 页整体设计语言

### 2.1 视觉基底

- **首屏（Opening）为深色背景**，手电筒光效在此处生效
- **Section 1–5 及 Closing 为浅色/白色背景**，正常呈现，靠排版、字体、间距、配色的变化区分不同角色的"质感"
- 从首屏到 Section 1 有一个从深到浅的过渡（灯亮起来，进入正片）
- 不同 section 之间通过视觉语言的切换制造 "smash cut" 效果

### 2.2 鼠标叙事系统

首屏使用特殊鼠标模式，其余 section 使用常规鼠标：

| 阶段 | 鼠标模式 | 光标样式 | 用户关系 | 使用位置 | 背景 |
|------|---------|---------|---------|---------|------|
| 探索 | 手电筒 | 柔光圆圈 | 陌生 | 首屏开场 | 深色 |

Section 1–5 及 Closing 使用常规鼠标，内容通过 scroll-triggered 动画（淡入淡出、视差等）和 hover 交互呈现。

### 2.3 移动端降级方案

| 桌面端 | 移动端替代 |
|--------|----------|
| 手电筒跟随鼠标 | 陀螺仪跟随（手机倾斜控制光源） |
| Hover 交互（S3 引用、S4 tag） | 点击展开/切换 |

### 2.4 Story 页完整 Section 列表

| # | Section | 鼠标模式 | 节奏 | 背景 |
|---|---------|---------|------|------|
| 0 | Opening（首屏） | 手电筒 | 探索 | 深色 |
| 1 | For Millions（设计师） | 常规 | 紧凑/密集 | 浅色 |
| 2 | For Business（商业） | 常规 | 短而有力 | 浅色 |
| 3 | For Teams（团队/协作） | 常规 | 松弛/呼吸 | 浅色 |
| 4 | For Evidence（研究） | 常规 | 轻快 | 浅色 |
| 5 | Curiosity（个人项目+生活） | 常规 | 自由/松散 | 浅色 |
| 6 | Closing | 常规 | 极简 | 浅色 |

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

Section 1 是 Story 页的第一个内容段落。核心叙事：大规模、系统性、影响面广。用一个提问统领三个项目，每个项目用一句 "It means..." 回应。

**鼠标模式：** 常规
**节奏：** 紧凑/密集，信息量最大的 section
**背景：** 浅色（从首屏深色过渡而来）

### 4.2 开场

用户滚过首屏后，进入 Section 1。第一句话 scroll-triggered 淡入，独占一屏：

> **"What does it mean to design for 700 million people?"**

继续滚动，第一个项目出现。

### 4.3 项目一：小米锁屏个性化编辑

#### 文案

> **"It means making something personal — at a scale where nothing feels personal."**

#### 呈现方式：锁屏瀑布流

- 文字在上方
- 文字下方隐隐露出锁屏画面的顶部
- 用户向下滚动 → 瀑布流完整展开
- 瀑布流内容：几十个不同风格的锁屏截图平铺在网格中，每个都不一样
- 视觉效果：用数量证明 "personal at scale" — 文字说矛盾，画面解决矛盾

#### 底部链接

```
Xiaomi Lock Screen · 2023 · View project →
```

一行淡色小字，不抢注意力。点击跳转到 Projects 页的锁屏 case study 详情页。

#### 素材需求

- [ ] 几十张不同风格的锁屏截图（个性化编辑后的效果图）
- [ ] 截图尺寸统一（手机竖屏比例）

---

### 4.4 项目二：MIUI 设计规范 2.0 + 多语言设计规范

#### 文案

> **"It means building the system that other designers build on."**

#### 呈现方式：三块并排 Before/After 滑块

一整屏平分为三块，每块包含一个独立的拖拽滑块，左半边是 before 状态，右半边是 after 状态。

| 位置 | 标题 | 对比内容 |
|------|------|---------|
| 左 | Components | 组件 Figma 的前后变化 |
| 中 | Design Tokens | 原子级字体/字号/颜色规范的前后变化 |
| 右 | Localization | 多语言规范前后变化 |

**交互细节：**

- 三个滑块各自独立操作
- 每个滑块中间有一条可拖拽的分割线
- 默认分割线在正中间（50/50）

**移动端：** 三块变为纵向堆叠，一块一块往下滑。

#### 底部链接

```
MIUI Design System 2.0 · View project →
```

#### 素材需求

- [ ] 6 张图（3 组 before/after）
- [ ] 每组 before 和 after 必须完全相同的画幅和尺寸
- [ ] 每组的 before 和 after 内容在同一位置对应（拖拽时才有对比感）

---

### 4.5 项目三：折叠屏响应式设计框架

#### 文案

> **"It means 'just make it bigger' is never the answer."**

#### 呈现方式：A/B 投票模块

三组对比图，两两一组，用户投票选择哪个方案更好。

**布局：** 一排图片，两两一组，共三组。

| 组 | 内容 | Sherry 的立场 |
|----|------|--------------|
| 第 1 组 | 折叠屏布局方案 A vs B | 有明确观点 |
| 第 2 组 | 折叠屏布局方案 A vs B | 有明确观点 |
| 第 3 组 | 折叠屏布局方案 A vs B | 开放讨论 |

**交互流程：**

1. 用户看到三组对比图，每组两张，无任何文字引导
2. 用户点击选择（每组 A 或 B 二选一）
3. 点击后该组立即显示：
   - 投票比例（如 "73% chose B"）
   - Sherry 的一两句分析/观点
4. 第 1、2 组：显示明确观点（如 "B reveals context above the current view — users don't need to navigate back and forth."）
5. 第 3 组：显示开放态度（如 "I'm still thinking about this one. It depends on context."）

**投票数据：** 初期使用预设数据，后续接入真实后端记录实时投票。

**移动端：** 三组纵向堆叠。

#### 底部链接

```
Foldable Screen Framework · 2022 · View project →
```

#### 素材需求

- [ ] 6 张图（3 组 A/B 对比）
- [ ] 每组两张图尺寸一致
- [ ] 每组 A 和 B 是同一个使用场景的两种布局方案
- [ ] 3 句 Sherry 的分析文案（前 2 组有明确观点，第 3 组开放讨论）

---

### 4.6 Section 1 过渡到 Section 2

Section 1 最后一个项目（折叠屏）底部链接之后，出现过渡句，引导进入下一段：

> **"At Xiaomi, I designed for scale. Then I joined a company where design was measured differently."**

过渡句之后，画面转场进入 Section 2 — For Business。

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

用户滚过过渡句后，看到引出句，scroll-triggered 渐入：

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

引用 + hover 模块结束后，出现过渡句：

> **"Building a team was one thing. Getting different departments to think together was another."**

继续滚动进入 workshop 照片墙。

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

> **"Curiosity doesn't stop at the office door."**

注意：这句话同时是 S4 的开场句和 S5 的主题句。

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

无过渡句。"Curiosity doesn't stop at the office door." 已在 S3→S4 过渡时出现，其含义自然延伸覆盖 S5 的内容。

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
| S1→S2 过渡 | At Xiaomi, I designed for scale. Then I joined a company where design was measured differently. |
| S2 开场 | At AppLovin, design was measured in dollars. |
| S2 三条常识 | Fewer steps is always better. / Cleaner UI converts more. / Users hate being forced. |
| S2 转折 | We tested all three. All three were wrong. |
| S2→S3 过渡 | Experiments need one hypothesis. Teams need one direction. |
| S3 引出句 | My manager said this when he put me in charge of the design system: |
| S3 引用 | "We just put a newcomer in charge, leading a team of senior people, across multiple departments. Honestly? It sounded like a terrible idea." |
| S3 反转 | Turns out it wasn't a terrible idea. |
| S3 workshop 过渡 | Building a team was one thing. Getting different departments to think together was another. |
| S3→S4 过渡 / S5 主题 | Curiosity doesn't stop at the office door. |
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
