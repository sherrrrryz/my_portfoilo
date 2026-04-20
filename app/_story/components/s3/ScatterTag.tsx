import type { ReactNode } from 'react';

export type ScatterTagColor =
  | 'rose'
  | 'amber'
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'peach';

type Props = {
  text: string;
  color?: ScatterTagColor;
  children?: ReactNode;
};

export default function ScatterTag({ text, color, children }: Props) {
  const cls = `ft-scatter-tag${color ? ` ft-scatter-tag--${color}` : ''}`;
  return <div className={cls}>{children ?? text}</div>;
}

type EmojiBadgeProps = { emoji: string };

export function EmojiBadge({ emoji }: EmojiBadgeProps) {
  return (
    <div className="ft-emoji-badge" aria-hidden="true">
      {emoji}
    </div>
  );
}
