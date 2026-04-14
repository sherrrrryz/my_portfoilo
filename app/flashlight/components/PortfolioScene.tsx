'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { MaskConfig } from './MaskControls';
import PortfolioContent from './PortfolioContent';

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function lerpColor(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  t: number,
) {
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

export default function PortfolioScene({ config }: { config: MaskConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  // Store viewport-relative mouse position (no scroll offset)
  const mouseViewRef = useRef({ x: 0, y: 0 });
  const displayRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const textEls = useRef<Element[]>([]);
  const imageEls = useRef<Element[]>([]);
  const borderEls = useRef<Element[]>([]);
  const configRef = useRef(config);
  configRef.current = config;

  // Collect data-fl-* elements after mount
  useEffect(() => {
    const w = wrapperRef.current;
    if (!w) return;
    textEls.current = Array.from(w.querySelectorAll('[data-fl-text]'));
    imageEls.current = Array.from(w.querySelectorAll('[data-fl-image]'));
    borderEls.current = Array.from(w.querySelectorAll('[data-fl-border]'));
  }, []);

  // Reset ALL element styles when config changes
  useEffect(() => {
    for (const el of textEls.current) {
      (el as HTMLElement).style.color = config.textColor;
      (el as HTMLElement).style.textShadow = 'none';
    }
    for (const el of imageEls.current) {
      (el as HTMLElement).style.filter = 'brightness(0.08)';
      (el as HTMLElement).style.opacity = '0.3';
    }
    for (const el of borderEls.current) {
      (el as HTMLElement).style.borderColor = config.textColor;
      (el as HTMLElement).style.setProperty('--fl-border-color', config.textColor);
    }
  }, [config.textColor, config.bgColor]);

  const animate = useCallback(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const glow = glowRef.current;
    if (!container) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    // Compute target with current scrollTop each frame
    const scrollTop = container.scrollTop;
    const targetX = mouseViewRef.current.x;
    const targetY = mouseViewRef.current.y + scrollTop;

    // Lerp
    displayRef.current.x += (targetX - displayRef.current.x) * 0.35;
    displayRef.current.y += (targetY - displayRef.current.y) * 0.35;

    const x = displayRef.current.x;
    const y = displayRef.current.y;

    const cfg = configRef.current;
    const glowRgb = hexToRgb(cfg.glowColor);
    const textRgb = hexToRgb(cfg.textColor);

    // Lit text: blend from textColor toward glowColor-tinted bright
    const litR = Math.min(255, textRgb.r + Math.round((glowRgb.r - textRgb.r) * 0.6) + 140);
    const litG = Math.min(255, textRgb.g + Math.round((glowRgb.g - textRgb.g) * 0.6) + 120);
    const litB = Math.min(255, textRgb.b + Math.round((glowRgb.b - textRgb.b) * 0.6) + 80);

    // 3-zone mask: hotspot (fully bright) -> spill (semi-bright) -> edge (dark)
    const h = Math.min(cfg.hotspot, cfg.falloff);
    const f = Math.max(cfg.hotspot, cfg.falloff);
    const hotspotPx = cfg.radius * (h / 100);
    const falloffPx = cfg.radius * (f / 100);
    const spillDark = 1 - cfg.spillOpacity / 100; // 0 = fully transparent (bright), 1 = fully opaque (dark)

    // Update overlay mask
    if (overlay) {
      const grad = `radial-gradient(circle ${cfg.radius}px at ${x}px ${y}px, transparent ${hotspotPx}px, rgba(0,0,0,${spillDark}) ${falloffPx}px, black ${cfg.radius}px)`;
      overlay.style.maskImage = grad;
      overlay.style.webkitMaskImage = grad;
    }

    // Update glow
    if (glow) {
      const intensity = cfg.glowIntensity / 100;
      glow.style.background = `radial-gradient(circle ${cfg.glowRadius}px at ${x}px ${y}px, rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${intensity}), rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${intensity * 0.33}) 50%, transparent 100%)`;
      glow.style.mixBlendMode = 'screen';
    }

    // Viewport cull bounds
    const cRect = container.getBoundingClientRect();
    const viewTop = cRect.top - 200;
    const viewBottom = cRect.bottom + 200;
    const fadeZone = cfg.radius + 100;

    // Text illumination (no viewport cull - ensures config changes apply everywhere)
    for (let i = 0; i < textEls.current.length; i++) {
      const el = textEls.current[i] as HTMLElement;
      const r = el.getBoundingClientRect();
      // Skip distance calc for off-screen, just keep base color
      if (r.bottom < viewTop || r.top > viewBottom) {
        el.style.color = cfg.textColor;
        el.style.textShadow = 'none';
        continue;
      }

      const cx = r.left + r.width / 2 - cRect.left;
      const cy = r.top + r.height / 2 - cRect.top + scrollTop;
      const dist = Math.hypot(x - cx, y - cy);
      const t = Math.max(0, Math.min(1, 1 - dist / fadeZone));

      if (t > 0.01) {
        el.style.color = lerpColor(textRgb.r, textRgb.g, textRgb.b, litR, litG, litB, t);
        el.style.textShadow = `0 0 ${20 * t}px rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${t * 0.5}), 0 0 ${40 * t}px rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${t * 0.2})`;
      } else {
        el.style.color = cfg.textColor;
        el.style.textShadow = 'none';
      }
    }

    // Image illumination
    for (let i = 0; i < imageEls.current.length; i++) {
      const el = imageEls.current[i] as HTMLElement;
      const r = el.getBoundingClientRect();
      if (r.bottom < viewTop || r.top > viewBottom) {
        el.style.filter = 'brightness(0.08)';
        el.style.opacity = '0.3';
        continue;
      }

      const cx = r.left + r.width / 2 - cRect.left;
      const cy = r.top + r.height / 2 - cRect.top + scrollTop;
      const dist = Math.hypot(x - cx, y - cy);
      const t = Math.max(0, Math.min(1, 1 - dist / fadeZone));

      el.style.filter = `brightness(${0.08 + t * 1.12}) sepia(${t * 0.15})`;
      el.style.opacity = `${0.3 + t * 0.7}`;
    }

    // Border illumination
    for (let i = 0; i < borderEls.current.length; i++) {
      const el = borderEls.current[i] as HTMLElement;
      const r = el.getBoundingClientRect();
      if (r.bottom < viewTop || r.top > viewBottom) {
        el.style.borderColor = cfg.textColor;
        el.style.setProperty('--fl-border-color', cfg.textColor);
        continue;
      }

      const cx = r.left + r.width / 2 - cRect.left;
      const cy = r.top + r.height / 2 - cRect.top + scrollTop;
      const dist = Math.hypot(x - cx, y - cy);
      const t = Math.max(0, Math.min(1, 1 - dist / fadeZone));

      const borderColor = lerpColor(textRgb.r, textRgb.g, textRgb.b, litR, litG, litB, t);
      el.style.borderColor = borderColor;
      el.style.setProperty('--fl-border-color', borderColor);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseViewRef.current = { x: rect.width / 2, y: rect.height / 2 };
    displayRef.current = { x: rect.width / 2, y: rect.height / 2 };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseViewRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="flashlight-scene"
      style={{ background: config.bgColor }}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Content wrapper - sizes to natural content height */}
      <div ref={wrapperRef} style={{ position: 'relative', minHeight: '100%' }}>
        {/* Portfolio content */}
        <PortfolioContent config={config} />

        {/* Overlay with mask hole */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: config.bgColor,
            zIndex: 5,
            pointerEvents: 'none',
          }}
        />

        {/* Warm glow layer */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 6,
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
