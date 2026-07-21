/* ============================================================================
   /projects/applovin-oobe — case-study landing for the AppLovin OOBE app
   discovery experiments, told the same way as /projects/lockscreen and
   /projects/miui-design-system: short editorial copy on the shared
   monochrome token scale, with the long deck text replaced by stat bands,
   inline SVG diagrams and sanitized flow images from public/oobe/.

   No TSX imports shared with the homepage or the other case studies
   (isolation rule): layout primitives are local markup, styling lives in
   ./oobe.css on the shared token scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./oobe.css";

import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import CopyEmail from "./CopyEmail";

export const metadata: Metadata = {
  title: "AppLovin OOBE App Discovery · Xueyi Zhou",
  description:
    "Four experiments to make app recommendations on a brand-new Android phone worth the tap.",
};

/** Data model (edit here to drive the page) */
const project = {
  title: "OOBE App Discovery",
  dek: "Four experiments to make app recommendations on a brand-new Android phone worth the tap.",
  subtitle: "Product Design · Experiment Design · Growth",
  stats: [
    { num: "10M+", label: "new-device users reached" },
    { num: "4", label: "experiment tracks shipped" },
    { num: "+10.6%", label: "distribution lift, best track" },
    { num: "75%", label: "bundle click-through rate" },
  ],
  overview:
    "AppLovin's discovery SDK runs inside the first-run setup of new Android phones, shipping with OEM and carrier partners such as Samsung and T-Mobile, plus partners across Europe. I ran a ladder of experiments on the app recommendation step, so more users would engage with it and complete installs, without adding real friction to device setup. At this scale, even small metric shifts translate into meaningful impact.",
  contributions: [
    "Experience design for all four experiment tracks",
    "Survey, bundle and swipe flow design",
    "Metric definition with data analysis",
    "Iteration on live funnel results",
  ],
  team: [
    "Design Lead, strategy and partner alignment",
    "Product Designer (me)",
    "Data Analyst",
    "Engineering team",
  ],
  redact:
    "Confidentiality note: the screens, copy, app lists and absolute numbers on this page are sanitized placeholders. Only the uplift percentages come from the real experiments.",
  baseline:
    "During setup, users see an opt-in page, then a recommendation list where some apps come pre-selected, then a done page. Most users tapped Continue within seconds and never really reviewed what was checked. Installs stayed low, and the signals we had suggested many of them were passive accepts rather than choices.",
  problem:
    "A new phone is the coldest start there is. We knew nothing about the user, the user was in a hurry, and partners like Samsung required every added step to be optional and skippable. So the bet became: spend a few seconds learning preferences first, then make every later screen work harder.",
  constraints: [
    {
      title: "Cold start",
      txt: "Zero preference signals on a brand-new device, so recommendations often missed.",
    },
    {
      title: "Time pressure",
      txt: "Setup is a chore. Nobody browses, nobody reads, everybody taps Continue.",
    },
    {
      title: "Trust and control",
      txt: "Every added step had to be understandable, optional and skippable, by partner requirement.",
    },
    {
      title: "Fragile pipeline",
      txt: "Install completion also depends on network and system pacing, not just the UI.",
    },
  ],
  experiments: {
    survey5: {
      hypothesis:
        "Let users express preferences in five quick steps, and recommendations become relevant enough to lift completed installs.",
      stats: [
        { num: "55%", label: "finished all five steps" },
        { num: "93%+", label: "step conversion after page one" },
        { num: "+0.21", label: "net clicks per user" },
        { num: "+4.1%", label: "total distribution" },
      ],
      takeaway:
        "Users were not looking for speed, they were looking for relevance. Leading with social apps instead of games made page one land, and almost everyone who cleared it finished the rest.",
    },
    survey1: {
      hypothesis:
        "Compress the five pages into one, and completion should soar, and installs with it.",
      takeaway:
        "Completion jumped, installs did not follow. Five steps warmed users up; one page ended before they started to care. Meaningful friction beat raw speed, so the 5-step survey stayed.",
    },
    bundle: {
      hypothesis:
        "OOBE users want setup done. Package the recommendations into one bundle, cut the decisions, lift the conversions.",
      stats: [
        { num: "0.47", label: "net installs per user, exposed" },
        { num: "0.37", label: "net installs per user, collapsed" },
        { num: "+10.6%", label: "total distribution" },
        { num: "75%", label: "bundle click-through rate" },
      ],
      takeaway:
        "Transparency won. The cleaner collapsed version read as a blind box, and hiding the contents cost more trust than the tidy layout earned. The bundle also front-loaded conversion so hard that it diluted every screen after it.",
    },
    swipe: {
      hypothesis:
        "A list is easy to ignore. A card you must swipe is not. Require one decision at a time, and attention should turn into installs.",
      stats: [
        { num: "13.52%", label: "CTR at 3 required swipes" },
        { num: "15.65%", label: "CTR at 10 required swipes" },
      ],
      takeaway:
        "Forced engagement beat free browsing. Swiping made users process each app instead of skimming past a list, and that interaction cost converted lost attention into real clicks and installs.",
    },
  },
  measurement:
    "Because pre-selection inflates raw install counts, the metric that mattered most was CIPEU: completed installs per engaged user. It only counts installs users actively chose. Around it we tracked a small system of checks.",
  metricChips: [
    "Completion rate",
    "CTR",
    "CIPEU",
    "Net lift",
    "Install success rate",
    "Scroll depth",
    "Time on page",
  ],
  learnings: [
    {
      head: "Meaningful friction beats speed.",
      txt: "The 5-step survey out-earned the 1-page version even though fewer people finished it.",
    },
    {
      head: "Transparency beats minimalism.",
      txt: "Showing every app in the bundle beat the cleaner collapsed layout on installs.",
    },
    {
      head: "Required beats optional, when the value is real.",
      txt: "Mandatory swipes produced the highest click-through rate of any track.",
    },
  ],
  closing:
    "Later rounds combined the bundle and swipe models, re-ordered survey options by advertiser mix, and split games into deeper subcategories. Together the tracks form one distribution system: capture intent early, then spend it efficiently.",
};

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

function XStats({ stats }: { stats: { num: string; label: string }[] }) {
  return (
    <div className="alo-xstats">
      {stats.map((s, i) => (
        <div className="alo-stat" key={i}>
          <div className="alo-stat__num">{s.num}</div>
          <div className="alo-stat__label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Take({ txt }: { txt: string }) {
  return (
    <div className="alo-take">
      <div className="alo-take__label">What we learned</div>
      <p className="alo-take__txt">{txt}</p>
    </div>
  );
}

/* ── Inline diagram: the baseline flow ──────────────────────────────
   Three screens joined by forward arrows. Drawn locally in currentColor
   so it flips with the theme like every other surface. */
function BaselineDiagram() {
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
      aria-label="Diagram of the baseline flow: an opt-in screen, a recommendation list with pre-selected apps, and a done screen"
    >
      <svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg">
        <text x={0} y={20} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          THE BASELINE · THREE SCREENS, SECONDS OF ATTENTION
        </text>
        {box(8, "Opt-in", "Continue or Not now")}
        {box(264, "Recommendations", "apps pre-selected")}
        {box(520, "Done", "Finish")}
        {arrow(206)}
        {arrow(462)}
      </svg>
      <p className="alo-illo__caption">Most users tap straight through without reviewing a thing</p>
    </div>
  );
}

/* ── Inline chart: experiment 1 vs experiment 2 ─────────────────────
   Two bar groups telling the one-page paradox: completion up, installs
   down. Scales are per-group (completion in %, install lift capped at
   20%), values from the real experiment read-outs. */
function SurveyBars() {
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
  /* completion: % of 100 → px of 480; lift: % of 20 → px of 480 */
  return (
    <div
      className="alo-illo"
      role="img"
      aria-label="Bar chart comparing the two surveys. Survey completion: 55 percent for the 5-step version, over 80 percent for the 1-page version. Install lift: plus 18 percent for the 5-step version, plus 14 percent for the 1-page version."
    >
      <svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg">
        <text x={0} y={16} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          SURVEY COMPLETION
        </text>
        {row(32, "5-step", "55%", 264, false)}
        {row(60, "1-page", "80%+", 384, true)}
        <text x={0} y={146} fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          INSTALL LIFT
        </text>
        {row(162, "5-step", "+18%", 432, true)}
        {row(190, "1-page", "+14%", 336, false)}
      </svg>
      <p className="alo-illo__caption">One page finished more surveys. Five steps sold more installs.</p>
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
  return (
    <div className="alo-root">
      <nav className="alo-nav" aria-label="Primary">
        <Link href="/" className="alo-nav__mark">
          Xueyi Zhou
        </Link>
        <div className="alo-nav__right">
          <Link href="/" className="alo-nav__link">
            &larr; Back to home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="alo-section alo-hero">
        <div className="alo-wrap">
          <div className="alo-hero__kicker">Case study &middot; AppLovin &middot; Android OOBE</div>
          <h1 className="alo-hero__title">{project.title}</h1>
          <p className="alo-hero__dek">{project.dek}</p>
          <div className="alo-hero__meta">{project.subtitle}</div>
          <div className="alo-stats">
            {project.stats.map((s, i) => (
              <div className="alo-stat" key={i}>
                <div className="alo-stat__num">{s.num}</div>
                <div className="alo-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 · Overview ────────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="01" label="Overview" />
          <div className="alo-grid3">
            <div>
              <div className="alo-label">Overview</div>
              <p className="alo-body">{project.overview}</p>
            </div>
            <div>
              <div className="alo-label">My contributions</div>
              <ul className="alo-plain-list">
                {project.contributions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="alo-label">Team</div>
              <ul className="alo-plain-list">
                {project.team.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="alo-redact">{project.redact}</p>
        </div>
      </section>

      {/* ── 02 · The baseline ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="02" label="The baseline" />
          <p className="alo-body">{project.baseline}</p>
          <BaselineDiagram />
          <Fig
            src="/oobe/existing-flow.png"
            alt="Sanitized baseline flow screens: opt-in page, recommendation list with pre-selected apps, and done page"
          />
        </div>
      </section>

      {/* ── 03 · The problem ─────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="03" label="Four constraints, one bet" />
          <p className="alo-body">{project.problem}</p>
          <div className="alo-cards4">
            {project.constraints.map((c, i) => (
              <div className="alo-card" key={i}>
                {[ICONS.coldstart, ICONS.clock, ICONS.shield, ICONS.pipeline][i]}
                <div className="alo-card__kicker">Constraint {String(i + 1).padStart(2, "0")}</div>
                <div className="alo-card__title">{c.title}</div>
                <p className="alo-card__txt">{c.txt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · Experiment 1 ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="04" label="Experiment 1 · The 5-step survey" />
          <div className="alo-label">Hypothesis</div>
          <p className="alo-body">{project.experiments.survey5.hypothesis}</p>
          <Fig
            src="/oobe/exp1-survey.png"
            alt="Sanitized screens of the 5-step preference survey, one app category per page"
          />
          <XStats stats={project.experiments.survey5.stats} />
          <Take txt={project.experiments.survey5.takeaway} />
        </div>
      </section>

      {/* ── 05 · Experiment 2 ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="05" label="Experiment 2 · The 1-page survey" />
          <div className="alo-label">Hypothesis</div>
          <p className="alo-body">{project.experiments.survey1.hypothesis}</p>
          <Fig
            src="/oobe/exp2-onepage.png"
            alt="Sanitized screen of the single-page survey with all app categories combined"
          />
          <SurveyBars />
          <Take txt={project.experiments.survey1.takeaway} />
        </div>
      </section>

      {/* ── 06 · Experiment 3 ────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="06" label="Experiment 3 · The one-tap bundle" />
          <div className="alo-label">Hypothesis</div>
          <p className="alo-body">{project.experiments.bundle.hypothesis}</p>
          <div className="alo-pair">
            <div className="alo-pair__cell">
              <div className="alo-pair__tag">Variant A &middot; collapsed</div>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/oobe/exp3-bundle-a.png"
                  alt="Sanitized bundle screen, variant A: collapsed view hiding the apps inside the bundle"
                  loading="lazy"
                  draggable={false}
                />
              </figure>
            </div>
            <div className="alo-pair__cell alo-pair__cell--win">
              <div className="alo-pair__tag">Variant B &middot; icons exposed &middot; winner</div>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/oobe/exp3-bundle-b.png"
                  alt="Sanitized bundle screen, variant B: every app icon inside the bundle shown up front"
                  loading="lazy"
                  draggable={false}
                />
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
          <Marker num="07" label="Experiment 4 · Swipe cards" />
          <div className="alo-label">Hypothesis</div>
          <p className="alo-body">{project.experiments.swipe.hypothesis}</p>
          <Fig
            src="/oobe/exp4-swipe.png"
            alt="Sanitized screens of the Tinder-style swipe cards, one app per card with accept and skip gestures"
          />
          <XStats stats={project.experiments.swipe.stats} />
          <Take txt={project.experiments.swipe.takeaway} />
        </div>
      </section>

      {/* ── 08 · What I measured, what I learned ─────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <Marker num="08" label="What I measured, what I learned" />
          <p className="alo-body">{project.measurement}</p>
          <ul className="alo-chips" aria-label="Metrics tracked across the experiments">
            {project.metricChips.map((m, i) => (
              <li className="alo-chip" key={i}>
                {m}
              </li>
            ))}
          </ul>
          <div className="alo-rows">
            {project.learnings.map((l, i) => (
              <div className="alo-row" key={i}>
                <span className="alo-row__idx">{String(i + 1).padStart(2, "0")}</span>
                <p className="alo-row__txt">
                  <strong>{l.head}</strong> {l.txt}
                </p>
              </div>
            ))}
          </div>
          <p className="alo-note">{project.closing}</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="alo-section">
        <div className="alo-wrap">
          <p className="alo-cta__line">Want the full experiment ladder, round by round?</p>
          <div className="alo-cta__row">
            <CopyEmail label="Copy email" />
            <Link className="alo-btn alo-btn--ghost" href="/projects/miui-design-system">
              Next case study &rarr;
            </Link>
          </div>
          <div className="alo-cta__hint">sherrrryz@outlook.com &middot; happy to walk through the real data</div>
        </div>
      </section>
    </div>
  );
}
