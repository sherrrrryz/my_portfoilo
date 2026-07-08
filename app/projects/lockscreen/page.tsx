'use client';

/* ============================================================================
   /projects/lockscreen — case-study landing, restyled to match the homepage's
   plain monochrome editorial read. Content is the same data model the legacy
   page rendered; only the presentation changed. The detail deck at ./detail
   (and its password gate via SeeDetailModal) is untouched.

   Bilingual: every copy string is an { en, zh } pair picked by a lang state
   (persisted in localStorage "lang", shared with / and /about). The toggle
   lives in the footer colophon, bottom right. SSR renders English; a
   returning zh reader flips after hydration (no mismatch, one repaint).

   No TSX imports shared with the homepage (isolation rule): layout primitives
   are local markup, styling lives in ./lockscreen.css on the shared token
   scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./lockscreen.css";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SeeDetailProvider } from "./SeeDetailContext";
import SeeDetailButton from "./SeeDetailButton";
import ThemeToggle from "./ThemeToggle";

/* ── i18n plumbing ─────────────────────────────────────────────────
   Per-page copy of the homepage recipe (isolation rule: no shared TSX).
   Everything on this page renders inside the root component, so a local
   t() is enough — no context needed. */
type Lang = "en" | "zh";
type L10n = { en: string; zh: string };

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
      className="lsx-lang"
      aria-label={lang === "en" ? "切换到中文" : "Switch to English"}
      onClick={() => onChange(lang === "en" ? "zh" : "en")}
    >
      {lang === "en" ? "中文" : "English"}
    </button>
  );
}

/** Data model (edit here to drive the page) */
const project = {
  title: {
    en: "Lock Screen Personalization Editing",
    zh: "锁屏个性化编辑",
  },
  subtitle: {
    en: "Interaction Design · Product Design · Visual Design",
    zh: "交互设计 · 产品设计 · 视觉设计",
  },
  overview: {
    en: "In 2023, MIUI 15 will launch three new lock screens under its new design philosophy. While enhancing customization capabilities, it also showcases leadership in glass effects, AOD lock screen linkage, and cutout technologies, improving user satisfaction with lock screen aesthetics.",
    zh: "2023 年，MIUI 15 将在全新设计理念下推出三款新锁屏。在增强自定义能力的同时，也展示了玻璃质感、AOD 息屏与锁屏联动、挖孔适配等技术上的领先性，提升用户对锁屏美感的满意度。",
  },
  contributions: [
    { en: "Product architecture design", zh: "产品架构设计" },
    { en: "Interaction flow design", zh: "交互流程设计" },
    { en: "UI design", zh: "UI 设计" },
    { en: "Prototype design and production", zh: "原型设计与制作" },
    { en: "Usability testing", zh: "可用性测试" },
  ],
  team: [
    { en: "Design lead 1", zh: "设计负责人 1 名" },
    { en: "UX Designer (Me)", zh: "UX 设计师（我）" },
    { en: "Graphic Designer 4", zh: "视觉设计师 4 名" },
    { en: "Product Manager 2", zh: "产品经理 2 名" },
  ],
  background: {
    en: "The project was initiated by lock screen visual designers who provided 7 new lock screen designs and 2 new technical capability requirements. As the interaction designer, I joined after the initial pitch succeeded to design the editing flows and framework for lock screen personalization.",
    zh: "项目由锁屏视觉设计师发起，他们提供了 7 款新锁屏设计和 2 项新技术能力需求。作为交互设计师，我在最初的提案通过后加入，负责设计锁屏个性化的编辑流程与整体框架。",
  },
  competitorFindings: [
    {
      en: "New templates have low exposure, requiring users to click the bottom-right add button to view;",
      zh: "新模板曝光度低，用户需要点击右下角的添加按钮才能看到；",
    },
    {
      en: "Template images are small and details are difficult to preview;",
      zh: "模板图片偏小，细节难以预览；",
    },
    {
      en: "For users without customization needs, the application process is long (at least 6 steps);",
      zh: "对没有自定义需求的用户来说，应用流程偏长（至少 6 步）；",
    },
    {
      en: "Templates are not interoperable, with inconsistent bottom editing options, making expectations unclear.",
      zh: "模板之间不互通，底部编辑选项不一致，用户预期不明确。",
    },
  ],
  designPrinciples: [
    {
      en: "When entering lock screen editing, new designs should be strongly showcased;",
      zh: "进入锁屏编辑时，应当强曝光新设计；",
    },
    {
      en: "Provide multiple preset combinations for low-customization users to apply quickly;",
      zh: "为低自定义需求的用户提供多套预设组合，便于快速应用；",
    },
    {
      en: "Customization interaction framework must be highly generalizable and easy to use.",
      zh: "自定义交互框架必须具有高通用性，并且易于使用。",
    },
  ],
  strategies: [
    {
      en: "Strategy 1: Use “Classic Lock Screen / Diamond Time” as the flagship option, with multiple preset lock screen combinations;",
      zh: "策略一：以“经典锁屏 / 钻石时间”作为旗舰选项，提供多套预设锁屏组合；",
    },
    {
      en: "Strategy 2: Expand “Image Magazine” as a new style annually, depending on development resources and version updates;",
      zh: "策略二：视开发资源与版本更新情况，每年将“图片杂志”扩展为一种新风格；",
    },
    {
      en: "Strategy 3: Ensure all sets support at least the basic customization ability (information layer and wallpaper layer).",
      zh: "策略三：确保所有套系至少支持基础自定义能力（信息层与壁纸层）。",
    },
  ],
  finalModelHighlights: [
    {
      en: "Immersion: As large a template preview panel as possible, with vertical switching for templates and horizontal switching for preset variations;",
      zh: "沉浸感：模板预览面板尽可能大，纵向切换模板，横向切换预设变体；",
    },
    {
      en: "Instant Use: Users can apply anytime via the top-right button, reducing costs for low-customization users.",
      zh: "即时应用：用户可随时通过右上角按钮应用，降低低自定义需求用户的操作成本。",
    },
  ],
  usabilityFocus: [
    {
      en: "Long-press to trigger editing may cause accidental activations;",
      zh: "长按触发编辑可能导致误操作；",
    },
    {
      en: "Clicking on the panel does nothing, but user expectations vary (apply/customize/preview);",
      zh: "点击面板没有响应，但用户的预期各不相同（应用、自定义、预览）；",
    },
    {
      en: "Information layer style editing is in a secondary level, making it too deep;",
      zh: "信息层样式编辑位于二级层级，路径过深；",
    },
    {
      en: "After customization, users cannot preview the effect before applying.",
      zh: "自定义完成后，用户无法在应用前预览效果。",
    },
  ],
  images: {
    hero: ["/lockscreen/lockscreencover.png", "/lockscreen/background.png"],
    competitor: ["/lockscreen/competitor1.png", "/lockscreen/competitor2.png"],
    strategy: ["/lockscreen/strategy1.png", "/lockscreen/strategy2.png", "/lockscreen/strategy3.png", "/lockscreen/strategy4.png"],
    final: ["/lockscreen/final1.png", "/lockscreen/final2.png", "/lockscreen/final3.png", "/lockscreen/final4.png", "/lockscreen/final5.png"],
  },
};

/* Inline JSX copy */
const UI = {
  en: {
    navMark: "Xueyi Zhou",
    back: "← Back to home",
    kicker: "Case study · Xiaomi MIUI 15 · 2023",
    mOverview: "Overview",
    mBackground: "Project background",
    mCompetitor: "Competitor analysis",
    mPrinciples: "Design principles & strategies",
    mFinal: "Final model highlights",
    mUsability: "Usability results",
    lOverview: "Overview",
    lContributions: "My contributions",
    lTeam: "Team",
    subStrategies: "Product strategies",
    ctaLine: "Want the full walkthrough, with every flow and iteration?",
    ctaHint: "6-digit password required · or email me for access",
    colophon: "Xueyi (Sherry) Zhou © 2026",
    altCover: "Lock screen personalization editing cover",
    altSeven: "The seven new lock screen designs",
    altCompetitor1: "Competitor lock screen editing flows",
    altCompetitor2: "Competitor template galleries compared",
    altStrategy1: "Classic lock screen preset combinations",
    altStrategy2: "Diamond Time preset combinations",
    altStrategy3: "Image Magazine style expansion",
    altStrategy4: "Basic customization ability across all sets",
    altFinal1: "Final editing model, template preview panel",
    altFinal2: "Vertical template switching",
    altFinal3: "Horizontal preset variation switching",
    altFinal4: "Instant apply from the top-right button",
    altFinal5: "Customization framework overview",
  },
  zh: {
    navMark: "周雪怡",
    back: "← 返回首页",
    kicker: "案例研究 · 小米 MIUI 15 · 2023",
    mOverview: "概览",
    mBackground: "项目背景",
    mCompetitor: "竞品分析",
    mPrinciples: "设计原则与策略",
    mFinal: "最终方案亮点",
    mUsability: "可用性测试结果",
    lOverview: "概览",
    lContributions: "我的职责",
    lTeam: "团队",
    subStrategies: "产品策略",
    ctaLine: "想看完整的方案讲解，包括每一条流程与迭代吗？",
    ctaHint: "需要 6 位密码 · 或发邮件向我获取",
    colophon: "周雪怡 (Sherry) © 2026",
    altCover: "锁屏个性化编辑封面",
    altSeven: "七款新锁屏设计",
    altCompetitor1: "竞品的锁屏编辑流程",
    altCompetitor2: "竞品模板陈列对比",
    altStrategy1: "经典锁屏的预设组合",
    altStrategy2: "钻石时间的预设组合",
    altStrategy3: "图片杂志的风格扩展",
    altStrategy4: "所有套系的基础自定义能力",
    altFinal1: "最终编辑模型，模板预览面板",
    altFinal2: "纵向切换模板",
    altFinal3: "横向切换预设变体",
    altFinal4: "通过右上角按钮即时应用",
    altFinal5: "自定义框架总览",
  },
} as const;

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="lsx-marker">
      <span className="lsx-marker__num">{num}</span>
      <span>{label}</span>
      <span className="lsx-marker__line" aria-hidden="true" />
    </div>
  );
}

function Fig({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="lsx-fig">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" draggable={false} />
    </figure>
  );
}

function Rows({ items }: { items: string[] }) {
  return (
    <div className="lsx-rows">
      {items.map((text, i) => (
        <div className="lsx-row" key={i}>
          <span className="lsx-row__idx">{String(i + 1).padStart(2, "0")}</span>
          <p className="lsx-row__txt">{text}</p>
        </div>
      ))}
    </div>
  );
}

export default function ProjectLockScreen() {
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
    <SeeDetailProvider>
      <div className="lsx-root">
        <nav className="lsx-nav" aria-label="Primary">
          <Link href="/" className="lsx-nav__mark">
            {u.navMark}
          </Link>
          <div className="lsx-nav__right">
            <Link href="/" className="lsx-nav__link">
              {u.back}
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="lsx-section lsx-hero">
          <div className="lsx-wrap">
            <div className="lsx-hero__kicker">{u.kicker}</div>
            <h1 className="lsx-hero__title">{t(project.title)}</h1>
            <div className="lsx-hero__row">
              <span className="lsx-hero__meta">{t(project.subtitle)}</span>
              <SeeDetailButton />
            </div>
            <Fig src={project.images.hero[0]} alt={u.altCover} />
          </div>
        </header>

        {/* ── 01 · Overview ────────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="01" label={u.mOverview} />
            <div className="lsx-grid3">
              <div>
                <div className="lsx-label">{u.lOverview}</div>
                <p className="lsx-body">{t(project.overview)}</p>
              </div>
              <div>
                <div className="lsx-label">{u.lContributions}</div>
                <ul className="lsx-plain-list">
                  {project.contributions.map((c, i) => (
                    <li key={i}>{t(c)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="lsx-label">{u.lTeam}</div>
                <ul className="lsx-plain-list">
                  {project.team.map((m, i) => (
                    <li key={i}>{t(m)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 · Background ──────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="02" label={u.mBackground} />
            <p className="lsx-body">{t(project.background)}</p>
            <Fig src={project.images.hero[1]} alt={u.altSeven} />
          </div>
        </section>

        {/* ── 03 · Competitor analysis ─────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="03" label={u.mCompetitor} />
            <Rows items={project.competitorFindings.map((x) => t(x))} />
            <Fig src={project.images.competitor[0]} alt={u.altCompetitor1} />
            <Fig src={project.images.competitor[1]} alt={u.altCompetitor2} />
          </div>
        </section>

        {/* ── 04 · Principles & strategies ─────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="04" label={u.mPrinciples} />
            <Rows items={project.designPrinciples.map((x) => t(x))} />

            <h2 className="lsx-sub">{u.subStrategies}</h2>

            <p className="lsx-note">{t(project.strategies[0])}</p>
            <Fig src={project.images.strategy[0]} alt={u.altStrategy1} />
            <Fig src={project.images.strategy[1]} alt={u.altStrategy2} />

            <p className="lsx-note">{t(project.strategies[1])}</p>
            <Fig src={project.images.strategy[2]} alt={u.altStrategy3} />

            <p className="lsx-note">{t(project.strategies[2])}</p>
            <Fig src={project.images.strategy[3]} alt={u.altStrategy4} />
          </div>
        </section>

        {/* ── 05 · Final model ─────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="05" label={u.mFinal} />
            <Rows items={project.finalModelHighlights.map((x) => t(x))} />
            <Fig src={project.images.final[0]} alt={u.altFinal1} />
            <Fig src={project.images.final[1]} alt={u.altFinal2} />
            <Fig src={project.images.final[2]} alt={u.altFinal3} />
            <Fig src={project.images.final[3]} alt={u.altFinal4} />
            <Fig src={project.images.final[4]} alt={u.altFinal5} />
          </div>
        </section>

        {/* ── 06 · Usability results ───────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="06" label={u.mUsability} />
            <Rows items={project.usabilityFocus.map((x) => t(x))} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <p className="lsx-cta__line">{u.ctaLine}</p>
            <SeeDetailButton />
            <div className="lsx-cta__hint">{u.ctaHint}</div>
            <div className="lsx-colophon">
              <span>{u.colophon}</span>
              <LangToggle lang={lang} onChange={changeLang} />
            </div>
          </div>
        </section>
      </div>
    </SeeDetailProvider>
  );
}
