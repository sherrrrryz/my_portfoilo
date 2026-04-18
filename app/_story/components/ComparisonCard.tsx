'use client';

type Props = {
  expected: string;
  actual: string;
  loserLabel: string;
  winnerLabel: string;
};

export default function ComparisonCard({
  expected,
  actual,
  loserLabel,
  winnerLabel,
}: Props) {
  return (
    <article className="fb-card">
      <p className="fb-card__expected">{expected}</p>
      <p className="fb-card__actual">{actual}</p>
      <div className="fb-card__pair">
        <div className="fb-card__box fb-card__box--loser">{loserLabel}</div>
        <div className="fb-card__box fb-card__box--winner">
          <span className="fb-card__winner-tag">WINNER</span>
          {winnerLabel}
        </div>
      </div>
    </article>
  );
}
