'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', ...props }, ref) => {
    const paddingStyles = {
      sm: 'p-4',
      md: 'p-5 md:p-6',
      lg: 'p-6 md:p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-surface-border bg-surface shadow-card transition-shadow',
          paddingStyles[padding],
          hover && 'cursor-pointer hover:shadow-card-hover',
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = 'Card';

export default Card;
