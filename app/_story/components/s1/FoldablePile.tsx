'use client';

/**
 * FoldablePile — G3 3-column foldable scenes that pile (markup only).
 *
 * Layout per scene: Unfold-A (350px ref) | Fold (167px ref) | Unfold-B (350px)
 * with pill labels above each column.
 *
 * Pile behavior: 3 scenes are absolutely stacked at the same anchor inside
 * .fm-g3__scenes. Initially scene 1 (desktop) shows; as user scrolls G3,
 * MillionsSection.tsx scrubs scale (1 → 0.92 → 0.85) on prior scenes and
 * fades in / scales-up the next scene.
 *
 * Voting: hover the Unfold cards → FollowerPointerCard shows "Vote A" /
 * "Vote B" + lift-3px shadow (same recipe as Business section's .fb-card).
 * Click commits a vote; the central island feedback line updates via
 * G3VoteContext. Fold middle column is reference only (no hover, no vote).
 *
 * Voting is OPTIONAL — user can scroll past unvoted; next scene piles in
 * regardless.
 */

import { FollowerPointerCard } from '../../../_lab/ui/following-pointer';
import { useG3Vote, type SceneId, type VoteSide } from './G3VoteContext';

type SceneSpec = {
  id: SceneId;
  unfoldA: string;
  fold: string;
  unfoldB: string;
  alt: string;
};

const SCENES: SceneSpec[] = [
  {
    id: 'desktop',
    unfoldA: '/foldable/desktop-unfold-a.png',
    fold: '/foldable/desktop-fold.png',
    unfoldB: '/foldable/desktop-unfold-b.png',
    alt: 'Foldable home screen',
  },
  {
    id: 'calendar',
    unfoldA: '/foldable/calender-unfold-a.png',
    fold: '/foldable/calender-fold.png',
    unfoldB: '/foldable/calender-unfold-b.png',
    alt: 'Foldable calendar',
  },
  {
    id: 'note',
    unfoldA: '/foldable/note-unfold-a.png',
    fold: '/foldable/note-fold.png',
    unfoldB: '/foldable/note-unfold-b.png',
    alt: 'Foldable notes',
  },
];

export default function FoldablePile() {
  return (
    <div className="fm-g3" data-fm-g3>
      <div className="fm-g3__stage">
        <div className="fm-g3__scenes">
          {SCENES.map((scene, i) => (
            <Scene key={scene.id} scene={scene} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene({ scene, index }: { scene: SceneSpec; index: number }) {
  const { votes, setVote } = useG3Vote();
  const voted = votes[scene.id];

  return (
    <div
      className="fm-g3-scene"
      data-fm-g3-scene={scene.id}
      data-fm-g3-scene-i={index}
    >
      <div className="fm-g3-scene__labels">
        <div className="fm-g3-pill">Unfold - A</div>
        <div className="fm-g3-pill">Fold</div>
        <div className="fm-g3-pill">Unfold - B</div>
      </div>

      <div className="fm-g3-scene__row">
        <VoteCard
          side="A"
          src={scene.unfoldA}
          alt={`${scene.alt} — option A`}
          voted={voted}
          onVote={() => setVote(scene.id, 'A')}
        />
        <FoldCard src={scene.fold} alt={`${scene.alt} — folded reference`} />
        <VoteCard
          side="B"
          src={scene.unfoldB}
          alt={`${scene.alt} — option B`}
          voted={voted}
          onVote={() => setVote(scene.id, 'B')}
        />
      </div>
    </div>
  );
}

function FoldCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="fm-g3-card fm-g3-card--fold" aria-label={alt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
    </div>
  );
}

function VoteCard({
  side,
  src,
  alt,
  voted,
  onVote,
}: {
  side: VoteSide;
  src: string;
  alt: string;
  voted: VoteSide | null;
  onVote: () => void;
}) {
  const isVoted = voted === side;
  const isLocked = voted !== null && !isVoted;

  return (
    <FollowerPointerCard className="fm-g3-vote-wrap" title={`Vote ${side}`}>
      <button
        type="button"
        className={`fm-g3-card fm-g3-card--votable${
          isVoted ? ' fm-g3-card--voted' : ''
        }`}
        onClick={onVote}
        aria-label={alt}
        aria-pressed={isVoted}
        disabled={voted !== null}
        style={{
          opacity: isLocked ? 0.55 : 1,
          padding: 0,
          border: 'none',
          fontFamily: 'inherit',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
      </button>
    </FollowerPointerCard>
  );
}
