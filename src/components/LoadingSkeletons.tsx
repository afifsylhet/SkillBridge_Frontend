import Skeleton from '@/components/ui/Skeleton';

/**
 * Page loading skeleton for dashboard overview page.
 */
export function DashboardPageSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton variant="text" className="w-32 h-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    </div>
  );
}

/**
 * Page loading skeleton for tutors browse page.
 */
export function TutorsBrowseSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton variant="text" className="w-32 h-10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    </div>
  );
}

/**
 * Page loading skeleton for tutor detail page.
 */
export function TutorDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton variant="card" className="h-48" />
        <Skeleton variant="card" className="h-32" />
        <Skeleton variant="card" className="h-32" />
      </div>
      <div className="lg:col-span-1">
        <Skeleton variant="card" />
      </div>
    </div>
  );
}
