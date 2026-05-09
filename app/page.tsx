'use client';

import './_styles/tokens.css';
import './_story/styles/flashlight.css';
import './_story/styles/for-millions.css';
import './_story/styles/for-business.css';
import './_story/styles/for-teams.css';
import './_story/styles/for-evidence.css';
import './_story/styles/curiosity.css';

import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioScene, { type FlashlightMode } from './_story/components/PortfolioScene';
import StoryNav from './_story/components/StoryNav';
import MillionsSection from './_story/components/s1/MillionsSection';
import ComparisonCard from './_story/components/ComparisonCard';
import QuoteHover from './_story/components/s3/QuoteHover';
import WorkshopWall from './_story/components/s3/WorkshopWall';
import MethodGrid from './_story/components/s4/MethodGrid';
import FeSection from './_story/components/s4/FeSection';
import FtIntroSection from './_story/components/s4/FtIntroSection';
import BioRow from './_story/components/s5/BioRow';
import PhotoStackGrid from './_story/components/s5/PhotoStackGrid';
import FadeOnExit from './_story/components/FadeOnExit';
import { Reveal } from './_story/lib/Reveal';
import { LenisProvider } from './_story/lib/LenisContext';
import { DEFAULT_CONFIG } from './_story/components/MaskControls';

export default function StoryPage() {
  const [mode, setMode] = useState<FlashlightMode>('glow');

  /* PRD §2.3 — body[data-theme] flips at each section's bottom 55%. CSS
     0.4s transition on each section's background-color smooths the swap.
     The wrapper for S1 covers Lockscreen + MIUI + Foldable + S1→S2 bridge,
     so its bottom is the natural switch point — same for the other
     wrappers, which already group their sub-sections. */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.dataset.theme = 'opening';

    const transitions: Array<{ sel: string; prev: string; next: string }> = [
      { sel: '[data-section="opening"]',  prev: 'opening',   next: 'millions' },
      { sel: '[data-section="millions"]', prev: 'millions',  next: 'business' },
      { sel: '[data-section="business"]', prev: 'business',  next: 'teams' },
      { sel: '[data-section="teams"]',    prev: 'teams',     next: 'evidence' },
      { sel: '[data-section="evidence"]', prev: 'evidence',  next: 'curiosity' },
    ];

    const sts = transitions
      .map(({ sel, prev, next }) => {
        const trigger = document.querySelector<HTMLElement>(sel);
        if (!trigger) return null;
        return ScrollTrigger.create({
          trigger,
          start: 'bottom 55%',
          onEnter: () => {
            document.body.dataset.theme = next;
          },
          onLeaveBack: () => {
            document.body.dataset.theme = prev;
          },
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    return () => {
      sts.forEach((st) => st.kill());
      delete document.body.dataset.theme;
    };
  }, []);

  return (
    <LenisProvider>
    <div
      className="fl-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'var(--theme-surface-1)',
        color: 'var(--theme-text-1)',
        // Use `clip` (not `hidden`) so we don't create a scroll container
        // that breaks `position: sticky` on descendants (e.g. S1's central
        // text island in fm-body).
        overflowX: 'clip',
      }}
    >
      <StoryNav variant="story" />

      <section
        id="section-opening"
        data-section="opening"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: 'var(--theme-surface-1)',
          transition: 'background-color 0.4s ease',
        }}
      >
        <PortfolioScene config={DEFAULT_CONFIG} mode={mode} />

        {/* Glow/Flat toggle — scoped to the opening section so it
            scrolls away with the rest of Section 0. */}
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'glow' ? 'flat' : 'glow'))}
          aria-label="Toggle flashlight style"
          style={{
            position: 'absolute',
            top: 24,
            right: 32,
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            borderRadius: 9999,
            border: '1px solid color-mix(in srgb, var(--theme-text-1) 30%, transparent)',
            background: 'color-mix(in srgb, var(--theme-surface-1) 60%, transparent)',
            color: 'color-mix(in srgb, var(--theme-text-1) 85%, transparent)',
            fontSize: 10,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: mode === 'glow' ? 'var(--theme-accent-1)' : 'var(--theme-text-1)',
              boxShadow:
                mode === 'glow'
                  ? '0 0 8px color-mix(in srgb, var(--theme-accent-1) 90%, transparent)'
                  : '0 0 0 1px color-mix(in srgb, var(--theme-text-1) 40%, transparent)',
              transition: 'all 0.25s ease',
            }}
          />
          {mode === 'glow' ? 'Glow' : 'Flat'}
        </button>
      </section>

      <MillionsSection />

      <div data-section="business">
      <section id="section-business" className="fb-section">
        <div className="fb-section__inner">
          {/* Section 02.A — Opening */}
          <div className="fb-block" id="section-business-opening">
            <div className="fb-opening__grid">
              <div>
                <div className="fb-opening__eyebrow">I design for business</div>
                <Reveal
                  mode="element"
                  effect="slide"
                  trigger="once"
                  duration={1}
                  initialY={32}
                  start="top 75%"
                >
                  <h2 className="fb-opening__headline">
                    At AppLovin,
                    <br />
                    design was measured in{' '}
                    <span className="accent">dollars.</span>
                  </h2>
                </Reveal>
              </div>
              <Reveal
                mode="element"
                effect="fade"
                trigger="once"
                duration={1}
                start="top 78%"
                className="fb-opening__body"
              >
                <p>
                  The OOBE app-recommendation flow ships with{' '}
                  <strong>Samsung</strong>, <strong>T-Mobile</strong>, and a dozen
                  other OEMs. It reaches tens of millions of newly unboxed phones
                  each quarter and contributes{' '}
                  <strong>seven figures of revenue</strong>.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Section 02.B — Three Design Tenets */}
          <div className="fb-block" id="section-business-tenets">
            <div className="fb-tenets">
            <Reveal
              mode="element"
              effect="fade"
              trigger="once"
              duration={0.6}
              start="top 80%"
            >
              <span className="fb-tenets__label">Design Common Sense</span>
            </Reveal>
            <div className="fb-tenets__rule" aria-hidden="true" />
            <Reveal
              mode="element"
              effect="slide"
              trigger="once"
              duration={0.9}
              initialY={20}
              start="top 80%"
            >
              <p className="fb-tenets__quote">
                &ldquo;<span className="fb-tenets__quote-mark">Fewer steps</span> is always better.&rdquo;
              </p>
            </Reveal>
            <Reveal
              mode="element"
              effect="slide"
              trigger="once"
              duration={0.9}
              initialY={20}
              start="top 78%"
            >
              <p className="fb-tenets__quote">
                &ldquo;<span className="fb-tenets__quote-mark">Cleaner UI</span> converts more.&rdquo;
              </p>
            </Reveal>
            <Reveal
              mode="element"
              effect="slide"
              trigger="once"
              duration={0.9}
              initialY={20}
              start="top 76%"
            >
              <p className="fb-tenets__quote">
                &ldquo;Users hate <span className="fb-tenets__quote-mark">being forced</span>.&rdquo;
              </p>
            </Reveal>
            <div
              className="fb-tenets__rule fb-tenets__rule--short"
              aria-hidden="true"
            />
            </div>
          </div>

          {/* Section 02.C — The Data Flip */}
          <div className="fb-block" id="section-business-data-flip">
            <div className="fb-flip">
            <div className="fb-flip__lead">
              <Reveal
                mode="element"
                effect="fade"
                trigger="once"
                duration={0.6}
                start="top 75%"
              >
                <p className="fb-tenets__punch">We tested all three.</p>
              </Reveal>
              <Reveal
                mode="element"
                effect="slide"
                trigger="once"
                duration={0.8}
                initialY={12}
                start="top 73%"
              >
                <p className="fb-tenets__punch fb-tenets__punch--accent">
                  All three were wrong.
                </p>
              </Reveal>
            </div>
            <div className="fb-flip__row">
              <Reveal
                mode="element"
                effect="slide"
                trigger="once"
                duration={0.9}
                initialY={40}
                start="top 80%"
              >
                <ComparisonCard
                  title="Onboarding survey"
                  data="5-step survey drove 18% install growth. 1-step only drove 14%."
                  optionA={{ label: '1-step' }}
                  optionB={{ label: '5-step' }}
                  winner="B"
                  insight="Longer engagement built stronger intent."
                />
              </Reveal>
              <Reveal
                mode="element"
                effect="slide"
                trigger="once"
                duration={0.9}
                initialY={40}
                start="top 78%"
              >
                <ComparisonCard
                  title="App bundle"
                  data="Showing all app icons lifted installs by 0.47 per user. Collapsed view only lifted 0.37."
                  optionA={{ label: 'Collapsed' }}
                  optionB={{ label: 'Transparent' }}
                  winner="B"
                  insight="Transparency beat minimalism."
                />
              </Reveal>
              <Reveal
                mode="element"
                effect="slide"
                trigger="once"
                duration={0.9}
                initialY={40}
                start="top 76%"
              >
                <ComparisonCard
                  title="Recommendation browsing"
                  data="Swipe cards reached 15.65% CTR. Free-scroll list stayed much lower."
                  optionA={{ label: 'Free-scroll' }}
                  optionB={{ label: 'Swipe' }}
                  winner="B"
                  insight="Forced focus beat open browsing."
                />
              </Reveal>
            </div>
          </div>
            <div className="fb-footer">
              AppLovin OOBE · 2025 ·{' '}
              <a href="#" title="Case study coming soon">
                View project →
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>

      <div data-section="teams">
      {/* ── S3 eyebrow + 引出句（合并一个 ft-section，控制内部节奏）
           外层用 FadeOnExit 做"快到顶端时渐变消失"，对应入场的 blur 效果。
           FtIntroSection wraps the section with a GSAP scrub that flips
           the bg from --stage-cream → --stage-light during the widened
           top padding. Finishes before the eyebrow is in view. ── */}
      <FtIntroSection>
        <FadeOnExit
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
            width: '100%',
          }}
        >
          <Reveal
            mode="words"
            effect="blur"
            trigger="once"
            duration={0.9}
            stagger={0.03}
            start="top 75%"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--eyebrow-size)',
              fontWeight: 'var(--eyebrow-weight)',
              letterSpacing: 'var(--eyebrow-tracking)',
              textTransform: 'uppercase',
              color: 'var(--theme-text-2)',
              textAlign: 'center',
            }}
          >
            I design for teams.
          </Reveal>
          <Reveal
            mode="words"
            effect="blur"
            trigger="once"
            duration={1}
            stagger={0.04}
            initialBlur={5}
            start="top 72%"
            className="ft-lead"
          >
            My manager said this when he put me in charge of the design system:
          </Reveal>
        </FadeOnExit>
      </FtIntroSection>

      {/* ── S3 QuoteHover ── */}
      <section
        className="ft-section"
        style={{ paddingTop: 0 }}
      >
        <div className="ft-section__inner">
          <QuoteHover />

          <div className="ft-footer">MIUI Design System 2.0 · 2023</div>
        </div>
      </section>

      {/* ── S3 第二层：Workshop 照片墙 ──
           overflow visible：让 tooltip 溢出到 section 外而不被裁切。
           横向溢出由 fl-root (overflow-x: hidden) 兜底。 */}
      <section
        className="ft-section"
        style={{
          minHeight: 'unset',
          paddingTop: 0,
          paddingBottom: 'var(--vspace-xl)',
          overflow: 'visible',
        }}
      >
        <WorkshopWall />
      </section>
      </div>

      <div data-section="evidence">
      {/* Section 4 — For Evidence */}
      <FeSection>
        <div className="fe-section__inner">
          <div className="fe-eyebrow">I design for evidence.</div>

          <Reveal
            mode="words"
            effect="blur"
            trigger="once"
            duration={1}
            stagger={0.04}
            initialBlur={5}
            start="top 75%"
            className="fe-lead"
          >
            Every project I&rsquo;ve worked on started with a question I couldn&rsquo;t answer from my desk.
          </Reveal>

          <MethodGrid />
        </div>
      </FeSection>
      </div>

      <div data-section="curiosity">
      {/* Section 5 — Curiosity */}
      <section className="cu-section" id="section-curiosity">
        <div className="cu-section__inner">
          <div>
            <div className="cu-eyebrow">I am curious.</div>
            <Reveal
              mode="words"
              effect="blur"
              trigger="once"
              duration={1}
              stagger={0.03}
              initialBlur={5}
              start="top 80%"
              className="cu-lead"
            >
              Curiosity doesn&rsquo;t stop at the office door.
            </Reveal>
          </div>

          <BioRow />

          <div>
            <p className="cu-grid-lead">
              Photos from things I keep chasing off the clock.
            </p>
            <PhotoStackGrid />
          </div>
        </div>
      </section>
      </div>
    </div>
    </LenisProvider>
  );
}
