"use client";

/* ============================================================================
   /projects/lockscreen — case-study landing, restyled to match the homepage's
   plain monochrome editorial read. Content is the same data model the legacy
   page rendered; only the presentation changed. The detail deck at ./detail
   (and its password gate via SeeDetailModal) is untouched.

   Bilingual via the shared localStorage "lang" recipe (same as /, /about,
   /projects). Chinese copy sourced from the original Chinese case study.

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

/* ── i18n plumbing — per-page copy of the homepage recipe ─────────── */
type Lang = "en" | "zh";
type L10n = { en: string; zh: string };

/* Footer language switch: shows the language you'd switch TO.
   Duplicated per page (isolation rule, same as ThemeToggle). */
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
  title: { en: "Lock Screen Personalization Editing", zh: "锁屏个性化编辑" },
  subtitle: {
    en: "Interaction Design · Product Design · Visual Design",
    zh: "交互设计 · 产品设计 · 视觉设计",
  },
  overview: {
    en: "In 2023, MIUI 15 will launch three new lock screens under its new design philosophy. While enhancing customization capabilities, it also showcases leadership in glass effects, AOD lock screen linkage, and cutout technologies, improving user satisfaction with lock screen aesthetics.",
    zh: "2023 年，MIUI 15 将基于全新美学宗旨推出三套全新锁屏，在增强锁屏自定义能力的同时，展示在玻璃特效、AOD 锁屏联动、抠图等技术上的领先性，提升用户对锁屏美学的满意度。",
  },
  contributions: [
    { en: "Product architecture design", zh: "产品架构设计" },
    { en: "Interaction flow design", zh: "交互流程设计" },
    { en: "UI design", zh: "界面设计" },
    { en: "Prototype design and production", zh: "原型设计与制作" },
    { en: "Usability testing", zh: "可用性测试" },
  ],
  team: [
    { en: "Design lead 1", zh: "设计负责人 1" },
    { en: "UX Designer (Me)", zh: "交互设计师（我）" },
    { en: "Graphic Designer 4", zh: "平面设计师 4" },
    { en: "Product Manager 2", zh: "产品经理 2" },
  ],
  background: {
    en: "The project was initiated by lock screen visual designers who provided 7 new lock screen designs and 2 new technical capability requirements. As the interaction designer, I joined after the initial pitch succeeded to design the editing flows and framework for lock screen personalization.",
    zh: "项目由锁屏视觉设计师发起，提供了 7 套锁屏新设计、2 类新技术能力需求。我作为交互设计师，在项目初步汇报成功后开始介入，为锁屏个性化功能搭建编辑流程与框架。",
  },
  competitorFindings: [
    {
      en: "New templates have low exposure, requiring users to click the bottom-right add button to view;",
      zh: "新模版曝光较低，需点击右下角加号才能查看；",
    },
    {
      en: "Template images are small and details are difficult to preview;",
      zh: "模版受布局方式影响，图片较小，较难查看更多细节；",
    },
    {
      en: "For users without customization needs, the application process is long (at least 6 steps);",
      zh: "对于无自定义需求的用户，应用流程较长（至少 6 步）；",
    },
    {
      en: "Templates are not interoperable, with inconsistent bottom editing options, making expectations unclear.",
      zh: "模版之间不互通，底部可编辑项差异较大，较难预期。",
    },
  ],
  designPrinciples: [
    {
      en: "When entering lock screen editing, new designs should be strongly showcased;",
      zh: "进入锁屏编辑，能够充分体现新设计的吸引力；",
    },
    {
      en: "Provide multiple preset combinations for low-customization users to apply quickly;",
      zh: "对于低自定义需求的用户，提供多套搭配方案，快速应用；",
    },
    {
      en: "Customization interaction framework must be highly generalizable and easy to use.",
      zh: "自定义交互框架需具备高通用性、易用性。",
    },
  ],
  strategies: [
    {
      en: "Strategy 1: Use “Classic Lock Screen / Diamond Time” as the flagship option, with multiple preset lock screen combinations;",
      zh: "策略一：以“经典锁屏 / 菱形时间”为主打方案，为用户预置多套搭配好的锁屏方案；",
    },
    {
      en: "Strategy 2: Expand “Image Magazine” as a new style annually, depending on development resources and version updates;",
      zh: "策略二：将“影像杂志”作为逐年扩充的新锁屏风格，依据开发能动性决定是否跟随主要版本上线；",
    },
    {
      en: "Strategy 3: Ensure all sets support at least the basic customization ability (information layer and wallpaper layer).",
      zh: "策略三：所有套装均需支持最基础的自定义能力（信息层与壁纸层）。",
    },
  ],
  finalModelHighlights: [
    {
      en: "Immersion: As large a template preview panel as possible, with vertical switching for templates and horizontal switching for preset variations;",
      zh: "沉浸感：使用尽可能大的模版预览面板，模版纵向切换，预设搭配横向切换；",
    },
    {
      en: "Instant Use: Users can apply anytime via the top-right button, reducing costs for low-customization users.",
      zh: "即用感：用户可随时点击右上角的应用按钮直接生效，降低低自定义需求用户的使用成本。",
    },
  ],
  usabilityFocus: [
    {
      en: "Long-press to trigger editing may cause accidental activations;",
      zh: "长按触发锁屏编辑可能容易误触；",
    },
    {
      en: "Clicking on the panel does nothing, but user expectations vary (apply/customize/preview);",
      zh: "点击面板暂无反应，但不同用户的预期不一（应用 / 自定义 / 预览）；",
    },
    {
      en: "Information layer style editing is in a secondary level, making it too deep;",
      zh: "信息层样式编辑需进入二级页面，层级较深；",
    },
    {
      en: "After customization, users cannot preview the effect before applying.",
      zh: "自定义后、应用前无法预览效果。",
    },
  ],
  images: {
    hero: ["/lockscreen/lockscreencover.png", "/lockscreen/background.png"],
    competitor: ["/lockscreen/competitor1.png", "/lockscreen/competitor2.png"],
    strategy: ["/lockscreen/strategy1.png", "/lockscreen/strategy2.png", "/lockscreen/strategy3.png", "/lockscreen/strategy4.png"],
    final: ["/lockscreen/final1.png", "/lockscreen/final2.png", "/lockscreen/final3.png", "/lockscreen/final4.png", "/lockscreen/final5.png"],
  },
};

/* All inline page copy that isn't part of the data constant above. */
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
    seeDetail: "See detail",
    ctaLine: "Want the full walkthrough, with every flow and iteration?",
    ctaHint: "6-digit password required · or email me for access",
    altHeroCover: "Lock screen personalization editing cover",
    altHeroSeven: "The seven new lock screen designs",
    altCompetitorFlows: "Competitor lock screen editing flows",
    altCompetitorGalleries: "Competitor template galleries compared",
    altStrategyClassic: "Classic lock screen preset combinations",
    altStrategyDiamond: "Diamond Time preset combinations",
    altStrategyMagazine: "Image Magazine style expansion",
    altStrategyBasic: "Basic customization ability across all sets",
    altFinalPanel: "Final editing model, template preview panel",
    altFinalVertical: "Vertical template switching",
    altFinalHorizontal: "Horizontal preset variation switching",
    altFinalApply: "Instant apply from the top-right button",
    altFinalFramework: "Customization framework overview",
  },
  zh: {
    navMark: "周雪怡",
    back: "← 返回首页",
    kicker: "案例研究 · 小米 MIUI 15 · 2023",
    mOverview: "概述",
    mBackground: "项目背景",
    mCompetitor: "竞品分析",
    mPrinciples: "设计原则与产品策略",
    mFinal: "最终方案亮点",
    mUsability: "可用性结论",
    lOverview: "概述",
    lContributions: "我的贡献",
    lTeam: "团队",
    subStrategies: "产品策略",
    seeDetail: "查看详情",
    ctaLine: "想看完整的设计过程，包括每一条流程与每一次迭代？",
    ctaHint: "需要 6 位数字密码 · 也可以邮件向我索取",
    altHeroCover: "锁屏个性化编辑封面",
    altHeroSeven: "七套全新锁屏设计",
    altCompetitorFlows: "竞品锁屏编辑流程",
    altCompetitorGalleries: "竞品模版画廊对比",
    altStrategyClassic: "经典锁屏预置搭配方案",
    altStrategyDiamond: "菱形时间预置搭配方案",
    altStrategyMagazine: "影像杂志风格扩展",
    altStrategyBasic: "全部套装的基础自定义能力",
    altFinalPanel: "最终编辑方案，模版预览面板",
    altFinalVertical: "模版纵向切换",
    altFinalHorizontal: "预设搭配横向切换",
    altFinalApply: "右上角即时应用",
    altFinalFramework: "自定义框架总览",
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
            <LangToggle lang={lang} onChange={changeLang} />
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
              <SeeDetailButton label={u.seeDetail} />
            </div>
            <Fig src={project.images.hero[0]} alt={u.altHeroCover} />
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
            <Fig src={project.images.hero[1]} alt={u.altHeroSeven} />
          </div>
        </section>

        {/* ── 03 · Competitor analysis ─────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="03" label={u.mCompetitor} />
            <Rows items={project.competitorFindings.map(t)} />
            <Fig src={project.images.competitor[0]} alt={u.altCompetitorFlows} />
            <Fig src={project.images.competitor[1]} alt={u.altCompetitorGalleries} />
          </div>
        </section>

        {/* ── 04 · Principles & strategies ─────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="04" label={u.mPrinciples} />
            <Rows items={project.designPrinciples.map(t)} />

            <h2 className="lsx-sub">{u.subStrategies}</h2>

            <p className="lsx-note">{t(project.strategies[0])}</p>
            <Fig src={project.images.strategy[0]} alt={u.altStrategyClassic} />
            <Fig src={project.images.strategy[1]} alt={u.altStrategyDiamond} />

            <p className="lsx-note">{t(project.strategies[1])}</p>
            <Fig src={project.images.strategy[2]} alt={u.altStrategyMagazine} />

            <p className="lsx-note">{t(project.strategies[2])}</p>
            <Fig src={project.images.strategy[3]} alt={u.altStrategyBasic} />
          </div>
        </section>

        {/* ── 05 · Final model ─────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="05" label={u.mFinal} />
            <Rows items={project.finalModelHighlights.map(t)} />
            <Fig src={project.images.final[0]} alt={u.altFinalPanel} />
            <Fig src={project.images.final[1]} alt={u.altFinalVertical} />
            <Fig src={project.images.final[2]} alt={u.altFinalHorizontal} />
            <Fig src={project.images.final[3]} alt={u.altFinalApply} />
            <Fig src={project.images.final[4]} alt={u.altFinalFramework} />
          </div>
        </section>

        {/* ── 06 · Usability results ───────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="06" label={u.mUsability} />
            <Rows items={project.usabilityFocus.map(t)} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <p className="lsx-cta__line">{u.ctaLine}</p>
            <SeeDetailButton label={u.seeDetail} />
            <div className="lsx-cta__hint">{u.ctaHint}</div>
          </div>
        </section>
      </div>
    </SeeDetailProvider>
  );
}
