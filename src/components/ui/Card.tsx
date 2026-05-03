'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-surface border border-surface-border rounded-xl p-6 transition-shadow',
        hover && 'hover:shadow-card-hover shadow-card cursor-pointer',
        !hover && 'shadow-card',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export default Card;
