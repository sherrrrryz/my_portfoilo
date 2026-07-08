'use client';

/* ============================================================================
   /projects/applovin-oobe — case-study landing for the AppLovin OOBE app
   discovery experiments, told the same way as /projects/lockscreen and
   /projects/miui-design-system: short editorial copy on the shared
   monochrome token scale, with the long deck text replaced by stat bands,
   inline SVG diagrams and sanitized flow images from public/oobe/.

   Bilingual: every copy string is an { en, zh } pair picked by a lang state
   (persisted in localStorage "lang", shared with / and /about). The toggle
   lives in the footer colophon, bottom right. SSR renders English; a
   returning zh reader flips after hydration. Route metadata moved to
   ./layout.tsx (client components can't export it).

   No TSX imports shared with the homepage or the other case studies
   (isolation rule): layout primitives are local markup, styling lives in
   ./oobe.css on the shared token scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./oobe.css";

import Link from "next/link";
import React, { createContext, useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

/* ── i18n plumbing ─────────────────────────────────────────────────
   Per-page copy of the homepage recipe (isolation rule: no shared TSX).
   The context feeds the SVG diagrams and the Take block, which render
   their own labels. */
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
      className="alo-lang"
      aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
      onClick={() => onChange(lang === "en" ? "zh" : "en")}
    >
      {lang === "en" ? "中文" : "English"}
    </button>
  );
}

/** Data model (edit here to drive the page) */
const project = {
  title: { en: "OOBE App Discovery", zh: "OOBE 应用发现" },
  dek: {
    en: "Four experiments to make app recommendations on a brand-new Android phone worth the tap.",
    zh: "四组实验，让全新 Android 手机上的应用推荐值得一点。",
  },
  subtitle: {
    en: "Product Design · Experiment Design · Growth",
    zh: "产品设计 · 实验设计 · 增长",
  },
  stats: [
    { num: "10M+", label: { en: "new-device users reached", zh: "覆盖的新设备用户" } },
    { num: "4", label: { en: "experiment tracks shipped", zh: "上线的实验方向" } },
    { num: "+10.6%", label: { en: "distribution lift, best track", zh: "最佳方向的分发提升" } },
    { num: "75%", label: { en: "bundle click-through rate", zh: "应用包点击率" } },
  ],
  overview: {
    en: "AppLovin's discovery SDK runs inside the first-run setup of new Android phones, shipping with OEM and carrier partners such as Samsung and T-Mobile, plus partners across Europe. I ran a ladder of experiments on the app recommendation step, so more users would engage with it and complete installs, without adding real friction to device setup. At this scale, even small metric shifts translate into meaningful impact.",
    zh: "AppLovin 的分发 SDK 运行在新 Android 手机的开机引导流程里，随三星、T-Mobile 等 OEM 与运营商合作伙伴出货，也覆盖欧洲多家合作伙伴。我在应用推荐环节主导了一系列阶梯式实验，让更多用户愿意与它互动并完成安装，同时不给开机流程增加真正的负担。在这样的规模下，哪怕很小的指标变化也意味着可观的影响。",
  },
  contributions: [
    { en: "Experience design for all four experiment tracks", zh: "四个实验方向的体验设计" },
    { en: "Survey, bundle and swipe flow design", zh: "问卷、应用包与滑卡流程设计" },
    { en: "Metric definition with data analysis", zh: "与数据分析共同定义指标" },
    { en: "Iteration on live funnel results", zh: "基于线上漏斗数据迭代" },
  ],
  team: [
    { en: "Design Lead, strategy and partner alignment", zh: "设计负责人，负责策略与合作伙伴对齐" },
    { en: "Product Designer (me)", zh: "产品设计师（我）" },
    { en: "Data Analyst", zh: "数据分析师" },
    { en: "Engineering team", zh: "工程团队" },
  ],
  redact: {
    en: "Confidentiality note: the screens, copy, app lists and absolute numbers on this page are sanitized placeholders. Only the uplift percentages come from the real experiments.",
    zh: "保密说明：本页的界面、文案、应用列表与绝对数值均为脱敏后的占位内容，只有提升百分比来自真实实验。",
  },
  baseline: {
    en: "During setup, users see an opt-in page, then a recommendation list where some apps come pre-selected, then a done page. Most users tapped Continue within seconds and never really reviewed what was checked. Installs stayed low, and the signals we had suggested many of them were passive accepts rather than choices.",
    zh: "在开机设置中，用户会先看到一个授权页，然后是一份部分应用已被预选的推荐列表，最后是完成页。大多数用户几秒钟内就点了继续，从没真正看过勾选了什么。安装量一直很低，而已有的信号表明，其中许多是被动接受，而不是主动选择。",
  },
  problem: {
    en: "A new phone is the coldest start there is. We knew nothing about the user, the user was in a hurry, and partners like Samsung required every added step to be optional and skippable. So the bet became: spend a few seconds learning preferences first, then make every later screen work harder.",
    zh: "新手机是最冷的冷启动。我们对用户一无所知，用户又赶时间，而三星等合作伙伴要求新增的每一步都必须可选、可跳过。于是我们押注：先花几秒钟了解偏好，再让之后的每个页面都更高效地工作。",
  },
  constraints: [
    {
      title: { en: "Cold start", zh: "冷启动" },
      txt: {
        en: "Zero preference signals on a brand-new device, so recommendations often missed.",
        zh: "全新设备上没有任何偏好信号，推荐经常不准。",
      },
    },
    {
      title: { en: "Time pressure", zh: "时间压力" },
      txt: {
        en: "Setup is a chore. Nobody browses, nobody reads, everybody taps Continue.",
        zh: "开机设置是件苦差事。没人浏览，没人阅读，人人都在点继续。",
      },
    },
    {
      title: { en: "Trust and control", zh: "信任与控制" },
      txt: {
        en: "Every added step had to be understandable, optional and skippable, by partner requirement.",
        zh: "按合作伙伴要求，新增的每一步都必须易懂、可选、可跳过。",
      },
    },
    {
      title: { en: "Fragile pipeline", zh: "脆弱的链路" },
      txt: {
        en: "Install completion also depends on network and system pacing, not just the UI.",
        zh: "安装完成率还取决于网络与系统调度，而不只是 UI。",
      },
    },
  ],
  experiments: {
    survey5: {
      hypothesis: {
        en: "Let users express preferences in five quick steps, and recommendations become relevant enough to lift completed installs.",
        zh: "让用户通过五个快速步骤表达偏好，推荐就会足够相关，从而带动完成安装量上升。",
      },
      stats: [
        { num: "55%", label: { en: "finished all five steps", zh: "完成全部五步" } },
        { num: "93%+", label: { en: "step conversion after page one", zh: "第一页之后的分步转化率" } },
        { num: "+0.21", label: { en: "net clicks per user", zh: "人均净点击增量" } },
        { num: "+4.1%", label: { en: "total distribution", zh: "总分发量提升" } },
      ],
      takeaway: {
        en: "Users were not looking for speed, they were looking for relevance. Leading with social apps instead of games made page one land, and almost everyone who cleared it finished the rest.",
        zh: "用户要的不是快，而是相关。第一页从游戏换成社交应用后立刻见效，而几乎所有过了第一页的用户都完成了剩余步骤。",
      },
    },
    survey1: {
      hypothesis: {
        en: "Compress the five pages into one, and completion should soar, and installs with it.",
        zh: "把五页压缩成一页，完成率应该会飙升，安装量也随之上涨。",
      },
      takeaway: {
        en: "Completion jumped, installs did not follow. Five steps warmed users up; one page ended before they started to care. Meaningful friction beat raw speed, so the 5-step survey stayed.",
        zh: "完成率跳升了，安装量却没有跟上。五步让用户逐渐进入状态；一页在他们开始在意之前就结束了。有意义的摩擦胜过单纯的速度，所以五步问卷被保留了下来。",
      },
    },
    bundle: {
      hypothesis: {
        en: "OOBE users want setup done. Package the recommendations into one bundle, cut the decisions, lift the conversions.",
        zh: "OOBE 用户只想快点装完。把推荐打包成一个应用包，减少决策数量，提升转化。",
      },
      stats: [
        { num: "0.47", label: { en: "net installs per user, exposed", zh: "人均净安装，图标外露版" } },
        { num: "0.37", label: { en: "net installs per user, collapsed", zh: "人均净安装，折叠版" } },
        { num: "+10.6%", label: { en: "total distribution", zh: "总分发量提升" } },
        { num: "75%", label: { en: "bundle click-through rate", zh: "应用包点击率" } },
      ],
      takeaway: {
        en: "Transparency won. The cleaner collapsed version read as a blind box, and hiding the contents cost more trust than the tidy layout earned. The bundle also front-loaded conversion so hard that it diluted every screen after it.",
        zh: "透明赢了。更简洁的折叠版看起来像个盲盒，隐藏内容损失的信任超过了整洁版式带来的收益。应用包还把转化过度前置，稀释了它之后的每个页面。",
      },
    },
    swipe: {
      hypothesis: {
        en: "A list is easy to ignore. A card you must swipe is not. Require one decision at a time, and attention should turn into installs.",
        zh: "列表容易被忽略，必须滑动的卡片则不然。要求用户一次做一个决定，注意力就会转化为安装。",
      },
      stats: [
        { num: "13.52%", label: { en: "CTR at 3 required swipes", zh: "必滑 3 张时的点击率" } },
        { num: "15.65%", label: { en: "CTR at 10 required swipes", zh: "必滑 10 张时的点击率" } },
      ],
      takeaway: {
        en: "Forced engagement beat free browsing. Swiping made users process each app instead of skimming past a list, and that interaction cost converted lost attention into real clicks and installs.",
        zh: "强制参与胜过自由浏览。滑卡让用户认真处理每一个应用，而不是扫一眼列表就划过去；这种交互成本把流失的注意力变成了真实的点击与安装。",
      },
    },
  },
  measurement: {
    en: "Because pre-selection inflates raw install counts, the metric that mattered most was CIPEU: completed installs per engaged user. It only counts installs users actively chose. Around it we tracked a small system of checks.",
    zh: "由于预选会虚高原始安装数，最重要的指标是 CIPEU：每位互动用户的完成安装量，只统计用户主动选择的安装。围绕它，我们还跟踪了一小套检验指标。",
  },
  metricChips: [
    { en: "Completion rate", zh: "完成率" },
    { en: "CTR", zh: "点击率" },
    { en: "CIPEU", zh: "CIPEU" },
    { en: "Net lift", zh: "净增量" },
    { en: "Install success rate", zh: "安装成功率" },
    { en: "Scroll depth", zh: "滚动深度" },
    { en: "Time on page", zh: "页面停留时长" },
  ],
  learnings: [
    {
      head: { en: "Meaningful friction beats speed.", zh: "有意义的摩擦胜过速度。" },
      txt: {
        en: "The 5-step survey out-earned the 1-page version even though fewer people finished it.",
        zh: "尽管完成的人更少，五步问卷的收益仍超过了单页版。",
      },
    },
    {
      head: { en: "Transparency beats minimalism.", zh: "透明胜过极简。" },
      txt: {
        en: "Showing every app in the bundle beat the cleaner collapsed layout on installs.",
        zh: "把应用包里的每个应用都展示出来，安装量胜过更简洁的折叠版式。",
      },
    },
    {
      head: { en: "Required beats optional, when the value is real.", zh: "当价值真实存在时，必选胜过可选。" },
      txt: {
        en: "Mandatory swipes produced the highest click-through rate of any track.",
        zh: "强制滑卡带来了所有方向中最高的点击率。",
      },
    },
  ],
  closing: {
    en: "Later rounds combined the bundle and swipe models, re-ordered survey options by advertiser mix, and split games into deeper subcategories. Together the tracks form one distribution system: capture intent early, then spend it efficiently.",
    zh: "后续几轮把应用包与滑卡模式结合，按广告主结构重排了问卷选项，并把游戏拆分成更细的子类目。这些方向共同构成一套分发系统：先捕获意图，再高效地使用它。",
  },
};

/* Inline JSX copy */
const UI = {
  en: {
    navMark: "Xueyi Zhou",
    back: "← Back to home",
    kicker: "Case study · AppLovin · Android OOBE",
    m01: "Overview",
    m02: "The baseline",
    m03: "Four constraints, one bet",
    m04: "Experiment 1 · The 5-step survey",
    m05: "Experiment 2 · The 1-page survey",
    m06: "Experiment 3 · The one-tap bundle",
    m07: "Experiment 4 · Swipe cards",
    m08: "What I measured, what I learned",
    lOverview: "Overview",
    lContributions: "My contributions",
    lTeam: "Team",
    lHypothesis: "Hypothesis",
    constraintTag: "Constraint",
    variantA: "Variant A · collapsed",
    variantB: "Variant B · icons exposed · winner",
    chipsAria: "Metrics tracked across the experiments",
    altBaseline:
      "Sanitized baseline flow screens: opt-in page, recommendation list with pre-selected apps, and done page",
    altExp1: "Sanitized screens of the 5-step preference survey, one app category per page",
    altExp2: "Sanitized screen of the single-page survey with all app categories combined",
    altExp3a: "Sanitized bundle screen, variant A: collapsed view hiding the apps inside the bundle",
    altExp3b: "Sanitized bundle screen, variant B: every app icon inside the bundle shown up front",
    altExp4:
      "Sanitized screens of the Tinder-style swipe cards, one app per card with accept and skip gestures",
    ctaLine: "Want the full experiment ladder, round by round?",
    ctaEmail: "Email me",
    ctaNext: "Next case study →",
    ctaHint: "sherrrrrryz@gmail.com · happy to walk through the real data",
    colophon: "Xueyi (Sherry) Zhou © 2026",
  },
  zh: {
    navMark: "周雪怡",
    back: "← 返回首页",
    kicker: "案例研究 · AppLovin · Android 开机引导",
    m01: "概览",
    m02: "基线现状",
    m03: "四个约束，一次押注",
    m04: "实验一 · 五步问卷",
    m05: "实验二 · 单页问卷",
    m06: "实验三 · 一键应用包",
    m07: "实验四 · 滑动卡片",
    m08: "度量与所得",
    lOverview: "概览",
    lContributions: "我的职责",
    lTeam: "团队",
    lHypothesis: "假设",
    constraintTag: "约束",
    variantA: "方案 A · 折叠",
    variantB: "方案 B · 图标外露 · 胜出",
    chipsAria: "各实验共同跟踪的指标",
    altBaseline: "脱敏后的基线流程界面：授权页、预选应用的推荐列表和完成页",
    altExp1: "脱敏后的五步偏好问卷界面，每页一个应用类目",
    altExp2: "脱敏后的单页问卷界面，所有应用类目合并在一页",
    altExp3a: "脱敏后的应用包界面，方案 A：折叠视图，隐藏包内应用",
    altExp3b: "脱敏后的应用包界面，方案 B：包内每个应用图标直接外露",
    altExp4: "脱敏后的滑动卡片界面，每张卡片一个应用，支持接受与跳过手势",
    ctaLine: "想逐轮了解完整的实验阶梯吗？",
    ctaEmail: "给我写邮件",
    ctaNext: "下一个案例 →",
    ctaHint: "sherrrrrryz@gmail.com · 欢迎约我看真实数据",
    colophon: "周雪怡 (Sherry) © 2026",
  },
} as const;

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="alo-marker">
      <span className="alo-marker__num">{num}</span>
      <span>{label}</span>
      <span className="alo-marker__line" aria-hidden="true" />
    </div>
  );
}

function Fig({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="alo-fig">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" draggable={false} />
    </figure>
  );
}

function XStats({ stats }: { stats: { num: string; label: L10n }[] }) {
  const t = useT();
  return (
    <div className="alo-xstats">
      {stats.map((s, i) => (
        <div className="alo-stat" key={i}>
          <div className="alo-stat__num">{s.num}</div>
          <div className="alo-stat__label">{t(s.label)}</div>
        </div>
      ))}
    </div>
  );
}

function Take({ txt }: { txt: L10n }) {
  const t = useT();
  return (
    <div className="alo-take">
      <div className="alo-take__label">{t({ en: "What we learned", zh: "我们学到的" })}</div>
      <p className="alo-take__txt">{t(txt)}</p>
    </div>
  );
}

/* ── Inline diagram: the baseline flow ──────────────────────────────
   Three screens joined by forward arrows. Drawn locally in currentColor
   so it flips with the theme like every other surface. */
function BaselineDiagram() {
  const t = useT();
  const box = (x: number, title: string, tag: string) => (
    <g>
      <rect x={x} y={64} width={192} height={64} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.75} />
      <text x={x + 96} y={101} textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor">
        {title}
      </text>
      <text x={x + 96} y={156} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
        {tag}
      </text>
    </g>
  );
  const arrow = (x: number) => (
    <g stroke="currentColor" strokeOpacity={0.55} fill="none">
      <line x1={x} y1={96} x2={x + 52} y2={96} />
      <path d={`M${x + 44} 90 L${x + 54} 96 L${x + 44} 102`} />
    </g>
  );
  return (
    <div
      className="alo-illo"
      role="img"
      aria-label={t({
        en: "Diagram of the baseline flow: an opt-in screen, a recommendation list with pre-selected apps, and a done screen",
        zh: "基线流程示意图：授权页、预选应用的推荐列表和完成页",
      })}
    >
      <svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg">
        <text x={0} y={20} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {t({
            en: "THE BASELINE · THREE SCREENS, SECONDS OF ATTENTION",
            zh: "基线流程 · 三个页面，几秒钟的注意力",
          })}
        </text>
        {box(8, t({ en: "Opt-in", zh: "授权页" }), t({ en: "Continue or Not now", zh: "继续，或暂不" }))}
        {box(264, t({ en: "Recommendations", zh: "推荐列表" }), t({ en: "apps pre-selected", zh: "应用已预选" }))}
        {box(520, t({ en: "Done", zh: "完成页" }), t({ en: "Finish", zh: "完成" }))}
        {arrow(206)}
        {arrow(462)}
      </svg>
      <p className="alo-illo__caption">
        {t({
          en: "Most users tap straight through without reviewing a thing",
          zh: "大多数用户什么都没看，就一路点了过去",
        })}
      </p>
    </div>
  );
}

/* ── Inline chart: experiment 1 vs experiment 2 ─────────────────────
   Two bar groups telling the one-page paradox: completion up, installs
   down. Scales are per-group (completion in %, install lift capped at
   20%), values from the real experiment read-outs. */
function SurveyBars() {
  const t = useT();
  const row = (y: number, label: string, value: string, w: number, solid: boolean) => (
    <g>
      <text x={0} y={y + 14} fontSize="12" fill="currentColor" fillOpacity={0.7}>
        {label}
      </text>
      <rect x={120} y={y} width={w} height={18} rx={3} fill="currentColor" fillOpacity={solid ? 0.9 : 0.3} />
      <text x={128 + w} y={y + 14} fontSize="12" fontWeight="600" fill="currentColor">
        {value}
      </text>
    </g>
  );
  const l5 = t({ en: "5-step", zh: "五步版" });
  const l1 = t({ en: "1-page", zh: "单页版" });
  /* completion: % of 100 → px of 480; lift: % of 20 → px of 480 */
  return (
    <div
      className="alo-illo"
      role="img"
      aria-label={t({
        en: "Bar chart comparing the two surveys. Survey completion: 55 percent for the 5-step version, over 80 percent for the 1-page version. Install lift: plus 18 percent for the 5-step version, plus 14 percent for the 1-page version.",
        zh: "两版问卷的柱状对比图。问卷完成率：五步版 55%，单页版超过 80%。安装提升：五步版 +18%，单页版 +14%。",
      })}
    >
      <svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg">
        <text x={0} y={16} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "SURVEY COMPLETION", zh: "问卷完成率" })}
        </text>
        {row(32, l5, "55%", 264, false)}
        {row(60, l1, "80%+", 384, true)}
        <text x={0} y={146} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "INSTALL LIFT", zh: "安装提升" })}
        </text>
        {row(162, l5, "+18%", 432, true)}
        {row(190, l1, "+14%", 336, false)}
      </svg>
      <p className="alo-illo__caption">
        {t({
          en: "One page finished more surveys. Five steps sold more installs.",
          zh: "单页版完成了更多问卷，五步版带来了更多安装。",
        })}
      </p>
    </div>
  );
}

/* small line pictograms for the constraint cards */
const ICONS = {
  coldstart: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 6v36M9 15.5l30 17M39 15.5l-30 17" />
      <path d="M19 9l5 5 5-5M19 39l5-5 5 5" opacity="0.55" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="26" r="16" />
      <path d="M24 16v10l7 5" />
      <path d="M19 4h10" opacity="0.55" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 4l16 6v12c0 11-7 18-16 22C15 40 8 33 8 22V10z" />
      <path d="M17 24l5 5 9-10" opacity="0.55" />
    </svg>
  ),
  pipeline: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 4v16m0 8v4" strokeDasharray="0" />
      <path d="M24 20v8" opacity="0.35" strokeDasharray="3 4" />
      <path d="M17 26l7 7 7-7" />
      <path d="M8 40h32" opacity="0.55" />
    </svg>
  ),
};

export default function ProjectApplovinOobe() {
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
    <div className="alo-root">
      <nav className="alo-nav" aria-label="Primary">
        <Link href="/" className="alo-nav__mark">
          {u.navMark}
        </Link>
        <div className="alo-nav__right">
          <Link href="/" className="alo-nav__link">
            {u.back}
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="alo-section alo-hero">
        <div className="alo-wrap">
          <div className="alo-hero__kicker">{u.kicker}</div>
          <h1 className="alo-hero__title">{t(project.title)}</h1>
          <p className="alo-hero__dek">{t(project.dek)}</p>
          <div className="alo-hero__meta">{t(project.subtitle)}</div>
          <div className="alo-stats">
            {project.stats.map((s, i) => (
              <div className="alo-stat" key={i}>
                <div className="alo-stat__num">{s.num}</div>
                <div className="alo-stat__label">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 · Overview ────────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="01" label={u.m01} />
          <div className="alo-grid3">
            <div>
              <div className="alo-label">{u.lOverview}</div>
              <p className="alo-body">{t(project.overview)}</p>
            </div>
            <div>
              <div className="alo-label">{u.lContributions}</div>
              <ul className="alo-plain-list">
                {project.contributions.map((c, i) => (
                  <li key={i}>{t(c)}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="alo-label">{u.lTeam}</div>
              <ul className="alo-plain-list">
                {project.team.map((m, i) => (
                  <li key={i}>{t(m)}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="alo-redact">{t(project.redact)}</p>
        </div>
      </section>

      {/* ── 02 · The baseline ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="02" label={u.m02} />
          <p className="alo-body">{t(project.baseline)}</p>
          <BaselineDiagram />
          <Fig src="/oobe/existing-flow.png" alt={u.altBaseline} />
        </div>
      </section>

      {/* ── 03 · The problem ─────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="03" label={u.m03} />
          <p className="alo-body">{t(project.problem)}</p>
          <div className="alo-cards4">
            {project.constraints.map((c, i) => (
              <div className="alo-card" key={i}>
                {[ICONS.coldstart, ICONS.clock, ICONS.shield, ICONS.pipeline][i]}
                <div className="alo-card__kicker">
                  {u.constraintTag} {String(i + 1).padStart(2, "0")}
                </div>
                <div className="alo-card__title">{t(c.title)}</div>
                <p className="alo-card__txt">{t(c.txt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · Experiment 1 ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="04" label={u.m04} />
          <div className="alo-label">{u.lHypothesis}</div>
          <p className="alo-body">{t(project.experiments.survey5.hypothesis)}</p>
          <Fig src="/oobe/exp1-survey.png" alt={u.altExp1} />
          <XStats stats={project.experiments.survey5.stats} />
          <Take txt={project.experiments.survey5.takeaway} />
        </div>
      </section>

      {/* ── 05 · Experiment 2 ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="05" label={u.m05} />
          <div className="alo-label">{u.lHypothesis}</div>
          <p className="alo-body">{t(project.experiments.survey1.hypothesis)}</p>
          <Fig src="/oobe/exp2-onepage.png" alt={u.altExp2} />
          <SurveyBars />
          <Take txt={project.experiments.survey1.takeaway} />
        </div>
      </section>

      {/* ── 06 · Experiment 3 ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="06" label={u.m06} />
          <div className="alo-label">{u.lHypothesis}</div>
          <p className="alo-body">{t(project.experiments.bundle.hypothesis)}</p>
          <div className="alo-pair">
            <div className="alo-pair__cell">
              <div className="alo-pair__tag">{u.variantA}</div>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/oobe/exp3-bundle-a.png" alt={u.altExp3a} loading="lazy" draggable={false} />
              </figure>
            </div>
            <div className="alo-pair__cell alo-pair__cell--win">
              <div className="alo-pair__tag">{u.variantB}</div>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/oobe/exp3-bundle-b.png" alt={u.altExp3b} loading="lazy" draggable={false} />
              </figure>
            </div>
          </div>
          <XStats stats={project.experiments.bundle.stats} />
          <Take txt={project.experiments.bundle.takeaway} />
        </div>
      </section>

      {/* ── 07 · Experiment 4 ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="07" label={u.m07} />
          <div className="alo-label">{u.lHypothesis}</div>
          <p className="alo-body">{t(project.experiments.swipe.hypothesis)}</p>
          <Fig src="/oobe/exp4-swipe.png" alt={u.altExp4} />
          <XStats stats={project.experiments.swipe.stats} />
          <Take txt={project.experiments.swipe.takeaway} />
        </div>
      </section>

      {/* ── 08 · What I measured, what I learned ─────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="08" label={u.m08} />
          <p className="alo-body">{t(project.measurement)}</p>
          <ul className="alo-chips" aria-label={u.chipsAria}>
            {project.metricChips.map((m, i) => (
              <li className="alo-chip" key={i}>
                {t(m)}
              </li>
            ))}
          </ul>
          <div className="alo-rows">
            {project.learnings.map((l, i) => (
              <div className="alo-row" key={i}>
                <span className="alo-row__idx">{String(i + 1).padStart(2, "0")}</span>
                <p className="alo-row__txt">
                  <strong>{t(l.head)}</strong> {t(l.txt)}
                </p>
              </div>
            ))}
          </div>
          <p className="alo-note">{t(project.closing)}</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <p className="alo-cta__line">{u.ctaLine}</p>
          <div className="alo-cta__row">
            <a className="alo-btn" href="mailto:sherrrrrryz@gmail.com">
              {u.ctaEmail}
            </a>
            <Link className="alo-btn alo-btn--ghost" href="/projects/miui-design-system">
              {u.ctaNext}
            </Link>
          </div>
          <div className="alo-cta__hint">{u.ctaHint}</div>
          <div className="alo-colophon">
            <span>{u.colophon}</span>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>
      </section>
    </div>
    </LangContext.Provider>
  );
}
