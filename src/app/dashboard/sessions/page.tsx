'use client';

import Link from 'next/link';
import { useMyBookings } from '@/lib/hooks';
import { formatBookingTime } from '@/lib/utils/time';
import { ROUTES } from '@/lib/constants/routes';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';

export default function MySessionsPage() {
  const { data, isLoading, error, refetch } = useMyBookings();

  if (isLoading) {
    return <PageLoader label="Loading your sessions…" />;
  }

  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-3xl font-bold">My Sessions</h1>
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          Could not load your sessions: {error.message}
          <button type="button" onClick={() => refetch()} className="ml-3 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const sessions = data ?? [];
  const now = Date.now();
  const upcoming = sessions
    .filter((b) => b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() > now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const pending = sessions
    .filter((b) => b.status === 'PENDING')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">My Sessions</h1>
      <p className="mb-8 text-ink-muted">
        Your confirmed and pending tutoring sessions in one place.
      </p>

      {pending.length > 0 && (
        <section className="mb-6 rounded-xl bg-surface p-6 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-ink">Awaiting tutor confirmation</h2>
          <ul className="divide-y divide-surface-border">
            {pending.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{b.tutorProfile.user.name}</p>
                  <p className="text-ink-muted">
                    {formatBookingTime(b.scheduledAt)} · {b.durationMin} min
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  PENDING
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl bg-surface p-6 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Upcoming sessions</h2>
        {upcoming.length === 0 ? (
          <EmptyState
            headline="No upcoming sessions"
            description="Browse tutors to schedule your next session."
            action={{
              label: 'Browse tutors',
              onClick: () => (window.location.href = ROUTES.BROWSE_TUTORS),
            }}
          />
        ) : (
          <ul className="divide-y divide-surface-border">
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <Link
                    href={ROUTES.TUTOR_DETAIL(b.tutorProfile.id)}
                    className="font-medium text-ink hover:text-brand-700"
                  >
                    {b.tutorProfile.user.name}
                  </Link>
                  <p className="text-ink-muted">{formatBookingTime(b.scheduledAt)}</p>
                </div>
                <span className="text-xs text-ink-muted">{b.durationMin} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-4 text-xs text-ink-muted">
        Want past or cancelled sessions?{' '}
        <Link href={ROUTES.DASHBOARD_BOOKINGS} className="underline">
          See all bookings
        </Link>
        .
      </p>
    </div>
  );
}
