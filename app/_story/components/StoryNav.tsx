'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../_lab/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '../../_lab/ui/sheet';

import '../styles/StoryNav.css';

export type StoryNavSectionId =
  | 'opening'
  | 'millions'
  | 'business'
  | 'teams'
  | 'evidence'
  | 'curiosity';

export type StoryNavVariant = 'story' | 'compact';

interface StoryNavProps {
  variant?: StoryNavVariant;
}

const NAV_BUTTONS: { id: StoryNavSectionId; label: string }[] = [
  { id: 'millions', label: 'Millions' },
  { id: 'business', label: 'Business' },
  { id: 'teams', label: 'Teams' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'curiosity', label: 'Curiosity' },
];

// Tracked phases for theme switching. `opening` has no nav button per
// PRD §1.2 but is a valid theme state.
const ALL_PHASES: StoryNavSectionId[] = [
  'opening',
  'millions',
  'business',
  'teams',
  'evidence',
  'curiosity',
];

const UNREVEALED_GLYPH = '？？？';

export default function StoryNav({ variant = 'story' }: StoryNavProps) {
  const [active, setActive] = useState<StoryNavSectionId>('opening');
  const [revealed, setRevealed] = useState<Set<StoryNavSectionId>>(
    () => new Set<StoryNavSectionId>(['opening']),
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const markRevealed = useCallback((id: StoryNavSectionId) => {
    setRevealed((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Track active phase by scroll. Switch theme when previous phase's
  // bottom crosses 55% of viewport — matches PRD §2.3 (start: 'bottom 55%').
  useEffect(() => {
    if (variant !== 'story') return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const phases = ALL_PHASES.map((id) => ({
        id,
        el: document.querySelector(`[data-section="${id}"]`) as HTMLElement | null,
      })).filter((p): p is { id: StoryNavSectionId; el: HTMLElement } => !!p.el);

      if (phases.length === 0) return;

      const trigger = window.innerHeight * 0.55;
      let currentIdx = 0;
      for (let i = 0; i < phases.length - 1; i++) {
        if (phases[i].el.getBoundingClientRect().bottom <= trigger) {
          currentIdx = i + 1;
        }
      }
      const currentId = phases[currentIdx].id;
      setActive(currentId);
      markRevealed(currentId);
      document.body.dataset.theme = currentId;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [variant, markRevealed]);

  const handleSectionClick = useCallback(
    (id: StoryNavSectionId) => {
      markRevealed(id);
      setSheetOpen(false);
      const target = document.querySelector(`[data-section="${id}"]`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [markRevealed],
  );

  const Wordmark = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="story-nav__wordmark"
          aria-label="Site navigation"
        >
          <span className="story-nav__bullet" aria-hidden="true" />
          <span className="story-nav__wordmark-text">I DESIGN FOR</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="story-nav__dropdown">
        <DropdownMenuItem asChild>
          <Link href="/overview">Overview</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/projects">Projects</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (variant === 'compact') {
    return (
      <nav className="story-nav story-nav--compact" aria-label="Site navigation">
        {Wordmark}
      </nav>
    );
  }

  const activeBtn = NAV_BUTTONS.find((b) => b.id === active);
  const activeLabel = activeBtn?.label ?? null;

  return (
    <nav className="story-nav story-nav--story" aria-label="Story navigation">
      {/* Desktop layout */}
      <div className="story-nav__desktop">
        {Wordmark}
        <ul className="story-nav__sections">
          {NAV_BUTTONS.map((btn) => {
            const isRevealed = revealed.has(btn.id);
            const isActive = active === btn.id;
            const state = !isRevealed
              ? 'unrevealed'
              : isActive
                ? 'active'
                : 'inactive';
            return (
              <li key={btn.id} className="story-nav__section-item">
                <button
                  type="button"
                  className={`story-nav__flipper story-nav__flipper--${state}`}
                  onClick={() => handleSectionClick(btn.id)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={
                    isRevealed
                      ? `Jump to ${btn.label}`
                      : `Section ${btn.label}, not yet revealed`
                  }
                >
                  <span className="story-nav__flipper-inner" aria-hidden="true">
                    <span className="story-nav__flipper-front">
                      {UNREVEALED_GLYPH}
                    </span>
                    <span className="story-nav__flipper-back">{btn.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile single-line trigger + sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button type="button" className="story-nav__mobile-trigger">
            <span className="story-nav__bullet" aria-hidden="true" />
            <span className="story-nav__mobile-trigger-label">I DESIGN FOR</span>
            <span className="story-nav__mobile-trigger-section">
              {activeLabel ?? UNREVEALED_GLYPH}
            </span>
          </button>
        </SheetTrigger>
        <SheetContent side="top" className="story-nav__sheet">
          <SheetTitle>Story navigation</SheetTitle>
          <ul className="story-nav__sheet-sections">
            {NAV_BUTTONS.map((btn) => {
              const isRevealed = revealed.has(btn.id);
              const isActive = active === btn.id;
              return (
                <li key={btn.id}>
                  <button
                    type="button"
                    className={[
                      'story-nav__sheet-item',
                      isActive ? 'is-active' : '',
                      !isRevealed ? 'is-unrevealed' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleSectionClick(btn.id)}
                  >
                    {isRevealed ? btn.label : UNREVEALED_GLYPH}
                  </button>
                </li>
              );
            })}
          </ul>
          <hr className="story-nav__sheet-divider" />
          <ul className="story-nav__sheet-links">
            <li>
              <Link
                href="/overview"
                className="story-nav__sheet-link"
                onClick={() => setSheetOpen(false)}
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="story-nav__sheet-link"
                onClick={() => setSheetOpen(false)}
              >
                Projects
              </Link>
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
