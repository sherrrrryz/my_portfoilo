'use client';

/* ============================================================================
   /projects/touch-hotspots — case-study landing for the Touch Hot Zone
   research, told the same way as /projects/miui-design-system: short
   editorial copy on the shared monochrome token scale, with the long
   research text replaced by inline SVG illustrations, stat bands and the
   real heatmap from public/toucharea/.

   Bilingual: every copy string is an { en, zh } pair picked by a lang state
   (persisted in localStorage "lang", shared with / and /about). The toggle
   lives in the footer colophon, bottom right. SSR renders English; a
   returning zh reader flips after hydration. Route metadata moved to
   ./layout.tsx (client components can't export it).

   No TSX imports shared with the homepage or other project routes
   (isolation rule): layout primitives are local markup, styling lives in
   ./touch-hotspots.css on the shared token scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./touch-hotspots.css";

import Link from "next/link";
import React, { createContext, useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

/* ── i18n plumbing ─────────────────────────────────────────────────
   Per-page copy of the homepage recipe (isolation rule: no shared TSX).
   The context feeds the SVG diagrams, which render their own labels. */
type Lang = "en" | "zh";
type L10n = { en: string; zh: string };

const LangContext = createContext<Lang>("en");

function useT() {
  const lang = useContext(LangContext);
  return (s: L10n) => s[lang];
}

/* Footer language switch: shows the language you'd switch TO.
   Duplicated from / and /about (per-page copies, same as ThemeToggle). */
function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <button
      type="button"
      className="thz-lang"
      aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
      onClick={() => onChange(lang === "en" ? "zh" : "en")}
    >
      {lang === "en" ? "中文" : "English"}
    </button>
  );
}

/** Data model (edit here to drive the page) */
const project = {
  title: { en: "Touch Hot Zone", zh: "屏幕触摸热区" },
  dek: {
    en: "Mapping where thumbs actually reach on a 6.8-inch screen, so layout decisions stop being guesses.",
    zh: "测绘拇指在 6.8 英寸屏幕上的真实可达范围，让布局决策不再靠猜。",
  },
  subtitle: {
    en: "HCI Research · Experimental Design · Data-informed UX",
    zh: "HCI 研究 · 实验设计 · 数据驱动的 UX",
  },
  stats: [
    { num: "144", label: { en: "screen zones measured", zh: "测量的屏幕分区" } },
    { num: "40", label: { en: "participants, both hands", zh: "参与者，双手测试" } },
    { num: "75%", label: { en: "of users operate one-thumbed", zh: "用户习惯单手拇指操作" } },
    { num: "40%", sub: "↓", label: { en: "shorter task path shipped", zh: "上线方案的任务路径缩短" } },
  ],
  overview: {
    en: "The first HCI design research project initiated by the design department at Xiaomi. We measured how thumbs really perform across today's large screens, turned the data into a hot zone map designers use daily, and packaged the method so it could be rerun on foldables and tablets.",
    zh: "这是小米设计部门发起的第一个 HCI 设计研究项目。我们测量了拇指在如今的大屏上的真实表现，把数据转化为设计师每天在用的热区地图，并把方法沉淀成模板，方便在折叠屏和平板上重跑。",
  },
  contributions: [
    { en: "User research", zh: "用户研究" },
    { en: "Experimental design", zh: "实验设计" },
    { en: "Data analysis", zh: "数据分析" },
    { en: "User experience design", zh: "用户体验设计" },
  ],
  team: [
    { en: "2 UX designers", zh: "2 名 UX 设计师" },
    { en: "1 user researcher", zh: "1 名用户研究员" },
    { en: "First research project by the design team", zh: "设计团队的首个研究项目" },
  ],
  why: {
    en: "Steve Jobs called 3.5 inches the perfect size. Since 2012 screens kept growing anyway, and Xiaomi's bestsellers now run about 6.8 inches. Our thumbs did not grow with them, yet most layout rules still assumed they had.",
    zh: "乔布斯曾说 3.5 英寸是完美尺寸。但 2012 年以来屏幕一直在变大，小米的畅销机型如今约为 6.8 英寸。我们的拇指并没有跟着变长，而多数布局规则却仍然默认它们变长了。",
  },
  goals: [
    { en: "A touch hot zone map designers can use daily", zh: "一张设计师每天可用的触摸热区地图" },
    { en: "Design guidance Xiaomi's business teams can apply", zh: "一套小米业务团队可落地的设计指引" },
    { en: "A replicable method for foldables and tablets", zh: "一个可复用于折叠屏与平板的方法" },
  ],
  setup: {
    en: "Desk research surfaced two dominant single-hand grips, pinky supporting the back of the phone or catching its bottom edge. We scoped the study tightly so the data would stay credible on a limited budget.",
    zh: "案头研究发现了两种主流的单手握姿：小拇指托住手机背面，或者兜住手机底边。我们把研究范围收得很紧，让数据在有限预算下依然可信。",
  },
  scope: [
    { en: "Xiaomi 11 · 6.8 in", zh: "小米 11 · 6.8 英寸" },
    { en: "Single-hand use", zh: "单手使用" },
    { en: "Thumb clicking", zh: "拇指点击" },
    { en: "Seated, stationary", zh: "坐姿静止" },
    { en: "Left and right hands", zh: "左手与右手" },
    { en: "50 / 50 gender split", zh: "男女各半" },
  ],
  experiment: {
    en: "We split the screen into 144 zones sized from Apple's ideal 9 by 9 millimeter target. In each zone, participants long-pressed a square, waited for it to turn green, then tapped it. 40 people, 20 per grip style, ran the task with both hands after 10 practice rounds.",
    zh: "我们按照苹果理想的 9 × 9 毫米点击目标，把屏幕划分成 144 个分区。在每个分区里，参与者长按一个方块，等它变绿后再点击一次。40 名参与者按两种握姿各 20 人分组，经过 10 轮练习后用双手完成任务。",
  },
  metrics: [
    { en: "Hit rate", zh: "命中率" },
    { en: "Abandon rate", zh: "放弃率" },
    { en: "Misoperation rate", zh: "误操作率" },
    { en: "Click duration", zh: "点击时长" },
    { en: "Click offset", zh: "点击偏移" },
  ],
  findings: {
    en: "Per-zone hit rates fell into three clean bands: an easy zone under the thumb's natural sweep, a stretch zone reachable with effort, and a dead zone the thumb abandons. The two maps below are the real data, left hand and right hand.",
    zh: "各分区的命中率清晰地分成三个梯度：拇指自然扫过范围内的舒适区，需要用力伸展才能到达的延伸区，以及拇指干脆放弃的死区。下面两张图就是真实数据，分别是左手与右手。",
  },
  shipped: {
    en: "We applied the map two ways. Statically, by moving controls into the easy zone. Dynamically, by re-examining whole flows: among 500,000 daily calendar users, 70% only edit the title when creating an event, yet could not finish that one-handed. Auto-focusing the title and moving the confirm buttons down cut the interaction path by about 40%. The biggest win, bottom tab navigation replacing top tabs, launched in MIUI 15.",
    zh: "我们用两种方式应用这张地图。静态地，把控件挪进舒适区。动态地，重新审视整条流程：在 50 万日历日活用户中，70% 的人创建日程时只编辑标题，却无法单手完成这一步。自动聚焦标题并把确认按钮下移后，交互路径缩短了约 40%。影响最大的改动，用底部标签导航取代顶部标签，随 MIUI 15 上线。",
  },
  flowStats: [
    { num: "500K", label: { en: "daily active users analyzed", zh: "分析的日活用户" } },
    { num: "70%", label: { en: "create events by editing title only", zh: "创建日程时只编辑标题" } },
    { num: "40%", sub: "↓", label: { en: "interaction path after redesign", zh: "重设计后的交互路径" } },
  ],
  quote: {
    en: "3.5 inches is the perfect size for consumers' hands.",
    zh: "3.5 英寸是最适合消费者手掌的完美尺寸。",
  },
  quoteBy: {
    en: "Steve Jobs, 2010. Screens kept growing anyway.",
    zh: "乔布斯，2010 年。屏幕后来还是一直在变大。",
  },
  closing: {
    en: "The findings were shared across design, product and research teams, and the method became the template for the folding screen, gesture and eye-tracking studies that followed.",
    zh: "研究结论在设计、产品与研究团队间共享，这套方法也成为后续折叠屏、手势和眼动研究的模板。",
  },
};

/* Inline JSX copy */
const UI = {
  en: {
    navMark: "Xueyi Zhou",
    back: "← Back to home",
    kicker: "Case study · Xiaomi · HCI research",
    m01: "Overview",
    m02: "Screens outgrew thumbs",
    m03: "The setup",
    m04: "The experiment",
    m05: "What the data showed",
    m06: "From map to shipped design",
    m07: "Takeaway",
    lOverview: "Overview",
    lContributions: "My contributions",
    lTeam: "Team",
    goalsNote: "The study aimed at three deliverables:",
    goalsAria: "Research goals",
    scopeAria: "Study scope",
    metricsNote: "Five metrics were collected for every zone:",
    metricsAria: "Metrics collected per zone",
    heatmapAlt:
      "The real hit-rate heatmaps from the study: two phone screens covered in per-zone percentages, left hand and right hand, with high hit rates pooling in the lower corner near each thumb and falling toward the opposite top corner",
    heatmapCaption: "Per-zone hit rates, left hand vs right hand. Warmer cells sit under the thumb.",
    ctaLine: "Want the full dataset and method?",
    ctaEmail: "Email me",
    ctaNext: "Next case study →",
    ctaHint: "sherrrrrryz@gmail.com · happy to walk through the research",
    colophon: "Xueyi (Sherry) Zhou © 2026",
  },
  zh: {
    navMark: "周雪怡",
    back: "← 返回首页",
    kicker: "案例研究 · 小米 · HCI 研究",
    m01: "概览",
    m02: "屏幕超过了拇指",
    m03: "研究设置",
    m04: "实验",
    m05: "数据说明了什么",
    m06: "从地图到上线设计",
    m07: "收获",
    lOverview: "概览",
    lContributions: "我的职责",
    lTeam: "团队",
    goalsNote: "这项研究瞄准三项产出：",
    goalsAria: "研究目标",
    scopeAria: "研究范围",
    metricsNote: "每个分区采集五项指标：",
    metricsAria: "每个分区采集的指标",
    heatmapAlt:
      "研究得到的真实命中率热力图：两块布满各分区百分比的手机屏幕，分别是左手与右手，高命中率集中在拇指附近的下角，向对侧上角逐渐降低",
    heatmapCaption: "各分区命中率，左手与右手对比。暖色格子集中在拇指下方。",
    ctaLine: "想要完整的数据与方法吗？",
    ctaEmail: "给我写邮件",
    ctaNext: "下一个案例 →",
    ctaHint: "sherrrrrryz@gmail.com · 欢迎约我细讲这项研究",
    colophon: "周雪怡 (Sherry) © 2026",
  },
} as const;

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="thz-marker">
      <span className="thz-marker__num">{num}</span>
      <span>{label}</span>
      <span className="thz-marker__line" aria-hidden="true" />
    </div>
  );
}

/* small helpers shared by the inline diagrams */
function Phone({
  x,
  y,
  w,
  h,
  children,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: React.ReactNode;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="none" stroke="currentColor" strokeOpacity={0.75} strokeWidth={1.5} />
      {children}
    </g>
  );
}

/* ── 02 · Screens outgrew thumbs ─────────────────────────────────────
   A 3.5-inch 2010 phone next to a 6.8-inch 2021 phone, with the thumb's
   sweep drawn on the big one. Drawn locally in currentColor so it flips
   with the theme like every other surface. */
function GrowthDiagram() {
  const t = useT();
  return (
    <div
      className="thz-illo"
      role="img"
      aria-label={t({
        en: "Diagram comparing a 3.5-inch phone from 2010 with a 6.8-inch phone from 2021. On the large phone, the thumb's reach covers only the lower right region of the screen.",
        zh: "对比示意图：2010 年的 3.5 英寸手机与 2021 年的 6.8 英寸手机。在大屏手机上，拇指的可达范围只覆盖屏幕右下区域。",
      })}
    >
      <svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg">
        {/* small phone */}
        <Phone x={120} y={92} w={92} h={168}>
          <line x1={140} y1={112} x2={192} y2={112} stroke="currentColor" strokeOpacity={0.25} />
          <line x1={140} y1={240} x2={192} y2={240} stroke="currentColor" strokeOpacity={0.25} />
        </Phone>
        <text x={166} y={72} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "2010 · 3.5 IN", zh: "2010 · 3.5 英寸" })}
        </text>
        <text x={166} y={286} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "“the perfect size”", zh: "“完美尺寸”" })}
        </text>

        {/* growth ghosts */}
        <Phone x={268} y={72} w={104} h={192} opacity={0.22} />
        <Phone x={392} y={52} w={116} h={216} opacity={0.38} />

        {/* big phone with thumb sweep */}
        <g>
          <clipPath id="thz-growth-clip">
            <rect x={528} y={28} width={132} height={244} rx={12} />
          </clipPath>
          <g clipPath="url(#thz-growth-clip)">
            <circle cx={648} cy={272} r={128} fill="currentColor" fillOpacity={0.12} />
            <circle cx={648} cy={272} r={128} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 5" />
          </g>
          <Phone x={528} y={28} w={132} h={244} />
          <circle cx={648} cy={272} r={4} fill="currentColor" />
        </g>
        <text x={594} y={16} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "2021 · 6.8 IN", zh: "2021 · 6.8 英寸" })}
        </text>
        <text x={594} y={292} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "same thumb, twice the screen", zh: "拇指没变，屏幕翻倍" })}
        </text>
      </svg>
      <p className="thz-illo__caption">
        {t({ en: "Screens doubled. Thumbs didn’t.", zh: "屏幕翻倍了，拇指没有。" })}
      </p>
    </div>
  );
}

/* ── 03 · Two grips ──────────────────────────────────────────────────
   The two single-hand grips from desk research, each shown as a phone
   with the thumb's anchor point and sweep. */
function GripsDiagram() {
  const t = useT();
  const grip = (x: number, anchorY: number, title: string, note: string, id: string) => (
    <g>
      <clipPath id={id}>
        <rect x={x} y={64} width={120} height={196} rx={12} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <circle cx={x + 112} cy={anchorY} r={96} fill="currentColor" fillOpacity={0.1} />
        <circle cx={x + 112} cy={anchorY} r={96} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeDasharray="4 5" />
      </g>
      <Phone x={x} y={64} w={120} h={196} />
      <circle cx={x + 112} cy={anchorY} r={4} fill="currentColor" />
      {/* pinky position marker */}
      <text x={x + 60} y={44} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
        {title}
      </text>
      <text x={x + 60} y={286} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
        {note}
      </text>
    </g>
  );
  return (
    <div
      className="thz-illo"
      role="img"
      aria-label={t({
        en: "Diagram of the two single-hand grip styles: pinky supporting the back of the phone, giving a higher thumb anchor, and pinky catching the bottom edge, giving a lower thumb anchor.",
        zh: "两种单手握姿示意图：小拇指托住手机背面，拇指锚点更高；小拇指兜住底边，拇指锚点更低。",
      })}
    >
      <svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg">
        {grip(140, 208, t({ en: "GRIP A", zh: "握姿 A" }), t({ en: "pinky supports the back", zh: "小拇指托住背面" }), "thz-grip-a")}
        {grip(460, 252, t({ en: "GRIP B", zh: "握姿 B" }), t({ en: "pinky catches the bottom", zh: "小拇指兜住底边" }), "thz-grip-b")}
        {/* pinky lines */}
        <line x1={140} y1={198} x2={124} y2={198} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <line x1={496} y1={260} x2={496} y2={276} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <p className="thz-illo__caption">
        {t({
          en: "Two grips, two thumb anchors, two different maps · 20 participants each",
          zh: "两种握姿，两个拇指锚点，两张不同的地图 · 每组 20 人",
        })}
      </p>
    </div>
  );
}

/* ── 04 · The experiment ─────────────────────────────────────────────
   Left: the 8 by 18 zone grid on the test device. Right: one trial,
   long-press, wait, tap. */
function ExperimentDiagram() {
  const t = useT();
  const cols = 8;
  const rows = 18;
  const gx = 150;
  const gy = 40;
  const gw = 128;
  const gh = 232;
  const vlines = Array.from({ length: cols - 1 }, (_, i) => gx + ((i + 1) * gw) / cols);
  const hlines = Array.from({ length: rows - 1 }, (_, i) => gy + ((i + 1) * gh) / rows);
  return (
    <div
      className="thz-illo"
      role="img"
      aria-label={t({
        en: "Diagram of the experiment: the phone screen divided into an 8 by 18 grid of 144 zones, and the trial sequence, long-press a square, wait 1.5 seconds, tap it once it turns.",
        zh: "实验示意图：手机屏幕被划分为 8 × 18 共 144 个分区，试验流程为长按方块，等待 1.5 秒，方块变色后点击。",
      })}
    >
      <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg">
        <Phone x={gx - 8} y={gy - 8} w={gw + 16} h={gh + 16} />
        <g stroke="currentColor" strokeOpacity={0.22}>
          {vlines.map((x) => (
            <line key={`v${x}`} x1={x} y1={gy} x2={x} y2={gy + gh} />
          ))}
          {hlines.map((y) => (
            <line key={`h${y}`} x1={gx} y1={y} x2={gx + gw} y2={y} />
          ))}
        </g>
        {/* one highlighted zone */}
        <rect x={gx + (5 * gw) / cols} y={gy + (13 * gh) / rows} width={gw / cols} height={gh / rows} fill="currentColor" fillOpacity={0.85} />
        <text x={gx + gw / 2} y={gy + gh + 36} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "8 × 18 = 144 ZONES", zh: "8 × 18 = 144 个分区" })}
        </text>
        <text x={gx + gw / 2} y={gy + gh + 54} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "each 9 × 9 mm", zh: "每个 9 × 9 毫米" })}
        </text>

        {/* trial sequence */}
        <g>
          <rect x={392} y={116} width={48} height={48} rx={8} fill="currentColor" fillOpacity={0.85} />
          <text x={416} y={196} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
            {t({ en: "LONG-PRESS", zh: "长按" })}
          </text>

          <path d="M456 140h28m0 0-8-6m8 6-8 6" fill="none" stroke="currentColor" strokeOpacity={0.55} />

          <rect x={500} y={116} width={48} height={48} rx={8} fill="none" stroke="currentColor" strokeDasharray="4 5" />
          <text x={524} y={146} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.7}>
            1.5s
          </text>
          <text x={524} y={196} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
            {t({ en: "WAIT", zh: "等待" })}
          </text>

          <path d="M564 140h28m0 0-8-6m8 6-8 6" fill="none" stroke="currentColor" strokeOpacity={0.55} />

          <rect x={608} y={116} width={48} height={48} rx={8} fill="none" stroke="currentColor" strokeWidth={1.5} />
          <circle cx={632} cy={140} r={9} fill="none" stroke="currentColor" />
          <circle cx={632} cy={140} r={3} fill="currentColor" />
          <text x={632} y={196} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
            {t({ en: "TAP", zh: "点击" })}
          </text>
        </g>
        <text x={524} y={248} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "one trial per zone · both hands", zh: "每个分区一次试验 · 双手各测" })}
        </text>
      </svg>
      <p className="thz-illo__caption">
        {t({
          en: "One protocol, 144 zones, five metrics per zone",
          zh: "一套流程，144 个分区，每区五项指标",
        })}
      </p>
    </div>
  );
}

/* ── 05 · Three reach bands ──────────────────────────────────────────
   Stylized summary of the finding: easy, stretch and dead zones for each
   thumb, mirrored left and right. */
function ZonesDiagram() {
  const t = useT();
  const map = (x: number, mirrored: boolean, title: string, id: string) => {
    const ax = mirrored ? x + 10 : x + 130; /* thumb anchor corner */
    return (
      <g>
        <clipPath id={id}>
          <rect x={x} y={56} width={140} height={232} rx={12} />
        </clipPath>
        <rect x={x} y={56} width={140} height={232} rx={12} fill="currentColor" fillOpacity={0.05} />
        <g clipPath={`url(#${id})`}>
          <circle cx={ax} cy={288} r={172} fill="currentColor" fillOpacity={0.12} />
          <circle cx={ax} cy={288} r={108} fill="currentColor" fillOpacity={0.26} />
          <circle cx={ax} cy={288} r={172} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 5" />
          <circle cx={ax} cy={288} r={108} fill="none" stroke="currentColor" strokeOpacity={0.55} />
        </g>
        <Phone x={x} y={56} w={140} h={232} />
        <text x={x + 70} y={36} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {title}
        </text>
      </g>
    );
  };
  return (
    <div
      className="thz-illo"
      role="img"
      aria-label={t({
        en: "Diagram of the three reach bands for each thumb: an easy zone in the lower corner near the thumb, a stretch zone around it, and a dead zone in the far upper corner. Left and right hands mirror each other.",
        zh: "每根拇指的三个可达梯度示意图：靠近拇指的下角是舒适区，周围是延伸区，对侧上角是死区。左右手互为镜像。",
      })}
    >
      <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg">
        {map(130, true, t({ en: "LEFT THUMB", zh: "左手拇指" }), "thz-zone-l")}
        {map(450, false, t({ en: "RIGHT THUMB", zh: "右手拇指" }), "thz-zone-r")}
        {/* legend */}
        <g fontSize="12" fill="currentColor">
          <rect x={200} y={304} width={12} height={12} fill="currentColor" fillOpacity={0.26} />
          <text x={220} y={314} fillOpacity={0.7}>{t({ en: "easy", zh: "舒适" })}</text>
          <rect x={300} y={304} width={12} height={12} fill="currentColor" fillOpacity={0.12} />
          <text x={320} y={314} fillOpacity={0.7}>{t({ en: "stretch", zh: "延伸" })}</text>
          <rect x={410} y={304} width={12} height={12} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.3} />
          <text x={430} y={314} fillOpacity={0.7}>{t({ en: "dead zone", zh: "死区" })}</text>
        </g>
      </svg>
      <p className="thz-illo__caption">
        {t({
          en: "Every thumb draws the same three bands, mirrored per hand",
          zh: "每根拇指都画出相同的三个梯度，左右镜像",
        })}
      </p>
    </div>
  );
}

/* ── 06 · Top tabs to bottom tabs ────────────────────────────────────
   The single most impactful application: navigation moved from the dead
   zone into the easy zone, shipped in MIUI 15. */
function TabsDiagram() {
  const t = useT();
  const phone = (x: number, tabsTop: boolean, title: string, verdict: string, id: string) => {
    const y = 56;
    const h = 224;
    const tabY = tabsTop ? y + 14 : y + h - 40;
    return (
      <g>
        <clipPath id={id}>
          <rect x={x} y={y} width={132} height={h} rx={12} />
        </clipPath>
        <g clipPath={`url(#${id})`}>
          <circle cx={x + 122} cy={y + h} r={118} fill="currentColor" fillOpacity={0.1} />
          <circle cx={x + 122} cy={y + h} r={118} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeDasharray="4 5" />
        </g>
        <Phone x={x} y={y} w={132} h={h} />
        {/* tab bar: three pills */}
        <g fill="currentColor">
          <rect x={x + 14} y={tabY} width={30} height={10} rx={5} fillOpacity={0.9} />
          <rect x={x + 52} y={tabY} width={30} height={10} rx={5} fillOpacity={0.35} />
          <rect x={x + 90} y={tabY} width={30} height={10} rx={5} fillOpacity={0.35} />
        </g>
        {/* content ghost lines */}
        <g stroke="currentColor" strokeOpacity={0.18}>
          <line x1={x + 16} y1={y + 86} x2={x + 116} y2={y + 86} />
          <line x1={x + 16} y1={y + 110} x2={x + 116} y2={y + 110} />
          <line x1={x + 16} y1={y + 134} x2={x + 96} y2={y + 134} />
        </g>
        <text x={x + 66} y={36} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {title}
        </text>
        <text x={x + 66} y={306} textAnchor="middle" fontSize="14" fill="currentColor" fillOpacity={0.7}>
          {verdict}
        </text>
      </g>
    );
  };
  return (
    <div
      className="thz-illo"
      role="img"
      aria-label={t({
        en: "Before and after diagram: tab navigation at the top of the screen sits in the thumb's dead zone, tab navigation at the bottom sits inside the easy zone. The bottom layout shipped in MIUI 15.",
        zh: "改版前后示意图：屏幕顶部的标签导航位于拇指死区，底部的标签导航位于舒适区。底部方案随 MIUI 15 上线。",
      })}
    >
      <svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg">
        {phone(
          134,
          true,
          t({ en: "BEFORE · TOP TABS", zh: "改版前 · 顶部标签" }),
          t({ en: "✕ tabs in the dead zone", zh: "✕ 标签在死区" }),
          "thz-tabs-a"
        )}
        <path d="M330 168h56m0 0-10-7m10 7-10 7" fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.5} />
        {phone(
          454,
          false,
          t({ en: "AFTER · BOTTOM TABS", zh: "改版后 · 底部标签" }),
          t({ en: "✓ tabs under the thumb", zh: "✓ 标签在拇指下方" }),
          "thz-tabs-b"
        )}
      </svg>
      <p className="thz-illo__caption">
        {t({
          en: "The most impactful change, launched in MIUI 15",
          zh: "影响最大的改动，随 MIUI 15 上线",
        })}
      </p>
    </div>
  );
}

export default function ProjectTouchHotspots() {
  const [lang, setLang] = useState<Lang>("en");

  /* Restore the saved language after hydration (SSR is always English, so
     the first client render matches the server markup — no mismatch). */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "zh" || saved === "en") setLang(saved);
    } catch {
      /* private mode etc. — stay in English */
    }
  }, []);

  /* Keep <html lang> honest for screen readers / search engines. */
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* private mode etc. — language still applies for this visit */
    }
  };

  const t = (s: L10n) => s[lang];
  const u = UI[lang];

  return (
    <LangContext.Provider value={lang}>
    <div className="thz-root">
      <nav className="thz-nav" aria-label="Primary">
        <Link href="/" className="thz-nav__mark">
          {u.navMark}
        </Link>
        <div className="thz-nav__right">
          <Link href="/" className="thz-nav__link">
            {u.back}
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="thz-section thz-hero">
        <div className="thz-wrap">
          <div className="thz-hero__kicker">{u.kicker}</div>
          <h1 className="thz-hero__title">{t(project.title)}</h1>
          <p className="thz-hero__dek">{t(project.dek)}</p>
          <div className="thz-hero__meta">{t(project.subtitle)}</div>
          <div className="thz-stats">
            {project.stats.map((s, i) => (
              <div className="thz-stat" key={i}>
                <div className="thz-stat__num">
                  {s.num}
                  {s.sub ? <sub>{s.sub}</sub> : null}
                </div>
                <div className="thz-stat__label">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 · Overview ────────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="01" label={u.m01} />
          <div className="thz-grid3">
            <div>
              <div className="thz-label">{u.lOverview}</div>
              <p className="thz-body">{t(project.overview)}</p>
            </div>
            <div>
              <div className="thz-label">{u.lContributions}</div>
              <ul className="thz-plain-list">
                {project.contributions.map((c, i) => (
                  <li key={i}>{t(c)}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="thz-label">{u.lTeam}</div>
              <ul className="thz-plain-list">
                {project.team.map((m, i) => (
                  <li key={i}>{t(m)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Screens outgrew thumbs ──────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="02" label={u.m02} />
          <p className="thz-body">{t(project.why)}</p>
          <GrowthDiagram />
          <p className="thz-note">{u.goalsNote}</p>
          <ul className="thz-chips" style={{ marginTop: 14 }} aria-label={u.goalsAria}>
            {project.goals.map((g, i) => (
              <li className="thz-chip thz-chip--num" key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t(g)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 03 · The setup ───────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="03" label={u.m03} />
          <p className="thz-body">{t(project.setup)}</p>
          <GripsDiagram />
          <ul className="thz-chips" style={{ marginTop: 24 }} aria-label={u.scopeAria}>
            {project.scope.map((s, i) => (
              <li className="thz-chip" key={i}>
                {t(s)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 04 · The experiment ──────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="04" label={u.m04} />
          <p className="thz-body">{t(project.experiment)}</p>
          <ExperimentDiagram />
          <p className="thz-note">{u.metricsNote}</p>
          <ul className="thz-chips" style={{ marginTop: 14 }} aria-label={u.metricsAria}>
            {project.metrics.map((m, i) => (
              <li className="thz-chip" key={i}>
                {t(m)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 05 · What the data showed ────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="05" label={u.m05} />
          <p className="thz-body">{t(project.findings)}</p>
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/toucharea/Cover.png" alt={u.heatmapAlt} loading="lazy" draggable={false} />
            <figcaption>{u.heatmapCaption}</figcaption>
          </figure>
          <ZonesDiagram />
        </div>
      </section>

      {/* ── 06 · From map to shipped design ──────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="06" label={u.m06} />
          <p className="thz-body">{t(project.shipped)}</p>
          <div className="thz-stats thz-stats--3">
            {project.flowStats.map((s, i) => (
              <div className="thz-stat" key={i}>
                <div className="thz-stat__num">
                  {s.num}
                  {s.sub ? <sub>{s.sub}</sub> : null}
                </div>
                <div className="thz-stat__label">{t(s.label)}</div>
              </div>
            ))}
          </div>
          <TabsDiagram />
        </div>
      </section>

      {/* ── 07 · Takeaway ────────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="07" label={u.m07} />
          <blockquote className="thz-quote">
            &ldquo;{t(project.quote)}&rdquo;
            <span className="thz-quote__by">{t(project.quoteBy)}</span>
          </blockquote>
          <p className="thz-note">{t(project.closing)}</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <p className="thz-cta__line">{u.ctaLine}</p>
          <div className="thz-cta__row">
            <a className="thz-btn" href="mailto:sherrrrrryz@gmail.com">
              {u.ctaEmail}
            </a>
            <Link className="thz-btn thz-btn--ghost" href="/projects/miui-design-system">
              {u.ctaNext}
            </Link>
          </div>
          <div className="thz-cta__hint">{u.ctaHint}</div>
          <div className="thz-colophon">
            <span>{u.colophon}</span>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>
      </section>
    </div>
    </LangContext.Provider>
  );
}
