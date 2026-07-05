/* ============================================================================
   /projects/lockscreen — case-study landing, restyled to match the homepage's
   plain monochrome editorial read. Content is the same data model the legacy
   page rendered; only the presentation changed. The detail deck at ./detail
   (and its password gate via SeeDetailModal) is untouched.

   No TSX imports shared with the homepage (isolation rule): layout primitives
   are local markup, styling lives in ./lockscreen.css on the shared token
   scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./lockscreen.css";

import Link from "next/link";
import React from "react";
import { SeeDetailProvider } from "./SeeDetailContext";
import SeeDetailButton from "./SeeDetailButton";

/** Data model (edit here to drive the page) */
const project = {
  title: "Lock Screen Personalization Editing",
  subtitle: "Interaction Design · Product Design · Visual Design",
  overview:
    "In 2023, MIUI 15 will launch three new lock screens under its new design philosophy. While enhancing customization capabilities, it also showcases leadership in glass effects, AOD lock screen linkage, and cutout technologies, improving user satisfaction with lock screen aesthetics.",
  contributions: [
    "Product architecture design",
    "Interaction flow design",
    "UI design",
    "Prototype design and production",
    "Usability testing",
  ],
  team: ["Design lead 1", "UX Designer (Me)", "Graphic Designer 4", "Product Manager 2"],
  background:
    "The project was initiated by lock screen visual designers who provided 7 new lock screen designs and 2 new technical capability requirements. As the interaction designer, I joined after the initial pitch succeeded to design the editing flows and framework for lock screen personalization.",
  potentialIssues: [
    "A wide variety of packages with unique characteristics makes it difficult to ensure framework universality;",
    "Lack of mainstream styles may confuse users among many options;",
    "Large differences in personalization capabilities make it hard for users to set expectations;",
    "Too many customization functions could overload a single page, leading to increased page hierarchy.",
  ],
  competitorFindings: [
    "New templates have low exposure, requiring users to click the bottom-right add button to view;",
    "Template images are small and details are difficult to preview;",
    "For users without customization needs, the application process is long (at least 6 steps);",
    "Templates are not interoperable, with inconsistent bottom editing options, making expectations unclear.",
  ],
  designPrinciples: [
    "When entering lock screen editing, new designs should be strongly showcased;",
    "Provide multiple preset combinations for low-customization users to apply quickly;",
    "Customization interaction framework must be highly generalizable and easy to use.",
  ],
  strategies: [
    "Strategy 1: Use “Classic Lock Screen / Diamond Time” as the flagship option, with multiple preset lock screen combinations;",
    "Strategy 2: Expand “Image Magazine” as a new style annually, depending on development resources and version updates;",
    "Strategy 3: Ensure all sets support at least the basic customization ability (information layer and wallpaper layer).",
  ],
  finalModelHighlights: [
    "Immersion: As large a template preview panel as possible, with vertical switching for templates and horizontal switching for preset variations;",
    "Instant Use: Users can apply anytime via the top-right button, reducing costs for low-customization users.",
  ],
  usabilityFocus: [
    "Long-press to trigger editing may cause accidental activations;",
    "Clicking on the panel does nothing, but user expectations vary (apply/customize/preview);",
    "Information layer style editing is in a secondary level, making it too deep;",
    "After customization, users cannot preview the effect before applying.",
  ],
  images: {
    hero: ["/lockscreen/lockscreencover.png", "/lockscreen/background.png"],
    competitor: ["/lockscreen/competitor1.png", "/lockscreen/competitor2.png"],
    strategy: ["/lockscreen/strategy1.png", "/lockscreen/strategy2.png", "/lockscreen/strategy3.png", "/lockscreen/strategy4.png"],
    final: ["/lockscreen/final1.png", "/lockscreen/final2.png", "/lockscreen/final3.png", "/lockscreen/final4.png", "/lockscreen/final5.png"],
  },
};

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
  return (
    <SeeDetailProvider>
      <div className="lsx-root">
        <nav className="lsx-nav" aria-label="Primary">
          <Link href="/" className="lsx-nav__mark">
            Xueyi Zhou
          </Link>
          <Link href="/" className="lsx-nav__link">
            &larr; Back to home
          </Link>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="lsx-section lsx-hero">
          <div className="lsx-wrap">
            <div className="lsx-hero__kicker">
              Case study &middot; Xiaomi MIUI 15 &middot; 2023
            </div>
            <h1 className="lsx-hero__title">{project.title}</h1>
            <div className="lsx-hero__row">
              <span className="lsx-hero__meta">{project.subtitle}</span>
              <SeeDetailButton />
            </div>
            <Fig src={project.images.hero[0]} alt="Lock screen personalization editing cover" />
          </div>
        </header>

        {/* ── 01 · Overview ────────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="01" label="Overview" />
            <div className="lsx-grid3">
              <div>
                <div className="lsx-label">Overview</div>
                <p className="lsx-body">{project.overview}</p>
              </div>
              <div>
                <div className="lsx-label">My contributions</div>
                <ul className="lsx-plain-list">
                  {project.contributions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="lsx-label">Team</div>
                <ul className="lsx-plain-list">
                  {project.team.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 · Background ──────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="02" label="Project background" />
            <p className="lsx-body">{project.background}</p>
            <Fig src={project.images.hero[1]} alt="The seven new lock screen designs" />
          </div>
        </section>

        {/* ── 03 · Competitor analysis ─────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="03" label="Competitor analysis" />
            <Rows items={project.competitorFindings} />
            <Fig src={project.images.competitor[0]} alt="Competitor lock screen editing flows" />
            <Fig src={project.images.competitor[1]} alt="Competitor template galleries compared" />
          </div>
        </section>

        {/* ── 04 · Principles & strategies ─────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="04" label="Design principles &amp; strategies" />
            <Rows items={project.designPrinciples} />

            <h2 className="lsx-sub">Product strategies</h2>

            <p className="lsx-note">{project.strategies[0]}</p>
            <Fig src={project.images.strategy[0]} alt="Classic lock screen preset combinations" />
            <Fig src={project.images.strategy[1]} alt="Diamond Time preset combinations" />

            <p className="lsx-note">{project.strategies[1]}</p>
            <Fig src={project.images.strategy[2]} alt="Image Magazine style expansion" />

            <p className="lsx-note">{project.strategies[2]}</p>
            <Fig src={project.images.strategy[3]} alt="Basic customization ability across all sets" />
          </div>
        </section>

        {/* ── 05 · Final model ─────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="05" label="Final model highlights" />
            <Rows items={project.finalModelHighlights} />
            <Fig src={project.images.final[0]} alt="Final editing model, template preview panel" />
            <Fig src={project.images.final[1]} alt="Vertical template switching" />
            <Fig src={project.images.final[2]} alt="Horizontal preset variation switching" />
            <Fig src={project.images.final[3]} alt="Instant apply from the top-right button" />
            <Fig src={project.images.final[4]} alt="Customization framework overview" />
          </div>
        </section>

        {/* ── 06 · Usability results ───────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <Marker num="06" label="Usability results" />
            <Rows items={project.usabilityFocus} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="lsx-section">
          <div className="lsx-wrap">
            <p className="lsx-cta__line">Want the full walkthrough, with every flow and iteration?</p>
            <SeeDetailButton />
            <div className="lsx-cta__hint">6-digit password required &middot; or email me for access</div>
          </div>
        </section>
      </div>
    </SeeDetailProvider>
  );
}
