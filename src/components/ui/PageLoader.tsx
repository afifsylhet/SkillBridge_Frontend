'use client';

import Spinner from './Spinner';
import { cn } from '@/lib/utils/cn';

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export default function PageLoader({ label = 'Loading…', className }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-24 min-h-[60vh]',
        className,
      )}
    >
      <Spinner size="lg" className="h-16 w-16" />
      {label && <p className="text-sm font-medium text-ink-muted">{label}</p>}
    </div>
  );
}
