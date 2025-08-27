// app/components/ProjectInfo.tsx
'use client';

type Props = {
  overview: string;
  contributions: string[];
  team: string[];
  titles?: {
    overview?: string;
    contributions?: string;
    team?: string;
  };
};

export default function Project3Col({
  overview,
  contributions,
  team,
  titles = {
    overview: 'Overview',
    contributions: 'My Contributions',
    team: 'Team',
  },
}: Props) {
  return (
    <section className="w-full my-40">
      <div
        className={[
          // 手机端默认：1 列 → 三行
          'grid grid-cols-1 gap-y-8',
          // md 起：左 1fr（fill），右两列 max-content（hug）
          'md:[grid-template-columns:1fr_max-content_max-content] md:gap-x-16',
          // 排版
          'items-start',
        ].join(' ')}
      >
        {/* 左：fill */}
        <div>
          <div className="text-[var(--nav-fg)] text-base md:text-2xl font-bold uppercase tracking-wide">
            {titles.overview}
          </div>
          <div className="mt-6 text-[var(--nav-fg)]/90 leading-relaxed max-w-3xl">
            {overview}
          </div>
        </div>

        {/* 右：hug（自适应内容宽） */}
        <div className="w-auto md:max-w-sm">
          <div className="text-[var(--nav-fg)] text-base md:text-2xl font-bold uppercase tracking-wide">
            {titles.contributions}
          </div>
          <ul className="mt-6 space-y-2 text-[var(--nav-fg)]/90 leading-relaxed">
            {contributions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 右：hug（自适应内容宽） */}
        <div className="w-auto md:max-w-xs">
          <div className="text-[var(--nav-fg)] text-base md:text-2xl font-bold uppercase tracking-wide">
            {titles.team}
          </div>
          <ul className="mt-6 space-y-2 text-[var(--nav-fg)]/90 leading-relaxed">
            {team.map((member, i) => (
              <li key={i}>{member}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}