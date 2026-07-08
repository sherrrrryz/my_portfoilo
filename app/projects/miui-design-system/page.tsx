'use client';

/* ============================================================================
   /projects/miui-design-system — case-study landing for MIUI Design System
   2.0, told the same way as /projects/lockscreen: short editorial copy on
   the shared monochrome token scale, with the long deck text replaced by
   stat bands, inline SVG diagrams, and before/after image pairs.

   Bilingual: every copy string is an { en, zh } pair picked by a lang state
   (persisted in localStorage "lang", shared with / and /about). The toggle
   lives in the footer colophon, bottom right. SSR renders English; a
   returning zh reader flips after hydration. Route metadata moved to
   ./layout.tsx (client components can't export it).

   No TSX imports shared with the homepage or the lockscreen route
   (isolation rule): layout primitives are local markup, styling lives in
   ./miui-ds.css on the shared token scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./miui-ds.css";

import Link from "next/link";
import React, { createContext, useContext, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

/* ── i18n plumbing ─────────────────────────────────────────────────
   Per-page copy of the homepage recipe (isolation rule: no shared TSX).
   The context feeds the SVG diagram, which renders its own labels. */
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
      className="mds-lang"
      aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
      onClick={() => onChange(lang === "en" ? "zh" : "en")}
    >
      {lang === "en" ? "中文" : "English"}
    </button>
  );
}

/** Data model (edit here to drive the page) */
const project = {
  title: { en: "MIUI Design System 2.0", zh: "MIUI 设计规范 2.0" },
  dek: {
    en: "Turning a guideline nobody trusted into a system ten thousand employees could build on.",
    zh: "把一份无人信任的设计规范，升级为上万名员工可以依赖的系统。",
  },
  subtitle: {
    en: "Design Systems · Design Ops · Design-led, no PM",
    zh: "设计系统 · 设计运营 · 设计主导，无产品经理",
  },
  stats: [
    { num: "700M+", label: { en: "MIUI users served", zh: "服务的 MIUI 用户" } },
    { num: "30", label: { en: "components maintained", zh: "持续维护的组件" } },
    { num: "13", label: { en: "designers and engineers", zh: "设计师与工程师" } },
    { num: "8.9", sub: "/10", label: { en: "satisfaction after rebuild", zh: "重建后的满意度评分" } },
  ],
  overview: {
    en: "MIUI's design guideline served tens of thousands of employees across dozens of business lines, yet it was kept alive by one or two people. Rules were scattered and incomplete, and most teams had stopped trusting it. Over one year, from mid 2022 to early 2023, I led its upgrade into a system that is complete, sustainable to maintain, and measurable with clear metrics.",
    zh: "MIUI 的设计规范服务着数十条业务线的上万名员工，却只靠一两个人维系。规则零散且不完整，多数团队已经不再信任它。从 2022 年年中到 2023 年年初，我用一年时间主导了这次升级，让它成为一套内容完整、可持续维护、且有明确指标可衡量的系统。",
  },
  contributions: [
    { en: "Guideline team lead", zh: "规范小组负责人" },
    { en: "Research and metric definition", zh: "研究与指标定义" },
    { en: "Component guideline authoring", zh: "组件规范撰写" },
    { en: "Figma library rebuild", zh: "Figma 组件库重建" },
    { en: "Cross-team rollout and reviews", zh: "跨团队推广与评审" },
  ],
  team: [
    { en: "7-person guideline group, led by me", zh: "7 人规范小组，由我负责" },
    { en: "6 MIUI SDK engineers", zh: "6 名 MIUI SDK 工程师" },
    { en: "Reported to the head of Xiaomi Design", zh: "向小米设计负责人汇报" },
  ],
  background: {
    en: "In December 2021 I took over three things: the guideline website, the Figma component library, and a backlog of long-standing SDK issues. Content was out of date and incomplete, many rules lived only in people's heads, and when the docs disagreed with production, asking an engineer was the only way to learn the truth.",
    zh: "2021 年 12 月，我接手了三样东西：规范网站、Figma 组件库，以及一批长期积压的 SDK 问题。内容过时且不完整，许多规则只存在于人们的脑子里；当文档和线上表现不一致时，问工程师是了解真相的唯一途径。",
  },
  research: {
    en: "Before writing anything, we compared MIUI against three major design systems, interviewed the people who used ours daily, and ran a co-creation workshop to hear the voices we had missed.",
    zh: "在动笔之前，我们把 MIUI 与三大设计系统做了对标，访谈了每天使用规范的人，并组织了一场共创工作坊，去听那些被我们忽略的声音。",
  },
  problems: [
    {
      problem: {
        en: "Nobody knew what MIUIX was, or when to use the component library.",
        zh: "没人知道 MIUIX 是什么，也不知道什么时候该用组件库。",
      },
      goal: {
        en: "Build a MIUI knowledge base, linked with engineering docs.",
        zh: "建立 MIUI 知识库，并与工程文档打通。",
      },
    },
    {
      problem: {
        en: "Resources were scattered across Figma, the website and platforms, with no links between them.",
        zh: "资源散落在 Figma、网站和各个平台上，彼此之间没有链接。",
      },
      goal: {
        en: "Rebuild the Figma library with a clear linking system.",
        zh: "重建 Figma 组件库，建立清晰的链接体系。",
      },
    },
    {
      problem: {
        en: "Key rules were missing and nothing followed a standard structure.",
        zh: "关键规则缺失，内容没有统一的结构标准。",
      },
      goal: {
        en: "Standardize the document and Figma framework.",
        zh: "统一文档与 Figma 的框架结构。",
      },
    },
    {
      problem: {
        en: "Figma and shipped results often disagreed, so people stopped trusting both.",
        zh: "Figma 和上线结果经常不一致，大家对两边都失去了信任。",
      },
      goal: {
        en: "Partner with engineering to keep content true to what ships.",
        zh: "与工程团队协作，让内容与线上实现保持一致。",
      },
    },
  ],
  pilot: {
    en: "I rewrote the dialog guideline as a pilot, borrowing the structure we learned from benchmarking, and put it through two review rounds: first 9 close readers, then 30 testers scoring it against the quality metrics we defined along the way.",
    zh: "我以弹窗规范作为试点重写，借鉴了对标中学到的结构，并让它经过两轮评审：先由 9 位读者精读，再由 30 位测试者按照我们一路定义出的质量指标打分。",
  },
  metrics: [
    { en: "Comprehensive and reliable", zh: "全面且可靠" },
    { en: "Easy to read and learn", zh: "易读易学" },
    { en: "Clear customization boundary", zh: "自定义边界清晰" },
    { en: "Clear ownership and change log", zh: "责任人与变更记录明确" },
    { en: "Consistent across Figma, docs and code", zh: "Figma、文档与代码一致" },
  ],
  shipped: {
    en: "Phase 1 rebuilt the highest-frequency components, with every rule aligned with the SDK team: button, switch, list, floating window, reach-friendly dialog, loading, empty state and input field. Foundation guidelines for color, typography, type scale and motion were published for the first time.",
    zh: "第一阶段重建了使用频率最高的组件，每条规则都与 SDK 团队对齐：按钮、开关、列表、悬浮窗、易达性弹窗、加载、空状态和输入框。颜色、字体、字号阶梯与动效的基础规范也首次发布。",
  },
  anatomy: [
    { en: "Links & overview", zh: "链接与概览" },
    { en: "Types & scenarios", zh: "类型与场景" },
    { en: "Anatomy", zh: "结构解析" },
    { en: "Responsive rules", zh: "响应式规则" },
    { en: "Interaction rules", zh: "交互规则" },
    { en: "Do's and don'ts", zh: "正误示例" },
    { en: "Change log & customization", zh: "变更记录与自定义" },
  ],
  pairs: [
    {
      heading: { en: "From styles to tokens", zh: "从颜色样式到 Design Token" },
      caption: {
        en: "Color used to exist only as Figma styles. We rebuilt it as design tokens, with default, pressed, hover and disabled states defined across light and dark.",
        zh: "颜色过去只以 Figma 样式的形式存在。我们把它重建为 Design Token，在浅色与深色模式下分别定义了默认、按下、悬停和禁用状态。",
      },
      before: {
        src: "/miui/designtoken-before.png",
        alt: {
          en: "Old Figma color styles panel, flat lists of text and system colors",
          zh: "旧的 Figma 颜色样式面板，只有文本色与系统色的平铺列表",
        },
      },
      after: {
        src: "/miui/designtoken-after.png",
        alt: {
          en: "New MIUIX color token sheet with state and light/dark variants",
          zh: "新的 MIUIX 颜色 Token 表，包含状态与浅色深色变体",
        },
      },
    },
    {
      heading: { en: "From working file to documented spec", zh: "从工作文件到成文规范" },
      caption: {
        en: "The old library piled everything into a few crowded pages. The new one is indexed, split per component, built on Auto Layout and variants, and every rule is written down.",
        zh: "旧组件库把所有内容堆在几个拥挤的页面里。新组件库建立了索引，按组件拆分，基于 Auto Layout 与变体搭建，每条规则都被写成文档。",
      },
      before: {
        src: "/miui/components-before.png",
        alt: {
          en: "Old Figma component file with unlabeled frames piled together",
          zh: "旧的 Figma 组件文件，未命名的画板堆在一起",
        },
      },
      after: {
        src: "/miui/components-after.png",
        alt: {
          en: "New list component guideline pages with structure, states and examples",
          zh: "新的列表组件规范页面，包含结构、状态与示例",
        },
      },
    },
    {
      heading: { en: "From hidden bugs to global standards", zh: "从隐蔽问题到全局标准" },
      caption: {
        en: "Long-standing large-text and multi-language issues became a written global consistency standard, so every user sees the full content instead of a truncated version.",
        zh: "长期存在的大字体与多语言问题，被沉淀为一份成文的全局一致性标准，让每位用户都能看到完整内容，而不是被截断的版本。",
      },
      before: {
        src: "/miui/localization-before.png",
        alt: {
          en: "Screens with truncated localized text across MIUI apps",
          zh: "MIUI 各应用中本地化文本被截断的界面",
        },
      },
      after: {
        src: "/miui/localization-after.png",
        alt: {
          en: "Global consistency design standards document",
          zh: "全局一致性设计标准文档",
        },
      },
    },
  ],
  quote: {
    en: "We appointed a newcomer to lead a group of senior people, and it had to be cross-department. It sounded very unreliable.",
    zh: "我们让一个新人去带一群资深同事，还必须跨部门协作，听起来非常不靠谱。",
  },
  quoteBy: {
    en: "My manager, joking, before it worked",
    zh: "我的主管在项目成功之前的玩笑话",
  },
  closing: {
    en: "Most of what we achieved came from fast learning loops, leadership trust, and a team that genuinely wanted a better system.",
    zh: "我们取得的大部分成果，来自快速的学习循环、管理层的信任，以及一支真心想要更好系统的团队。",
  },
};

/* Inline JSX copy */
const UI = {
  en: {
    navMark: "Xueyi Zhou",
    back: "← Back to home",
    kicker: "Case study · Xiaomi MIUI · 2022–2023",
    m01: "Overview",
    m02: "The system I inherited",
    m03: "Listening first",
    m04: "Four problems, four goals",
    m05: "Prove it on one component",
    m06: "What shipped",
    m07: "Takeaway",
    lOverview: "Overview",
    lContributions: "My contributions",
    lTeam: "Team",
    cardBenchmarkKicker: "Benchmark",
    cardBenchmarkNum: "Apple · Google · IBM",
    cardBenchmarkTxt:
      "Compared against MIUI, the gap was bigger than expected. Color lived only in Figma styles, and dark mode had no system-level rules at all.",
    cardInterviewsKicker: "Interviews",
    cardInterviewsNum: "3 designers + 3 engineers",
    cardInterviewsTxt:
      "Each walked us through a recent piece of component work: where they looked things up, and where they got stuck.",
    cardWorkshopKicker: "Workshop",
    cardWorkshopNum: "~40 people co-creating",
    cardWorkshopTxt:
      "Designers, researchers and PMs added issues and needs with sticky notes, then voted on what hurt the most.",
    focusIntro:
      "Instead of trying to fix everything, we focused the year on the four problems that hurt daily efficiency and trust the most.",
    problemTag: "Problem",
    scoreMeta: "10 designers · 10 PMs · 10 engineers (N=30)",
    scoreAria: "Satisfaction score 8.9 out of 10",
    chipsAria: "Quality metrics the guideline is scored on",
    anatomyNote: "Every component doc now follows the same seven-part anatomy:",
    anatomyAria: "Seven-part component doc anatomy",
    baBefore: "Before",
    baAfter: "After",
    ctaLine: "Want the story behind the numbers?",
    ctaEmail: "Email me",
    ctaNext: "Next case study →",
    ctaHint: "sherrrrrryz@gmail.com · happy to walk through the full deck",
    colophon: "Xueyi (Sherry) Zhou © 2026",
  },
  zh: {
    navMark: "周雪怡",
    back: "← 返回首页",
    kicker: "案例研究 · 小米 MIUI · 2022–2023",
    m01: "概览",
    m02: "我接手的系统",
    m03: "先倾听",
    m04: "四个问题，四个目标",
    m05: "用一个组件验证",
    m06: "最终交付",
    m07: "收获",
    lOverview: "概览",
    lContributions: "我的职责",
    lTeam: "团队",
    cardBenchmarkKicker: "对标研究",
    cardBenchmarkNum: "Apple · Google · IBM",
    cardBenchmarkTxt:
      "与 MIUI 相比，差距比预期更大。颜色只存在于 Figma 样式里，深色模式完全没有系统级规则。",
    cardInterviewsKicker: "用户访谈",
    cardInterviewsNum: "3 名设计师 + 3 名工程师",
    cardInterviewsTxt:
      "每个人向我们完整讲了一次近期的组件工作：他们在哪里查资料，又在哪里卡住。",
    cardWorkshopKicker: "共创工作坊",
    cardWorkshopNum: "约 40 人参与共创",
    cardWorkshopTxt:
      "设计师、研究员和产品经理用便利贴写下问题与需求，再投票选出最痛的部分。",
    focusIntro:
      "我们没有试图解决所有问题，而是把这一年聚焦在最影响日常效率与信任的四个问题上。",
    problemTag: "问题",
    scoreMeta: "10 名设计师 · 10 名产品经理 · 10 名工程师（N=30）",
    scoreAria: "满意度评分 8.9 分，满分 10 分",
    chipsAria: "规范的质量评分指标",
    anatomyNote: "现在每份组件文档都遵循相同的七段式结构：",
    anatomyAria: "组件文档的七段式结构",
    baBefore: "改版前",
    baAfter: "改版后",
    ctaLine: "想听数字背后的故事吗？",
    ctaEmail: "给我写邮件",
    ctaNext: "下一个案例 →",
    ctaHint: "sherrrrrryz@gmail.com · 欢迎约我完整讲一遍",
    colophon: "周雪怡 (Sherry) © 2026",
  },
} as const;

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="mds-marker">
      <span className="mds-marker__num">{num}</span>
      <span>{label}</span>
      <span className="mds-marker__line" aria-hidden="true" />
    </div>
  );
}

/* ── Inline diagram: the system I inherited ─────────────────────────
   Three disconnected artifacts joined by broken links. Drawn locally in
   currentColor so it flips with the theme like every other surface. */
function InheritedDiagram() {
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
  const broken = (x: number) => (
    <g stroke="currentColor" strokeOpacity={0.55}>
      <line x1={x} y1={96} x2={x + 22} y2={96} strokeDasharray="4 5" />
      <line x1={x + 42} y1={96} x2={x + 64} y2={96} strokeDasharray="4 5" />
      <line x1={x + 27} y1={91} x2={x + 37} y2={101} />
      <line x1={x + 37} y1={91} x2={x + 27} y2={101} />
    </g>
  );
  return (
    <div
      className="mds-illo"
      role="img"
      aria-label={t({
        en: "Diagram of the inherited system: a guideline website, a Figma library and a component SDK, each out of sync with the others",
        zh: "接手时的系统示意图：规范网站、Figma 组件库和组件 SDK，三者互不同步",
      })}
    >
      <svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg">
        <text x={0} y={20} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          {t({ en: "DECEMBER 2021 · THE HANDOVER", zh: "2021 年 12 月 · 交接" })}
        </text>
        {box(8, t({ en: "Guideline website", zh: "规范网站" }), t({ en: "out of date", zh: "内容过时" }))}
        {box(264, t({ en: "Figma library", zh: "Figma 组件库" }), t({ en: "rules scattered", zh: "规则零散" }))}
        {box(520, t({ en: "Component SDK", zh: "组件 SDK" }), t({ en: "didn't match docs", zh: "与文档不符" }))}
        {broken(200)}
        {broken(456)}
      </svg>
      <p className="mds-illo__caption">
        {t({
          en: "Three artifacts, one part-time owner, no single source of truth",
          zh: "三个产物，一位兼职维护者，没有唯一可信源",
        })}
      </p>
    </div>
  );
}

/* small line pictograms for the research cards */
const ICONS = {
  benchmark: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="14" width="24" height="28" rx="2" />
      <path d="M12 8h24v28" opacity="0.55" />
      <path d="M18 2h24v28" opacity="0.3" />
      <path d="M11 22h14M11 28h14M11 34h9" />
    </svg>
  ),
  interviews: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h26v16H14l-6 6v-6H4z" />
      <path d="M22 30h22v12h-5v5l-5-5H22z" opacity="0.55" />
      <path d="M10 14h14M10 19h9" />
    </svg>
  ),
  workshop: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="5" width="16" height="16" rx="1" />
      <rect x="27" y="5" width="16" height="16" rx="1" opacity="0.55" />
      <rect x="5" y="27" width="16" height="16" rx="1" opacity="0.55" />
      <rect x="26" y="26" width="16" height="16" rx="1" transform="rotate(6 34 34)" />
    </svg>
  ),
};

export default function ProjectMiuiDesignSystem() {
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
    <div className="mds-root">
      <nav className="mds-nav" aria-label="Primary">
        <Link href="/" className="mds-nav__mark">
          {u.navMark}
        </Link>
        <div className="mds-nav__right">
          <Link href="/" className="mds-nav__link">
            {u.back}
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="mds-section mds-hero">
        <div className="mds-wrap">
          <div className="mds-hero__kicker">{u.kicker}</div>
          <h1 className="mds-hero__title">{t(project.title)}</h1>
          <p className="mds-hero__dek">{t(project.dek)}</p>
          <div className="mds-hero__meta">{t(project.subtitle)}</div>
          <div className="mds-stats">
            {project.stats.map((s, i) => (
              <div className="mds-stat" key={i}>
                <div className="mds-stat__num">
                  {s.num}
                  {s.sub ? <sub>{s.sub}</sub> : null}
                </div>
                <div className="mds-stat__label">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 · Overview ────────────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="01" label={u.m01} />
          <div className="mds-grid3">
            <div>
              <div className="mds-label">{u.lOverview}</div>
              <p className="mds-body">{t(project.overview)}</p>
            </div>
            <div>
              <div className="mds-label">{u.lContributions}</div>
              <ul className="mds-plain-list">
                {project.contributions.map((c, i) => (
                  <li key={i}>{t(c)}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mds-label">{u.lTeam}</div>
              <ul className="mds-plain-list">
                {project.team.map((m, i) => (
                  <li key={i}>{t(m)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · The system I inherited ──────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="02" label={u.m02} />
          <p className="mds-body">{t(project.background)}</p>
          <InheritedDiagram />
        </div>
      </section>

      {/* ── 03 · Listening first ─────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="03" label={u.m03} />
          <p className="mds-body">{t(project.research)}</p>
          <div className="mds-cards3">
            <div className="mds-card">
              {ICONS.benchmark}
              <div className="mds-card__kicker">{u.cardBenchmarkKicker}</div>
              <div className="mds-card__num">{u.cardBenchmarkNum}</div>
              <p className="mds-card__txt">{u.cardBenchmarkTxt}</p>
            </div>
            <div className="mds-card">
              {ICONS.interviews}
              <div className="mds-card__kicker">{u.cardInterviewsKicker}</div>
              <div className="mds-card__num">{u.cardInterviewsNum}</div>
              <p className="mds-card__txt">{u.cardInterviewsTxt}</p>
            </div>
            <div className="mds-card">
              {ICONS.workshop}
              <div className="mds-card__kicker">{u.cardWorkshopKicker}</div>
              <div className="mds-card__num">{u.cardWorkshopNum}</div>
              <p className="mds-card__txt">{u.cardWorkshopTxt}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · Four problems, four goals ───────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="04" label={u.m04} />
          <p className="mds-body">{u.focusIntro}</p>
          <div className="mds-goals">
            {project.problems.map((p, i) => (
              <div className="mds-goal" key={i}>
                <div className="mds-goal__tag">
                  {u.problemTag} {String(i + 1).padStart(2, "0")}
                </div>
                <p className="mds-goal__problem">{t(p.problem)}</p>
                <div className="mds-goal__arrow" aria-hidden="true">
                  &darr;
                </div>
                <p className="mds-goal__goal">{t(p.goal)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 · Prove it on one component ───────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="05" label={u.m05} />
          <p className="mds-body">{t(project.pilot)}</p>
          <div className="mds-score">
            <div className="mds-score__row">
              <div className="mds-score__num">
                8.9<sub>/10</sub>
              </div>
              <div className="mds-score__meta">{u.scoreMeta}</div>
            </div>
            <div className="mds-score__track" role="img" aria-label={u.scoreAria}>
              <div className="mds-score__fill" />
            </div>
            <ul className="mds-chips" aria-label={u.chipsAria}>
              {project.metrics.map((m, i) => (
                <li className="mds-chip" key={i}>
                  {t(m)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 06 · What shipped ────────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="06" label={u.m06} />
          <p className="mds-body">{t(project.shipped)}</p>

          <p className="mds-note">{u.anatomyNote}</p>
          <ul className="mds-chips" style={{ marginTop: 14 }} aria-label={u.anatomyAria}>
            {project.anatomy.map((a, i) => (
              <li className="mds-chip mds-chip--num" key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t(a)}
              </li>
            ))}
          </ul>

          {project.pairs.map((pair, i) => (
            <React.Fragment key={i}>
              <h2 className="mds-sub">{t(pair.heading)}</h2>
              <p className="mds-note">{t(pair.caption)}</p>
              <div className="mds-ba">
                <div className="mds-ba__cell">
                  <div className="mds-ba__tag">{u.baBefore}</div>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pair.before.src} alt={t(pair.before.alt)} loading="lazy" draggable={false} />
                  </figure>
                </div>
                <div className="mds-ba__cell mds-ba__cell--after">
                  <div className="mds-ba__tag">{u.baAfter}</div>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pair.after.src} alt={t(pair.after.alt)} loading="lazy" draggable={false} />
                  </figure>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── 07 · Takeaway ────────────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="07" label={u.m07} />
          <blockquote className="mds-quote">
            &ldquo;{t(project.quote)}&rdquo;
            <span className="mds-quote__by">{t(project.quoteBy)}</span>
          </blockquote>
          <p className="mds-note">{t(project.closing)}</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <p className="mds-cta__line">{u.ctaLine}</p>
          <div className="mds-cta__row">
            <a className="mds-btn" href="mailto:sherrrrrryz@gmail.com">
              {u.ctaEmail}
            </a>
            <Link className="mds-btn mds-btn--ghost" href="/projects/lockscreen">
              {u.ctaNext}
            </Link>
          </div>
          <div className="mds-cta__hint">{u.ctaHint}</div>
          <div className="mds-colophon">
            <span>{u.colophon}</span>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>
      </section>
    </div>
    </LangContext.Provider>
  );
}
