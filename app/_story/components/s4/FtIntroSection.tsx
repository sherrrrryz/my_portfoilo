'use client';

import type { ReactNode } from 'react';

/**
 * S3 (For Teams) intro wrapper. Now a passthrough — the previous
 * GSAP scrub that flipped bg from --stage-cream → --stage-light has
 * been removed. The new theme spec (PRD §2.4) drives bg via
 * body[data-theme="teams"] → .ft-section { background: var(--theme-surface-1) },
 * so any local bg override would just leak the old palette and create
 * a cream→white slab between business and teams. Section padding is
 * inherited from the unified .ft-section rule (22vh top/bottom).
 */
export default function FtIntroSection({ children }: { children: ReactNode }) {
  return <section className="ft-section">{children}</section>;
}
