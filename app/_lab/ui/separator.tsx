import * as React from 'react';
import { cn } from '../utils';

/* Separator: reserved for cases where a surface shift isn't enough.
   Hairline gray — intentionally quiet. */

export function Separator({
  orientation = 'horizontal',
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-[var(--border-hairline)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  );
}
