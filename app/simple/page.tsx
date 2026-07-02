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

const MIUI_PAIRS = [
  { before: '/miui/components-before.png', after: '/miui/components-after.png', label: 'Components' },
  { before: '/miui/designtoken-before.png', after: '/miui/designtoken-after.png', label: 'Design Tokens' },
  { before: '/miui/localization-before.png', after: '/miui/localization-after.png', label: 'Localization' },
];

/* Drag-to-compare before/after slider (non-scroll UI motion). */
function BeforeAfter({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div className="sm-ba">
      <div
        ref={ref}
        className="sm-ba__stage"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) update(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        role="slider"
        aria-label={`${label} before and after`}
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
          if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
        }}
      >
        <span className="sm-ba__tag sm-ba__tag--after">After</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sm-ba__after" src={after} alt={`${label} after`} draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={`${label} before`}
          draggable={false}
          style={{ zIndex: 1, clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <span className="sm-ba__tag sm-ba__tag--before" style={{ zIndex: 1 }}>
          Before
        </span>
        <div className="sm-ba__handle" style={{ left: `${pos}%` }}>
          <span className="sm-ba__grip" aria-hidden="true">
            ⇄
          </span>
        </div>
      </div>
      <span className="sm-ba__label">{label}</span>
    </div>
  );
}

const WORKSHOP = [
  { src: '/section3-3/1-1.png', kind: 'wide' },
  { src: '/section3-3/2-1.png', kind: 'wide' },
  { src: '/section3-3/1-3.png', kind: '' },
  { src: '/section3-3/2-2.png', kind: '' },
  { src: '/section3-3/1-2.png', kind: 'wide' },
  { src: '/section3-3/2-5.png', kind: 'tall' },
  { src: '/section3-3/1-4.png', kind: '' },
  { src: '/section3-3/2-3.png', kind: '' },
  { src: '/section3-3/1-5.png', kind: 'wide' },
  { src: '/section3-3/2-4.png', kind: '' },
] as const;

/* One "It means" row. Its visual (lockscreen / before-after / foldable strip)
   opens on first hover and STAYS open — it only resets on a page refresh.
   `open` is one-way: once true it never goes back to false. */
function MeanRow({ m, idx }: { m: (typeof MEANS)[number]; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <FollowPointer
      className={`sm-mean${idx === 0 ? ' sm-mean--ls' : ''}${
        idx === 1 ? ' sm-mean--ba' : ''
      }${idx === 2 ? ' sm-mean--fold' : ''}${open ? ' sm-open' : ''}`}
      title={
        <>
          {m.project} <span aria-hidden="true">&rarr;</span>
        </>
      }
      onOpen={() => setOpen(true)}
    >
      <div className="sm-mean__head">
        <span className="sm-means__idx">{String(idx + 1).padStart(2, '0')}</span>
        <div>
          <p className="sm-means__text">{m.text}</p>
          <div className="sm-means__meta">
            {m.meta} &middot;{' '}
            <a href="#" title="Case study coming soon">
              View project &rarr;
            </a>
          </div>
        </div>
      </div>

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
        <div className="sm-ba-reveal" data-no-follower>
          <div className="sm-ba-row">
            {MIUI_PAIRS.map((p) => (
              <BeforeAfter
                key={p.label}
                before={p.before}
                after={p.after}
                label={p.label}
              />
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
    expected: '1-step survey should win',
    actual: '5-step survey drove 18% install growth. 1-step only drove 14%.',
    insight: 'Longer engagement built stronger intent.',
  },
  {
    label: 'App bundle',
    expected: 'Clean collapsed bundle should win',
    actual: 'Showing all app icons lifted installs by 0.47 per user. Collapsed view only lifted 0.37.',
    insight: 'Transparency beat minimalism.',
  },
  {
    label: 'Recommendation browsing',
    expected: 'Free browsing should win',
    actual: 'Swipe cards reached 15.65% CTR. Free-scroll list stayed much lower.',
    insight: 'Forced focus beat open browsing.',
  },
];

const PHRASES = [
  {
    head: 'a newcomer',
    items: [
      'Only 1 year of experience',
      'Already leading another key project',
      "Started with 2 teammates who weren't sure about me",
      'The entire dev team got reshuffled midway',
      'Constantly playing "customer service" for other designers',
      'Organizing rules that were scattered, incomplete, sometimes wrong',
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
            AppLovin. Designing for millions, for business, for teams, for
            evidence, and out of plain curiosity.
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
          <h2 className="sm-h">
            At AppLovin, design was measured in dollars.
          </h2>
          <p className="sm-body" style={{ marginTop: '24px' }}>
            The OOBE app-recommendation flow ships with <strong>Samsung</strong>,{' '}
            <strong>T-Mobile</strong>, and a dozen other OEMs. It reaches tens of
            millions of newly unboxed phones each quarter and contributes{' '}
            <strong>seven figures of revenue</strong>.
          </p>

          <div className="sm-tenets">
            <p className="sm-tenet">&ldquo;Fewer steps is always better.&rdquo;</p>
            <p className="sm-tenet">&ldquo;Cleaner UI converts more.&rdquo;</p>
            <p className="sm-tenet">&ldquo;Users hate being forced.&rdquo;</p>
          </div>
          <p className="sm-verdict">
            We tested all three. All three were wrong.
          </p>

          <div className="sm-flip">
            {FLIP.map((c) => (
              <article className="sm-card" key={c.label}>
                <span className="sm-card__label">{c.label}</span>
                <p className="sm-card__expected">
                  Expected: <s>{c.expected}</s>
                </p>
                <p className="sm-card__actual">{c.actual}</p>
                <p className="sm-card__insight">{c.insight}</p>
              </article>
            ))}
          </div>

          <p className="sm-footer-link">AppLovin OOBE &middot; 2025 &middot; View project &rarr;</p>
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
            &ldquo;We just put <em>a newcomer</em> in charge, leading{' '}
            <em>a team of senior people</em>, across{' '}
            <em>multiple departments</em>. Honestly? It sounded like{' '}
            <em>a terrible idea</em>.&rdquo;
          </blockquote>

          <div className="sm-phrases">
            {PHRASES.map((p) => (
              <div className="sm-phrase" key={p.head}>
                <div className="sm-phrase__head">{p.head}</div>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="sm-sublabel">Workshops · aligning across departments</div>
          <div className="sm-ww">
            {WORKSHOP.map((w, i) => (
              <div
                className={`sm-ww__cell${w.kind ? ` sm-ww__cell--${w.kind}` : ''}`}
                key={i}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.src} alt="" loading="lazy" draggable={false} />
              </div>
            ))}
          </div>

          <p className="sm-turn">Turns out it wasn&rsquo;t a terrible idea.</p>
          <p className="sm-footer-link">MIUI Design System 2.0 &middot; 2023</p>
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
