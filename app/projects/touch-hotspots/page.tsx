/* ============================================================================
   /projects/touch-hotspots — case-study landing for the Touch Hot Zone
   research, told the same way as /projects/miui-design-system: short
   editorial copy on the shared monochrome token scale, with the long
   research text replaced by inline SVG illustrations, stat bands and the
   real study artifacts (test app screens, heatmaps, UI overlays) from
   public/toucharea/.

   No TSX imports shared with the homepage or other project routes
   (isolation rule): layout primitives are local markup, styling lives in
   ./touch-hotspots.css on the shared token scale from _styles/tokens.css.
============================================================================ */

import "../../_styles/tokens.css";
import "./touch-hotspots.css";

import type { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export const metadata: Metadata = {
  title: "Touch Hot Zone · Xueyi Zhou",
  description:
    "Mapping where thumbs actually reach on a 6.8-inch screen, so layout decisions stop being guesses.",
};

/** Data model (edit here to drive the page) */
const project = {
  title: "Touch Hot Zone",
  dek: "Mapping where thumbs actually reach on a 6.8-inch screen, so layout decisions stop being guesses.",
  subtitle: "HCI Research · Experimental Design · Data-informed UX",
  stats: [
    { num: "144", label: "screen zones measured" },
    { num: "40", label: "participants, both hands" },
    { num: "75%", label: "of users operate one-thumbed" },
    { num: "40%", sub: "↓", label: "shorter task path shipped" },
  ],
  overview:
    "The first HCI design research project initiated by the design department at Xiaomi. We measured how thumbs really perform across today's large screens, turned the data into a hot zone map designers use daily, and packaged the method so it could be rerun on foldables and tablets.",
  contributions: [
    "User research",
    "Experimental design",
    "Data analysis",
    "User experience design",
  ],
  team: ["2 UX designers", "1 user researcher", "First research project by the design team"],
  why: "Steve Jobs called 3.5 inches the perfect size. Since 2012 screens kept growing anyway, and Xiaomi's bestsellers now run about 6.8 inches. Our thumbs did not grow with them, yet most layout rules still assumed they had.",
  goals: [
    "A touch hot zone map designers can use daily",
    "Design guidance Xiaomi's business teams can apply",
    "A replicable method for foldables and tablets",
  ],
  setup:
    "Desk research surfaced two dominant single-hand grips, pinky supporting the back of the phone or catching its bottom edge. We scoped the study tightly so the data would stay credible on a limited budget.",
  scope: ["Xiaomi 11 · 6.8 in", "Single-hand use", "Thumb clicking", "Seated, stationary", "Left and right hands", "50 / 50 gender split"],
  experiment:
    "We split the screen into 144 zones sized from Apple's ideal 9 by 9 millimeter target. In each zone, participants long-pressed a square, waited for it to turn green, then tapped it. 40 people, 20 per grip style, ran the task with both hands after 10 practice rounds.",
  metrics: ["Hit rate", "Abandon rate", "Misoperation rate", "Click duration", "Click offset"],
  findings:
    "Per-zone hit rates fell into three clean bands: an easy zone under the thumb's natural sweep, a stretch zone reachable with effort, and a dead zone the thumb abandons. The maps below are the real data, first how to read one, then both hands side by side.",
  shipped:
    "We applied the map two ways. Statically, by moving controls into the easy zone. Dynamically, by re-examining whole flows: among 500,000 daily calendar users, 70% only edit the title when creating an event, yet could not finish that one-handed. Auto-focusing the title and moving the confirm buttons down cut the interaction path by about 40%. The biggest win, bottom tab navigation replacing top tabs, launched in MIUI 15.",
  quote: "3.5 inches is the perfect size for consumers' hands.",
  quoteBy: "Steve Jobs, 2010. Screens kept growing anyway.",
  closing:
    "The findings were shared across design, product and research teams, and the method became the template for the folding screen, gesture and eye-tracking studies that followed.",
};

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
  return (
    <div
      className="thz-illo"
      role="img"
      aria-label="Diagram comparing a 3.5-inch phone from 2010 with a 6.8-inch phone from 2021. On the large phone, the thumb's reach covers only the lower right region of the screen."
    >
      <svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg">
        {/* small phone */}
        <Phone x={120} y={92} w={92} h={168}>
          <line x1={140} y1={112} x2={192} y2={112} stroke="currentColor" strokeOpacity={0.25} />
          <line x1={140} y1={240} x2={192} y2={240} stroke="currentColor" strokeOpacity={0.25} />
        </Phone>
        <text x={166} y={72} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
          2010 · 3.5 IN
        </text>
        <text x={166} y={286} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          &ldquo;the perfect size&rdquo;
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
          2021 · 6.8 IN
        </text>
        <text x={594} y={292} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          same thumb, twice the screen
        </text>
      </svg>
      <p className="thz-illo__caption">Screens doubled. Thumbs didn&rsquo;t.</p>
    </div>
  );
}

/* ── 03 · Two grips ──────────────────────────────────────────────────
   The two single-hand grips from desk research, each shown as a phone
   with the thumb's anchor point and sweep. */
function GripsDiagram() {
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
      aria-label="Diagram of the two single-hand grip styles: pinky supporting the back of the phone, giving a higher thumb anchor, and pinky catching the bottom edge, giving a lower thumb anchor."
    >
      <svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg">
        {grip(140, 208, "GRIP A", "pinky supports the back", "thz-grip-a")}
        {grip(460, 252, "GRIP B", "pinky catches the bottom", "thz-grip-b")}
        {/* pinky lines */}
        <line x1={140} y1={198} x2={124} y2={198} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <line x1={496} y1={260} x2={496} y2={276} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <p className="thz-illo__caption">Two grips, two thumb anchors, two different maps · 20 participants each</p>
    </div>
  );
}

/* ── 04 · The experiment ─────────────────────────────────────────────
   Left: the 8 by 18 zone grid on the test device. Right: one trial,
   long-press, wait, tap. */
function ExperimentDiagram() {
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
      aria-label="Diagram of the experiment: the phone screen divided into an 8 by 18 grid of 144 zones, and the trial sequence, long-press a square, wait 1.5 seconds, tap it once it turns."
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
          8 × 18 = 144 ZONES
        </text>
        <text x={gx + gw / 2} y={gy + gh + 54} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          each 9 × 9 mm
        </text>

        {/* trial sequence */}
        <g>
          <rect x={392} y={116} width={48} height={48} rx={8} fill="currentColor" fillOpacity={0.85} />
          <text x={416} y={196} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
            LONG-PRESS
          </text>

          <path d="M456 140h28m0 0-8-6m8 6-8 6" fill="none" stroke="currentColor" strokeOpacity={0.55} />

          <rect x={500} y={116} width={48} height={48} rx={8} fill="none" stroke="currentColor" strokeDasharray="4 5" />
          <text x={524} y={146} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.7}>
            1.5s
          </text>
          <text x={524} y={196} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
            WAIT
          </text>

          <path d="M564 140h28m0 0-8-6m8 6-8 6" fill="none" stroke="currentColor" strokeOpacity={0.55} />

          <rect x={608} y={116} width={48} height={48} rx={8} fill="none" stroke="currentColor" strokeWidth={1.5} />
          <circle cx={632} cy={140} r={9} fill="none" stroke="currentColor" />
          <circle cx={632} cy={140} r={3} fill="currentColor" />
          <text x={632} y={196} textAnchor="middle" fontSize="12" letterSpacing="2" fill="currentColor" fillOpacity={0.55}>
            TAP
          </text>
        </g>
        <text x={524} y={248} textAnchor="middle" fontSize="12" fill="currentColor" fillOpacity={0.55}>
          one trial per zone · both hands
        </text>
      </svg>
      <p className="thz-illo__caption">One protocol, 144 zones, five metrics per zone</p>
    </div>
  );
}

export default function ProjectTouchHotspots() {
  return (
    <div className="thz-root">
      <nav className="thz-nav" aria-label="Primary">
        <Link href="/" className="thz-nav__mark">
          Xueyi Zhou
        </Link>
        <div className="thz-nav__right">
          <Link href="/" className="thz-nav__link">
            &larr; Back to home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="thz-section thz-hero">
        <div className="thz-wrap">
          <div className="thz-hero__kicker">Case study &middot; Xiaomi &middot; HCI research</div>
          <h1 className="thz-hero__title">{project.title}</h1>
          <p className="thz-hero__dek">{project.dek}</p>
          <div className="thz-hero__meta">{project.subtitle}</div>
          <div className="thz-stats">
            {project.stats.map((s, i) => (
              <div className="thz-stat" key={i}>
                <div className="thz-stat__num">
                  {s.num}
                  {s.sub ? <sub>{s.sub}</sub> : null}
                </div>
                <div className="thz-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── 01 · Overview ────────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="01" label="Overview" />
          <div className="thz-grid3">
            <div>
              <div className="thz-label">Overview</div>
              <p className="thz-body">{project.overview}</p>
            </div>
            <div>
              <div className="thz-label">My contributions</div>
              <ul className="thz-plain-list">
                {project.contributions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="thz-label">Team</div>
              <ul className="thz-plain-list">
                {project.team.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Screens outgrew thumbs ──────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="02" label="Screens outgrew thumbs" />
          <p className="thz-body">{project.why}</p>
          <GrowthDiagram />
          <p className="thz-note">The study aimed at three deliverables:</p>
          <ul className="thz-chips" style={{ marginTop: 14 }} aria-label="Research goals">
            {project.goals.map((g, i) => (
              <li className="thz-chip thz-chip--num" key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 03 · The setup ───────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="03" label="The setup" />
          <p className="thz-body">{project.setup}</p>
          <GripsDiagram />
          <ul className="thz-chips" style={{ marginTop: 24 }} aria-label="Study scope">
            {project.scope.map((s, i) => (
              <li className="thz-chip" key={i}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 04 · The experiment ──────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="04" label="The experiment" />
          <p className="thz-body">{project.experiment}</p>
          <ExperimentDiagram />
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toucharea/app-onboarding.png"
              alt="Four screens of the tap test app: a welcome form collecting name, gender and daily phone-use habits, an instruction to hold the phone one-handed and tap a comfortable spot, the tapped grid with a confirm button, and a screen asking which grip the participant is using"
              loading="lazy"
              draggable={false}
            />
            <figcaption>The test app we built. Participants register, calibrate a comfortable spot, then declare their grip.</figcaption>
          </figure>
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toucharea/app-trial.png"
              alt="Four more screens of the tap test app: practice mode instructions, a trial where a blue square is long-pressed while a gray square waits, the gray square turned green and ready to tap, and the experiment 1 instructions asking participants to keep their palm in place"
              loading="lazy"
              draggable={false}
            />
            <figcaption>One trial: long-press the blue square, wait for the target to turn green, tap it. 10 practice rounds first.</figcaption>
          </figure>
          <p className="thz-note">Five metrics were collected for every zone:</p>
          <ul className="thz-chips" style={{ marginTop: 14 }} aria-label="Metrics collected per zone">
            {project.metrics.map((m, i) => (
              <li className="thz-chip" key={i}>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 05 · What the data showed ────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="05" label="What the data showed" />
          <p className="thz-body">{project.findings}</p>
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toucharea/heatmap-legend.png"
              alt="The hit-rate heatmap with its legend: each cell shows the percentage of people who tapped that zone successfully. Green cells mean 75% or more hit the target, yellow 25% to 75%, red 3% to 25%, and black cells were hit by no one"
              loading="lazy"
              draggable={false}
            />
            <figcaption>How to read the map. Each cell is one zone&rsquo;s tap hit rate: green 75%+, yellow 25&ndash;75%, red under 25%, black untouched.</figcaption>
          </figure>
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toucharea/heatmap-hands.png"
              alt="The real hit-rate heatmaps from the study, two full phone screens side by side: left hand and right hand, each covered in per-zone percentages, with the green high-hit-rate pool sitting low on the thumb's side and fading to red and black toward the opposite top corner"
              loading="lazy"
              draggable={false}
            />
            <figcaption>Per-zone hit rates, left hand vs right hand. The green pool mirrors with the thumb.</figcaption>
          </figure>
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toucharea/heatmap-bands.png"
              alt="The heatmap annotated with the three reach bands: the green center is reachable with just a little thumb movement, the yellow ring is reachable with some effort but risks tapping the wrong spot, and the dark top corner is basically out of reach with a high rate of mis-taps"
              loading="lazy"
              draggable={false}
            />
            <figcaption>The three bands on the real data: easy under the thumb, stretch around it, dead zone in the far corner.</figcaption>
          </figure>
        </div>
      </section>

      {/* ── 06 · From map to shipped design ──────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="06" label="From map to shipped design" />
          <p className="thz-body">{project.shipped}</p>
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toucharea/overlay-lockscreen.jpg"
              alt="Three lock screens side by side: an iOS lock screen, the MIUI lock screen, and the same MIUI lock screen with the touch hot zone map overlaid, showing the camera and flashlight shortcuts sitting inside the easy zone"
              loading="lazy"
              draggable={false}
            />
            <figcaption>Auditing shipped UI: the map overlaid on the MIUI lock screen puts its shortcuts in the easy zone.</figcaption>
          </figure>
          <figure className="thz-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/toucharea/overlay-apps.jpg"
              alt="The overlay applied to more screens: lock screen notifications landing in the stretch zone, and the file manager app whose tabs and recent files sit across the easy and stretch zones"
              loading="lazy"
              draggable={false}
            />
            <figcaption>The same audit on notifications and the file manager, zone by zone, control by control.</figcaption>
          </figure>
        </div>
      </section>

      {/* ── 07 · Takeaway ────────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <Marker num="07" label="Takeaway" />
          <blockquote className="thz-quote">
            &ldquo;{project.quote}&rdquo;
            <span className="thz-quote__by">{project.quoteBy}</span>
          </blockquote>
          <p className="thz-note">{project.closing}</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="thz-section">
        <div className="thz-wrap">
          <p className="thz-cta__line">Want the full dataset and method?</p>
          <div className="thz-cta__row">
            <a className="thz-btn" href="mailto:sherrrrrryz@gmail.com">
              Email me
            </a>
            <Link className="thz-btn thz-btn--ghost" href="/projects/miui-design-system">
              Next case study &rarr;
            </Link>
          </div>
          <div className="thz-cta__hint">sherrrrrryz@gmail.com &middot; happy to walk through the research</div>
        </div>
      </section>
    </div>
  );
}
