'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import EphemeralChat from './components/EphemeralChat';
import ContextPanel from './components/ContextPanel';

export default function ChatPage() {
  const [contextId, setContextId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const autoExpandedRef = useRef(false);

  // Auto-expand panel when first contextId arrives
  useEffect(() => {
    if (contextId && !autoExpandedRef.current) {
      setHasContent(true);
      setPanelOpen(true);
      autoExpandedRef.current = true;
    }
  }, [contextId]);

  return (
    <div
      className={panelOpen ? 'chat-layout panel-open' : 'chat-layout panel-closed'}
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Global controls - top right of viewport */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 32,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 12,
        }}
      >
        <Link
          href="/"
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 24,
            letterSpacing: '0.05em',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          EXIT
        </Link>
        {hasContent && (
          <button
            onClick={() => setPanelOpen((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: panelOpen ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
              fontSize: 13,
              letterSpacing: '0.05em',
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 300,
              padding: 0,
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = panelOpen
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(255,255,255,0.3)')
            }
          >
            PANEL
          </button>
        )}
      </div>

      <div className="chat-area">
        <EphemeralChat onContextChange={setContextId} />
      </div>
      <div className="panel-area">
        <ContextPanel contextId={contextId} />
      </div>
    </div>
  );
}
