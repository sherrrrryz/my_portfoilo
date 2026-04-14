'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortfolioScene from './components/PortfolioScene';
import MaskControls, { DEFAULT_CONFIG, type MaskConfig } from './components/MaskControls';

export default function FlashlightPage() {
  const [config, setConfig] = useState<MaskConfig>(DEFAULT_CONFIG);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* EXIT link */}
      <Link
        href="/"
        style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 200,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 24,
          letterSpacing: '0.05em',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')
        }
      >
        EXIT
      </Link>

      {/* Scene */}
      <PortfolioScene config={config} />

      {/* Controls */}
      <MaskControls config={config} onChange={setConfig} />
    </div>
  );
}
