import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-8 text-center shadow-card md:p-9">
        <p className="font-display text-6xl font-bold tracking-tight text-brand-600">404</p>
        <h1 className="mt-3 font-display text-xl font-semibold text-ink">Page not found</h1>
        <p className="mt-2 mb-7 text-sm leading-relaxed text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href={ROUTES.HOME}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
