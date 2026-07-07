/* ============================================================================
   /projects/miui-design-system — case-study landing for MIUI Design System
   2.0, told the same way as /projects/lockscreen: short editorial copy on
   the shared monochrome token scale, with the long deck text replaced by
   stat bands, inline SVG diagrams, and before/after image pairs.

   No TSX imports shared with the homepage or the lockscreen route
   (isolation rule): layout primitives are local markup, styling lives in
   ./miui-ds.css on the shared token scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./miui-ds.css";

import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

export const metadata: Metadata = {
  title: "MIUI Design System 2.0 · Xueyi Zhou",
  description:
    "Turning a design guideline nobody trusted into a system ten thousand employees could build on.",
};

/** Data model (edit here to drive the page) */
const project = {
  title: "MIUI Design System 2.0",
  dek: "Turning a guideline nobody trusted into a system ten thousand employees could build on.",
  subtitle: "Design Systems · Design Ops · Design-led, no PM",
  stats: [
    { num: "700M+", label: "MIUI users served" },
    { num: "30", label: "components maintained" },
    { num: "13", label: "designers and engineers" },
    { num: "8.9", sub: "/10", label: "satisfaction after rebuild" },
  ],
  overview:
    "MIUI's design guideline served tens of thousands of employees across dozens of business lines, yet it was kept alive by one or two people. Rules were scattered and incomplete, and most teams had stopped trusting it. Over one year, from mid 2022 to early 2023, I led its upgrade into a system that is complete, sustainable to maintain, and measurable with clear metrics.",
  contributions: [
    "Guideline team lead",
    "Research and metric definition",
    "Component guideline authoring",
    "Figma library rebuild",
    "Cross-team rollout and reviews",
  ],
  team: [
    "7-person guideline group, led by me",
    "6 MIUI SDK engineers",
    "Reported to the head of Xiaomi Design",
  ],
  background:
    "In December 2021 I took over three things: the guideline website, the Figma component library, and a backlog of long-standing SDK issues. Content was out of date and incomplete, many rules lived only in people's heads, and when the docs disagreed with production, asking an engineer was the only way to learn the truth.",
  research:
    "Before writing anything, we compared MIUI against three major design systems, interviewed the people who used ours daily, and ran a co-creation workshop to hear the voices we had missed.",
  problems: [
    {
      problem: "Nobody knew what MIUIX was, or when to use the component library.",
      goal: "Build a MIUI knowledge base, linked with engineering docs.",
    },
    {
      problem: "Resources were scattered across Figma, the website and platforms, with no links between them.",
      goal: "Rebuild the Figma library with a clear linking system.",
    },
    {
      problem: "Key rules were missing and nothing followed a standard structure.",
      goal: "Standardize the document and Figma framework.",
    },
    {
      problem: "Figma and shipped results often disagreed, so people stopped trusting both.",
      goal: "Partner with engineering to keep content true to what ships.",
    },
  ],
  pilot:
    "I rewrote the dialog guideline as a pilot, borrowing the structure we learned from benchmarking, and put it through two review rounds: first 9 close readers, then 30 testers scoring it against the quality metrics we defined along the way.",
  metrics: [
    "Comprehensive and reliable",
    "Easy to read and learn",
    "Clear customization boundary",
    "Clear ownership and change log",
    "Consistent across Figma, docs and code",
  ],
  shipped:
    "Phase 1 rebuilt the highest-frequency components, with every rule aligned with the SDK team: button, switch, list, floating window, reach-friendly dialog, loading, empty state and input field. Foundation guidelines for color, typography, type scale and motion were published for the first time.",
  anatomy: [
    "Links & overview",
    "Types & scenarios",
    "Anatomy",
    "Responsive rules",
    "Interaction rules",
    "Do's and don'ts",
    "Change log & customization",
  ],
  pairs: [
    {
      heading: "From styles to tokens",
      caption:
        "Color used to exist only as Figma styles. We rebuilt it as design tokens, with default, pressed, hover and disabled states defined across light and dark.",
      before: { src: "/miui/designtoken-before.png", alt: "Old Figma color styles panel, flat lists of text and system colors" },
      after: { src: "/miui/designtoken-after.png", alt: "New MIUIX color token sheet with state and light/dark variants" },
    },
    {
      heading: "From working file to documented spec",
      caption:
        "The old library piled everything into a few crowded pages. The new one is indexed, split per component, built on Auto Layout and variants, and every rule is written down.",
      before: { src: "/miui/components-before.png", alt: "Old Figma component file with unlabeled frames piled together" },
      after: { src: "/miui/components-after.png", alt: "New list component guideline pages with structure, states and examples" },
    },
    {
      heading: "From hidden bugs to global standards",
      caption:
        "Long-standing large-text and multi-language issues became a written global consistency standard, so every user sees the full content instead of a truncated version.",
      before: { src: "/miui/localization-before.png", alt: "Screens with truncated localized text across MIUI apps" },
      after: { src: "/miui/localization-after.png", alt: "Global consistency design standards document" },
    },
  ],
  quote:
    "We appointed a newcomer to lead a group of senior people, and it had to be cross-department. It sounded very unreliable.",
  quoteBy: "My manager, joking, before it worked",
  closing:
    "Most of what we achieved came from fast learning loops, leadership trust, and a team that genuinely wanted a better system.",
};

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
    <div className="mds-illo" role="img" aria-label="Diagram of the inherited system: a guideline website, a Figma library and a component SDK, each out of sync with the others">
      <svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg">
        <text x={0} y={20} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          DECEMBER 2021 · THE HANDOVER
        </text>
        {box(8, "Guideline website", "out of date")}
        {box(264, "Figma library", "rules scattered")}
        {box(520, "Component SDK", "didn't match docs")}
        {broken(200)}
        {broken(456)}
      </svg>
      <p className="mds-illo__caption">Three artifacts, one part-time owner, no single source of truth</p>
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
  return (
    <div className="mds-root">
      <nav className="mds-nav" aria-label="Primary">
        <Link href="/" className="mds-nav__mark">
          Xueyi Zhou
        </Link>
        <div className="mds-nav__right">
          <Link href="/" className="mds-nav__link">
            &larr; Back to home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="mds-section mds-hero">
        <div className="mds-wrap">
          <div className="mds-hero__kicker">Case study &middot; Xiaomi MIUI &middot; 2022&ndash;2023</div>
          <h1 className="mds-hero__title">{project.title}</h1>
          <p className="mds-hero__dek">{project.dek}</p>
          <div className="mds-hero__meta">{project.subtitle}</div>
          <div className="mds-stats">
            {project.stats.map((s, i) => (
              <div className="mds-stat" key={i}>
                <div className="mds-stat__num">
                  {s.num}
                  {s.sub ? <sub>{s.sub}</sub> : null}
                </div>
                <div className="mds-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 · Overview ────────────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="01" label="Overview" />
          <div className="mds-grid3">
            <div>
              <div className="mds-label">Overview</div>
              <p className="mds-body">{project.overview}</p>
            </div>
            <div>
              <div className="mds-label">My contributions</div>
              <ul className="mds-plain-list">
                {project.contributions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mds-label">Team</div>
              <ul className="mds-plain-list">
                {project.team.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · The system I inherited ──────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="02" label="The system I inherited" />
          <p className="mds-body">{project.background}</p>
          <InheritedDiagram />
        </div>
      </section>

      {/* ── 03 · Listening first ─────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="03" label="Listening first" />
          <p className="mds-body">{project.research}</p>
          <div className="mds-cards3">
            <div className="mds-card">
              {ICONS.benchmark}
              <div className="mds-card__kicker">Benchmark</div>
              <div className="mds-card__num">Apple · Google · IBM</div>
              <p className="mds-card__txt">
                Compared against MIUI, the gap was bigger than expected. Color lived only in Figma styles, and dark mode had no system-level rules at all.
              </p>
            </div>
            <div className="mds-card">
              {ICONS.interviews}
              <div className="mds-card__kicker">Interviews</div>
              <div className="mds-card__num">3 designers + 3 engineers</div>
              <p className="mds-card__txt">
                Each walked us through a recent piece of component work: where they looked things up, and where they got stuck.
              </p>
            </div>
            <div className="mds-card">
              {ICONS.workshop}
              <div className="mds-card__kicker">Workshop</div>
              <div className="mds-card__num">~40 people co-creating</div>
              <p className="mds-card__txt">
                Designers, researchers and PMs added issues and needs with sticky notes, then voted on what hurt the most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · Four problems, four goals ───────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="04" label="Four problems, four goals" />
          <p className="mds-body">
            Instead of trying to fix everything, we focused the year on the four problems that hurt daily efficiency and trust the most.
          </p>
          <div className="mds-goals">
            {project.problems.map((p, i) => (
              <div className="mds-goal" key={i}>
                <div className="mds-goal__tag">Problem {String(i + 1).padStart(2, "0")}</div>
                <p className="mds-goal__problem">{p.problem}</p>
                <div className="mds-goal__arrow" aria-hidden="true">
                  &darr;
                </div>
                <p className="mds-goal__goal">{p.goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 · Prove it on one component ───────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="05" label="Prove it on one component" />
          <p className="mds-body">{project.pilot}</p>
          <div className="mds-score">
            <div className="mds-score__row">
              <div className="mds-score__num">
                8.9<sub>/10</sub>
              </div>
              <div className="mds-score__meta">10 designers · 10 PMs · 10 engineers (N=30)</div>
            </div>
            <div className="mds-score__track" role="img" aria-label="Satisfaction score 8.9 out of 10">
              <div className="mds-score__fill" />
            </div>
            <ul className="mds-chips" aria-label="Quality metrics the guideline is scored on">
              {project.metrics.map((m, i) => (
                <li className="mds-chip" key={i}>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 06 · What shipped ────────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <Marker num="06" label="What shipped" />
          <p className="mds-body">{project.shipped}</p>

          <p className="mds-note">Every component doc now follows the same seven-part anatomy:</p>
          <ul className="mds-chips" style={{ marginTop: 14 }} aria-label="Seven-part component doc anatomy">
            {project.anatomy.map((a, i) => (
              <li className="mds-chip mds-chip--num" key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {a}
              </li>
            ))}
          </ul>

          {project.pairs.map((pair, i) => (
            <React.Fragment key={i}>
              <h2 className="mds-sub">{pair.heading}</h2>
              <p className="mds-note">{pair.caption}</p>
              <div className="mds-ba">
                <div className="mds-ba__cell">
                  <div className="mds-ba__tag">Before</div>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pair.before.src} alt={pair.before.alt} loading="lazy" draggable={false} />
                  </figure>
                </div>
                <div className="mds-ba__cell mds-ba__cell--after">
                  <div className="mds-ba__tag">After</div>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pair.after.src} alt={pair.after.alt} loading="lazy" draggable={false} />
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
          <Marker num="07" label="Takeaway" />
          <blockquote className="mds-quote">
            &ldquo;{project.quote}&rdquo;
            <span className="mds-quote__by">{project.quoteBy}</span>
          </blockquote>
          <p className="mds-note">{project.closing}</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mds-section">
        <div className="mds-wrap">
          <p className="mds-cta__line">Want the story behind the numbers?</p>
          <div className="mds-cta__row">
            <a className="mds-btn" href="mailto:sherrrrrryz@gmail.com">
              Email me
            </a>
            <Link className="mds-btn mds-btn--ghost" href="/projects/lockscreen">
              Next case study &rarr;
            </Link>
          </div>
          <div className="mds-cta__hint">sherrrrrryz@gmail.com &middot; happy to walk through the full deck</div>
        </div>
      </section>
    </div>
  );
}
