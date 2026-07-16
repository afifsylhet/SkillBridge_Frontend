'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-8 text-center shadow-card md:p-9">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Something went wrong</h1>
        <p className="mt-2 mb-7 text-sm leading-relaxed text-ink-muted">
          {error.message || 'Something went wrong while loading this page.'}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => reset()} variant="primary" className="flex-1">
            Try again
          </Button>
          <Link href={ROUTES.HOME} className="flex-1">
            <Button variant="secondary" className="w-full">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
