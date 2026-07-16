'use client';

import Link from 'next/link';
import { useMyBookings } from '@/lib/hooks';
import { formatBookingTime } from '@/lib/utils/time';
import { ROUTES } from '@/lib/constants/routes';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import Button from '@/components/ui/Button';
import type { BookingWithRelations } from '@/types/booking';

function TutorAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  const initial = name?.[0]?.toUpperCase() ?? '?';
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 text-base font-semibold text-brand-700 ring-1 ring-surface-border">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}

function SessionCard({
  booking,
  badge,
}: {
  booking: BookingWithRelations;
  badge: 'pending' | 'confirmed';
}) {
  const price = (booking.tutorProfile.hourlyRate * booking.durationMin) / 60;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-surface-border bg-surface p-5 shadow-card transition hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-start gap-3.5">
        <TutorAvatar
          name={booking.tutorProfile.user.name}
          avatarUrl={booking.tutorProfile.user.avatarUrl}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={ROUTES.TUTOR_DETAIL(booking.tutorProfile.id)}
              className="truncate font-semibold text-ink transition hover:text-brand-600"
            >
              {booking.tutorProfile.user.name}
            </Link>
            <span
              className={
                badge === 'pending'
                  ? 'rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-medium text-warning'
                  : 'rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700'
              }
            >
              {badge === 'pending' ? 'Pending' : 'Confirmed'}
            </span>
          </div>
          {booking.tutorProfile.headline && (
            <p className="mt-0.5 truncate text-sm text-ink-muted">{booking.tutorProfile.headline}</p>
          )}
          <p className="mt-2 text-sm text-ink-soft">
            {formatBookingTime(booking.scheduledAt)}
            <span className="text-ink-muted"> · {booking.durationMin} min · ${price}</span>
          </p>
        </div>
      </div>
      <Link href={ROUTES.TUTOR_DETAIL(booking.tutorProfile.id)} className="sm:shrink-0">
        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
          View tutor
        </Button>
      </Link>
    </article>
  );
}

export default function MySessionsPage() {
  const { data, isLoading, error, refetch } = useMyBookings();

  if (isLoading) {
    return <PageLoader label="Loading your sessions…" />;
  }

  if (error) {
    return (
      <div>
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Schedule</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            My Sessions
          </h1>
        </header>
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
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

  const next = upcoming[0];
  const restUpcoming = upcoming.slice(1);

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Schedule</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            My Sessions
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Confirmed and pending tutoring sessions in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={ROUTES.DASHBOARD_BOOKINGS}>
            <Button variant="secondary" size="sm">
              All bookings
            </Button>
          </Link>
          <Link href={ROUTES.BROWSE_TUTORS}>
            <Button size="sm">Book a tutor</Button>
          </Link>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-surface-border bg-surface px-4 py-4 shadow-card">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Upcoming</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
            {upcoming.length}
          </p>
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface px-4 py-4 shadow-card">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Pending</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-tight text-warning">
            {pending.length}
          </p>
        </div>
        <div className="col-span-2 rounded-2xl border border-surface-border bg-surface px-4 py-4 shadow-card sm:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Next session</p>
          <p className="mt-1 truncate text-sm font-semibold text-ink">
            {next ? next.tutorProfile.user.name : 'None scheduled'}
          </p>
        </div>
      </div>

      {next && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Next up
          </h2>
          <div className="overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-surface shadow-card dark:border-brand-300/30 dark:from-brand-50">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex min-w-0 items-start gap-4">
                <TutorAvatar
                  name={next.tutorProfile.user.name}
                  avatarUrl={next.tutorProfile.user.avatarUrl}
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-brand-600">Confirmed session</p>
                  <Link
                    href={ROUTES.TUTOR_DETAIL(next.tutorProfile.id)}
                    className="mt-0.5 block truncate font-display text-xl font-bold tracking-tight text-ink transition hover:text-brand-600"
                  >
                    {next.tutorProfile.user.name}
                  </Link>
                  <p className="mt-2 text-sm text-ink-soft">{formatBookingTime(next.scheduledAt)}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {next.durationMin} min · $
                    {(next.tutorProfile.hourlyRate * next.durationMin) / 60}
                  </p>
                </div>
              </div>
              <Link href={ROUTES.TUTOR_DETAIL(next.tutorProfile.id)}>
                <Button className="w-full sm:w-auto">Open profile</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-ink">
            Awaiting confirmation
          </h2>
          <ul className="space-y-3">
            {pending.map((b) => (
              <li key={b.id}>
                <SessionCard booking={b} badge="pending" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-ink">
          {next ? 'Later this week' : 'Upcoming sessions'}
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState
            headline="No upcoming sessions"
            description="Browse tutors to schedule your next session."
            action={{
              label: 'Browse tutors',
              onClick: () => {
                window.location.href = ROUTES.BROWSE_TUTORS;
              },
            }}
          />
        ) : restUpcoming.length === 0 && next ? (
          <p className="rounded-2xl border border-dashed border-surface-border bg-surface px-5 py-8 text-center text-sm text-ink-muted">
            No other upcoming sessions. Your next one is highlighted above.
          </p>
        ) : (
          <ul className="space-y-3">
            {(next ? restUpcoming : upcoming).map((b) => (
              <li key={b.id}>
                <SessionCard booking={b} badge="confirmed" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Need past or cancelled history?{' '}
        <Link
          href={ROUTES.DASHBOARD_BOOKINGS}
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          View all bookings
        </Link>
      </p>
    </div>
  );
}
