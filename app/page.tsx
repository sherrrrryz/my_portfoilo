'use client';

/* ============================================================================
   / — the homepage. A plain, monochrome, editorial read.

   Almost no scroll choreography. The one exception is the page background:
   a ScrollTrigger toggles data-bg on .sm-root at section boundaries (white
   for hero + 01, then two grays for 02–03 and 04 onward), and a 0.4s CSS
   transition smooths the swap. The hero keeps the "I, as a ___" rotating role.

   Self-contained: no TSX imports shared with the lockscreen routes (isolation
   rule). Styling lives in ./simple.css and leans on the shared token scale in
   _styles/tokens.css for type + spacing. The former scroll-driven Story page
   is archived at git tag `archive/story-page`.
============================================================================ */

import './_styles/tokens.css';
import './simple.css';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

/* Hero: the three employers, ordered by importance. Hover (or focus)
   floats a small card with a scale fact, so visitors outside the industry
   get a sense of how big each company is. */
const COMPANIES = [
  {
    name: 'Xiaomi',
    tag: 'Fortune Global 500',
    desc: 'One of the world’s top 3 smartphone makers. Its OS runs on 700M+ monthly active devices.',
  },
  {
    name: 'AppLovin',
    tag: 'NASDAQ: APP',
    desc: 'A leading mobile ad-tech platform, reaching over 1 billion devices every day.',
  },
  {
    name: 'Huawei',
    tag: '170+ countries',
    desc: 'A global ICT giant with 200,000+ employees, serving over 3 billion people.',
  },
];

function CompanyHover({ c }: { c: (typeof COMPANIES)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="sm-co"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      aria-describedby={open ? `co-${c.name}` : undefined}
    >
      {c.name}
      <AnimatePresence>
        {open && (
          <motion.span
            className="sm-co-card"
            id={`co-${c.name}`}
            role="tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <span className="sm-co-card__tag">{c.tag}</span>
            <span className="sm-co-card__desc">{c.desc}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

const MEANS = [
  {
    text: 'It means making something personal — at a scale where nothing feels personal.',
    meta: 'Xiaomi Lock Screen · 2023',
    project: 'Xiaomi Lock Screen',
    href: '/projects/lockscreen',
  },
  {
    text: 'It means building the system that other designers build on.',
    meta: 'MIUI Design System 2.0 · 2023',
    project: 'MIUI Design System 2.0',
    href: '',
  },
  {
    text: "It means ‘just make it bigger’ is never the answer.",
    meta: 'Foldable Screen Framework · 2022',
    project: 'Foldable Screen Framework',
    href: '',
  },
  {
    text: 'It means designing what your finger feels, not what your eye sees.',
    meta: 'Touch Hot Zone · 2024',
    project: 'Touch Hot Zone',
    href: '',
  },
  {
    text: "It means there's always another kind of design waiting to be made.",
    meta: '',
    project: '',
    href: '',
  },
];

/* Same following-cursor effect as the Story page's Business cards
   (following-pointer.tsx, now only in git tag archive/story-page), restyled
   black/white for /simple. Re-implemented locally because that component
   painted with the archived theme tokens and portaled to <body>, so it
   couldn't pick up this page's overrides. */
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

/* Shared timestamp so strips that qualify at (nearly) the same moment open
   as a short cascade instead of one big simultaneous layout jump. */
let lastStripOpenAt = 0;
const STRIP_STAGGER_MS = 260;

/* One "It means" row. Its visual (lockscreen / before-after / foldable strip)
   opens by itself once the row scrolls into place and STAYS open — it only
   resets on a page refresh. `open` is one-way: once true it never flips back.

   Trigger is an IntersectionObserver rather than GSAP ScrollTrigger on
   purpose: each strip that opens pushes the rows below it ~400px down, so
   any trigger position computed up front goes stale after the first reveal.
   IO evaluates live geometry, so every row still fires at the same visual
   line (its head entering the top ~68% of the viewport).

   A second, much earlier observer flips `near` one viewport ahead, swapping
   the strip's images from lazy to eager so they're decoded before the
   reveal starts — no pop-in while the strip is growing. */
function MeanRow({ m, idx }: { m: (typeof MEANS)[number]; idx: number }) {
  const headRef = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) return;
    const el = headRef.current;
    if (!el) return;

    const nearIO = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        nearIO.disconnect();
      },
      { rootMargin: '100% 0px 100% 0px' },
    );
    nearIO.observe(el);

    let timer: number | undefined;
    const openIO = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        openIO.disconnect();
        const now = performance.now();
        const delay = Math.max(0, lastStripOpenAt + STRIP_STAGGER_MS - now);
        lastStripOpenAt = now + delay;
        timer = window.setTimeout(() => {
          setNear(true);
          setOpen(true);
        }, delay);
      },
      /* Fires once the head crosses the top ~68% of the viewport. The huge
         top margin keeps everything ABOVE that line inside the root too:
         a fast flick (or a restored scroll position) can move the head
         past the whole band between two observer ticks, and without the
         allowance that row would never intersect — and never open. */
      { rootMargin: '9999px 0px -32% 0px' },
    );
    openIO.observe(el);

    return () => {
      nearIO.disconnect();
      openIO.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [open]);

  const lazy = near ? undefined : ('lazy' as const);

  const className = `sm-mean${idx === 0 ? ' sm-mean--ls' : ''}${
    idx === 1 ? ' sm-mean--ds' : ''
  }${idx === 2 ? ' sm-mean--fold' : ''}${idx === 3 ? ' sm-mean--touch' : ''}${
    idx === 4 ? ' sm-mean--misc' : ''
  }${open ? ' sm-open' : ''}`;

  const head = (
    <div className="sm-mean__head" ref={headRef}>
      <span className="sm-means__idx">{String(idx + 1).padStart(2, '0')}</span>
      <div>
        <p className="sm-means__text">
          {m.href ? (
            <Link href={m.href} className="sm-means__text-link">
              {m.text}
            </Link>
          ) : (
            m.text
          )}
        </p>
        {m.meta && (
          <div className="sm-means__meta">{m.meta}</div>
        )}
      </div>
    </div>
  );

  /* Row 5 is a grab-bag of side / older work: no project name, no jump link. */
  if (idx === 4) {
    return (
      <div className={className}>
        {head}
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-strip__in">
            <div className="sm-ls-track">
              {[...MISC_PHOTOS, ...MISC_PHOTOS].map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={src} alt="" loading={lazy} draggable={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {head}

      {idx === 0 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-strip__in">
            <div className="sm-ls-track">
              {[...LOCKSCREENS, ...LOCKSCREENS].map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={src} alt="" loading={lazy} draggable={false} />
              ))}
            </div>
          </div>
        </div>
      )}

      {idx === 2 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-strip__in">
            <div className="sm-ls-track sm-ls-track--groups">
              {[...FOLDABLE_PHOTOS, ...FOLDABLE_PHOTOS].map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={src} alt="" loading={lazy} draggable={false} />
              ))}
            </div>
          </div>
        </div>
      )}

      {idx === 1 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-strip__in">
            <div className="sm-ls-track">
              {[...DS_PHOTOS, ...DS_PHOTOS].map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={src} alt="" loading={lazy} draggable={false} />
              ))}
            </div>
          </div>
        </div>
      )}

      {idx === 3 && (
        <div className="sm-ls-strip" aria-hidden="true">
          <div className="sm-ls-strip__in">
            <div className="sm-ls-track">
              {[...TOUCH_PHOTOS, ...TOUCH_PHOTOS].map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={src} alt="" loading={lazy} draggable={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
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

/* Off-the-clock projects for the Curiosity section. Each card is a small pile
   of overlapping photos; clicking opens a lightbox with a per-item caption.
   Media live under /public/simple/off-clock/. */
type OcMedia = {
  kind: 'image' | 'video';
  src: string;
  caption: string;
};

type OcProject = {
  id: string;
  title: string;
  tagline: string;
  blurb: string;
  emoji: string;
  stack: string[];
  media: OcMedia[];
};

const OC = '/simple/off-clock';

const OFF_CLOCK: OcProject[] = [
  {
    id: 'provis',
    title: 'Seeing scent',
    tagline: 'PROVis, a research tool that gives perfume a visual language.',
    blurb:
      'Fragrance data is rich but trapped in text. PROVis translates ingredients, notes and chemistry into flat graphic patterns, so perfumes can be browsed, compared and composed by eye. Wrapped up as an academic design study.',
    emoji: '🌸',
    stack: [`${OC}/provis/drop.jpg`, `${OC}/provis/system.jpg`, `${OC}/provis/explorer.jpg`],
    media: [
      {
        kind: 'image',
        src: `${OC}/provis/system.jpg`,
        caption:
          'The rule set. A real plant is traced into a flat profile, its colors sampled and softened into background and foreground elements.',
      },
      {
        kind: 'image',
        src: `${OC}/provis/drop.jpg`,
        caption:
          'One drop per perfume. Top, heart and base notes stack into translucent layers, and the drop fades the way a scent does over time.',
      },
      {
        kind: 'image',
        src: `${OC}/provis/explorer.jpg`,
        caption:
          'The explorer concept. A fragrance roulette to browse families, chemical charts to compare two bottles, and cards that unpack each formula.',
      },
      {
        kind: 'image',
        src: `${OC}/provis/paper.jpg`,
        caption:
          'The write-up. PROVis, a Perfume Relational Omni-dimensional Visualization Tool, structured as an application and design study.',
      },
    ],
  },
  {
    id: 'tactile',
    title: 'Graphics you can touch',
    tagline: 'Research on graphical tactile displays for visually impaired users.',
    blurb:
      'Screens assume sight. At Tsinghua I co-authored an interactive system for graphical tactile devices: a haptic interface, a voice interface and a universal keyboard, tested with visually impaired students down to the braille spacing rules.',
    emoji: '🤲',
    stack: [`${OC}/tactile/page-2.jpg`, `${OC}/tactile/page-1.jpg`, `${OC}/tactile/page-4.jpg`],
    media: [
      {
        kind: 'image',
        src: `${OC}/tactile/page-1.jpg`,
        caption:
          'The paper. An interactive system combining touch, voice and a universal keyboard, grounded in interviews and the state of Chinese braille.',
      },
      {
        kind: 'image',
        src: `${OC}/tactile/page-2.jpg`,
        caption:
          'Why it matters. Existing tactile displays are driven by memorized clicking buttons, so we drew principles from how blind users actually plan, confirm and recover.',
      },
      {
        kind: 'image',
        src: `${OC}/tactile/page-3.jpg`,
        caption:
          'The braille lattice experiment. Seven visually impaired students read two arrangements; the one that scored 90 to 100 percent became the layout rule.',
      },
      {
        kind: 'image',
        src: `${OC}/tactile/page-4.jpg`,
        caption:
          'Definition symbols and the keyboard. 3x3 dot-matrix shapes mark what is clickable, and hotkeys follow habits blind users already have.',
      },
    ],
  },
  {
    id: 'lego',
    title: 'Scrapbots at LEGO House',
    tagline: 'A co-creation sprint in Billund, rewiring the City Architect table.',
    blurb:
      'One brief, an international team of seven, a few days inside LEGO House: get families building again in the City Architect experience. Our answer was Scrapbots, scrappy solar-powered robots that keep the LEGO city clean while players keep it powered.',
    emoji: '🧱',
    stack: [`${OC}/lego/team.jpg`, `${OC}/lego/poster.jpg`],
    media: [
      {
        kind: 'video',
        src: `${OC}/lego/house.mp4`,
        caption: 'The prototype in motion, filmed at LEGO House.',
      },
      {
        kind: 'image',
        src: `${OC}/lego/poster.jpg`,
        caption:
          'The pitch. Scraps pile up, Scrapbots sweep in, and the loop runs on solar power that players redirect with mirrored reflectors they build themselves.',
      },
      {
        kind: 'image',
        src: `${OC}/lego/team.jpg`,
        caption: 'Team Scrapbots in the LEGO House workshop book.',
      },
    ],
  },
  {
    id: 'experiments',
    title: 'Rooms, robots, patterns',
    tagline: 'Little installations from school years. Sound, cardboard and code.',
    blurb:
      'Three experiments that never asked for permission. A pitch-black room that replays the same street three different ways, a choir of emoji boxes with a LEGO brain, and a long generative strip.',
    emoji: '🔊',
    stack: [`${OC}/experiments/emoji.jpg`, `${OC}/experiments/strip.jpg`, `${OC}/experiments/room.jpg`],
    media: [
      {
        kind: 'video',
        src: `${OC}/experiments/installation.mp4`,
        caption: 'A walkthrough of the sound room.',
      },
      {
        kind: 'image',
        src: `${OC}/experiments/room.jpg`,
        caption: 'One window, one visitor. Everything else is speakers.',
      },
      {
        kind: 'image',
        src: `${OC}/experiments/sounds.jpg`,
        caption:
          'Three sound sets, three worlds. The same room turns into a storm, a drizzle or a lazy morning depending on what you hear.',
      },
      {
        kind: 'image',
        src: `${OC}/experiments/texts.jpg`,
        caption: 'The premise. What we hear draws the limit of what we imagine.',
      },
      {
        kind: 'image',
        src: `${OC}/experiments/emoji.jpg`,
        caption: 'Emoji, made physical. A wall of cardboard heads on a black stage.',
      },
      {
        kind: 'image',
        src: `${OC}/experiments/emoji-night.jpg`,
        caption: 'Lights down. Each box glows on its cue.',
      },
      {
        kind: 'image',
        src: `${OC}/experiments/robot.jpg`,
        caption: 'The stagehand. A LEGO NXT robot wired into the show.',
      },
      {
        kind: 'image',
        src: `${OC}/experiments/strip.jpg`,
        caption: 'A generative pattern study, printed long.',
      },
    ],
  },
  {
    id: 'linkly',
    title: 'Linkly',
    tagline: 'Where every travel link finds its place. UX certification, 2025.',
    blurb:
      'Trips are planned in links: maps, posts, screenshots, group chats. Linkly catches them, sorts them by trip and lays them out on a timeline. From interviews to persona to flows to refined screens.',
    emoji: '✈️',
    stack: [`${OC}/linkly/cover.jpg`, `${OC}/linkly/flow.jpg`, `${OC}/linkly/screens.jpg`],
    media: [
      {
        kind: 'image',
        src: `${OC}/linkly/cover.jpg`,
        caption: 'The one-liner.',
      },
      {
        kind: 'image',
        src: `${OC}/linkly/research.jpg`,
        caption:
          'What travelers said. Scattered information, no structure, and collaboration that falls apart in group chats.',
      },
      {
        kind: 'image',
        src: `${OC}/linkly/persona.jpg`,
        caption: 'Amanda, the default organizer. She wants control without spreadsheet-grade overhead.',
      },
      {
        kind: 'image',
        src: `${OC}/linkly/flow.jpg`,
        caption: 'Creating a trip. Name it, date it, invite people, then just drop your links.',
      },
      {
        kind: 'image',
        src: `${OC}/linkly/screens.jpg`,
        caption: 'Refined screens. Home, the trip link board and the trip timeline.',
      },
    ],
  },
];

function OcLightbox({ p, onClose }: { p: OcProject; onClose: () => void }) {
  const [i, setI] = useState(0);
  const count = p.media.length;
  const m = p.media[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setI((v) => (v + count - 1) % count);
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % count);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, count]);

  return createPortal(
    <motion.div
      className="sm-oc-lb"
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="sm-oc-lb__panel"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sm-oc-lb__head">
          <h3 className="sm-oc-lb__title">{p.title}</h3>
          <button className="sm-oc-lb__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </header>
        <p className="sm-oc-lb__blurb">{p.blurb}</p>

        <figure className="sm-oc-lb__fig">
          {m.kind === 'video' ? (
            <video key={m.src} src={m.src} controls playsInline preload="metadata" />
          ) : (
            /* Plain <img>: lightbox media are pre-sized local JPEGs and swap on
               every arrow press; next/image's layout props buy nothing here. */
            // eslint-disable-next-line @next/next/no-img-element
            <img key={m.src} src={m.src} alt={m.caption} />
          )}
          <figcaption className="sm-oc-lb__cap">{m.caption}</figcaption>
        </figure>

        <footer className="sm-oc-lb__nav">
          <button onClick={() => setI((v) => (v + count - 1) % count)} aria-label="Previous">
            &larr;
          </button>
          <div className="sm-oc-lb__dots" role="tablist" aria-label="Items">
            {p.media.map((item, d) => (
              <button
                key={item.src + d}
                className="sm-oc-lb__dot"
                data-active={d === i || undefined}
                onClick={() => setI(d)}
                aria-label={`Item ${d + 1}`}
              />
            ))}
          </div>
          <span className="sm-oc-lb__count">
            {i + 1} / {count}
          </span>
          <button onClick={() => setI((v) => (v + 1) % count)} aria-label="Next">
            &rarr;
          </button>
        </footer>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function OffClock() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = OFF_CLOCK.find((p) => p.id === openId);

  return (
    <>
      <div className="sm-oc">
        {OFF_CLOCK.map((p) => (
          <button
            key={p.id}
            className="sm-oc-card"
            style={{ cursor: emojiCursor(p.emoji) }}
            onClick={() => setOpenId(p.id)}
            aria-haspopup="dialog"
          >
            <span className="sm-oc-pile">
              {p.stack.map((src, i) => (
                <span className="sm-oc-pile__img" data-i={i} key={src}>
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 860px) 90vw, 30vw"
                    draggable={false}
                  />
                </span>
              ))}
            </span>
            <span className="sm-oc-card__title">{p.title}</span>
            <span className="sm-oc-card__tag">{p.tagline}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open && <OcLightbox p={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </>
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
  const rootRef = useRef<HTMLDivElement | null>(null);

  /* Page-bg swap at section boundaries — same recipe as the home page's
     body[data-theme] flip (bottom 55% of the outgoing section), only here
     it toggles data-bg on .sm-root. Hero + 01 sit on plain white (no
     attribute), 02–03 on --sm-bg-mid, 04 onward on --sm-bg-tail;
     simple.css transitions the color. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const transitions: Array<{ sel: string; prev: string; next: string }> = [
      { sel: '[data-section="millions"]', prev: 'paper', next: 'mid' },
      { sel: '[data-section="teams"]',    prev: 'mid',   next: 'tail' },
    ];

    const sts = transitions
      .map(({ sel, prev, next }) => {
        const trigger = root.querySelector<HTMLElement>(sel);
        if (!trigger) return null;
        return ScrollTrigger.create({
          trigger,
          start: 'bottom 55%',
          onEnter: () => {
            root.dataset.bg = next;
          },
          onLeaveBack: () => {
            root.dataset.bg = prev;
          },
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    return () => {
      sts.forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="sm-root" ref={rootRef}>
      <nav className="sm-nav" aria-label="Primary">
        <Link href="/" className="sm-nav__mark">
          Xueyi Zhou
        </Link>
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
            A UX/Product Designer with experience at{' '}
            <CompanyHover c={COMPANIES[0]} />,{' '}
            <CompanyHover c={COMPANIES[1]} />, and{' '}
            <CompanyHover c={COMPANIES[2]} />.
          </p>
          <p className="sm-hero__sub">
            Designing for millions, for business, for teams, and out of plain
            curiosity.
          </p>
          <span className="sm-hero__scroll">Scroll to read &darr;</span>
        </div>
      </header>

      {/* ── 01 · For Millions ────────────────────────────────── */}
      <section className="sm-section" data-section="millions">
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
      <section className="sm-section" data-section="teams">
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

      {/* ── 04 · Curiosity ───────────────────────────────────── */}
      <section className="sm-section">
        <div className="sm-wrap">
          <Marker num="04" label="Curiosity" />
          <h2 className="sm-h sm-h--sm">
            Curiosity doesn&rsquo;t stop at the office door.
          </h2>
          <OffClock />
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <footer className="sm-section sm-contact">
        <div className="sm-wrap">
          <Marker num="05" label="Say hello" />
          <h2 className="sm-h sm-h--sm">Let&rsquo;s build for real people.</h2>
          <a className="sm-contact__mail" href="mailto:sherrrrrryz@gmail.com">
            sherrrrrryz@gmail.com
          </a>
          <div className="sm-contact__row">
            <Link href="/overview">Overview</Link>
            <Link href="/projects">Projects</Link>
          </div>
          <div className="sm-colophon">
            <span>Xueyi (Sherry) Zhou &copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
