'use client';

/* ============================================================================
   / — the homepage. A plain, monochrome, editorial read.

   Almost no scroll choreography. The one exception is the page background:
   a ScrollTrigger toggles data-bg on .sm-root at section boundaries (white
   for hero + 01, then two grays for 02–03 and 04 onward), and a 0.4s CSS
   transition smooths the swap. The hero keeps the "I, as a ___" rotating role.

   Bilingual: every copy string is an { en, zh } pair picked by a lang state
   (persisted in localStorage "lang", shared with /about). The toggle lives
   in the footer colophon, bottom right. SSR renders English; a returning
   zh reader flips after hydration (no mismatch, one repaint).

   Self-contained: no TSX imports shared with the lockscreen routes (isolation
   rule). Styling lives in ./simple.css and leans on the shared token scale in
   _styles/tokens.css for type + spacing. The former scroll-driven Story page
   is archived at git tag `archive/story-page`.
============================================================================ */

import './_styles/tokens.css';
import './simple.css';

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
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── i18n plumbing ─────────────────────────────────────────────────
   One context, one hook. Data constants keep a single copy of every
   src/href and localize only their text fields, so the two languages
   can never drift apart structurally. */
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

const ROLES: L10n[] = [
  { en: 'UX Designer', zh: 'UX 设计师' },
  { en: 'Team Leader', zh: '团队负责人' },
  { en: 'Researcher', zh: '研究者' },
  { en: 'Facilitator', zh: '引导者' },
  { en: 'Experimenter', zh: '实验者' },
  { en: 'Maker', zh: '创造者' },
  { en: 'Learner', zh: '学习者' },
  { en: 'Human', zh: '普通人' },
];

/* Light/dark toggle. Stateless on purpose: the visible icon is swapped by
   CSS keyed off html[data-theme] (see .sm-theme in simple.css), so SSR
   markup never disagrees with the client and there's no hydration flash.
   Duplicated on the lockscreen page (isolation rule: no shared TSX). */
function ThemeToggle() {
  return (
    <button
      type="button"
      className="sm-theme"
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
        className="sm-theme__sun"
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
        className="sm-theme__moon"
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
   Duplicated on /about (per-page copies, same as ThemeToggle). */
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
      className="sm-lang"
      aria-label={lang === 'en' ? '切换到中文' : 'Switch to English'}
      onClick={() => onChange(lang === 'en' ? 'zh' : 'en')}
    >
      {lang === 'en' ? '中文' : 'English'}
    </button>
  );
}

function RotatingRole() {
  const t = useT();
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
        {t(ROLES[i])}
      </span>
    </span>
  );
}

/* Hero: the three employers, ordered by importance. Hover (or focus)
   floats a small card with a scale fact, so visitors outside the industry
   get a sense of how big each company is. */
const COMPANIES = [
  {
    id: 'xiaomi',
    name: { en: 'Xiaomi', zh: '小米' },
    tag: { en: 'Fortune Global 500', zh: '财富世界 500 强' },
    desc: {
      en: 'One of the world’s top 3 smartphone makers. Its OS runs on 700M+ monthly active devices.',
      zh: '全球前三的智能手机厂商，其操作系统运行在 7 亿+ 月活设备上。',
    },
  },
  {
    id: 'applovin',
    name: { en: 'AppLovin', zh: 'AppLovin' },
    tag: { en: 'NASDAQ: APP', zh: 'NASDAQ: APP' },
    desc: {
      en: 'A leading mobile ad-tech platform, reaching over 1 billion devices every day.',
      zh: '领先的移动广告技术平台，每天触达超过 10 亿台设备。',
    },
  },
  {
    id: 'huawei',
    name: { en: 'Huawei', zh: '华为' },
    tag: { en: '170+ countries', zh: '覆盖 170+ 国家' },
    desc: {
      en: 'A global ICT giant with 200,000+ employees, serving over 3 billion people.',
      zh: '全球 ICT 巨头，拥有 20 万+ 员工，服务超过 30 亿人。',
    },
  },
];

/* Clamp a trigger-centered floating card to the viewport. The cards below
   (company card, phrase card, workshop tooltip) are centered on their
   trigger with `translate: -50%`; when the trigger sits near a screen edge
   the card would run off-screen and get cut, especially on phones. Measure
   once open and return the px shift to fold into the centering translate.
   Duplicated on /about (per-page copies, same as ThemeToggle). */
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

function CompanyHover({ c }: { c: (typeof COMPANIES)[number] }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { cardRef, shift } = useCardShift<HTMLSpanElement>(open);
  return (
    <span
      className="sm-co"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      aria-describedby={open ? `co-${c.id}` : undefined}
    >
      {t(c.name)}
      <AnimatePresence>
        {open && (
          <motion.span
            className="sm-co-card"
            id={`co-${c.id}`}
            role="tooltip"
            ref={cardRef}
            style={{ translate: `calc(-50% + ${shift}px)` }}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <span className="sm-co-card__tag">{t(c.tag)}</span>
            <span className="sm-co-card__desc">{t(c.desc)}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

const COMING_SOON: L10n = { en: 'Coming soon', zh: '敬请期待' };

const MEANS = [
  {
    text: {
      en: 'It means making something personal — at a scale where nothing feels personal.',
      zh: '意味着在一个一切都谈不上个人的规模里，做出足够个人的东西。',
    },
    meta: { en: 'Xiaomi Lock Screen · 2023', zh: '小米锁屏 · 2023' },
    href: '/projects/lockscreen',
  },
  {
    text: {
      en: 'It means building the system that other designers build on.',
      zh: '意味着搭建一套系统，让其他设计师在上面继续搭建。',
    },
    meta: { en: 'MIUI Design System 2.0 · 2023', zh: 'MIUI 设计系统 2.0 · 2023' },
    href: '/projects/miui-design-system',
  },
  /* No case study written yet, so this row swaps the 👀 cursor for a
     "Coming soon" follow-pointer pill (see MeanRow) rather than offering a
     link affordance that goes nowhere. */
  {
    text: {
      en: "It means ‘just make it bigger’ is never the answer.",
      zh: '意味着“把它做大一点”从来都不是答案。',
    },
    meta: { en: 'Foldable Screen Framework · 2022', zh: '折叠屏框架 · 2022' },
    href: '',
  },
  {
    text: {
      en: 'It means designing what your finger feels, not what your eye sees.',
      zh: '意味着为手指的感受设计，而不是为眼睛所见设计。',
    },
    meta: { en: 'Touch Hot Zone · 2024', zh: '触摸热区 · 2024' },
    href: '/projects/touch-hotspots',
  },
  {
    text: {
      en: "It means there's always another kind of design waiting to be made.",
      zh: '意味着总有另一种设计，等着被做出来。',
    },
    meta: { en: '', zh: '' },
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
                    /* portaled to <body>, outside .sm-root — read the
                       :root-scoped theme tokens, not the --sm-* aliases */
                    color: 'var(--theme-ink)',
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
                    background: 'var(--theme-ink)',
                    color: 'var(--theme-paper)',
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
    src: '/section3-3/ws-01.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'The deck: design thinking', zh: '开场页：设计思维' },
    desc: {
      en: 'Slides built from scratch to run the whole sprint, not a template.',
      zh: '为整场工作坊从零做的幻灯片，不是套模板。',
    },
  },
  {
    src: '/section3-3/ws-02.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'House rule No.1', zh: '房规第一条' },
    desc: {
      en: 'Think harder. Always ask why. The tone was set on slide two.',
      zh: '想得再深一点，永远追问为什么。基调在第二页就定下了。',
    },
  },
  {
    src: '/section3-3/ws-03.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Fail early, fast, often', zh: '早失败，快失败，常失败' },
    desc: {
      en: 'Permission to be wrong, printed in bold.',
      zh: '把“允许犯错”用粗体印出来。',
    },
  },
  {
    src: '/section3-3/ws-04.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Empathy map', zh: '共情地图' },
    desc: {
      en: 'Says, thinks, does, feels. Pinning the user down before any sketching.',
      zh: '说、想、做、感受。动笔之前先把用户钉清楚。',
    },
  },
  {
    src: '/section3-3/ws-05.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Redefining the problem', zh: '重新定义问题' },
    desc: {
      en: 'Madlib template forcing each team to name the real user friction.',
      zh: '用填空模板，让每个小组说出真正的用户摩擦。',
    },
  },
  {
    src: '/section3-3/ws-06.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Opener: "How might we"', zh: '开场：“我们如何能”' },
    desc: {
      en: 'Turning the problem into possibilities before ideation starts.',
      zh: '在发散之前，先把问题翻译成可能性。',
    },
  },
  {
    src: '/section3-3/ws-07.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Crazy 8s', zh: '疯狂八稿' },
    desc: {
      en: '8 minutes, 8 ideas, sticky notes only.',
      zh: '8 分钟 8 个点子，只许写在便利贴上。',
    },
  },
  {
    src: '/section3-3/ws-08.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Pick the "WOW"', zh: '选出「WOW」' },
    desc: {
      en: 'Novelty against effort: NOW, WOW, HOW, and CIAO.',
      zh: '新颖度对实现难度：NOW、WOW、HOW、CIAO。',
    },
  },
  {
    src: '/section3-3/ws-09.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Idea parking station', zh: '想法停留站' },
    desc: {
      en: 'No idea gets thrown away. Off-topic ones get parked, not killed.',
      zh: '任何点子都不扔，跑题的先停靠，不枪毙。',
    },
  },
  {
    src: '/section3-3/ws-10.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'The toolkit', zh: '工具包' },
    desc: {
      en: 'Paper phone templates, a big whiteboard, and POP for instant prototypes.',
      zh: '手机纸模板、大白板，再加 POP 应用做即时原型。',
    },
  },
  {
    src: '/section3-3/ws-11.png',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Speed-dating interviews', zh: '快速轮换访谈' },
    desc: {
      en: 'Every 10 minutes the interviewee rotates to the next table.',
      zh: '每 10 分钟，受访者轮换到下一张桌子。',
    },
  },
  {
    src: '/section3-3/ws-12.jpg',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Ideas hit the flipchart', zh: '想法上墙' },
    desc: {
      en: 'Each group walked the room through their sketches, one sheet at a time.',
      zh: '各组轮流讲解草图，一页一页过。',
    },
  },
  {
    src: '/section3-3/ws-13.jpg',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Silent ideation', zh: '安静写想法' },
    desc: {
      en: 'Heads down, sticky notes first. Discussion starts after everyone writes.',
      zh: '先埋头写便利贴，写完才开始讨论。',
    },
  },
  {
    src: '/section3-3/ws-14.jpg',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'The parking station, in use', zh: '停留站实况' },
    desc: {
      en: 'Sketches parked and picked over, fingers already pointing at favorites.',
      zh: '草图停靠上墙，大家已经开始指认心头好。',
    },
  },
  {
    src: '/section3-3/ws-14-1.jpg',
    workshop: { en: 'Lock screen brainstorm', zh: '锁屏头脑风暴' },
    title: { en: 'Moodboards, side by side', zh: '灵感板并排陈列' },
    desc: {
      en: "Eight designers' references on one board, comments and stars included.",
      zh: '八位设计师的灵感放在同一块板上，评论和星标都在。',
    },
  },
  {
    src: '/section3-3/ws-15.jpg',
    workshop: { en: 'Desktop feature workshop', zh: '桌面功能工作坊' },
    title: { en: 'Paper prototypes on the table', zh: '纸面原型上桌' },
    desc: {
      en: 'Home screen layouts printed and passed around for a first gut check.',
      zh: '桌面布局打印出来传着看，先过直觉这一关。',
    },
  },
  {
    src: '/section3-3/ws-15-1.jpg',
    workshop: { en: 'Design system workshop', zh: '设计系统工作坊' },
    title: { en: 'Pain-point wall + dot vote', zh: '痛点墙 + 圆点投票' },
    desc: {
      en: 'Every gap in the old system called out. Dots picked what to fix first.',
      zh: '旧系统的每个缺口都被点名，圆点决定先修哪个。',
    },
  },
  {
    src: '/section3-3/ws-16.jpg',
    workshop: { en: 'Design system workshop', zh: '设计系统工作坊' },
    title: { en: 'Working session', zh: '工作会' },
    desc: {
      en: 'Small room, shared doc, open questions settled one by one.',
      zh: '小会议室，同一份文档，悬而未决的问题逐条敲定。',
    },
  },
] as const;

/* One image in the workshops grid. Hover lifts the card and floats a small
   tooltip above it (workshop tag · title · description) — same recipe as the
   home page's WorkshopWall, restyled black/white. */
function WorkshopCell({ w }: { w: (typeof WORKSHOP)[number] }) {
  const t = useT();
  const [hovered, setHovered] = useState(false);
  const { cardRef, shift } = useCardShift<HTMLDivElement>(hovered);
  return (
    <div
      className="sm-ww__cell"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={`${t(w.workshop)}: ${t(w.title)}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={w.src} alt="" loading="lazy" draggable={false} />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="sm-ww__tooltip"
            ref={cardRef}
            style={{ translate: `calc(-50% + ${shift}px)` }}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            <span className="sm-ww__tt-tag">{t(w.workshop)}</span>
            <p className="sm-ww__tt-title">{t(w.title)}</p>
            <p className="sm-ww__tt-desc">{t(w.desc)}</p>
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
  const t = useT();
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

  /* Row 3's case study isn't written yet. Rather than a 👀 cursor promising a
     jump that never comes, it says so: the same follow-pointer pill the flip
     cards use, reading "Coming soon". */
  const comingSoon = idx === 2;

  const text = (
    <p
      className="sm-means__text"
      style={comingSoon ? undefined : { cursor: emojiCursor('👀') }}
    >
      {m.href ? (
        <Link href={m.href} className="sm-means__text-link">
          {t(m.text)}
        </Link>
      ) : (
        t(m.text)
      )}
    </p>
  );

  const head = (
    <div className="sm-mean__head" ref={headRef}>
      <span className="sm-means__idx">{String(idx + 1).padStart(2, '0')}</span>
      <div>
        {comingSoon ? (
          <FollowPointer title={t(COMING_SOON)}>{text}</FollowPointer>
        ) : (
          text
        )}
        {t(m.meta) && (
          <div className="sm-means__meta">{t(m.meta)}</div>
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
    label: { en: 'Onboarding survey', zh: '开机问卷' },
    actual: {
      en: '5-step survey drove 18% install growth. 1-step only drove 14%.',
      zh: '5 步问卷带来 18% 的安装增长，1 步问卷只有 14%。',
    },
    insight: {
      en: 'Longer engagement built stronger intent.',
      zh: '更长的参与，换来更强的意愿。',
    },
    loser: { en: '1 step', zh: '1 步' },
    winner: { en: '5 step', zh: '5 步' },
    loserImg: '/section2/1-step.png',
    winnerImg: '/section2/5-step.png',
  },
  {
    label: { en: 'App bundle', zh: '应用合集' },
    actual: {
      en: 'Showing all app icons lifted installs by 0.47 per user. Collapsed view only lifted 0.37.',
      zh: '展示全部应用图标让人均安装提升 0.47，折叠视图只有 0.37。',
    },
    insight: { en: 'Transparency beat minimalism.', zh: '透明胜过极简。' },
    loser: { en: 'Collapsed', zh: '折叠' },
    winner: { en: 'Transparent', zh: '透明' },
    loserImg: '/section2/collapsed.png',
    winnerImg: '/section2/transparent.png',
  },
  {
    label: { en: 'Recommendation browsing', zh: '推荐浏览方式' },
    actual: {
      en: 'Swipe cards reached 15.65% CTR. Free-scroll list stayed much lower.',
      zh: '滑动卡片的点击率达到 15.65%，自由滚动列表远低于此。',
    },
    insight: {
      en: 'Forced focus beat open browsing.',
      zh: '强制聚焦胜过自由浏览。',
    },
    loser: { en: 'Free-scroll', zh: '自由滚动' },
    winner: { en: 'Swipe', zh: '滑动卡片' },
    loserImg: '/section2/free-scroll.png',
    winnerImg: '/section2/swipe.png',
  },
] as const;

const PHRASES = [
  {
    id: 'newcomer',
    head: { en: 'a newcomer', zh: '一个新人' },
    items: [
      { en: 'Only 1 year of working experience', zh: '只有 1 年工作经验' },
      { en: 'Already leading another key project', zh: '同时还在主导另一个重点项目' },
      {
        en: "Started with 2 teammates who weren't sure about me",
        zh: '起步时的 2 位队友对我还将信将疑',
      },
    ],
  },
  {
    id: 'senior-team',
    head: { en: 'a team of senior people', zh: '一支资深团队' },
    items: [
      { en: 'Grew the team from 2 to 7', zh: '把团队从 2 人带到 7 人' },
      { en: 'Helped everyone understand the current state', zh: '帮每个人看清现状' },
      { en: 'Gathered evidence to set a clear direction', zh: '收集证据，定下清晰的方向' },
      { en: 'Learned together as a team', zh: '和团队一起学习' },
      {
        en: 'Took the first step alone so others could follow',
        zh: '先独自迈出第一步，让别人可以跟上',
      },
    ],
  },
  {
    id: 'departments',
    head: { en: 'multiple departments', zh: '多个部门' },
    items: [
      {
        en: '40-person workshop with design, PM, and research',
        zh: '40 人工作坊，设计、产品、研究一起参与',
      },
      { en: 'Invited engineers to share their pain points', zh: '邀请工程师来讲他们的痛点' },
      { en: 'Aligned rules directly with 6 SDK engineers', zh: '与 6 位 SDK 工程师直接对齐规则' },
      {
        en: 'Cross-role review: 10 designers + 10 PMs + 10 engineers',
        zh: '跨角色评审：10 位设计师 + 10 位产品经理 + 10 位工程师',
      },
    ],
  },
  {
    id: 'terrible-idea',
    head: { en: 'a terrible idea', zh: '一个糟糕的主意' },
    items: [
      { en: '8 core components documented', zh: '沉淀了 8 个核心组件文档' },
      { en: 'First-ever foundation guidelines', zh: '第一份基础规范' },
      { en: 'Design tokens introduced', zh: '引入了设计令牌' },
      { en: '8.9 / 10 satisfaction score', zh: '8.9 / 10 的满意度' },
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
  const lang = useLang();
  const t = useT();
  const [open, setOpen] = useState(false);
  const { cardRef, shift } = useCardShift<HTMLSpanElement>(open);
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
      aria-describedby={open ? `phrase-${phrase.id}` : undefined}
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
        t(phrase.head)
      )}
      {showHint && (
        <span className="sm-phrase-hint" aria-hidden="true">
          <span className="sm-phrase-hint__dot" />
          {lang === 'zh' ? '悬停' : 'hover'}
        </span>
      )}
      <AnimatePresence>
        {open && (
          <motion.span
            className="sm-phrase-card"
            id={`phrase-${phrase.id}`}
            role="tooltip"
            ref={cardRef}
            style={{ translate: `calc(-50% + ${shift}px)` }}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <ul className="sm-phrase-card__list">
              {phrase.items.map((it) => (
                <li key={it.en}>{t(it)}</li>
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
  const lang = useLang();
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
      <div className="sm-eyebrow">{lang === 'zh' ? '设计常识' : 'Design common sense'}</div>
      <div className="sm-tenets">
        {lang === 'zh' ? (
          <>
            <p className="sm-tenet">&ldquo;步骤越少越好。&rdquo;</p>
            <p className="sm-tenet">&ldquo;界面越干净，转化越高。&rdquo;</p>
            <p className="sm-tenet">&ldquo;用户讨厌被强迫。&rdquo;</p>
          </>
        ) : (
          <>
            <p className="sm-tenet">&ldquo;Fewer steps is always better.&rdquo;</p>
            <p className="sm-tenet">&ldquo;Cleaner UI converts more.&rdquo;</p>
            <p className="sm-tenet">&ldquo;Users hate being forced.&rdquo;</p>
          </>
        )}
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
  caption: L10n;
};

type OcProject = {
  id: string;
  title: L10n;
  tagline: L10n;
  blurb: L10n;
  emoji: string;
  stack: string[];
  media: OcMedia[];
};

const OC = '/simple/off-clock';

const OFF_CLOCK: OcProject[] = [
  {
    id: 'provis',
    title: { en: 'Seeing scent', zh: '看得见的香气' },
    tagline: {
      en: 'PROVis, a research tool that gives perfume a visual language.',
      zh: 'PROVis，一个让香水拥有视觉语言的研究工具。',
    },
    blurb: {
      en: 'Fragrance data is rich but trapped in text. PROVis translates ingredients, notes and chemistry into flat graphic patterns, so perfumes can be browsed, compared and composed by eye. Wrapped up as an academic design study.',
      zh: '香水的数据很丰富，却困在文字里。PROVis 把成分、香调和化学属性翻译成扁平的图形语言，让香水可以用眼睛去浏览、比较和组合。最终整理成一项学术设计研究。',
    },
    emoji: '🌸',
    stack: [`${OC}/provis/drop.jpg`, `${OC}/provis/system.jpg`, `${OC}/provis/explorer.jpg`],
    media: [
      {
        kind: 'image',
        src: `${OC}/provis/system.jpg`,
        caption: {
          en: 'The rule set. A real plant is traced into a flat profile, its colors sampled and softened into background and foreground elements.',
          zh: '规则体系。把一株真实的植物描摹成扁平轮廓，取色后柔化成背景与前景元素。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/provis/drop.jpg`,
        caption: {
          en: 'One drop per perfume. Top, heart and base notes stack into translucent layers, and the drop fades the way a scent does over time.',
          zh: '一滴代表一支香水。前调、中调、后调叠成半透明的层，液滴像香味一样随时间淡去。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/provis/explorer.jpg`,
        caption: {
          en: 'The explorer concept. A fragrance roulette to browse families, chemical charts to compare two bottles, and cards that unpack each formula.',
          zh: '浏览器概念。用香水轮盘浏览香调家族，用化学图表对比两支香水，再用卡片拆解每个配方。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/provis/paper.jpg`,
        caption: {
          en: 'The write-up. PROVis, a Perfume Relational Omni-dimensional Visualization Tool, structured as an application and design study.',
          zh: '论文。PROVis，一个香水关系全维度可视化工具，以应用与设计研究的形式呈现。',
        },
      },
    ],
  },
  {
    id: 'tactile',
    title: { en: 'Graphics you can touch', zh: '摸得到的图形' },
    tagline: {
      en: 'Research on graphical tactile displays for visually impaired users.',
      zh: '面向视障用户的图形化触觉显示研究。',
    },
    blurb: {
      en: 'Screens assume sight. At Tsinghua I co-authored an interactive system for graphical tactile devices: a haptic interface, a voice interface and a universal keyboard, tested with visually impaired students down to the braille spacing rules.',
      zh: '屏幕默认人人都看得见。在清华，我参与合著了一套图形化触觉设备的交互系统：触觉界面、语音界面和通用键盘，并与视障学生一起测试，细到盲文点距的排布规则。',
    },
    emoji: '🤲',
    stack: [`${OC}/tactile/page-2.jpg`, `${OC}/tactile/page-1.jpg`, `${OC}/tactile/page-4.jpg`],
    media: [
      {
        kind: 'image',
        src: `${OC}/tactile/page-1.jpg`,
        caption: {
          en: 'The paper. An interactive system combining touch, voice and a universal keyboard, grounded in interviews and the state of Chinese braille.',
          zh: '论文本体。一套结合触觉、语音和通用键盘的交互系统，建立在访谈和中国盲文现状之上。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/tactile/page-2.jpg`,
        caption: {
          en: 'Why it matters. Existing tactile displays are driven by memorized clicking buttons, so we drew principles from how blind users actually plan, confirm and recover.',
          zh: '为什么重要。现有触觉显示器靠死记按键来操作，我们从盲人用户真实的计划、确认与纠错方式中提炼原则。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/tactile/page-3.jpg`,
        caption: {
          en: 'The braille lattice experiment. Seven visually impaired students read two arrangements; the one that scored 90 to 100 percent became the layout rule.',
          zh: '盲文点阵实验。七位视障学生阅读两种排布，得分 90 到 100 分的那一种成为布局规则。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/tactile/page-4.jpg`,
        caption: {
          en: 'Definition symbols and the keyboard. 3x3 dot-matrix shapes mark what is clickable, and hotkeys follow habits blind users already have.',
          zh: '定义符号与键盘。3x3 点阵图形标记出可点击的对象，快捷键沿用盲人用户已有的习惯。',
        },
      },
    ],
  },
  {
    id: 'lego',
    title: { en: 'Scrapbots at LEGO House', zh: '乐高之家的 Scrapbots' },
    tagline: {
      en: 'A co-creation sprint in Billund, rewiring the City Architect table.',
      zh: '在比隆的一次共创冲刺，给 City Architect 桌注入新玩法。',
    },
    blurb: {
      en: 'One brief, an international team of seven, a few days inside LEGO House: get families building again in the City Architect experience. Our answer was Scrapbots, scrappy solar-powered robots that keep the LEGO city clean while players keep it powered.',
      zh: '一个命题，一支七人国际团队，在乐高之家的几天：让家庭在 City Architect 体验里重新动手搭建。我们的答案是 Scrapbots，一群捡废料的太阳能小机器人，玩家维持城市供电，它们维持城市干净。',
    },
    emoji: '🧱',
    stack: [`${OC}/lego/team.jpg`, `${OC}/lego/poster.jpg`],
    media: [
      {
        kind: 'video',
        src: `${OC}/lego/house.mp4`,
        caption: {
          en: 'The prototype in motion, filmed at LEGO House.',
          zh: '原型运转实拍，摄于乐高之家。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/lego/poster.jpg`,
        caption: {
          en: 'The pitch. Scraps pile up, Scrapbots sweep in, and the loop runs on solar power that players redirect with mirrored reflectors they build themselves.',
          zh: '提案。废料堆起来，Scrapbots 扫过去，整个循环靠玩家亲手搭建的反光镜阵列引导太阳能来驱动。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/lego/team.jpg`,
        caption: {
          en: 'Team Scrapbots in the LEGO House workshop book.',
          zh: '工作坊纪念册里的 Scrapbots 团队。',
        },
      },
    ],
  },
  {
    id: 'experiments',
    title: { en: 'Rooms, robots, patterns', zh: '房间、机器人与图案' },
    tagline: {
      en: 'Little installations from school years. Sound, cardboard and code.',
      zh: '学生时代的小装置。声音、纸板和代码。',
    },
    blurb: {
      en: 'Three experiments that never asked for permission. A pitch-black room that replays the same street three different ways, a choir of emoji boxes with a LEGO brain, and a long generative strip.',
      zh: '三个从没请示过谁的实验。一间把同一条街道播成三种世界的全黑房间，一支由乐高大脑指挥的 emoji 纸盒合唱团，还有一条长长的生成式图案。',
    },
    emoji: '🔊',
    stack: [`${OC}/experiments/emoji.jpg`, `${OC}/experiments/strip.jpg`, `${OC}/experiments/room.jpg`],
    media: [
      {
        kind: 'video',
        src: `${OC}/experiments/installation.mp4`,
        caption: { en: 'A walkthrough of the sound room.', zh: '声音房间的现场走览。' },
      },
      {
        kind: 'image',
        src: `${OC}/experiments/room.jpg`,
        caption: {
          en: 'One window, one visitor. Everything else is speakers.',
          zh: '一扇窗，一位访客，其余全是音箱。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/experiments/sounds.jpg`,
        caption: {
          en: 'Three sound sets, three worlds. The same room turns into a storm, a drizzle or a lazy morning depending on what you hear.',
          zh: '三组声音，三个世界。同一个房间，随你听到的声音变成暴雨、细雨或慵懒的清晨。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/experiments/texts.jpg`,
        caption: {
          en: 'The premise. What we hear draws the limit of what we imagine.',
          zh: '前提。我们听到什么，决定了我们能想象什么。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/experiments/emoji.jpg`,
        caption: {
          en: 'Emoji, made physical. A wall of cardboard heads on a black stage.',
          zh: 'emoji 的实体化。黑色舞台上的一面纸板头像墙。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/experiments/emoji-night.jpg`,
        caption: { en: 'Lights down. Each box glows on its cue.', zh: '灯光暗下，每个纸盒按各自的节拍发光。' },
      },
      {
        kind: 'image',
        src: `${OC}/experiments/robot.jpg`,
        caption: {
          en: 'The stagehand. A LEGO NXT robot wired into the show.',
          zh: '后台工作人员。一台接进演出的乐高 NXT 机器人。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/experiments/strip.jpg`,
        caption: { en: 'A generative pattern study, printed long.', zh: '一次生成式图案研究，打印成长卷。' },
      },
    ],
  },
  {
    id: 'linkly',
    title: { en: 'Linkly', zh: 'Linkly' },
    tagline: {
      en: 'Where every travel link finds its place. UX certification, 2025.',
      zh: '让每条旅行链接都有归处。UX 认证项目，2025。',
    },
    blurb: {
      en: 'Trips are planned in links: maps, posts, screenshots, group chats. Linkly catches them, sorts them by trip and lays them out on a timeline. From interviews to persona to flows to refined screens.',
      zh: '旅行是在链接里计划出来的：地图、帖子、截图、群聊。Linkly 把它们接住，按行程分类，再铺到时间线上。从访谈到画像、流程，再到细化界面。',
    },
    emoji: '✈️',
    stack: [`${OC}/linkly/screens.jpg`, `${OC}/linkly/create-trip.jpg`, `${OC}/linkly/cover.jpg`],
    media: [
      {
        kind: 'image',
        src: `${OC}/linkly/cover.jpg`,
        caption: { en: 'The one-liner.', zh: '一句话概括。' },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/problem.jpg`,
        caption: {
          en: 'The problem. Group trip planning is chaotic: scattered links, messy collaboration, no structure and platform lock-in.',
          zh: '问题。多人旅行计划一团乱：链接四散、协作混乱、缺乏结构，还被平台锁定。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/research.jpg`,
        caption: {
          en: 'What travelers said. Big Google Docs that stop working, and apps that want to plan from scratch when people just need their links sorted.',
          zh: '旅行者的原话。越写越长直到失控的 Google 文档，和总想让人从零开始规划的应用，可大家只想把链接理清楚。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/persona-jason.jpg`,
        caption: {
          en: 'Jason, the casual contributor. Drops links in chat and wants a one-tap way to react without logging into anything.',
          zh: 'Jason，随手贡献者。往群里丢链接，希望不用登录就能一键表态。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/persona-amanda.jpg`,
        caption: {
          en: 'Amanda, the default organizer. She wants control without spreadsheet-grade overhead.',
          zh: 'Amanda，默认的组织者。她想要掌控感，但不想要表格级的负担。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/solution.jpg`,
        caption: {
          en: 'The answer. An AI organizer that turns scattered travel links into a clean, shareable library and timeline.',
          zh: '答案。一个 AI 整理器，把散落的旅行链接变成清爽可分享的资料库和时间线。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/wireframe.jpg`,
        caption: {
          en: 'Wireframes. Trips, links, link details, adding and filtering.',
          zh: '线框图。行程、链接、链接详情、添加与筛选。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/create-trip.jpg`,
        caption: {
          en: 'Creating a trip. Name it, date it, invite people, then just drop your links.',
          zh: '创建行程。起名、定日期、邀请伙伴，然后只管丢链接。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/trip-links.jpg`,
        caption: {
          en: 'The trip link board. Every saved place as a card, with AI functions a tap away.',
          zh: '行程链接板。每个收藏的地点都是一张卡片，AI 功能一步可达。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/trip-timeline.jpg`,
        caption: {
          en: 'The timeline. Days, stops and link cards in order, with AI to check conflicts and summarize the trip.',
          zh: '时间线。天数、站点和链接卡片依次排开，AI 负责查冲突、做总结。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/view-modes.jpg`,
        caption: {
          en: 'View modes. The same links as full cards, a grid, compact rows or a list.',
          zh: '视图模式。同一批链接，可以是大卡片、网格、紧凑行或列表。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/screens.jpg`,
        caption: {
          en: 'Refined screens. Home, the trip link board and the trip timeline.',
          zh: '细化界面。首页、行程链接板和行程时间线。',
        },
      },
      {
        kind: 'image',
        src: `${OC}/linkly/ai-filter.jpg`,
        caption: {
          en: 'AI filter, v1. Name a filter, describe the condition in plain words, get a reusable set of filter chips.',
          zh: 'AI 筛选，第一版。给筛选起个名字，用大白话描述条件，得到一组可复用的筛选标签。',
        },
      },
    ],
  },
];

function OcLightbox({ p, onClose }: { p: OcProject; onClose: () => void }) {
  const lang = useLang();
  const t = useT();
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
      aria-label={t(p.title)}
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
          <h3 className="sm-oc-lb__title">{t(p.title)}</h3>
          <button
            className="sm-oc-lb__close"
            onClick={onClose}
            aria-label={lang === 'zh' ? '关闭' : 'Close'}
          >
            &times;
          </button>
        </header>
        <p className="sm-oc-lb__blurb">{t(p.blurb)}</p>

        <figure className="sm-oc-lb__fig">
          {m.kind === 'video' ? (
            <video key={m.src} src={m.src} controls playsInline preload="metadata" />
          ) : (
            /* Plain <img>: lightbox media are pre-sized local JPEGs and swap on
               every arrow press; next/image's layout props buy nothing here. */
            // eslint-disable-next-line @next/next/no-img-element
            <img key={m.src} src={m.src} alt={t(m.caption)} />
          )}
          <figcaption className="sm-oc-lb__cap">{t(m.caption)}</figcaption>
        </figure>

        <footer className="sm-oc-lb__nav">
          <button
            onClick={() => setI((v) => (v + count - 1) % count)}
            aria-label={lang === 'zh' ? '上一张' : 'Previous'}
          >
            &larr;
          </button>
          <div
            className="sm-oc-lb__dots"
            role="tablist"
            aria-label={lang === 'zh' ? '条目' : 'Items'}
          >
            {p.media.map((item, d) => (
              <button
                key={item.src + d}
                className="sm-oc-lb__dot"
                data-active={d === i || undefined}
                onClick={() => setI(d)}
                aria-label={lang === 'zh' ? `第 ${d + 1} 项` : `Item ${d + 1}`}
              />
            ))}
          </div>
          <span className="sm-oc-lb__count">
            {i + 1} / {count}
          </span>
          <button
            onClick={() => setI((v) => (v + 1) % count)}
            aria-label={lang === 'zh' ? '下一张' : 'Next'}
          >
            &rarr;
          </button>
        </footer>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function OffClock() {
  const t = useT();
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
            <span className="sm-oc-card__title">{t(p.title)}</span>
            <span className="sm-oc-card__tag">{t(p.tagline)}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open && <OcLightbox p={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </>
  );
}

const CONTACT_EMAIL = 'sherrrryz@outlook.com';

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="sm-marker">
      <span className="sm-marker__num">{num}</span>
      <span>{label}</span>
      <span className="sm-marker__line" aria-hidden="true" />
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
        className="sm-contact__mail"
        aria-label={`${copyLabel}: ${CONTACT_EMAIL}`}
        onClick={copy}
      >
        {CONTACT_EMAIL}
      </button>
      {/* Kept mounted so it can transition both ways; empty until it fires,
          so role=status has nothing to announce at page load. */}
      <div
        className={`sm-toast${toast ? ' sm-toast--on' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}

/* All inline page copy that isn't part of a data constant above. */
const UI = {
  en: {
    navMark: 'Xueyi Zhou',
    kicker: 'Xueyi (Sherry) Zhou · Product Designer',
    heroLine: 'I, as a',
    mMillions: 'For Millions',
    mBusiness: 'For Business',
    mTeams: 'For Teams',
    mCuriosity: 'Curiosity',
    mHello: 'Say hello',
    q1: 'What does it mean to design for 700 million people?',
    bizHead: 'At AppLovin, design was measured in dollars.',
    oemsAria: 'OEM & carrier partners',
    verdict: 'We tested all three. All three were wrong.',
    winnerTag: 'WINNER',
    caseMeta: 'AppLovin OOBE · 2025',
    caseCta: 'View the full case study',
    quoteIntro: 'My manager said this when he put me in charge of the design system:',
    sublabelWw: 'Workshops · aligning across departments',
    curiosityHead: 'Curiosity doesn’t stop at the office door.',
    contactHead: 'Let’s build for real people.',
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
    kicker: '周雪怡 (Sherry) · 产品设计师',
    heroLine: '我，作为',
    mMillions: '为亿万用户',
    mBusiness: '为商业',
    mTeams: '为团队',
    mCuriosity: '好奇心',
    mHello: '打个招呼',
    q1: '为 7 亿人做设计，意味着什么？',
    bizHead: '在 AppLovin，设计的好坏用美元来衡量。',
    oemsAria: 'OEM 与运营商伙伴',
    verdict: '三条我们都测了。三条全错了。',
    winnerTag: '胜出',
    caseMeta: 'AppLovin OOBE · 2025',
    caseCta: '查看完整案例',
    quoteIntro: '把设计系统交给我时，我的老板是这么说的：',
    sublabelWw: '工作坊 · 跨部门对齐',
    curiosityHead: '好奇心不会停在办公室门口。',
    contactHead: '一起为真实的人做点东西吧。',
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

export default function SimplePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
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
    <LangContext.Provider value={lang}>
    <div className="sm-root" ref={rootRef}>
      <nav className="sm-nav" aria-label="Primary">
        <Link href="/" className="sm-nav__mark">
          {u.navMark}
        </Link>
        <div className="sm-nav__links">
          <Link href="/" className="sm-nav__link" aria-current="page">
            {u.fHome}
          </Link>
          <Link href="/about" className="sm-nav__link">
            {u.fAbout}
          </Link>
          <Link href="/projects" className="sm-nav__link">
            {u.fProjects}
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="sm-section sm-hero">
        <div className="sm-wrap">
          <div className="sm-hero__kicker">{u.kicker}</div>
          <h1 className="sm-hero__line">
            {u.heroLine}
            <br />
            <RotatingRole />
            <span className="sm-role__cursor" aria-hidden="true">
              _
            </span>
          </h1>
          {lang === 'zh' ? (
            <p className="sm-hero__sub">
              一名 UX/产品设计师，曾任职于
              <CompanyHover c={COMPANIES[0]} />、
              <CompanyHover c={COMPANIES[1]} /> 和 <CompanyHover c={COMPANIES[2]} />。
            </p>
          ) : (
            <p className="sm-hero__sub">
              A UX/Product Designer with experience at{' '}
              <CompanyHover c={COMPANIES[0]} />,{' '}
              <CompanyHover c={COMPANIES[1]} />, and{' '}
              <CompanyHover c={COMPANIES[2]} />.
            </p>
          )}
          <p className="sm-hero__sub">
            {lang === 'zh'
              ? '为亿万用户设计，为商业设计，为团队设计，也为纯粹的好奇心设计。'
              : 'Designing for millions, for business, for teams, and out of plain curiosity.'}
          </p>
        </div>
      </header>

      {/* ── 01 · For Millions ────────────────────────────────── */}
      <section className="sm-section" data-section="millions">
        <div className="sm-wrap">
          <Marker num="01" label={u.mMillions} />
          <h2 className="sm-question">{u.q1}</h2>
          <div className="sm-means">
            {MEANS.map((m, idx) => (
              <MeanRow key={idx} m={m} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · For Business ────────────────────────────────── */}
      <section className="sm-section">
        <div className="sm-wrap">
          <Marker num="02" label={u.mBusiness} />

          {/* Group 1 — headline + context */}
          <div className="sm-group">
            <h2 className="sm-h">{u.bizHead}</h2>
            {lang === 'zh' ? (
              <p className="sm-body sm-group__body">
                OOBE 应用推荐流程随<strong>三星</strong>、<strong>T-Mobile</strong>
                以及十多家 OEM 厂商出厂，每个季度触达数千万台新开箱的手机，贡献
                <strong>七位数的营收</strong>。
              </p>
            ) : (
              <p className="sm-body sm-group__body">
                The OOBE app-recommendation flow ships with <strong>Samsung</strong>,{' '}
                <strong>T-Mobile</strong>, and a dozen other OEMs. It reaches tens
                of millions of newly unboxed phones each quarter and contributes{' '}
                <strong>seven figures of revenue</strong>.
              </p>
            )}
            <ul className="sm-oems" aria-label={u.oemsAria}>
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
            <p className="sm-verdict">{u.verdict}</p>

          <div className="sm-flip">
            {FLIP.map((c) => (
              <FollowPointer
                key={c.label.en}
                className="sm-flip__col"
                title={c.insight[lang]}
              >
                <article className="sm-card">
                  <h3 className="sm-card__title">{c.label[lang]}</h3>
                  <p className="sm-card__desc">{c.actual[lang]}</p>
                  <div className="sm-card__pair">
                    <div className="sm-opt sm-opt--loser">
                      <span className="sm-opt__label">{c.loser[lang]}</span>
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
                      <span className="sm-opt__tag">{u.winnerTag}</span>
                      <span className="sm-opt__label">{c.winner[lang]}</span>
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

            <Link href="/projects/applovin-oobe" className="sm-case-link">
              <span className="sm-case-link__meta">{u.caseMeta}</span>
              <span className="sm-case-link__cta">
                {u.caseCta}
                <span className="sm-case-link__arrow" aria-hidden="true">
                  &rarr;
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 03 · For Teams ───────────────────────────────────── */}
      <section className="sm-section" data-section="teams">
        <div className="sm-wrap">
          <Marker num="03" label={u.mTeams} />
          <p className="sm-quote-intro">{u.quoteIntro}</p>
          {lang === 'zh' ? (
            <blockquote className="sm-quote">
              &ldquo;我们刚让
              <HoverPhrase phrase={PHRASES[0]} showHint emoji="😳" />
              来负责，带着
              <HoverPhrase phrase={PHRASES[1]} emoji="🤨" />
              ，横跨
              <HoverPhrase phrase={PHRASES[2]} emoji="🤯" />
              。说实话？这听起来像
              <HoverPhrase
                phrase={PHRASES[3]}
                reveal={{ before: '一个', from: '糟糕', to: '绝妙', after: '的主意' }}
                emoji="🤩"
              />
              。&rdquo;
            </blockquote>
          ) : (
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
          )}

          <div className="sm-sublabel">{u.sublabelWw}</div>
          <div className="sm-ww">
            {WORKSHOP.map((w, i) => (
              <WorkshopCell w={w} key={i} />
            ))}
          </div>

        </div>
      </section>

      {/* ── 04 · Curiosity ───────────────────────────────────── */}
      {/* id: anchor target for the Linkly card on /projects */}
      <section className="sm-section" id="curiosity">
        <div className="sm-wrap">
          <Marker num="04" label={u.mCuriosity} />
          <h2 className="sm-h sm-h--sm">{u.curiosityHead}</h2>
          <OffClock />
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <footer className="sm-section sm-contact">
        <div className="sm-wrap">
          <Marker num="05" label={u.mHello} />
          <h2 className="sm-h sm-h--sm">{u.contactHead}</h2>
          <CopyMail
            copyLabel={u.copy}
            copiedLabel={u.copied}
            manualLabel={u.copyManual}
          />
          <a
            className="sm-contact__resume"
            href="/Sherry_Zhou_Resume.pdf"
            target="_blank"
            rel="noopener"
          >
            {u.resume}
          </a>
          <a
            className="sm-contact__social"
            href="https://www.linkedin.com/in/xueyizhou"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInMark />
            {u.linkedin}
          </a>
          <div className="sm-colophon">
            <span>{u.colophon}</span>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>
      </footer>
    </div>
    </LangContext.Provider>
  );
}
