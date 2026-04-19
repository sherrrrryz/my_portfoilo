'use client';

import { FollowerPointerCard } from '../../_lab/ui/following-pointer';

export type ComparisonOption = {
  label: string;
  /**
   * Wireframe image src (user will provide later). When absent, a neutral
   * placeholder box is rendered so the layout holds together.
   */
  wireframeSrc?: string;
};

type Props = {
  title: string;
  data: string;
  optionA: ComparisonOption;
  optionB: ComparisonOption;
  winner: 'A' | 'B';
  insight: string;
};

export default function ComparisonCard({
  title,
  data,
  optionA,
  optionB,
  winner,
  insight,
}: Props) {
  return (
    <FollowerPointerCard className="fb-card-group" title={insight}>
      <article className="fb-card">
        <header>
          <h3 className="fb-card__title">{title}</h3>
          <p className="fb-card__data">{data}</p>
        </header>

        <div className="fb-card__pair">
          <Mini option={optionA} isWinner={winner === 'A'} />
          <Mini option={optionB} isWinner={winner === 'B'} />
        </div>
      </article>
    </FollowerPointerCard>
  );
}

function Mini({
  option,
  isWinner,
}: {
  option: ComparisonOption;
  isWinner: boolean;
}) {
  return (
    <div className={`fb-mini${isWinner ? ' fb-mini--winner' : ''}`}>
      {isWinner && <span className="fb-mini__tag">WINNER</span>}
      <div className="fb-mini__label">{option.label}</div>
      <div className="fb-mini__wire" aria-hidden="true">
        {option.wireframeSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={option.wireframeSrc}
            alt=""
            draggable={false}
            className="fb-mini__wire-img"
          />
        ) : (
          <div className="fb-mini__wire-placeholder" />
        )}
      </div>
    </div>
  );
}
