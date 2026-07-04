'use client';

/* ============================================================================
   /simple — a plain, monochrome edition of the Story page.

   Same structure and copy as `/`, but black-on-white, no scroll choreography
   and no per-section theme swaps. The hero keeps only the "I, as a ___"
   rotating role; the flashlight word-wall and floating text are dropped.

   Self-contained: no imports from the Story component tree, so the two pages
   never share a TSX import (mirrors the isolation rule for lockscreen). Styling
   lives in ./simple.css and leans on the shared token scale for type + spacing.
============================================================================ */

import '../_styles/tokens.css';
import './simple.css';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const ROLES = [
  'UX Designer',
  'Team Leader',
  'Researcher',
  'Facilitator',
  'Experimenter',
  'Maker',
  'Learner',
  'Human',
];

function RotatingRole() {
  const [i, setI] = useState(0);
  const [state, setState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const hold = setInterval(() => {
      setState('out');
      const swap = setTimeout(() => {
        setI((prev) => (prev + 1) % ROLES.length);
        setState('in');
      }, 240);
      return () => clearTimeout(swap);
    }, 2600);
    return () => clearInterval(hold);
  }, []);

  return (
    <span className="sm-role">
      <span className="sm-role__word" data-state={state}>
        {ROLES[i]}
      </span>
    </span>
  );
}

const MEANS = [
  {
    text: 'It means making something personal — at a scale where nothing feels personal.',
    meta: 'Xiaomi Lock Screen · 2023',
    project: 'Xiaomi Lock Screen',
  },
  {
    text: 'It means building the system that other designers build on.',
    meta: 'MIUI Design System 2.0 · 2023',
    project: 'MIUI Design System 2.0',
  },
  {
    text: "It means ‘just make it bigger’ is never the answer.",
    meta: 'Foldable Screen Framework · 2022',
    project: 'Foldable Screen Framework',
  },
  {
    text: 'It means designing what your finger feels, not what your eye sees.',
    meta: 'Touch Hot Zone · 2024',
    project: 'Touch Hot Zone',
  },
  {
    text: "It means there's always another kind of design waiting to be made.",
    meta: '',
    project: '',
  },
];

/* Same following-cursor effect as the Story page's Business cards
   (app/_lab/ui/following-pointer.tsx), restyled black/white for /simple.
   Re-implemented locally because that component paints with var(--theme-*)
   tokens and portals to <body>, so it can't pick up this page's overrides. */
function FollowPointer({
  title,
  className,
  children,
  onOpen,
}: {
  title: ReactNode;
  className?: string;
  children: ReactNode;
  onOpen?: () => void;
}) {
  const [inside, setInside] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* Suppress the follower (and restore the native cursor) while the pointer
     is over any descendant marked data-no-follower — e.g. the drag slider,
     which has its own ew-resize cursor. */
  const overExcluded = (target: EventTarget | null) =>
    !!(target as HTMLElement | null)?.closest?.('[data-no-follower]');

  const [suppressed, setSuppressed] = useState(false);

  return (
    <div
      className={className}
      style={{ position: 'relative', cursor: suppressed ? 'auto' : 'none' }}
      onMouseEnter={(e) => {
        setPos({ x: e.clientX, y: e.clientY });
        const ex = overExcluded(e.target);
        setSuppressed(ex);
        setInside(!ex);
        onOpen?.();
      }}
      onMouseLeave={() => {
        setInside(false);
        setSuppressed(false);
      }}
      onMouseMove={(e) => {
        setPos({ x: e.clientX, y: e.clientY });
        const ex = overExcluded(e.target);
        setSuppressed(ex);
        setInside(!ex);
      }}
    >
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {inside && (
              <motion.div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  zIndex: 9999,
                  pointerEvents: 'none',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <svg
                  viewBox="0 0 16 16"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: 'translate(-2px, -2px) rotate(-70deg)',
                    color: '#111111',
                    fill: 'currentColor',
                    stroke: 'currentColor',
                    strokeWidth: 1,
                  }}
                >
                  <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
                </svg>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  style={{
                    position: 'absolute',
                    top: 18,
                    left: 16,
                    background: '#111111',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.35,
                    letterSpacing: 'var(--tracking-wide)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-pill)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
                  }}
                >
                  {title}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

const LOCKSCREENS = Array.from(
  { length: 23 },
  (_, i) => `/lockscreen-web/ls-${String(i + 1).padStart(2, '0')}.jpg`,
);

const FOLDABLE_PHOTOS = [
  '/section1-3/desktop-unfold-a.png',
  '/section1-3/desktop-unfold-b.png',
  '/section1-3/desktop-fold.png',
  '/section1-3/calender-unfold-a.png',
  '/section1-3/calender-unfold-b.png',
  '/section1-3/calender-fold.png',
  '/section1-3/note-unfold-a.png',
  '/section1-3/note-unfold-b.png',
  '/section1-3/note-fold.png',
];

const TOUCH_PHOTOS = Array.from(
  { length: 11 },
  (_, i) => `/section1-4/touch-${String(i + 1).padStart(2, '0')}.png`,
);

const MISC_PHOTOS = Array.from(
  { length: 12 },
  (_, i) => `/section1-5/s5-${String(i + 1).padStart(2, '0')}.png`,
);

const DS_PHOTOS = Array.from(
  { length: 10 },
  (_, i) => `/section1-2/ds-${String(i + 1).padStart(2, '0')}.png`,
);

const WORKSHOP = [
  {
    src: '/section3-3/1-1.png',
    workshop: 'Design system workshop',
    title: 'Opener: "How might we"',
    desc: 'Setting the frame before 40 people split into breakout groups.',
  },
  {
    src: '/section3-3/2-1.png',
    workshop: 'Design system workshop',
    title: 'Small-group sketching',
    desc: 'Senior engineers drew their own components. Nobody stayed quiet.',
  },
  {
    src: '/section3-3/1-3.png',
    workshop: 'Desktop feature workshop',
    title: 'Clustered user needs',
    desc: 'Two days of sticky notes collapsed into five opportunity areas.',
  },
  {
    src: '/section3-3/2-2.png',
    workshop: 'Design system workshop',
    title: 'Cross-team critique',
    desc: 'Three roles reviewed the same screen. Disagreements surfaced fast.',
  },
  {
    src: '/section3-3/1-2.png',
    workshop: 'Design system workshop',
    title: 'Redefining the problem',
    desc: 'Madlib template forcing each team to name the real user friction.',
  },
  {
    src: '/section3-3/2-5.png',
    workshop: 'Lock screen brainstorm',
    title: 'Card-sorting the catalog',
    desc: 'Every lock-screen style on the wall. One afternoon to re-group them all.',
  },
  {
    src: '/section3-3/1-4.png',
    workshop: 'Desktop feature workshop',
    title: 'Impact × effort matrix',
    desc: 'PMs, engineers, designers scored the same list side by side.',
  },
  {
    src: '/section3-3/2-3.png',
    workshop: 'Desktop feature workshop',
    title: 'Dot-vote round',
    desc: 'Five dots each. Loudest voice in the room suddenly had to choose.',
  },
  {
    src: '/section3-3/1-5.png',
    workshop: 'Lock screen brainstorm',
    title: 'Final recap',
    desc: 'One deck to carry the decisions back to each department.',
  },
  {
    src: '/section3-3/2-4.png',
    workshop: 'Desktop feature workshop',
    title: 'Pair focus block',
    desc: 'Designer + PM working through one flow end to end, together.',
  },
  {
    src: '/section3-3/new1.png',
    workshop: 'Desktop feature workshop',
    title: 'Cross-team working session',
    desc: 'Designers, PMs, and engineers heads-down at the same table.',
  },
  {
    src: '/section3-3/new2.png',
    workshop: 'Design system workshop',
    title: '40-person plenary',
    desc: 'Whole-room debrief before the tables broke into their own tracks.',
  },
  {
    src: '/section3-3/new3.png',
    workshop: 'Design system workshop',
    title: 'Pain-point wall + dot vote',
    desc: 'Every gap in the old system called out. Dots picked what to fix first.',
  },
  {
    src: '/section3-3/new4.png',
    workshop: 'Design system workshop',
    title: 'Team-by-team critique board',
    desc: "Every designer's work reviewed side by side by the whole team.",
  },
] as const;

/* One image in the workshops grid. Hover lifts the card and floats a small
   tooltip above it (workshop tag · title · description) — same recipe as the
   home page's WorkshopWall, restyled black/white. */
function WorkshopCell({ w }: { w: (typeof WORKSHOP)[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="sm-ww__cell"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={`${w.workshop}: ${w.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={w.src} alt="" loading="lazy" draggable={false} />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="sm-ww__tooltip"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <span className="sm-ww__tt-tag">{w.workshop}</span>
            <p className="sm-ww__tt-title">{w.title}</p>
            <p className="sm-ww__tt-desc">{w.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* One "It means" row. Its visual (lockscreen / before-after / foldable strip)
   opens on first hover and STAYS open — it only resets on a page refresh.
   `open` is one-way: once true it never goes back to false. */
function MeanRow({ m, idx }: { m: (typeof MEANS)[number]; idx: number }) {
  const [open, setOpen] = useState(false);

  const className = `sm-mean${idx === 0 ? ' sm-mean--ls' : ''}${
    idx === 1 ? ' sm-mean--ds' : ''
  }${idx === 2 ? ' sm-mean--fold' : ''}${idx === 3 ? ' sm-mean--touch' : ''}${
    idx === 4 ? ' sm-mean--misc' : ''
  }${open ? ' sm-open' : ''}`;

  const head = (
    <div className="sm-mean__head">
      <span className="sm-means__idx">{String(idx + 1).padStart(2, '0')}</span>
      <div>
        <p className="sm-means__text">{m.text}</p>
        {m.meta && (
          <div className="sm-means__meta">
            {m.meta} &middot;{' '}
            <a href="#" title="Case study coming soon">
              View project &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );

  /* Row 5 is a grab-bag of side / older work: no project name, no jump link,
     no cursor follower. Plain hover-to-reveal wrapper. */
  if (idx === 4) {
    return (
      <div
        className={className}
        onMouseEnter={() => setOpen(true)}
      >
        {head}
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-track">
            {[...MISC_PHOTOS, ...MISC_PHOTOS].map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={src} alt="" loading="lazy" draggable={false} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <FollowPointer
      className={className}
      title={
        <>
          {m.project} <span aria-hidden="true">&rarr;</span>
        </>
      }
      onOpen={() => setOpen(true)}
    >
      {head}

      {idx === 0 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-track">
            {[...LOCKSCREENS, ...LOCKSCREENS].map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={src} alt="" loading="lazy" draggable={false} />
            ))}
          </div>
        </div>
      )}

      {idx === 2 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-track sm-ls-track--groups">
            {[...FOLDABLE_PHOTOS, ...FOLDABLE_PHOTOS].map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={src} alt="" loading="lazy" draggable={false} />
            ))}
          </div>
        </div>
      )}

      {idx === 1 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-track">
            {[...DS_PHOTOS, ...DS_PHOTOS].map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={src} alt="" loading="lazy" draggable={false} />
            ))}
          </div>
        </div>
      )}

      {idx === 3 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-track">
            {[...TOUCH_PHOTOS, ...TOUCH_PHOTOS].map((src, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={i} src={src} alt="" loading="lazy" draggable={false} />
            ))}
          </div>
        </div>
      )}
    </FollowPointer>
  );
}

const FLIP = [
  {
    label: 'Onboarding survey',
    actual: '5-step survey drove 18% install growth. 1-step only drove 14%.',
    insight: 'Longer engagement built stronger intent.',
    loser: '1 step',
    winner: '5 step',
    loserImg: '/section2/1-step.png',
    winnerImg: '/section2/5-step.png',
  },
  {
    label: 'App bundle',
    actual: 'Showing all app icons lifted installs by 0.47 per user. Collapsed view only lifted 0.37.',
    insight: 'Transparency beat minimalism.',
    loser: 'Collapsed',
    winner: 'Transparent',
    loserImg: '/section2/collapsed.png',
    winnerImg: '/section2/transparent.png',
  },
  {
    label: 'Recommendation browsing',
    actual: 'Swipe cards reached 15.65% CTR. Free-scroll list stayed much lower.',
    insight: 'Forced focus beat open browsing.',
    loser: 'Free-scroll',
    winner: 'Swipe',
    loserImg: '/section2/free-scroll.png',
    winnerImg: '/section2/swipe.png',
  },
] as const;

const PHRASES = [
  {
    head: 'a newcomer',
    items: [
      'Only 1 year of working experience',
      'Already leading another key project',
      "Started with 2 teammates who weren't sure about me",
    ],
  },
  {
    head: 'a team of senior people',
    items: [
      'Grew the team from 2 to 7',
      'Helped everyone understand the current state',
      'Gathered evidence to set a clear direction',
      'Learned together as a team',
      'Took the first step alone so others could follow',
    ],
  },
  {
    head: 'multiple departments',
    items: [
      '40-person workshop with design, PM, and research',
      'Invited engineers to share their pain points',
      'Aligned rules directly with 6 SDK engineers',
      'Cross-role review: 10 designers + 10 PMs + 10 engineers',
    ],
  },
  {
    head: 'a terrible idea',
    items: [
      '8 core components documented',
      'First-ever foundation guidelines',
      'Design tokens introduced',
      '8.9 / 10 satisfaction score',
    ],
  },
];

const RESEARCH = [
  "Xiaomi's first design research project",
  '100+ automotive HCI papers',
  'Cursor research report',
  'Designer workflow survey',
];

const METHODS = [
  'Competitive analysis',
  'User interviews',
  'Usability testing',
  'A/B testing',
  'Survey design',
  'Heuristic evaluation',
  'Contextual inquiry',
  'Affinity mapping',
  'Card sorting',
  'Journey mapping',
];

const PHOTOS = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg',
  '/photos/photo5.jpg',
  '/photos/photo6.jpg',
  '/photos/photo1.jpg',
  '/photos/photo3.jpg',
];

/* Underlined phrase inside the For-Teams quote. Hover (or focus for keyboard
   users) opens a large card above the phrase with the bullet points that used
   to sit in the 4-column grid below. A small pulsing "hover" badge on the first
   phrase (`showHint`) advertises the interaction. */
/* Build a `cursor:` value that renders an emoji as the mouse cursor via a
   32×32 SVG data URI. Emoji is URL-encoded so codepoints outside ASCII
   travel cleanly through the URL parser. Hotspot centered at 16/16;
   falls back to `help` on browsers that drop custom cursors. */
function emojiCursor(emoji: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='0' y='26' font-size='26'>${emoji}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, help`;
}

function HoverPhrase({
  phrase,
  showHint,
  reveal,
  emoji,
}: {
  phrase: (typeof PHRASES)[number];
  showHint?: boolean;
  /* Optional: swap a single word on hover. E.g. "a terrible idea" → "a
     brilliant idea". The phrase's `.head` still drives the popup id/aria,
     but the visible text renders via this template. */
  reveal?: { before: string; from: string; to: string; after: string };
  /* Optional: emoji to render as the mouse cursor while hovering this
     phrase. When set, overrides the default `cursor: help`. */
  emoji?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="sm-phrase-hover"
      style={emoji ? { cursor: emojiCursor(emoji) } : undefined}
      data-open={open ? 'true' : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      aria-describedby={open ? `phrase-${phrase.head}` : undefined}
      aria-label={reveal ? `${reveal.before}${reveal.from}${reveal.after}` : undefined}
    >
      {reveal ? (
        <>
          {reveal.before}
          <span className="sm-phrase-swap">
            <span className="sm-phrase-swap__slot sm-phrase-swap__from" aria-hidden="true">
              {reveal.from}
            </span>
            <span className="sm-phrase-swap__slot sm-phrase-swap__to" aria-hidden="true">
              {reveal.to}
            </span>
          </span>
          {reveal.after}
        </>
      ) : (
        phrase.head
      )}
      {showHint && (
        <span className="sm-phrase-hint" aria-hidden="true">
          <span className="sm-phrase-hint__dot" />
          hover
        </span>
      )}
      <AnimatePresence>
        {open && (
          <motion.span
            className="sm-phrase-card"
            id={`phrase-${phrase.head}`}
            role="tooltip"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <ul className="sm-phrase-card__list">
              {phrase.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* Design-common-sense tenets. Once the group's bottom scrolls above the top
   ~35% of the viewport (user is leaving the section going down), each line
   gets struck through in a staggered left-to-right sweep. One-way: doesn't
   un-strike on scroll back — the "we were wrong" reveal shouldn't rewind. */
function Tenets() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [struck, setStruck] = useState(false);

  useEffect(() => {
    if (struck) return;
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setStruck(true);
      return;
    }

    /* Fire while the group is still on-screen so the user actually sees the
       animation. Trigger: group's top crosses the top ~5% of the viewport —
       user has clearly read past it, top is right at the ceiling but the
       rest of the group is still visible below. */
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.05 && rect.bottom > 0) {
        setStruck(true);
      }
    };
    window.addEventListener('scroll', check, { passive: true });
    /* Don't fire an initial check() here — browsers restore scroll position on
       reload, so if a returning user lands with the tenets already past the
       trigger line, an immediate setStruck(true) fires so fast the transition
       never paints. Deferring to real scroll events guarantees an animation. */
    return () => window.removeEventListener('scroll', check);
  }, [struck]);

  return (
    <div
      ref={ref}
      className={`sm-group sm-group--tenets${struck ? ' sm-group--struck' : ''}`}
    >
      <div className="sm-eyebrow">Design common sense</div>
      <div className="sm-tenets">
        <p className="sm-tenet">&ldquo;Fewer steps is always better.&rdquo;</p>
        <p className="sm-tenet">&ldquo;Cleaner UI converts more.&rdquo;</p>
        <p className="sm-tenet">&ldquo;Users hate being forced.&rdquo;</p>
      </div>
    </div>
  );
}

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="sm-marker">
      <span className="sm-marker__num">{num}</span>
      <span>{label}</span>
      <span className="sm-marker__line" aria-hidden="true" />
    </div>
  );
}

export default function SimplePage() {
  return (
    <div className="sm-root">
      <nav className="sm-nav" aria-label="Primary">
        <Link href="/simple" className="sm-nav__mark">
          Xueyi Zhou
        </Link>
        <div className="sm-nav__links">
          <Link href="/" className="sm-nav__link">
            Full experience &rarr;
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="sm-section sm-hero">
        <div className="sm-wrap">
          <div className="sm-hero__kicker">Xueyi (Sherry) Zhou &middot; Product Designer</div>
          <h1 className="sm-hero__line">
            I, as a
            <br />
            <RotatingRole />
            <span className="sm-role__cursor" aria-hidden="true">
              _
            </span>
          </h1>
          <p className="sm-hero__sub">
            A UX/Product Designer with experience at Huawei, Xiaomi, and
            AppLovin.
          </p>
          <p className="sm-hero__sub">
            Designing for millions, for business, for teams, for evidence, and
            out of plain curiosity.
          </p>
          <span className="sm-hero__scroll">Scroll to read &darr;</span>
        </div>
      </header>

      {/* ── 01 · For Millions ────────────────────────────────── */}
      <section className="sm-section">
        <div className="sm-wrap">
          <Marker num="01" label="For Millions" />
          <h2 className="sm-question">
            What does it mean to design for 700 million people?
          </h2>
          <div className="sm-means">
            {MEANS.map((m, idx) => (
              <MeanRow key={m.meta} m={m} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · For Business ────────────────────────────────── */}
      <section className="sm-section">
        <div className="sm-wrap">
          <Marker num="02" label="For Business" />

          {/* Group 1 — headline + context */}
          <div className="sm-group">
            <h2 className="sm-h">
              At AppLovin, design was measured in dollars.
            </h2>
            <p className="sm-body sm-group__body">
              The OOBE app-recommendation flow ships with <strong>Samsung</strong>,{' '}
              <strong>T-Mobile</strong>, and a dozen other OEMs. It reaches tens
              of millions of newly unboxed phones each quarter and contributes{' '}
              <strong>seven figures of revenue</strong>.
            </p>
            <ul className="sm-oems" aria-label="OEM & carrier partners">
              {[
                { src: '/section2/oem-tmobile.png',  name: 'T-Mobile' },
                { src: '/section2/oem-realme.png',   name: 'realme' },
                { src: '/section2/oem-samsung.png',  name: 'Samsung' },
                { src: '/section2/oem-bouygues.png', name: 'Bouygues Telecom' },
                { src: '/section2/oem-metro.png',    name: 'Metro' },
                { src: '/section2/oem-mtn.png',      name: 'MTN' },
              ].map((o) => (
                <li className="sm-oem" key={o.name} title={o.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.src} alt={o.name} loading="lazy" draggable={false} />
                </li>
              ))}
            </ul>
          </div>

          {/* Group 2 — the design-common-sense we walked in with */}
          <Tenets />

          {/* Group 3 — the verdict + the three tests */}
          <div className="sm-group">
            <p className="sm-verdict">
              We tested all three. All three were wrong.
            </p>

          <div className="sm-flip">
            {FLIP.map((c) => (
              <FollowPointer
                key={c.label}
                className="sm-flip__col"
                title={c.insight}
              >
                <article className="sm-card">
                  <h3 className="sm-card__title">{c.label}</h3>
                  <p className="sm-card__desc">{c.actual}</p>
                  <div className="sm-card__pair">
                    <div className="sm-opt sm-opt--loser">
                      <span className="sm-opt__label">{c.loser}</span>
                      <div className="sm-opt__art">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.loserImg}
                          alt=""
                          className="sm-mock"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="sm-opt sm-opt--winner">
                      <span className="sm-opt__tag">WINNER</span>
                      <span className="sm-opt__label">{c.winner}</span>
                      <div className="sm-opt__art">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.winnerImg}
                          alt=""
                          className="sm-mock"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </FollowPointer>
            ))}
          </div>

            <p className="sm-footer-link">AppLovin OOBE &middot; 2025 &middot; View project &rarr;</p>
          </div>
        </div>
      </section>

      {/* ── 03 · For Teams ───────────────────────────────────── */}
      <section className="sm-section">
        <div className="sm-wrap">
          <Marker num="03" label="For Teams" />
          <p className="sm-quote-intro">
            My manager said this when he put me in charge of the design system:
          </p>
          <blockquote className="sm-quote">
            &ldquo;We just put{' '}
            <HoverPhrase phrase={PHRASES[0]} showHint emoji="😳" />
            {' '}in charge, leading{' '}
            <HoverPhrase phrase={PHRASES[1]} emoji="🤨" />
            , across{' '}
            <HoverPhrase phrase={PHRASES[2]} emoji="🤯" />
            . Honestly? It sounded like{' '}
            <HoverPhrase
              phrase={PHRASES[3]}
              reveal={{ before: 'a ', from: 'terrible', to: 'brilliant', after: ' idea' }}
              emoji="🤩"
            />
            .&rdquo;
          </blockquote>

          <div className="sm-sublabel">Workshops · aligning across departments</div>
          <div className="sm-ww">
            {WORKSHOP.map((w, i) => (
              <WorkshopCell w={w} key={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── 04 · For Evidence ────────────────────────────────── */}
      <section className="sm-section">
        <div className="sm-wrap">
          <Marker num="04" label="For Evidence" />
          <h2 className="sm-h sm-h--sm">
            Every project I&rsquo;ve worked on started with a question I
            couldn&rsquo;t answer from my desk.
          </h2>
          <div className="sm-tags">
            {RESEARCH.map((t) => (
              <span className="sm-tag sm-tag--solid" key={t}>
                {t}
              </span>
            ))}
            {METHODS.map((t) => (
              <span className="sm-tag sm-tag--ghost" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 · Curiosity ───────────────────────────────────── */}
      <section className="sm-section">
        <div className="sm-wrap">
          <Marker num="05" label="Curiosity" />
          <h2 className="sm-h sm-h--sm">
            Curiosity doesn&rsquo;t stop at the office door.
          </h2>

          <div className="sm-bio">
            <div className="sm-bio__body">
              <p>
                I&rsquo;m a <strong>UX Designer</strong> who likes to mess with
                systems, at work and off the clock.
              </p>
              <p>
                By day I&rsquo;ve shipped features to <strong>700M phones</strong>,
                run <strong>40-person workshops</strong>, and rebuilt the
                onboarding flow that quietly prints revenue for a few OEMs.
              </p>
              <p>
                Off the clock I build little iOS toys, teach my{' '}
                <strong>two cats</strong> new tricks, and chase one more run down
                the slope.
              </p>
              <p>
                Currently open to <strong>new adventures</strong>. If you&rsquo;re
                building for real people, let&rsquo;s talk.
              </p>
            </div>

            <div className="sm-photos">
              {PHOTOS.map((src, i) => (
                <div className="sm-photo" key={`${src}-${i}`}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 45vw, 22vw"
                    draggable={false}
                  />
                </div>
              ))}
              <span className="sm-photos__note">
                Things I keep chasing off the clock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <footer className="sm-section sm-contact">
        <div className="sm-wrap">
          <Marker num="06" label="Say hello" />
          <h2 className="sm-h sm-h--sm">Let&rsquo;s build for real people.</h2>
          <a className="sm-contact__mail" href="mailto:sherrrrrryz@gmail.com">
            sherrrrrryz@gmail.com
          </a>
          <div className="sm-contact__row">
            <Link href="/">Full experience</Link>
            <Link href="/overview">Overview</Link>
            <Link href="/projects">Projects</Link>
          </div>
          <div className="sm-colophon">
            <span>Xueyi (Sherry) Zhou &copy; 2026</span>
            <span>Plain edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
