import * as React from 'react';
import { cn } from '../utils';

/* Card: surface-based, no border by default. Differentiation comes from
   the surface-1 fill against surface-0 (paper) outside. */

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-[var(--radius-lg)] bg-[var(--surface-1)] text-[var(--ink-primary)]',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-2 px-[var(--space-5)] pt-[var(--space-5)] pb-[var(--space-3)]', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-[22px] font-bold leading-tight tracking-[-0.01em]',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-[14px] text-[var(--ink-muted)]', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-[var(--space-5)] pt-[var(--space-3)] pb-[var(--space-4)]', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

/* CardFooter: no border-t anymore — uses padding-bottom rhythm. */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3 px-[var(--space-5)] pb-[var(--space-5)]',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
