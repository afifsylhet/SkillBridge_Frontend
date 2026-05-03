'use client';

import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  headline: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  headline,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink mb-2">{headline}</h3>
      {description && (
        <p className="text-ink-muted mb-6 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
