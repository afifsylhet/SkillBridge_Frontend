import Spinner from '@/components/ui/Spinner';
import Skeleton from '@/components/ui/Skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * Centered spinner for route transitions and Suspense fallbacks.
 */
export function RouteSpinnerSkeleton({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20"
    >
      <Spinner size="lg" className="h-12 w-12" />
      <p className="text-sm font-medium text-ink-muted">{label}</p>
    </div>
  );
}

/** Public pages: keep Navbar/Footer visible while the route loads. */
export function PublicPageLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <RouteSpinnerSkeleton label={label} />
      </main>
      <Footer />
    </div>
  );
}

/** Compact spinner for streaming home sections that fetch from the DB. */
export function SectionSpinner({
  className = 'section-y',
  labelClassName = 'text-ink-muted',
}: {
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-[12rem] flex-col items-center justify-center gap-3 ${className}`}
    >
      <Spinner size="md" />
      <p className={`text-sm ${labelClassName}`}>Loading…</p>
    </div>
  );
}

/**
 * App-shell spinner used by dashboard / tutor / admin loading.tsx files.
 */
export function DashboardPageSkeleton() {
  return <RouteSpinnerSkeleton label="Loading…" />;
}

/**
 * Page loading skeleton for tutors browse page.
 */
export function TutorsBrowseSkeleton() {
  return (
    <div>
      <div className="mb-8 md:mb-10">
        <Skeleton variant="text" className="h-9 w-56" />
        <Skeleton variant="text" className="mt-3 h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[17.5rem_1fr] lg:gap-8">
        <Skeleton variant="card" className="h-80" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="card" className="h-64" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Page loading skeleton for tutor detail page.
 */
export function TutorDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
      <div className="space-y-5 md:space-y-6">
        <Skeleton variant="card" className="h-40" />
        <Skeleton variant="card" className="h-36" />
        <Skeleton variant="card" className="h-52" />
        <Skeleton variant="card" className="h-48" />
      </div>
      <Skeleton variant="card" className="h-56" />
    </div>
  );
}
