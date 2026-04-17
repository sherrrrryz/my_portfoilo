import Link from 'next/link';
import PortfolioScene from './components/PortfolioScene';
import { DEFAULT_CONFIG } from './components/MaskControls';

export default function FlashlightPage() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Link
        href="/"
        className="fl-exit"
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

      <PortfolioScene config={DEFAULT_CONFIG} />
    </div>
  );
}
