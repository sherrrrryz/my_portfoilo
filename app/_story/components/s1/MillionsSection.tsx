'use client';

/**
 * MillionsSection — S1 top-level orchestrator.
 *
 * Owns ALL ScrollTriggers for S1:
 *   1. §4.2 — question entrance (one-shot fade-in + slide-up)
 *   2. §4.2 — Q→A pin + scrub timeline (scale-only shrink, word-by-word
 *             crossfade, subtitle/link fade-in)
 *   3. G1 — outer column parallax (inner is 1:1, outer scrubs 0.667)
 *   4. G1→G2 island swap (word-by-word crossfade + G1-rail fade out + G2-rail fade in)
 *   5. G2 — single column scrub (1:1)
 *   6. G2→G3 island swap (word-by-word crossfade + position shift to top + G3 scenes appear)
 *   7. G3 — per-scene active tracking (sets G3VoteContext.active so the
 *           island feedback updates correctly) + pile scale choreography
 *
 * Theme: data-section="millions" on outer <section> keeps page-level theme
 * ScrollTrigger working unchanged.
 *
 * Mobile (< 768px): timelines stubbed via gsap.matchMedia; the responsive
 * CSS fallback in for-millions.css handles the layout.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import OpeningPin from './OpeningPin';
import CentralIsland from './CentralIsland';
import LockscreenRiver from './LockscreenRiver';
import BeforeAfterColumns from './BeforeAfterColumns';
import FoldablePile from './FoldablePile';
import { G3VoteProvider, useG3Vote, type SceneId } from './G3VoteContext';

gsap.registerPlugin(ScrollTrigger);

export default function MillionsSection() {
  return (
    <G3VoteProvider>
      <MillionsSectionInner />
    </G3VoteProvider>
  );
}

function MillionsSectionInner() {
  const rootRef = useRef<HTMLElement>(null);
  const { setActive } = useG3Vote();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = rootRef.current;
    if (!root) return;

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;
    let refreshTimer: number | undefined;

    const setup = () => {
      mm = gsap.matchMedia(undefined, root);

      // === Desktop / normal motion ============================================
      mm.add(
        '(min-width: 769px) and (prefers-reduced-motion: no-preference)',
        () => {
          // ----- Initial state setup (pre-tween) ----------------------------
          // Q is visible by default (CSS opacity 1).
          // The island carrier stays visible throughout S1 (CSS default
          // opacity 1) — what we hide/reveal is the CONTENT inside.
          // G1 is the active variant; its words/sub/link start invisible
          // and fade in via pin scrub. G2/G3 variants start fully hidden.
          gsap.set('[data-island-variant="g1"] .fm-word', { opacity: 0 });
          gsap.set('[data-island-variant="g1"] .fm-island__sub', { opacity: 0 });
          gsap.set('[data-island-variant="g1"] .fm-island__link', { opacity: 0 });
          gsap.set('[data-island-variant="g2"]', { opacity: 0, filter: 'blur(12px)' });
          gsap.set('[data-island-variant="g3"]', { opacity: 0, filter: 'blur(12px)' });

          // 1. ===== §4.2 Question entrance (one-shot) ======================
          gsap.fromTo(
            '.fm-q-text',
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.fm-q-text',
                start: 'top 85%',
                once: true,
              },
            }
          );

          // 2. ===== §4.2 Q→A pin + scrub ===================================
          // Pin the question stage. Scrub timeline shrinks Q, then fades
          // the central island (the SOLE answer) in via word stagger so the
          // user reads the answer arriving in the spot the question vacates.
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: '.fm-opening__pin',
                start: 'top top',
                end: '+=130%',
                scrub: 1,
                pin: true,
                anticipatePin: 1,
              },
            })
            // 0.00–0.30: Q scales 1 → 0.5 — lands the Q on island font size
            // (Q is 2× island via clamp() in CSS, so 0.5 is exact).
            .fromTo(
              '.fm-q-text',
              { scale: 1 },
              { scale: 0.5, duration: 0.30 },
              0
            )
            // 0.42–0.62: Q words fade out word-by-word
            .to(
              '.fm-opening__layer--q .fm-word',
              { opacity: 0, duration: 0.20, stagger: 0.014 },
              0.42
            )
            // 0.50: snap island carrier to opacity 1 (so its words can fade
            // in on their own). Stays visible from here through G1/G2/G3.
            .to('.fm-island', { opacity: 1, duration: 0.02 }, 0.50)
            // 0.55–0.78: G1 island words fade in word-by-word (overlapping
            // the Q fade-out — same screen point, "answer arrives in Q's spot")
            .to(
              '[data-island-variant="g1"] .fm-word',
              { opacity: 1, duration: 0.23, stagger: 0.016 },
              0.55
            )
            // 0.80–0.90: subtitle fades in
            .to(
              '[data-island-variant="g1"] .fm-island__sub',
              { opacity: 1, duration: 0.10 },
              0.80
            )
            // 0.90–1.00: project link fades in
            .to(
              '[data-island-variant="g1"] .fm-island__link',
              { opacity: 1, duration: 0.10 },
              0.90
            );

          // 3. ===== G1 outer column parallax ===============================
          // Inner cols move 1:1 with scroll (no animation). Outer cols add
          // +50vh translateY across the G1 scroll, slowing them to 0.667
          // of inner.
          gsap.to('.fm-g1 .fm-ls-col--outer', {
            y: '50vh',
            ease: 'none',
            scrollTrigger: {
              trigger: '.fm-g1',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });

          // 4. ===== G1 → G2 island swap (text-only blur morph in 70vh gap) =
          // Whole sentence blurs + fades to invisible, brief blank beat,
          // new sentence un-blurs in. Anchored to a tighter window inside
          // the gap so G1 island stays visible through most of the
          // lockscreen river, then morphs once G1 images are leaving and
          // G2 imagery is entering — total swap range ~110vh.
          ScrollTrigger.create({
            trigger: '.fm-group-gap--g1g2',
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
            animation: gsap
              .timeline({ defaults: { ease: 'none' } })
              .fromTo(
                '[data-island-variant="g1"]',
                { opacity: 1, filter: 'blur(0px)' },
                { opacity: 0, filter: 'blur(12px)', duration: 0.45 },
                0
              )
              .fromTo(
                '[data-island-variant="g2"]',
                { opacity: 0, filter: 'blur(12px)' },
                { opacity: 1, filter: 'blur(0px)', duration: 0.45 },
                0.55
              ),
          });

          // 5. ===== G2 → G3 island swap (blur morph in 70vh gap) + position
          // shift. Same blur shape as block 4. The is-g3 class toggle moves
          // the island from screen-center to top, separate from blur.
          ScrollTrigger.create({
            trigger: '.fm-group-gap--g2g3',
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
            onEnter: () => {
              document
                .querySelector('[data-island]')
                ?.classList.add('is-g3');
              setActive('desktop');
            },
            onLeaveBack: () => {
              document
                .querySelector('[data-island]')
                ?.classList.remove('is-g3');
            },
            animation: gsap
              .timeline({ defaults: { ease: 'none' } })
              // Use `to` (not fromTo) for g2 so we don't pre-apply a "from"
              // state at setup. Block 4 also touches g2 with a fromTo that
              // immediateRenders (scrub forces it), and a fromTo here would
              // override that initial hidden state. `to` records the current
              // state as the from when this tween actually starts playing,
              // which by then is the post-block-4 visible state.
              .to(
                '[data-island-variant="g2"]',
                { opacity: 0, filter: 'blur(12px)', duration: 0.45 },
                0
              )
              .fromTo(
                '[data-island-variant="g3"]',
                { opacity: 0, filter: 'blur(12px)' },
                { opacity: 1, filter: 'blur(0px)', duration: 0.45 },
                0.55
              ),
          });

          // 6. ===== G3 pile scale choreography =============================
          // 3 scenes piled. As user scrolls G3:
          //   0–33%:  scene 0 (desktop) at scale 1, scenes 1+2 hidden below
          //   33%:    scene 1 (calendar) enters; scene 0 → 0.92
          //   66%:    scene 2 (note) enters; scene 1 → 0.92, scene 0 → 0.85
          // Per the plan: only scale, no Y offset — top edge naturally peeks
          // out from behind the new scene.
          const sceneEls = root.querySelectorAll<HTMLElement>('.fm-g3-scene');

          // Initial state: scene 0 visible, scenes 1+2 hidden + below
          if (sceneEls.length >= 3) {
            gsap.set(sceneEls[0], { opacity: 1, scale: 1 });
            gsap.set(sceneEls[1], { opacity: 0, scale: 1, yPercent: 100 });
            gsap.set(sceneEls[2], { opacity: 0, scale: 1, yPercent: 100 });

            gsap
              .timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                  trigger: '.fm-g3',
                  start: 'top top',
                  end: 'bottom bottom',
                  scrub: 1,
                },
              })
              // 0.00–0.33 — scene 0 alone
              // 0.33–0.50 — scene 1 enters (slide up + fade in), scene 0 shrinks to 0.92
              .to(
                sceneEls[1],
                { opacity: 1, yPercent: 0, duration: 0.17 },
                0.33
              )
              .to(sceneEls[0], { scale: 0.92, duration: 0.17 }, 0.33)
              // 0.66–0.83 — scene 2 enters; scene 1 → 0.92; scene 0 → 0.85
              .to(
                sceneEls[2],
                { opacity: 1, yPercent: 0, duration: 0.17 },
                0.66
              )
              .to(sceneEls[1], { scale: 0.92, duration: 0.17 }, 0.66)
              .to(sceneEls[0], { scale: 0.85, duration: 0.17 }, 0.66);
          }

          // 7. ===== G3 active scene tracking ===============================
          // Three sub-triggers within the 450vh G3 region — one per third.
          // Pure setActive callbacks; no animation here.
          const scenesOrder: SceneId[] = ['desktop', 'calendar', 'note'];
          scenesOrder.forEach((scene, i) => {
            ScrollTrigger.create({
              trigger: '.fm-g3',
              start: `${(i / 3) * 100}% top`,
              end: `${((i + 1) / 3) * 100}% top`,
              onEnter: () => setActive(scene),
              onEnterBack: () => setActive(scene),
            });
          });

          // 8. ===== Island fade-out at end of S1 ===========================
          // The fixed island would otherwise overlay S2 Business at viewport
          // center. Fade it out as G3 ends; restore on scroll-back.
          ScrollTrigger.create({
            trigger: '.fm-g3',
            start: 'bottom 60%',
            end: 'bottom 30%',
            scrub: 1,
            animation: gsap.to('.fm-island', {
              opacity: 0,
              ease: 'none',
            }),
          });
        }
      );

      // === Mobile / reduced-motion fallback ====================================
      // Just make sure A is visible on small screens (no pin scrub there).
      mm.add('(max-width: 768px)', () => {
        gsap.set('.fm-a-text, .fm-a-text .fm-word, .fm-a-sub, .fm-a-link', {
          opacity: 1,
        });
        gsap.set(
          '[data-island-variant="g1"], [data-island-variant="g2"], [data-island-variant="g3"]',
          { opacity: 1 }
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.fm-a-text, .fm-a-text .fm-word, .fm-a-sub, .fm-a-link', {
          opacity: 1,
        });
        gsap.set(
          '[data-island-variant="g1"], [data-island-variant="g2"], [data-island-variant="g3"]',
          { opacity: 1 }
        );
      });

      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setup);
    } else {
      setup();
    }

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      mm?.revert();
    };
  }, [setActive]);

  return (
    <section ref={rootRef} data-section="millions" className="fm-section">
      <OpeningPin />
      <div className="fm-body">
        <CentralIsland />
        <LockscreenRiver />
        <div className="fm-group-gap fm-group-gap--g1g2" aria-hidden="true" />
        <BeforeAfterColumns />
        <div className="fm-group-gap fm-group-gap--g2g3" aria-hidden="true" />
        <FoldablePile />
      </div>
    </section>
  );
}
