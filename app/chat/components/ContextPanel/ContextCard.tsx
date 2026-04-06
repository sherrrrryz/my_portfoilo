'use client';

import { useState } from 'react';

interface ContextImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ContextCardData {
  id: string;
  title: string;
  link?: {
    text: string;
    url: string;
  };
  tags: string[];
  images: ContextImage[];
}

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 4,
        backgroundColor: '#111111',
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          display: 'block',
          borderRadius: 4,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      />
    </div>
  );
}

export default function ContextCard({ card }: { card: ContextCardData }) {
  return (
    <div>
      <h2
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 400,
          fontSize: 18,
          color: '#e8e4df',
          letterSpacing: '0.03em',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        {card.title}
      </h2>

      {card.link && (
        <a
          href={card.link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 10,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 300,
            fontSize: 13,
            color: '#8ab4f8',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          {card.link.text} →
        </a>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginTop: 16,
        }}
      >
        {card.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 300,
              fontSize: 11,
              color: '#808080',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 3,
              padding: '3px 10px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 24,
        }}
      >
        {card.images.map((img) => (
          <LazyImage key={img.src} src={img.src} alt={img.alt} />
        ))}
      </div>
    </div>
  );
}
