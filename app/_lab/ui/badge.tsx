import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

/* Badge: monochrome by default. Color variants are opt-in and rare. */

const badgeVariants = cva(
  'inline-flex items-center font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.12em] uppercase px-[var(--space-2)] py-[4px] rounded-[var(--radius-sm)]',
  {
    variants: {
      variant: {
        // Default: fill, not outline. Surface-2 is the "gray chip" look.
        default:
          'text-[var(--ink-muted)] bg-[var(--surface-2)]',
        // Ink: inverted black slab. High-contrast label.
        ink:
          'text-[var(--stage-light)] bg-[var(--ink-primary)]',
        // Accent: rare, for primary signal.
        accent:
          'text-[var(--stage-light)] bg-[var(--accent)]',
        // Highlight: rare, for terracotta marker signals.
        highlight:
          'text-[var(--highlight-ink)] bg-[var(--highlight-pale)]',
        // Outline: the ONLY outlined variant; use when a fill would clash.
        outline:
          'text-[var(--ink-muted)] bg-transparent border border-[var(--border-hairline)]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
