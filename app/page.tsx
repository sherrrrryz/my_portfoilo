'use client';

import './_story/styles/flashlight.css';

import Link from 'next/link';
import { useState } from 'react';
import PortfolioScene, { type FlashlightMode } from './_story/components/PortfolioScene';
import PillNav from './_story/components/PillNav';
import ScrollFloat from './_story/components/ScrollFloat';
import ScrollReveal from './_story/components/ScrollReveal';
import LockscreenPile from './_story/components/LockscreenPile';
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
    </div>
    </LenisProvider>
  );
}
