'use client';

/* ============================================================================
   /about — who Sherry is, off the resume.

   Same monochrome editorial voice as the homepage, but self-contained
   (isolation rule: no TSX shared with other routes; ThemeToggle and
   emojiCursor are deliberate per-page copies). No scroll choreography at
   all — every interaction here is state-driven, so framer-motion only.

   Content sources: Sherry_Zhou_Resume.docx + 周雪怡_交互设计.pdf (2026-07).
   Photos live in /public/about/ (EXIF/GPS stripped at export time).
============================================================================ */

import '../_styles/tokens.css';
import './about.css';

import Link from 'next/link';
import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* Light/dark toggle. Stateless: the icon swap is CSS keyed off
   html[data-theme]. Duplicated per page (isolation rule). */
function ThemeToggle() {
  return (
    <button
      type="button"
      className="ab-theme"
      aria-label="Toggle dark mode"
      onClick={() => {
        const el = document.documentElement;
        const next = el.dataset.theme === 'dark' ? 'light' : 'dark';
        el.dataset.theme = next;
        try {
          localStorage.setItem('theme', next);
        } catch {
          /* private mode etc. — theme still applies for this visit */
        }
      }}
    >
      <svg
        className="ab-theme__sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        className="ab-theme__moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
      </svg>
    </button>
  );
}

/* Emoji-as-cursor helper — same recipe as the homepage's emojiCursor(). */
function emojiCursor(emoji: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='0' y='26' font-size='26'>${emoji}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, help`;
}

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="ab-marker">
      <span className="ab-marker__num">{num}</span>
      <span>{label}</span>
      <span className="ab-marker__line" aria-hidden="true" />
    </div>
  );
}

/* Underlined fact inside the bio. Hover / focus floats a small dark card
   with a mono tag + one short story. Same recipe as the homepage's
   CompanyHover, generalized. */
function Fact({
  children,
  id,
  tag,
  desc,
  emoji,
}: {
  children: ReactNode;
  id: string;
  tag: string;
  desc: string;
  emoji?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="ab-fact"
      style={emoji ? { cursor: emojiCursor(emoji) } : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      aria-describedby={open ? `fact-${id}` : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            className="ab-fact-card"
            id={`fact-${id}`}
            role="tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <span className="ab-fact-card__tag">{tag}</span>
            <span className="ab-fact-card__desc">{desc}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* Hero portrait: a tilted print that swaps between the studio photo and the
   weekend photo on hover (or tap, for touch), caption included. */
function PortraitSwap() {
  const [alt, setAlt] = useState(false);
  return (
    <button
      type="button"
      className="ab-portrait"
      data-alt={alt || undefined}
      style={{ cursor: emojiCursor('👋') }}
      onMouseEnter={() => setAlt(true)}
      onMouseLeave={() => setAlt(false)}
      onClick={() => setAlt((v) => !v)}
      aria-label="Swap portrait photo"
    >
      <span className="ab-portrait__frame">
        <Image
          src="/about/portrait-mono.jpg"
          alt="Black and white profile portrait of Sherry, smiling"
          className="ab-portrait__img--main"
          fill
          sizes="(max-width: 880px) 90vw, 420px"
          priority
          draggable={false}
        />
        <Image
          src="/about/portrait-color.jpg"
          alt="Sherry sitting on a wooden bench in a green striped shirt, smiling"
          className="ab-portrait__img--alt"
          fill
          sizes="(max-width: 880px) 90vw, 420px"
          draggable={false}
        />
      </span>
      <span className="ab-portrait__cap">
        {alt ? 'The weekend version.' : 'The portfolio version.'}
      </span>
    </button>
  );
}

/* ── 02 · the path ─────────────────────────────────────────────── */
const PATH = [
  {
    years: '2013–2017',
    title: 'Tsinghua University · two bachelor’s at once',
    detail:
      'Information Art and Design, plus a second degree in Journalism and Communication. First taste of the industry as an interaction design intern at Alibaba’s Cainiao Network.',
  },
  {
    years: '2017–2020',
    title: 'Tsinghua University · master’s',
    detail:
      'MA in Information Art and Design. Future Lab research on scent visualization and tactile graphics for blind users, with internships at Schlumberger and Huawei along the way.',
  },
  {
    years: '2020–2021',
    title: 'Huawei · UX Designer',
    detail:
      'Human factors and HCI group. Gesture design and cross-device interaction across phones, tablets and foldables, plus patent writing for cross-device features.',
  },
  {
    years: '2021–2023',
    title: 'Xiaomi · UX Designer → Senior UX Designer',
    detail:
      'Promoted to senior in year two. Led shared design standards across 7+ teams on an OS used by 700 million people, including the design system and lock screen work on this site.',
  },
  {
    years: '2023–2025',
    title: 'AppLovin · Product Designer',
    detail:
      'Out-of-box flows shipped with Samsung, T-Mobile and other OEMs, where every design decision is A/B tested against installs and revenue. Moved from the Beijing office to Toronto in late 2024.',
  },
  {
    years: '2025–now',
    title: 'Toronto · what’s next',
    detail:
      'Settling into a new city, building this site, and staying curious about what to design next.',
  },
] as const;

function TimelineRow({ row }: { row: (typeof PATH)[number] }) {
  return (
    <div className="ab-tl__row" tabIndex={0}>
      <span className="ab-tl__years">{row.years}</span>
      <div>
        <h3 className="ab-tl__title">{row.title}</h3>
        <div className="ab-tl__detail" aria-hidden={false}>
          <div>
            <p>{row.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · off the clock ────────────────────────────────────────── */
function SnowCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="ab-oc__card"
      style={{ cursor: emojiCursor('🏂') }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label="Snowboarding. Former president of the Tsinghua Ski Association."
    >
      <div className="ab-photo">
        <div className="ab-photo__frame">
          <Image
            src="/about/snowboard.jpg"
            alt="Sherry on a snowboard, looking down a deep powder slope"
            fill
            sizes="(max-width: 880px) 90vw, 45vw"
            draggable={false}
          />
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="ab-photo__tooltip"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            >
              <span className="ab-photo__tt-tag">Tsinghua Ski Association</span>
              <p className="ab-photo__tt-title">Club president, 2018 to 2019</p>
              <p className="ab-photo__tt-desc">
                Sponsorships, races and trips for the whole club. These days it
                is one snowboard and as much powder as possible.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="ab-oc__title">Winter is the busy season</span>
      <span className="ab-oc__tag">
        Ran a university ski club as president. Now the meetings are optional
        and the snow is deeper.
      </span>
    </div>
  );
}

const CATS = [
  {
    src: '/about/cats-thermal.jpg',
    alt: 'Two cats lounging on a desk, rendered in a thermal color filter',
  },
  {
    src: '/about/cat-spotlight.jpg',
    alt: 'A cat looking up into a lamp in a dark room',
  },
  {
    src: '/about/cat-yawn.jpg',
    alt: 'A gray cat mid-yawn',
  },
] as const;

function CatPile() {
  return (
    <div
      className="ab-oc__card"
      style={{ cursor: emojiCursor('🐈') }}
      tabIndex={0}
      aria-label="Two cats, photographed extensively"
    >
      <span className="ab-tiles">
        {CATS.map((c, i) => (
          <span className="ab-tiles__img" data-i={i} key={c.src}>
            <Image
              src={c.src}
              alt={c.alt}
              fill
              sizes={
                i === 0
                  ? '(max-width: 880px) 90vw, 440px'
                  : '(max-width: 880px) 45vw, 220px'
              }
              draggable={false}
            />
          </span>
        ))}
      </span>
      <span className="ab-oc__title">The supervision team</span>
      <span className="ab-oc__tag">
        Two cats. They sit in on every design review, contribute nothing, and
        approve nothing.
      </span>
    </div>
  );
}

const ALSO_TRUE = [
  '📰 Trained in news writing and photography',
  '🤲 Co-authored tactile display research for blind users',
  '📄 Wrote patents for cross-device interaction',
  '🗣️ Bilingual, Mandarin and English',
] as const;

export default function AboutPage() {
  return (
    <div className="ab-root">
      <nav className="ab-nav" aria-label="Primary">
        <Link href="/" className="ab-nav__mark">
          Xueyi Zhou
        </Link>
        <div className="ab-nav__side">
          <span className="ab-nav__crumb">About</span>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="ab-section ab-hero">
        <div className="ab-wrap">
          <div className="ab-hero__grid">
            <div>
              <div className="ab-hero__kicker">
                About &middot; Xueyi (Sherry) Zhou
              </div>
              <h1 className="ab-hero__line">
                Hi, I&rsquo;m Sherry.&nbsp;
                <span className="ab-wave" aria-hidden="true">
                  👋
                </span>
              </h1>
              <p className="ab-hero__sub">
                Product designer. Raised in Beijing, based in Toronto.
              </p>
              <p className="ab-hero__sub">
                I design for millions of people at work, and for two cats at
                home.
              </p>
              <span className="ab-hero__scroll">Scroll for the full story &darr;</span>
            </div>
            <PortraitSwap />
          </div>
        </div>
      </header>

      {/* ── 01 · The short version ───────────────────────────── */}
      <section className="ab-section">
        <div className="ab-wrap">
          <Marker num="01" label="The short version" />
          <div className="ab-bio">
            <p>
              I grew up in Beijing and spent seven years at Tsinghua
              University, leaving with a bachelor&rsquo;s in Information Art
              and Design, a second bachelor&rsquo;s in Journalism and
              Communication, and a master&rsquo;s from the same
              interdisciplinary lab.
            </p>
            <p>
              Since 2020 I have designed across every screen size: phones,
              tablets and foldables at{' '}
              <Fact
                id="huawei"
                tag="2020 to 2021"
                desc="UX designer in the human factors and HCI group. Gesture systems and cross-device interaction, with a few patents written along the way."
                emoji="📱"
              >
                Huawei
              </Fact>
              , an OS for 700 million people at{' '}
              <Fact
                id="xiaomi"
                tag="2021 to 2023"
                desc="UX to senior UX designer. Led shared design standards across 7+ teams, including the lock screen and design system work on this site."
                emoji="🧩"
              >
                Xiaomi
              </Fact>
              , and growth flows measured in dollars at{' '}
              <Fact
                id="applovin"
                tag="2023 to 2025"
                desc="Product designer on out-of-box flows shipped with Samsung, T-Mobile and other OEMs. Every design decision A/B tested against revenue."
                emoji="📈"
              >
                AppLovin
              </Fact>
              .
            </p>
            <p>
              In late 2024 I moved from Beijing to Toronto with AppLovin,
              switched my daily working language to English, and started
              sketching what comes next. This site is part of that.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 · The path ────────────────────────────────────── */}
      <section className="ab-section">
        <div className="ab-wrap">
          <Marker num="02" label="The path" />
          <div className="ab-sublabel">2013 to now &middot; hover a row</div>
          <div className="ab-tl">
            {PATH.map((row) => (
              <TimelineRow row={row} key={row.years} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Off the clock ───────────────────────────────── */}
      <section className="ab-section">
        <div className="ab-wrap">
          <Marker num="03" label="Off the clock" />
          <h2 className="ab-h">Powder in winter, cats all year.</h2>
          <div className="ab-oc">
            <SnowCard />
            <CatPile />
          </div>
          <ul className="ab-pills" aria-label="Also true">
            {ALSO_TRUE.map((t) => (
              <li className="ab-pill" key={t}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <footer className="ab-section ab-contact">
        <div className="ab-wrap">
          <Marker num="04" label="Say hello" />
          <h2 className="ab-h">Now you know me. Your turn.</h2>
          <a className="ab-contact__mail" href="mailto:sherrrrrryz@gmail.com">
            sherrrrrryz@gmail.com
          </a>
          <div className="ab-contact__row">
            <Link href="/">Home</Link>
            <Link href="/overview">Overview</Link>
            <Link href="/projects">Projects</Link>
          </div>
          <div className="ab-colophon">
            <span>Xueyi (Sherry) Zhou &copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
