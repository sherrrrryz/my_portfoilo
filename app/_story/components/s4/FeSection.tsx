'use client';

import type { ReactNode } from 'react';

/**
 * Section 4 wrapper. Now a passthrough — the previous internal
 * --fe-bg / --fe-ink GSAP scrub (stage-light → stage-dark) has been
 * removed: section bg is driven by body[data-theme] flipping at section
 * boundaries (PRD §2.3), and the new theme spec (§2.4) calls for
 * evidence = warm cream, not the old light→dark crossfade.
 */
export default function FeSection({ children }: { children: ReactNode }) {
  return <section className="fe-section">{children}</section>;
}
