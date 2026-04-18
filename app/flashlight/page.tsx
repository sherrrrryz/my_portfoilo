'use client';

import Link from 'next/link';
import { useState } from 'react';
import PortfolioScene, { type FlashlightMode } from './components/PortfolioScene';
import PillNav from './components/PillNav';
import ScrollFloat from './components/ScrollFloat';
import LenisProvider from './components/LenisProvider';
import { DEFAULT_CONFIG } from './components/MaskControls';

export default function FlashlightPage() {
  const [mode, setMode] = useState<FlashlightMode>('glow');

  return (
    <>
      <LenisProvider />
      <PillNav
        logo="/logo.png"
        logoAlt="Sherry"
        items={[
          { label: 'Story', href: '/flashlight' },
          { label: 'Overview', href: '/about' },
          { label: 'Projects', href: '/projects' },
        ]}
        activeHref="/flashlight"
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
          right: 100,
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

      <Link
        href="/"
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 200,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 10,
          letterSpacing: '0.05em',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
        }}
      >
        [EXIT]
      </Link>

      <section
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
        <div style={{ maxWidth: 1100, width: '100%' }}>
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
      </section>
    </>
  );
}
