'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        // Default = ink block. Monochrome is the baseline. Big solid fill.
        default:
          'bg-[var(--ink-primary)] text-[var(--stage-light)] hover:bg-[var(--neutral-800)] focus-visible:ring-[var(--ink-primary)]',
        // Secondary = surface fill. Also monochrome. Softer CTA.
        secondary:
          'bg-[var(--surface-2)] text-[var(--ink-primary)] hover:bg-[var(--neutral-300)] focus-visible:ring-[var(--ink-primary)]',
        // Ghost = no bg until hover. Minimal.
        ghost:
          'bg-transparent text-[var(--ink-primary)] hover:bg-[var(--surface-2)] focus-visible:ring-[var(--ink-primary)]',
        // Link = pure text, no chrome.
        link:
          'bg-transparent text-[var(--ink-primary)] underline underline-offset-4 decoration-[var(--ink-faint)] hover:decoration-[var(--ink-primary)] p-0 h-auto',
        // Accent = green. Opt-in. Use for the ONE primary CTA per beat.
        accent:
          'bg-[var(--accent)] text-[var(--stage-light)] hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--accent)]',
        // Destructive = red. Error / delete states only.
        destructive:
          'bg-[var(--destructive)] text-white hover:opacity-90 focus-visible:ring-[var(--destructive)]',
      },
      size: {
        sm: 'h-9 px-4 text-[13px] rounded-[var(--radius-md)]',
        md: 'h-11 px-5 text-[14px] rounded-[var(--radius-md)]',
        lg: 'h-14 px-7 text-[15px] rounded-[var(--radius-lg)]',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';
