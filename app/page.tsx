'use client';

import './_story/styles/flashlight.css';

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
        items={[{ label: 'Story', href: '/' }]}
        activeHref="/"
        baseColor="#ffffff"
        pillColor="#0a0a0a"
        hoveredPillTextColor="#0a0a0a"
        pillTextColor="#ffffff"
      />

      <button
        type="button"
        onClick={() => setMode((m) => (m === 'glow' ? 'flat' : 'glow'))}
        aria-label="Toggle flashlight style"
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 200,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 9999,
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(0,0,0,0.4)',
          color: 'rgba(255,255,255,0.85)',
          fontSize: 10,
          letterSpacing: '0.08em',
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
      </section>

      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: '#f5f1ea',
          color: '#1a1a1a',
          padding: '22vh 8vw',
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
              fontSize: 14,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(26,26,26,0.55)',
              marginBottom: 36,
              textAlign: 'center',
              fontWeight: 500,
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
            >
              What does it mean to design for 700 million people?
            </ScrollFloat>
          </div>

          <div
            id="section-millions-answer"
            data-snap-align="center"
            style={{ marginTop: '80vh' }}
          >
            <ScrollReveal
              baseOpacity={0.1}
              baseRotation={2}
              blurStrength={4}
            >
              It means making something personal — at a scale where nothing feels personal.
            </ScrollReveal>
          </div>

          <div style={{ marginTop: '14vh' }}>
            <LockscreenPile />
          </div>

          <div
            style={{
              marginTop: '18vh',
              textAlign: 'center',
              fontSize: 13,
              letterSpacing: '0.08em',
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
          background: '#f5f1ea',
          color: '#1a1a1a',
          padding: '22vh 8vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily:
            "'Switzer-Variable', 'Switzer', 'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 2200, width: '100%' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', marginBottom: '14vh' }}>
            <Reveal
              mode="words"
              effect="blur"
              trigger="once"
              duration={1}
              stagger={0.06}
              initialBlur={6}
              start="top 75%"
              style={{
                fontFamily:
                  "'Switzer-Variable', 'Switzer', 'Inter', system-ui, sans-serif",
                fontSize: 'clamp(2.75rem, 8vw, 8rem)',
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-0.02em',
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
              marginTop: '18vh',
              textAlign: 'center',
              fontSize: 13,
              letterSpacing: '0.08em',
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
          background: '#f5f1ea',
          color: '#1a1a1a',
          padding: '22vh 8vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily:
            "'Switzer-Variable', 'Switzer', 'Inter', system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 2200, width: '100%' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', marginBottom: '14vh' }}>
            <Reveal
              mode="words"
              effect="blur"
              trigger="once"
              duration={1}
              stagger={0.06}
              initialBlur={6}
              start="top 75%"
              style={{
                fontFamily:
                  "'Switzer-Variable', 'Switzer', 'Inter', system-ui, sans-serif",
                fontSize: 'clamp(2.75rem, 8vw, 8rem)',
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-0.02em',
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
              marginTop: '18vh',
              textAlign: 'center',
              fontSize: 13,
              letterSpacing: '0.08em',
              color: 'rgba(26,26,26,0.45)',
            }}
          >
            Foldable Screen Framework · 2022 · View project →
          </div>
        </div>
      </section>
    </div>
    </LenisProvider>
  );
}
