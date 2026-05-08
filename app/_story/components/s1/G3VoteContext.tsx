'use client';

/**
 * G3VoteContext — shared vote + active-scene state for G3.
 *
 * Lives at MillionsSection level so:
 *   - FoldablePile children update votes via setVote(sceneId, side)
 *   - MillionsSection's ScrollTriggers update which scene is active
 *   - CentralIsland reads { active, votes } to render the feedback line
 *     under "Xiaomi Foldable Screen View →"
 *
 * Voting is optional — null = skipped, never voted yet.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type SceneId = 'desktop' | 'calendar' | 'note';
export type VoteSide = 'A' | 'B';

export type SceneFeedback = {
  percentA: number;       // pre-set seed data
  takeawayWhenA: string;  // analysis if user picked A
  takeawayWhenB: string;  // analysis if user picked B
  open?: boolean;         // open discussion (Note) — show neutral takeaway
  takeawayOpen?: string;
};

export const G3_SCENES: Record<SceneId, SceneFeedback> = {
  desktop: {
    percentA: 58,
    takeawayWhenA:
      "A keeps the muscle memory from folded — same icons, just bigger. Most users picked it.",
    takeawayWhenB:
      "B turns the new canvas into a widget dashboard — extra space ≠ extra content the user asked for.",
  },
  calendar: {
    percentA: 27,
    takeawayWhenA:
      "A keeps it familiar, but a scaled-up day list doesn't add information — just pixels.",
    takeawayWhenB:
      "B's week grid surfaces cross-day conflicts without switching views. The unfolded canvas does new work.",
  },
  note: {
    percentA: 50,
    open: true,
    takeawayWhenA: "Long-form writers want a bigger, quieter canvas.",
    takeawayWhenB: "Note-browsers want to see context while editing.",
    takeawayOpen:
      "Honestly depends on the task — I'd A/B test this one in production.",
  },
};

type Ctx = {
  votes: Record<SceneId, VoteSide | null>;
  setVote: (scene: SceneId, side: VoteSide) => void;
  active: SceneId;
  setActive: (s: SceneId) => void;
};

const G3VoteContext = createContext<Ctx | null>(null);

export function G3VoteProvider({ children }: { children: ReactNode }) {
  const [votes, setVotes] = useState<Record<SceneId, VoteSide | null>>({
    desktop: null,
    calendar: null,
    note: null,
  });
  const [active, setActive] = useState<SceneId>('desktop');

  const setVote = (scene: SceneId, side: VoteSide) => {
    setVotes((prev) => (prev[scene] ? prev : { ...prev, [scene]: side }));
  };

  // Mirror the active scene + votes onto data attributes on the
  // central island feedback element so the (sticky-rendered) plain DOM
  // text can update without an extra React render path. Listening for
  // the imperative DOM mutation kept GSAP timelines from racing React.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const fb = document.querySelector<HTMLElement>('[data-island-feedback]');
    if (!fb) return;

    const scene = G3_SCENES[active];
    const vote = votes[active];

    if (!vote) {
      fb.classList.remove('is-shown');
      fb.textContent = '';
      return;
    }

    if (scene.open) {
      fb.textContent = `Split the room — ${scene.takeawayOpen}`;
    } else {
      const pct = vote === 'A' ? scene.percentA : 100 - scene.percentA;
      const takeaway =
        vote === 'A' ? scene.takeawayWhenA : scene.takeawayWhenB;
      fb.textContent = `${pct}% chose ${vote} · ${takeaway}`;
    }
    fb.classList.add('is-shown');
  }, [votes, active]);

  return (
    <G3VoteContext.Provider value={{ votes, setVote, active, setActive }}>
      {children}
    </G3VoteContext.Provider>
  );
}

export const useG3Vote = () => {
  const ctx = useContext(G3VoteContext);
  if (!ctx) throw new Error('useG3Vote outside G3VoteProvider');
  return ctx;
};
