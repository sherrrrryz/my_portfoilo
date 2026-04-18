import * as React from 'react';
import { cn } from '../utils';

/* Input: surface-based (no full border). The subtle fill against paper
   does the delimiting. Focus ring replaces the idle border. */

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-[var(--radius-md)] bg-[var(--surface-1)] px-[var(--space-3)] py-1 text-[15px] text-[var(--ink-primary)] transition-colors placeholder:text-[var(--ink-faint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink-primary)] focus-visible:bg-[var(--stage-light)] disabled:cursor-not-allowed disabled:opacity-40',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--ink-muted)] font-[family-name:var(--font-mono)]',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';
