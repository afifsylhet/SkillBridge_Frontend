'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', ...props }, ref) => {
    const variantStyles = {
      text: 'h-4 rounded',
      card: 'h-48 rounded-xl',
      avatar: 'h-12 w-12 rounded-full',
      button: 'h-10 rounded-lg',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface-muted animate-pulse',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
