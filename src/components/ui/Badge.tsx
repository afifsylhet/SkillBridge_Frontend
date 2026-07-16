'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-brand-50 text-brand-700 dark:bg-brand-100 dark:text-brand-500',
      success: 'bg-accent-soft text-accent',
      warning: 'bg-amber-50 text-warning dark:bg-amber-950/40 dark:text-warning',
      danger: 'bg-red-50 text-danger dark:bg-red-950/40',
      neutral: 'bg-surface-muted text-ink-soft',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium tracking-wide',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
