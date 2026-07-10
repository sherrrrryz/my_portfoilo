'use client';

/* ============================================================================
   /projects — the project index (client half; metadata lives in page.tsx).

   Six cards: the homepage's four "It means" projects (lock screen, MIUI
   design system, foldable framework, touch hot zone), the AppLovin OOBE
   work, and Linkly, the personal project. Four link to their case-study
   landings; the foldable framework has no write-up yet and Linkly's full
   walkthrough lives in the homepage's Curiosity lightbox, so those two
   carry a mono note instead of a CTA.

   Same monochrome editorial voice as the homepage and /about, and the same
   per-page copies of ThemeToggle / LangToggle / emojiCursor (isolation
   rule: no TSX shared with other routes). Bilingual via the shared
   localStorage "lang" recipe. No scroll choreography.
============================================================================ */

import '../_styles/tokens.css';
import './projects.css';

import Link from 'next/link';
import Image from 'next/image';
import { createContext, useContext, useEffect, useState } from 'react';

/* ── i18n plumbing — per-page copy of the homepage recipe ─────────── */
type Lang = 'en' | 'zh';
type L10n = { en: string; zh: string };

const LangContext = createContext<Lang>('en');

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
      className="pj-theme"
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
        className="pj-theme__sun"
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
        className="pj-theme__moon"
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
   Duplicated per page (isolation rule, same as ThemeToggle). */
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
      className="pj-lang"
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
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, pointer`;
}

/* ── the six projects ─────────────────────────────────────────────
   Homepage order: It-means rows 1-4, then the AppLovin OOBE work from
   02 · For Business, then the personal project from 04 · Curiosity. */
type Project = {
  id: string;
  href?: string;
  img: string;
  /* cover crop anchor for tall sources */
  imgPos?: string;
  alt: L10n;
  title: L10n;
  org: L10n;
  year: string;
  dek: L10n;
  tags: L10n;
  /* mono note for cards without a case study; noteHref makes it a link */
  note?: L10n;
  noteHref?: string;
};

const PROJECTS: Project[] = [
  {
    id: 'lockscreen',
    href: '/projects/lockscreen',
    img: '/lockscreen/lockscreencover.png',
    alt: {
      en: 'A collage of MIUI 15 lock screens: magazine, classic and widget styles.',
      zh: 'MIUI 15 锁屏拼贴：杂志、经典与小组件样式。',
    },
    title: { en: 'Lock Screen Personalization', zh: '锁屏个性化编辑' },
    org: { en: 'Xiaomi', zh: '小米' },
    year: '2023',
    dek: {
      en: 'The editing framework behind MIUI 15’s new lock screens. Something personal, at a scale where nothing feels personal.',
      zh: 'MIUI 15 新锁屏背后的编辑框架。在一切都谈不上个人的规模里，做出足够个人的东西。',
    },
    tags: {
      en: 'Interaction design · Product design · Visual design',
      zh: '交互设计 · 产品设计 · 视觉设计',
    },
  },
  {
    id: 'miui-design-system',
    href: '/projects/miui-design-system',
    img: '/miui/components-after.png',
    imgPos: 'top',
    alt: {
      en: 'A page of the MIUI Design System 2.0 component documentation.',
      zh: 'MIUI 设计系统 2.0 组件文档的一页。',
    },
    title: { en: 'MIUI Design System 2.0', zh: 'MIUI 设计系统 2.0' },
    org: { en: 'Xiaomi', zh: '小米' },
    year: '2023',
    dek: {
      en: 'Turning a guideline nobody trusted into a system ten thousand employees could build on.',
      zh: '把一份没人信任的规范，变成一万名员工可以依赖的系统。',
    },
    tags: {
      en: 'Design systems · Design ops · Design-led',
      zh: '设计系统 · 设计运营 · 设计驱动',
    },
  },
  {
    id: 'foldable',
    img: '/foldable/note-unfold-a.png',
    imgPos: 'top',
    alt: {
      en: 'The MIUI notes app laid out on an unfolded foldable screen.',
      zh: '展开的折叠屏上的 MIUI 笔记应用布局。',
    },
    title: { en: 'Foldable Screen Framework', zh: '折叠屏框架' },
    org: { en: 'Xiaomi', zh: '小米' },
    year: '2022',
    dek: {
      en: '“Just make it bigger” is never the answer. Layout rules for apps that live on two screen sizes at once.',
      zh: '“把它做大一点”从来都不是答案。为同时活在两种屏幕尺寸上的应用定下布局规则。',
    },
    tags: {
      en: 'Interaction framework · Adaptive layout',
      zh: '交互框架 · 自适应布局',
    },
    note: { en: 'Write-up in progress', zh: '案例整理中' },
  },
  {
    id: 'touch-hotspots',
    href: '/projects/touch-hotspots',
    img: '/toucharea/Cover.png',
    alt: {
      en: 'Two phones showing per-zone touch hit-rate heatmaps, left and right hand.',
      zh: '两台手机分别显示左右手分区触控命中率热力图。',
    },
    title: { en: 'Touch Hot Zone', zh: '触摸热区' },
    org: { en: 'Xiaomi', zh: '小米' },
    year: '2024',
    dek: {
      en: 'Mapping where thumbs actually reach on a 6.8-inch screen, so layout decisions stop being guesses.',
      zh: '测绘拇指在 6.8 英寸屏幕上真正够得到的区域，让布局决策不再靠猜。',
    },
    tags: {
      en: 'HCI research · Experimental design',
      zh: 'HCI 研究 · 实验设计',
    },
  },
  {
    id: 'applovin-oobe',
    href: '/projects/applovin-oobe',
    img: '/oobe/existing-flow.png',
    alt: {
      en: 'Three screens of the out-of-box app recommendation flow on a new Android phone.',
      zh: '新 Android 手机开箱应用推荐流程的三个界面。',
    },
    title: { en: 'OOBE App Discovery', zh: 'OOBE 应用发现' },
    org: { en: 'AppLovin', zh: 'AppLovin' },
    year: '2023–2025',
    dek: {
      en: 'Four experiments to make app recommendations on a brand-new Android phone worth the tap.',
      zh: '四个实验，让新手机开箱时的应用推荐值得一点。',
    },
    tags: {
      en: 'Product design · Experiment design · Growth',
      zh: '产品设计 · 实验设计 · 增长',
    },
  },
  {
    id: 'linkly',
    img: '/simple/off-clock/linkly/cover.jpg',
    alt: {
      en: 'Linkly cover: where every travel link finds its place.',
      zh: 'Linkly 封面：让每条旅行链接都有归处。',
    },
    title: { en: 'Linkly', zh: 'Linkly' },
    org: { en: 'Personal · iOS', zh: '个人项目 · iOS' },
    year: '2025',
    dek: {
      en: 'Where every travel link finds its place. From interviews to persona to flows to refined screens.',
      zh: '让每条旅行链接都有归处。从访谈到画像、流程，再到细化界面。',
    },
    tags: {
      en: 'End-to-end UX · UX certification',
      zh: '端到端 UX · UX 认证',
    },
    note: { en: 'Walkthrough on the homepage →', zh: '首页查看完整过程 →' },
    noteHref: '/#curiosity',
  },
];

/* All inline page copy that isn't part of a data constant above. */
const UI = {
  en: {
    navMark: 'Xueyi Zhou',
    kicker: 'Projects · Xueyi (Sherry) Zhou',
    heroLine: 'Selected work.',
    heroSub:
      'Six projects: an OS for 700 million people at Xiaomi, growth measured in dollars at AppLovin, and one personal project for the way I travel.',
    mIndex: 'The work',
    sublabel: '6 projects · 2022 to now',
    cta: 'Case study',
    mHello: 'Say hello',
    contactHead: 'Want the full story on any of these?',
    resume: 'Resume ↗',
    fHome: 'Home',
    fAbout: 'About',
    fProjects: 'Projects',
    colophon: 'Xueyi (Sherry) Zhou © 2026',
  },
  zh: {
    navMark: '周雪怡',
    kicker: '项目 · 周雪怡 (Sherry)',
    heroLine: '精选作品。',
    heroSub:
      '六个项目：在小米为 7 亿人做操作系统，在 AppLovin 做以美元衡量的增长，还有一个为旅行方式而做的个人项目。',
    mIndex: '作品',
    sublabel: '6 个项目 · 2022 至今',
    cta: '案例',
    mHello: '打个招呼',
    contactHead: '想听其中任何一个的完整故事？',
    resume: '简历 ↗',
    fHome: '首页',
    fAbout: '关于',
    fProjects: '项目',
    colophon: '周雪怡 (Sherry) © 2026',
  },
} as const;

function Marker({ num, label }: { num: string; label: string }) {
  return (
    <div className="pj-marker">
      <span className="pj-marker__num">{num}</span>
      <span>{label}</span>
      <span className="pj-marker__line" aria-hidden="true" />
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const t = useT();
  const lang = useContext(LangContext);
  const u = UI[lang];

  const inner = (
    <>
      <div className="pj-card__media">
        <Image
          src={p.img}
          alt={t(p.alt)}
          fill
          sizes="(max-width: 860px) 100vw, 640px"
          style={{ objectPosition: p.imgPos ?? 'center' }}
        />
      </div>
      <div className="pj-card__row">
        <span>
          {t(p.org)} · {p.year}
        </span>
        {p.href ? (
          <span className="pj-card__cta">
            {u.cta}
            <span className="pj-card__arrow" aria-hidden="true">
              &rarr;
            </span>
          </span>
        ) : p.note && p.noteHref ? (
          <Link href={p.noteHref} className="pj-card__note pj-card__note--link">
            {t(p.note)}
          </Link>
        ) : p.note ? (
          <span className="pj-card__note">{t(p.note)}</span>
        ) : null}
      </div>
      <h3 className="pj-card__title">{t(p.title)}</h3>
      <p className="pj-card__dek">{t(p.dek)}</p>
      <p className="pj-card__tags">{t(p.tags)}</p>
    </>
  );

  return p.href ? (
    <Link href={p.href} className="pj-card" style={{ cursor: emojiCursor('👀') }}>
      {inner}
    </Link>
  ) : (
    <article className="pj-card">{inner}</article>
  );
}

export default function ProjectsIndex() {
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
    <div className="pj-root">
      <nav className="pj-nav" aria-label="Primary">
        <Link href="/" className="pj-nav__mark">
          {u.navMark}
        </Link>
        <div className="pj-nav__side">
          <Link href="/" className="pj-nav__link">
            {u.fHome}
          </Link>
          <Link href="/about" className="pj-nav__link">
            {u.fAbout}
          </Link>
          <Link href="/projects" className="pj-nav__link" aria-current="page">
            {u.fProjects}
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="pj-section pj-hero">
        <div className="pj-wrap">
          <div className="pj-hero__kicker">{u.kicker}</div>
          <h1 className="pj-hero__line">{u.heroLine}</h1>
          <p className="pj-hero__sub">{u.heroSub}</p>
        </div>
      </header>

      {/* ── 01 · The work ────────────────────────────────────── */}
      <section className="pj-section">
        <div className="pj-wrap">
          <Marker num="01" label={u.mIndex} />
          <div className="pj-sublabel">{u.sublabel}</div>
          <div className="pj-grid">
            {PROJECTS.map((p) => (
              <ProjectCard p={p} key={p.id} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <footer className="pj-section pj-contact">
        <div className="pj-wrap">
          <Marker num="02" label={u.mHello} />
          <h2 className="pj-contact__head">{u.contactHead}</h2>
          <a className="pj-contact__mail" href="mailto:sherrrryz@outlook.com">
            sherrrryz@outlook.com
          </a>
          <a
            className="pj-contact__resume"
            href="/Sherry_Zhou_Resume.pdf"
            target="_blank"
            rel="noopener"
          >
            {u.resume}
          </a>
          <div className="pj-colophon">
            <span>{u.colophon}</span>
            <LangToggle lang={lang} onChange={changeLang} />
          </div>
        </div>
      </footer>
    </div>
    </LangContext.Provider>
  );
}
