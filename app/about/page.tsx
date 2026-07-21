'use client';

/* ============================================================================
   /about — who Sherry is, off the resume.

   Same monochrome editorial voice as the homepage, but self-contained
   (isolation rule: no TSX shared with other routes; ThemeToggle and
   emojiCursor are deliberate per-page copies). No scroll choreography at
   all — every interaction here is state-driven, so framer-motion only.

   Bilingual: copy strings are { en, zh } pairs picked by a lang state
   (persisted in localStorage "lang", shared with the homepage). The toggle
   lives in the footer colophon, bottom right — per-page copy, same as
   ThemeToggle.

   Content sources: Sherry_Zhou_Resume.docx + 周雪怡_交互设计.pdf (2026-07).
   Photos live in /public/about/ (EXIF/GPS stripped at export time).
============================================================================ */

import '../_styles/tokens.css';
import './about.css';

import Link from 'next/link';
import Image from 'next/image';
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ── i18n plumbing — per-page copy of the homepage recipe ─────────── */
type Lang = 'en' | 'zh';
type L10n = { en: string; zh: string };

const LangContext = createContext<Lang>('en');

function useLang() {
  return useContext(LangContext);
}

function useT() {
  const lang = useContext(LangContext);
  return (s: L10n) => s[lang];
}

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

/* Footer language switch: shows the language you'd switch TO.
   Duplicated on the homepage (per-page copies, same as ThemeToggle). */
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
      className="ab-lang"
      aria-label={lang === 'en' ? '切换到中文' : 'Switch to English'}
      onClick={() => onChange(lang === 'en' ? 'zh' : 'en')}
    >
      {lang === 'en' ? '中文' : 'English'}
    </button>
  );
}

/* Emoji-as-cursor helper — same recipe as the homepage's emojiCursor(). */
function emojiCursor(emoji: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><text x='0' y='26' font-size='26'>${emoji}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, help`;
}

const CONTACT_EMAIL = 'sherrrryz@outlook.com';

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="ab-marker">
      <span className="ab-marker__num">{num}</span>
      <span>{label}</span>
      <span className="ab-marker__line" aria-hidden="true" />
    </div>
  );
}

/* LinkedIn glyph for the footer social link. Inlined per page because the
   three monochrome pages deliberately share no TSX imports; currentColor
   keeps it on the same ink ramp as the link text. */
function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.44-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/* Click-to-copy, not a mailto. A mailto only does something when the device
   has a mail client registered; on one that doesn't it fails silently and the
   visitor never says so. Copying is the path that works everywhere.

   Three layers, because with mailto gone a failed copy would leave no way to
   reach the address at all: Clipboard API, then selecting the text so the
   keyboard shortcut still works, and the toast says which one happened.
   Duplicated per page (isolation rule, same as ThemeToggle / LangToggle). */
function CopyMail({
  copyLabel,
  copiedLabel,
  manualLabel,
}: {
  copyLabel: string;
  copiedLabel: string;
  manualLabel: string;
}) {
  const [toast, setToast] = useState('');
  const mailRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setToast(copiedLabel);
    } catch {
      const el = mailRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setToast(manualLabel);
    }
  };

  return (
    <>
      <button
        ref={mailRef}
        type="button"
        className="ab-contact__mail"
        aria-label={`${copyLabel}: ${CONTACT_EMAIL}`}
        onClick={copy}
      >
        {CONTACT_EMAIL}
      </button>
      {/* Kept mounted so it can transition both ways; empty until it fires,
          so role=status has nothing to announce at page load. */}
      <div
        className={`ab-toast${toast ? ' ab-toast--on' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}

/* Clamp a trigger-centered floating card to the viewport. The card sits at
   `translate: -50%` above its trigger; when the trigger is near a screen
   edge the card would run off-screen and get cut. Measure once open and
   return the px shift to fold into the centering translate. Duplicated on
   the homepage (per-page copies, same as ThemeToggle). */
function useCardShift<T extends HTMLElement>(open: boolean) {
  const cardRef = useRef<T | null>(null);
  const [shift, setShift] = useState(0);
  useLayoutEffect(() => {
    if (!open) {
      setShift(0);
      return;
    }
    const el = cardRef.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const PAD = 12;
    const hostRect = host.getBoundingClientRect();
    const cx = hostRect.left + hostRect.width / 2;
    /* offsetWidth, not getBoundingClientRect().width — the entry animation
       starts at scale 0.96 and would under-measure the settled card */
    const half = el.offsetWidth / 2;
    let d = 0;
    if (cx - half < PAD) d = PAD - (cx - half);
    else if (cx + half > window.innerWidth - PAD) {
      d = window.innerWidth - PAD - (cx + half);
    }
    setShift(Math.round(d));
  }, [open]);
  return { cardRef, shift };
}

/* Underlined fact inside the bio. Hover / focus floats a small dark card
   with a mono tag + one short story. Same recipe as the homepage's
   CompanyHover, generalized. With `href` the trigger renders as an external
   link (new tab) instead of a plain span; the card behaves the same. */
function Fact({
  children,
  id,
  tag,
  desc,
  emoji,
  href,
}: {
  children: ReactNode;
  id: string;
  tag: L10n;
  desc: L10n;
  emoji?: string;
  href?: string;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { cardRef, shift } = useCardShift<HTMLSpanElement>(open);
  const hostProps = {
    className: 'ab-fact',
    style: emoji ? { cursor: emojiCursor(emoji) } : undefined,
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    'aria-describedby': open ? `fact-${id}` : undefined,
  };
  const body = (
    <>
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            className="ab-fact-card"
            id={`fact-${id}`}
            role="tooltip"
            ref={cardRef}
            style={{ translate: `calc(-50% + ${shift}px)` }}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <span className="ab-fact-card__tag">{t(tag)}</span>
            <span className="ab-fact-card__desc">{t(desc)}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" {...hostProps}>
      {body}
    </a>
  ) : (
    <span tabIndex={0} {...hostProps}>
      {body}
    </span>
  );
}

/* Hero portrait: a tilted print that swaps between the studio photo and the
   vacation photo on hover (or tap, for touch), caption included. */
function PortraitSwap() {
  const lang = useLang();
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
          src="/about/portrait-vacation.jpg"
          alt="Sherry watching goldfish through the glass of an aquarium tank, an orange fancy goldfish swimming past her face"
          className="ab-portrait__img--alt"
          fill
          sizes="(max-width: 880px) 90vw, 420px"
          draggable={false}
        />
      </span>
      <span className="ab-portrait__cap">
        {lang === 'zh'
          ? alt
            ? '度假版本。'
            : '作品集版本。'
          : alt
            ? 'The vacation version.'
            : 'The portfolio version.'}
      </span>
    </button>
  );
}

/* ── 02 · the path ─────────────────────────────────────────────── */
const PATH = [
  {
    years: '2013–2017',
    title: {
      en: 'Tsinghua University · two bachelor’s at once',
      zh: '清华大学 · 同时读两个本科',
    },
    detail: {
      en: 'Information Art and Design, plus a second degree in Journalism and Communication. First taste of the industry as an interaction design intern at Alibaba’s Cainiao Network.',
      zh: '信息艺术设计，加上新闻与传播的第二学位。在阿里巴巴菜鸟网络做交互设计实习生，第一次尝到行业的味道。',
    },
  },
  {
    years: '2017–2020',
    title: { en: 'Tsinghua University · master’s', zh: '清华大学 · 硕士' },
    detail: {
      en: 'MA in Information Art and Design. Future Lab research on scent visualization and tactile graphics for blind users, with internships at Schlumberger and Huawei along the way.',
      zh: '信息艺术设计硕士。在未来实验室研究香味可视化和面向盲人的触觉图形，期间在斯伦贝谢和华为实习。',
    },
  },
  {
    years: '2020–2021',
    title: { en: 'Huawei · UX Designer', zh: '华为 · UX 设计师' },
    detail: {
      en: 'Human factors and HCI group. Gesture design and cross-device interaction across phones, tablets and foldables, plus patent writing for cross-device features.',
      zh: '人因与 HCI 组。负责手机、平板和折叠屏的手势设计与跨设备交互，并撰写跨设备功能专利。',
    },
  },
  {
    years: '2021–2023',
    title: {
      en: 'Xiaomi · UX Designer → Senior UX Designer',
      zh: '小米 · UX 设计师 → 资深 UX 设计师',
    },
    detail: {
      en: 'Promoted to senior in year two. Led shared design standards across 7+ teams on an OS used by 700 million people, including the design system and lock screen work on this site.',
      zh: '第二年晋升资深。在一个 7 亿人使用的操作系统上，主导 7+ 团队共享的设计标准，包括本站的设计系统与锁屏项目。',
    },
  },
  {
    years: '2023–2025',
    title: { en: 'AppLovin · Product Designer', zh: 'AppLovin · 产品设计师' },
    detail: {
      en: 'Out-of-box flows shipped with Samsung, T-Mobile and other OEMs, where every design decision is A/B tested against installs and revenue. Moved from the Beijing office to Toronto in late 2024.',
      zh: '随三星、T-Mobile 等 OEM 出厂的开箱流程，每个设计决策都以安装量和营收做 A/B 检验。2024 年底从北京办公室搬到多伦多。',
    },
  },
  {
    years: '2025–now',
    title: { en: 'Toronto · what’s next', zh: '多伦多 · 下一步' },
    detail: {
      en: 'Settling into a new city, building this site, and staying curious about what to design next.',
      zh: '安顿一座新城市，搭这个网站，并对接下来要设计什么保持好奇。',
    },
  },
] as const;

function TimelineRow({ row }: { row: (typeof PATH)[number] }) {
  const t = useT();
  return (
    <div className="ab-tl__row" tabIndex={0}>
      <span className="ab-tl__years">{row.years}</span>
      <div>
        <h3 className="ab-tl__title">{t(row.title)}</h3>
        <div className="ab-tl__detail" aria-hidden={false}>
          <div>
            <p>{t(row.detail)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 03 · off the clock ────────────────────────────────────────── */
function SnowCard() {
  const lang = useLang();
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
      aria-label={
        lang === 'zh'
          ? '单板滑雪。清华大学滑雪协会前任社长。'
          : 'Snowboarding. Former president of the Tsinghua Ski Association.'
      }
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
              <span className="ab-photo__tt-tag">
                {lang === 'zh' ? '清华大学滑雪协会' : 'Tsinghua Ski Association'}
              </span>
              <p className="ab-photo__tt-title">
                {lang === 'zh' ? '社长，2018 至 2019' : 'Club president, 2018 to 2019'}
              </p>
              <p className="ab-photo__tt-desc">
                {lang === 'zh'
                  ? '拉赞助、办比赛、组织全社出行。如今只剩一块单板，和尽可能多的粉雪。'
                  : 'Sponsorships, races and trips for the whole club. These days it is one snowboard and as much powder as possible.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="ab-oc__title">
        {lang === 'zh' ? '冬天才是旺季' : 'Winter is the busy season'}
      </span>
      <span className="ab-oc__tag">
        {lang === 'zh'
          ? '大学时当过滑雪社社长。现在开会都免了，雪更深了。'
          : 'Ran a university ski club as president. Now the meetings are optional and the snow is deeper.'}
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
  const lang = useLang();
  return (
    <div
      className="ab-oc__card"
      style={{ cursor: emojiCursor('🐈') }}
      tabIndex={0}
      aria-label={
        lang === 'zh' ? '两只猫，被大量拍摄' : 'Two cats, photographed extensively'
      }
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
      <span className="ab-oc__title">
        {lang === 'zh' ? '监工小队' : 'The supervision team'}
      </span>
      <span className="ab-oc__tag">
        {lang === 'zh'
          ? '两只猫。每场设计评审都列席，什么也不贡献，什么也不批准。'
          : 'Two cats. They sit in on every design review, contribute nothing, and approve nothing.'}
      </span>
    </div>
  );
}

const DIVES = [
  {
    src: '/about/dive-under.jpg',
    alt: 'Scuba divers descending along a coral wall in the Philippines',
  },
  {
    src: '/about/dive-crew.jpg',
    alt: 'Tsinghua student diver association posing with their banner on a beach at dusk',
  },
  {
    src: '/about/dive-boat.jpg',
    alt: 'Divers in wetsuits resting on a boat ladder, backlit over the sea',
  },
] as const;

function DiveCard() {
  const lang = useLang();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="ab-oc__card"
      style={{ cursor: emojiCursor('🤿') }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={
        lang === 'zh'
          ? '水肺潜水。跟清华潜水协会出海，在菲律宾拿到初级和高级潜水证。'
          : 'Scuba diving. Open Water and Advanced certified in the Philippines with the Tsinghua diver association.'
      }
    >
      <div className="ab-photo">
        <span className="ab-tiles">
          {DIVES.map((c, i) => (
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
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="ab-photo__tooltip"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            >
              <span className="ab-photo__tt-tag">
                {lang === 'zh'
                  ? '清华大学学生潜水协会'
                  : 'Student Diver Association of Tsinghua'}
              </span>
              <p className="ab-photo__tt-title">
                {lang === 'zh'
                  ? '初级加高级潜水证，2019'
                  : 'Open Water and Advanced, 2019'}
              </p>
              <p className="ab-photo__tt-desc">
                {lang === 'zh'
                  ? '跟着协会出海，两张证都在菲律宾考下。我到过最安静的地方，是水下二十米。'
                  : 'Club trips took me to the Philippines, where both certificates were earned. The quietest place I have ever been is twenty meters down.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="ab-oc__title">
        {lang === 'zh' ? '夏天属于海水' : 'Summer is for salt water'}
      </span>
      <span className="ab-oc__tag">
        {lang === 'zh'
          ? '跟清华潜水协会出海，在菲律宾拿到初级和高级潜水证。'
          : 'Open Water and Advanced certified with the university diving club, in the Philippines.'}
      </span>
    </div>
  );
}

/* Snowboarding video: a local grayscale poster (same treatment as the
   photos) that swaps to the real YouTube iframe on click, so the page
   loads no third-party code until someone actually presses play. */
const REEL_ID = '8ZNU1zSpDX0';

function ReelCard() {
  const lang = useLang();
  const [playing, setPlaying] = useState(false);
  return (
    <div className="ab-oc__card">
      <div className="ab-reel">
        {playing ? (
          <iframe
            className="ab-reel__frame"
            src={`https://www.youtube-nocookie.com/embed/${REEL_ID}?autoplay=1&rel=0`}
            title={
              lang === 'zh'
                ? '清华滑雪协会二世谷之行视频'
                : 'Niseko trip, Ski and Snowboard Club in Tsinghua'
            }
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="ab-reel__poster"
            style={{ cursor: emojiCursor('🎬') }}
            onClick={() => setPlaying(true)}
            aria-label={
              lang === 'zh' ? '播放二世谷滑雪视频' : 'Play the Niseko snowboarding video'
            }
          >
            <Image
              src="/about/niseko-reel.jpg"
              alt="Still from the Niseko trip video: a smiling snowboarder in goggles and a GoPro helmet on a powder slope"
              fill
              sizes="(max-width: 880px) 90vw, 45vw"
              draggable={false}
            />
            <span className="ab-reel__play" aria-hidden="true" />
          </button>
        )}
      </div>
      <span className="ab-oc__title">
        {lang === 'zh' ? '粉雪实录' : 'Proof of powder'}
      </span>
      <span className="ab-oc__tag">
        {lang === 'zh'
          ? '滑雪协会的日本二世谷之行。点开看粉雪。'
          : 'The club trip to Niseko, Japan. Press play for the powder days.'}
      </span>
    </div>
  );
}

/* All inline page copy that isn't part of a data constant above. */
const UI = {
  en: {
    navMark: 'Xueyi Zhou',
    kicker: 'About · Xueyi (Sherry) Zhou',
    heroSub1: 'Product designer. Raised in Beijing, based in Toronto.',
    heroSub2: 'I design for millions of people at work, and for two cats at home.',
    scroll: 'Scroll for the full story ↓',
    mShort: 'The short version',
    mPath: 'The path',
    mOff: 'Off the clock',
    mHello: 'Say hello',
    pathSub: '2013 to now · hover a row',
    offHead: 'Powder in winter, reefs in summer, cats all year.',
    contactHead: 'Now you know me. Your turn.',
    resume: 'Resume ↗',
    linkedin: 'LinkedIn ↗',
    copy: 'Copy email address',
    copied: 'Copied to clipboard',
    copyManual: 'Selected. Press \u2318C or Ctrl+C',
    fHome: 'Home',
    fAbout: 'About',
    fProjects: 'Projects',
    colophon: 'Xueyi (Sherry) Zhou © 2026',
  },
  zh: {
    navMark: '周雪怡',
    kicker: '关于 · 周雪怡 (Sherry)',
    heroSub1: '产品设计师。北京长大，现居多伦多。',
    heroSub2: '在公司为亿万用户做设计，在家为两只猫做设计。',
    scroll: '向下滚动看完整故事 ↓',
    mShort: '简短版本',
    mPath: '来时的路',
    mOff: '工作之外',
    mHello: '打个招呼',
    pathSub: '2013 至今 · 悬停查看',
    offHead: '冬天滑雪，夏天潜水，四季撸猫。',
    contactHead: '现在你认识我了。该你了。',
    resume: '简历 ↗',
    linkedin: '领英 ↗',
    copy: '复制邮箱地址',
    copied: '已复制到剪贴板',
    copyManual: '已选中，按 \u2318C 或 Ctrl+C 复制',
    fHome: '首页',
    fAbout: '关于',
    fProjects: '项目',
    colophon: '周雪怡 (Sherry) © 2026',
  },
} as const;

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>('en');

  /* Restore the saved language after hydration (SSR is always English, so
     the first client render matches the server markup — no mismatch). */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'zh' || saved === 'en') setLang(saved);
    } catch {
      /* private mode etc. — stay in English */
    }
  }, []);

  /* Keep <html lang> honest for screen readers / search engines. */
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* private mode etc. — language still applies for this visit */
    }
  };

  const u = UI[lang];

  return (
    <LangContext.Provider value={lang}>
    <div className="ab-root">
      <nav className="ab-nav" aria-label="Primary">
        <Link href="/" className="ab-nav__mark">
          {u.navMark}
        </Link>
        <div className="ab-nav__side">
          <Link href="/" className="ab-nav__link">
            {u.fHome}
          </Link>
          <Link href="/about" className="ab-nav__link" aria-current="page">
            {u.fAbout}
          </Link>
          <Link href="/projects" className="ab-nav__link">
            {u.fProjects}
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="ab-section ab-hero">
        <div className="ab-wrap">
          <div className="ab-hero__grid">
            <div>
              <div className="ab-hero__kicker">{u.kicker}</div>
              <h1 className="ab-hero__line">
                {lang === 'zh' ? (
                  <>嗨，我是 Sherry。&nbsp;</>
                ) : (
                  <>Hi, I&rsquo;m Sherry.&nbsp;</>
                )}
                <span className="ab-wave" aria-hidden="true">
                  👋
                </span>
              </h1>
              <p className="ab-hero__sub">{u.heroSub1}</p>
              <p className="ab-hero__sub">{u.heroSub2}</p>
              <span className="ab-hero__scroll">{u.scroll}</span>
            </div>
            <PortraitSwap />
          </div>
        </div>
      </header>

      {/* ── 01 · The short version ───────────────────────────── */}
      <section className="ab-section">
        <div className="ab-wrap">
          <Marker num="01" label={u.mShort} />
          <div className="ab-bio">
            {lang === 'zh' ? (
              <>
                <p>
                  我在北京长大，在
                  <Fact
                    id="tsinghua"
                    tag={{ en: '2013 to 2020', zh: '2013 至 2020' }}
                    desc={{
                      en: 'Consistently ranked the No.1 or No.2 university in China and among the best in Asia. The link opens the university site.',
                      zh: '常年位居中国大学排名第一或第二，也是亚洲最顶尖的大学之一。点击打开清华官网。',
                    }}
                    emoji="🎓"
                    href="https://www.tsinghua.edu.cn/"
                  >
                    清华大学
                  </Fact>
                  度过了七年，拿到信息艺术设计的本科学位、新闻与传播的第二学位，以及
                  <Fact
                    id="futurelab"
                    tag={{
                      en: 'thfl.tsinghua.edu.cn',
                      zh: 'thfl.tsinghua.edu.cn',
                    }}
                    desc={{
                      en: 'Tsinghua’s interdisciplinary lab mixing computing, media and art to prototype future human-machine interaction. The link opens the lab site.',
                      zh: '清华的交叉学科实验室，融合计算、媒体与艺术，探索未来人机交互。点击打开实验室官网。',
                    }}
                    emoji="🔬"
                    href="https://thfl.tsinghua.edu.cn/"
                  >
                    未来实验室
                  </Fact>
                  的硕士学位。
                </p>
                <p>
                  2020 年起，我的设计横跨每一种屏幕尺寸：在{' '}
                  <Fact
                    id="huawei"
                    tag={{ en: '2020 to 2021', zh: '2020 至 2021' }}
                    desc={{
                      en: 'UX designer in the human factors and HCI group. Gesture systems and cross-device interaction, with a few patents written along the way.',
                      zh: '人因与 HCI 组的 UX 设计师。做手势系统和跨设备交互，顺手写了几项专利。',
                    }}
                    emoji="📱"
                  >
                    华为
                  </Fact>{' '}
                  做手机、平板和折叠屏，在{' '}
                  <Fact
                    id="xiaomi"
                    tag={{ en: '2021 to 2023', zh: '2021 至 2023' }}
                    desc={{
                      en: 'UX to senior UX designer. Led shared design standards across 7+ teams, including the lock screen and design system work on this site.',
                      zh: '从 UX 设计师晋升到资深 UX 设计师。主导 7+ 团队共用的设计标准，包括本站的锁屏与设计系统项目。',
                    }}
                    emoji="🧩"
                  >
                    小米
                  </Fact>{' '}
                  做一个 7 亿人使用的操作系统，在{' '}
                  <Fact
                    id="applovin"
                    tag={{ en: '2023 to 2025', zh: '2023 至 2025' }}
                    desc={{
                      en: 'Product designer on out-of-box flows shipped with Samsung, T-Mobile and other OEMs. Every design decision A/B tested against revenue.',
                      zh: '负责随三星、T-Mobile 等 OEM 出厂的开箱流程。每个设计决策都要经过以营收为标准的 A/B 测试。',
                    }}
                    emoji="📈"
                  >
                    AppLovin
                  </Fact>{' '}
                  做用美元衡量的增长流程。
                </p>
                <p>
                  2024 年底，我随 AppLovin 从北京搬到多伦多，把日常工作语言切换成英语，开始勾画下一步。这个网站就是其中的一部分。
                </p>
              </>
            ) : (
              <>
                <p>
                  I grew up in Beijing and spent seven years at{' '}
                  <Fact
                    id="tsinghua"
                    tag={{ en: '2013 to 2020', zh: '2013 至 2020' }}
                    desc={{
                      en: 'Consistently ranked the No.1 or No.2 university in China and among the best in Asia. The link opens the university site.',
                      zh: '常年位居中国大学排名第一或第二，也是亚洲最顶尖的大学之一。点击打开清华官网。',
                    }}
                    emoji="🎓"
                    href="https://www.tsinghua.edu.cn/en/"
                  >
                    Tsinghua University
                  </Fact>
                  , leaving with a bachelor&rsquo;s in Information Art and
                  Design, a second bachelor&rsquo;s in Journalism and
                  Communication, and a master&rsquo;s from{' '}
                  <Fact
                    id="futurelab"
                    tag={{
                      en: 'thfl.tsinghua.edu.cn',
                      zh: 'thfl.tsinghua.edu.cn',
                    }}
                    desc={{
                      en: 'Tsinghua’s interdisciplinary lab mixing computing, media and art to prototype future human-machine interaction. The link opens the lab site.',
                      zh: '清华的交叉学科实验室，融合计算、媒体与艺术，探索未来人机交互。点击打开实验室官网。',
                    }}
                    emoji="🔬"
                    href="https://thfl.tsinghua.edu.cn/en/"
                  >
                    the Future Laboratory
                  </Fact>
                  .
                </p>
                <p>
                  Since 2020 I have designed across every screen size: phones,
                  tablets and foldables at{' '}
                  <Fact
                    id="huawei"
                    tag={{ en: '2020 to 2021', zh: '2020 至 2021' }}
                    desc={{
                      en: 'UX designer in the human factors and HCI group. Gesture systems and cross-device interaction, with a few patents written along the way.',
                      zh: '人因与 HCI 组的 UX 设计师。做手势系统和跨设备交互，顺手写了几项专利。',
                    }}
                    emoji="📱"
                  >
                    Huawei
                  </Fact>
                  , an OS for 700 million people at{' '}
                  <Fact
                    id="xiaomi"
                    tag={{ en: '2021 to 2023', zh: '2021 至 2023' }}
                    desc={{
                      en: 'UX to senior UX designer. Led shared design standards across 7+ teams, including the lock screen and design system work on this site.',
                      zh: '从 UX 设计师晋升到资深 UX 设计师。主导 7+ 团队共用的设计标准，包括本站的锁屏与设计系统项目。',
                    }}
                    emoji="🧩"
                  >
                    Xiaomi
                  </Fact>
                  , and growth flows measured in dollars at{' '}
                  <Fact
                    id="applovin"
                    tag={{ en: '2023 to 2025', zh: '2023 至 2025' }}
                    desc={{
                      en: 'Product designer on out-of-box flows shipped with Samsung, T-Mobile and other OEMs. Every design decision A/B tested against revenue.',
                      zh: '负责随三星、T-Mobile 等 OEM 出厂的开箱流程。每个设计决策都要经过以营收为标准的 A/B 测试。',
                    }}
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── 02 · The path ────────────────────────────────────── */}
      <section className="ab-section">
        <div className="ab-wrap">
          <Marker num="02" label={u.mPath} />
          <div className="ab-sublabel">{u.pathSub}</div>
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
          <Marker num="03" label={u.mOff} />
          <h2 className="ab-h">{u.offHead}</h2>
          <div className="ab-oc">
            <CatPile />
            <DiveCard />
            <SnowCard />
            <ReelCard />
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <footer className="ab-section ab-contact">
        <div className="ab-wrap">
          <Marker num="04" label={u.mHello} />
          <h2 className="ab-h">{u.contactHead}</h2>
          <CopyMail
            copyLabel={u.copy}
            copiedLabel={u.copied}
            manualLabel={u.copyManual}
          />
          <a
            className="ab-contact__resume"
            href="/Sherry_Zhou_Resume.pdf"
            target="_blank"
            rel="noopener"
          >
            {u.resume}
          </a>
          <a
            className="ab-contact__social"
            href="https://www.linkedin.com/in/xueyizhou"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInMark />
            {u.linkedin}
          </a>
          <div className="ab-colophon">
            <span>{u.colophon}</span>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>
      </footer>
    </div>
    </LangContext.Provider>
  );
}
