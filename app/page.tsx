'use client';

import './_styles/tokens.css';
import './_story/styles/flashlight.css';
import './_story/styles/for-business.css';
import './_story/styles/for-teams.css';

import Link from 'next/link';
import { useState } from 'react';
import PortfolioScene, { type FlashlightMode } from './_story/components/PortfolioScene';
import PillNav from './_story/components/PillNav';
import ScrollFloat from './_story/components/ScrollFloat';
import ScrollReveal from './_story/components/ScrollReveal';
import LockscreenPile from './_story/components/LockscreenPile';
import BeforeAfterSlider from './_story/components/BeforeAfterSlider';
import ABVote from './_story/components/ABVote';
import FoldableCarousel from './_story/components/FoldableCarousel';
import ComparisonCard from './_story/components/ComparisonCard';
import QuoteHover from './_story/components/s3/QuoteHover';
import WorkshopWall from './_story/components/s3/WorkshopWall';
import FadeOnExit from './_story/components/FadeOnExit';
import { Reveal } from './_story/lib/Reveal';
import { LenisProvider } from './_story/lib/LenisContext';
import { DEFAULT_CONFIG } from './_story/components/MaskControls';

export default function StoryPage() {
  const [mode, setMode] = useState<FlashlightMode>('glow');

  return (
    <LenisProvider>
    <div
      className="fl-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        overflowX: 'hidden',
      }}
    >
      <PillNav
        logo="/logo.png"
        logoAlt="Sherry"
        items={[
          { label: 'Story', href: '/' },
          { label: 'Overview', href: '/overview' },
          { label: 'Projects', href: '/projects' },
        ]}
        activeHref="/"
        baseColor="#ffffff"
        pillColor="#0a0a0a"
        hoveredPillTextColor="#0a0a0a"
        pillTextColor="#ffffff"
      />

      <section
        id="section-opening"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: '#0a0a0a',
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
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(0,0,0,0.4)',
            color: 'rgba(255,255,255,0.85)',
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
              background: mode === 'glow' ? '#ffd27a' : '#ffffff',
              boxShadow:
                mode === 'glow'
                  ? '0 0 8px rgba(255,210,122,0.9)'
                  : '0 0 0 1px rgba(255,255,255,0.4)',
              transition: 'all 0.25s ease',
            }}
          />
          {mode === 'glow' ? 'Glow' : 'Flat'}
        </button>
      </section>

      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: 'var(--stage-light)',
          color: '#1a1a1a',
          padding: 'var(--vspace-xl) var(--hspace-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          fontFamily: "'Switzer-Variable', 'Switzer', 'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 2200, width: '100%' }}>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              marginBottom: 'var(--space-4-5)',
              textAlign: 'center',
              fontWeight: 'var(--font-medium)' as never,
            }}
          >
            I design for millions.
          </div>
          <div id="section-millions-question" data-snap-align="center">
            <ScrollFloat
              animationDuration={0.6}
              ease="power3.out"
              scrollStart="top 75%"
              stagger={0.025}
              scrub={false}
              highlight="700 million"
            >
              What does it mean to design for 700 million people?
            </ScrollFloat>
          </div>

          <div
            id="section-millions-answer"
            data-snap-align="center"
            style={{ marginTop: 'var(--vspace-2xl)' }}
          >
            <ScrollReveal
              baseOpacity={0.1}
              baseRotation={2}
              blurStrength={4}
            >
              It means making something personal — at a scale where nothing feels personal.
            </ScrollReveal>
          </div>

          <div style={{ marginTop: 'var(--vspace-md)' }}>
            <LockscreenPile />
          </div>

          <div
            style={{
              marginTop: 'var(--vspace-lg)',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              letterSpacing: 'var(--tracking-wide)',
              color: 'rgba(26,26,26,0.45)',
            }}
          >
            Xiaomi Lock Screen · 2023 ·{' '}
            <Link
              href="/projects/lockscreen"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
                textUnderlineOffset: 4,
              }}
            >
              View project →
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — MIUI Design System 2.0 */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: 'var(--stage-light)',
          color: '#1a1a1a',
          padding: 'var(--vspace-xl) var(--hspace-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily:
            "'Switzer-Variable', 'Switzer', 'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 2200, width: '100%' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', marginBottom: 'var(--vspace-md)' }}>
            <Reveal
              mode="words"
              effect="blur"
              trigger="once"
              duration={1}
              stagger={0.06}
              initialBlur={6}
              start="top 75%"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-3xl)',
                lineHeight: 'var(--leading-tight)',
                fontWeight: 'var(--font-extrabold)',
                letterSpacing: 'var(--tracking-tightest)',
                textAlign: 'center',
              }}
            >
              It means building the system that other designers build on.
            </Reveal>
          </div>

          <div className="miui-grid">
            <BeforeAfterSlider
              title="Components"
              beforeSrc="/miui/components-before.png"
              afterSrc="/miui/components-after.png"
              aspectRatio="464 / 512"
            />
            <BeforeAfterSlider
              title="Design Tokens"
              beforeSrc="/miui/designtoken-before.png"
              afterSrc="/miui/designtoken-after.png"
              aspectRatio="464 / 512"
            />
            <BeforeAfterSlider
              title="Localization"
              beforeSrc="/miui/localization-before.png"
              afterSrc="/miui/localization-after.png"
              aspectRatio="464 / 512"
            />
          </div>

          <div
            style={{
              marginTop: 'var(--vspace-lg)',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              letterSpacing: 'var(--tracking-wide)',
              color: 'rgba(26,26,26,0.45)',
            }}
          >
            MIUI Design System 2.0 · 2024 · View project →
          </div>
        </div>
      </section>

      {/* Section 3 — Foldable Screen Framework */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: 'var(--stage-light)',
          color: '#1a1a1a',
          padding: 'var(--vspace-xl) var(--hspace-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily:
            "'Switzer-Variable', 'Switzer', 'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 2200, width: '100%' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', marginBottom: 'var(--vspace-md)' }}>
            <Reveal
              mode="words"
              effect="blur"
              trigger="once"
              duration={1}
              stagger={0.06}
              initialBlur={6}
              start="top 75%"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-3xl)',
                lineHeight: 'var(--leading-tight)',
                fontWeight: 'var(--font-extrabold)',
                letterSpacing: 'var(--tracking-tightest)',
                textAlign: 'center',
              }}
            >
              It means &lsquo;just make it bigger&rsquo; is never the answer.
            </Reveal>
          </div>

          <FoldableCarousel>
            <ABVote
              labelA="Calendar unfolded — option A: scaled-up day list"
              labelB="Calendar unfolded — option B: week grid"
              foldSrc="/foldable/calender-fold.png"
              srcA="/foldable/calender-unfold-a.png"
              srcB="/foldable/calender-unfold-b.png"
              premise="The user was checking today's schedule on the folded screen. When it unfolds, what deserves the extra canvas?"
              percentA={27}
              takeaway="B's week grid surfaces cross-day conflicts without switching views. Just scaling the day list bigger doesn't add information — it only adds pixels."
            />
            <ABVote
              labelA="Home unfolded — option A: scaled icon grid"
              labelB="Home unfolded — option B: icons plus widget dashboard"
              foldSrc="/foldable/desktop-fold.png"
              srcA="/foldable/desktop-unfold-a.png"
              srcB="/foldable/desktop-unfold-b.png"
              premise="The user was glancing at the home screen. Unfolded: should the same icons just get bigger, or should the new space become something else?"
              percentA={58}
              takeaway="A preserves the mental model from folded mode — muscle memory still works. B adds a widget grid the user didn't ask for. Extra space doesn't mean extra content."
            />
            <ABVote
              labelA="Note unfolded — option A: single-column wider canvas"
              labelB="Note unfolded — option B: notes list plus editor"
              foldSrc="/foldable/note-fold.png"
              srcA="/foldable/note-unfold-a.png"
              srcB="/foldable/note-unfold-b.png"
              premise="The user was writing a single note. Unfolded: keep one column of uninterrupted space, or split into a list-plus-editor like iPadOS?"
              percentA={50}
              takeaway="Honestly depends on the task. Long-form writers want A — a bigger, quieter canvas. Note-browsers want B — see context while editing. I'd A/B test this one in production."
              open
            />
          </FoldableCarousel>

          <div
            style={{
              marginTop: 'var(--vspace-lg)',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              letterSpacing: 'var(--tracking-wide)',
              color: 'rgba(26,26,26,0.45)',
            }}
          >
            Foldable Screen Framework · 2022 · View project →
          </div>
        </div>
      </section>

      {/* Section 1 → 2 bridge */}
      <section className="fb-bridge" aria-hidden={false}>
        <Reveal
          mode="words"
          effect="blur"
          trigger="once"
          duration={1}
          stagger={0.04}
          initialBlur={4}
          start="top 70%"
          className="fb-bridge__copy"
        >
          At Xiaomi, I designed for scale. Then I joined a company where design was measured differently.
        </Reveal>
      </section>

      {/* Section 02.A — Opening */}
      <section id="section-business-opening" className="fb-section">
        <div className="fb-section__inner">
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
      </section>

      {/* Section 02.B — Three Design Tenets */}
      <section id="section-business-tenets" className="fb-section">
        <div className="fb-section__inner">
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
      </section>

      {/* Section 02.C — The Data Flip */}
      <section id="section-business-data-flip" className="fb-section">
        <div className="fb-section__inner">
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
      </section>

      {/* ── S2 → S3 bridge ── */}
      <section className="fb-bridge" aria-hidden={false}>
        <Reveal
          mode="words"
          effect="blur"
          trigger="once"
          duration={1}
          stagger={0.04}
          initialBlur={4}
          start="top 70%"
          className="fb-bridge__copy"
        >
          Experiments need one hypothesis. Teams need one direction.
        </Reveal>
      </section>

      {/* ── S3 eyebrow + 引出句（合并一个 ft-section，控制内部节奏）
           外层用 FadeOnExit 做"快到顶端时渐变消失"，对应入场的 blur 效果。 ── */}
      <section
        className="ft-section"
        style={{
          minHeight: 'unset',
          paddingTop: 'var(--vspace-xl)',
          paddingBottom: 0,
        }}
      >
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
              color: 'var(--eyebrow-color)',
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
      </section>

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

      {/* ── S3 第一层 → 第二层 过渡句 ── */}
      <section className="fb-bridge" aria-hidden={false}>
        <Reveal
          mode="words"
          effect="blur"
          trigger="once"
          duration={1}
          stagger={0.04}
          initialBlur={4}
          start="top 70%"
          className="fb-bridge__copy"
        >
          Building a team was one thing. Getting different departments to think together was another.
        </Reveal>
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
    </LenisProvider>
  );
}
