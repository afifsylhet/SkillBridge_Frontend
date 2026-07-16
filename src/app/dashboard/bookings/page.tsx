'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCancelBooking, useMyBookings } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import { formatBookingTime } from '@/lib/utils/time';
import { ROUTES } from '@/lib/constants/routes';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import Button from '@/components/ui/Button';
import ReviewForm from '@/components/forms/ReviewForm';
import type { BookingStatus, BookingWithRelations } from '@/types/booking';

type Tab = 'upcoming' | 'pending' | 'past' | 'cancelled';

function statusStyles(status: BookingStatus) {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-brand-50 text-brand-700';
    case 'PENDING':
      return 'bg-warning/15 text-warning';
    case 'COMPLETED':
      return 'bg-success/15 text-success';
    case 'CANCELLED':
      return 'bg-danger/15 text-danger';
    default:
      return 'bg-surface-muted text-ink-muted';
  }
}

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

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [reviewing, setReviewing] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useMyBookings();
  const cancelMutation = useCancelBooking();
  const { showToast } = useToast();

  const bookings = data ?? [];
  const now = Date.now();

  const counts = {
    upcoming: bookings.filter(
      (b) => b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() > now,
    ).length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    past: bookings.filter(
      (b) =>
        b.status === 'COMPLETED' ||
        (b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() <= now),
    ).length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
  };

  const tabs = [
    { id: 'upcoming' as const, label: 'Upcoming', count: counts.upcoming },
    { id: 'pending' as const, label: 'Pending', count: counts.pending },
    { id: 'past' as const, label: 'Past', count: counts.past },
    { id: 'cancelled' as const, label: 'Cancelled', count: counts.cancelled },
  ];

  const filtered = bookings.filter((b) => {
    if (tab === 'upcoming') {
      return b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() > now;
    }
    if (tab === 'pending') return b.status === 'PENDING';
    if (tab === 'past') {
      return (
        b.status === 'COMPLETED' ||
        (b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() <= now)
      );
    }
    return b.status === 'CANCELLED';
  });

  const handleCancel = async (id: string) => {
    if (
      !confirm(
        'Cancel this booking? Cancellations must be at least 2 hours before the session.',
      )
    ) {
      return;
    }
    try {
      await cancelMutation.mutateAsync(id);
      showToast('Booking cancelled', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel booking';
      showToast(message, 'error');
    }
  };

  if (isLoading) {
    return <PageLoader label="Loading your bookings…" />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
        Could not load your bookings: {error.message}
        <button type="button" onClick={() => refetch()} className="ml-3 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">History</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            My Bookings
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Track upcoming, pending, past, and cancelled sessions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={ROUTES.DASHBOARD_SESSIONS}>
            <Button variant="secondary" size="sm">
              Sessions view
            </Button>
          </Link>
          <Link href={ROUTES.BROWSE_TUTORS}>
            <Button size="sm">Book a tutor</Button>
          </Link>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Booking filters"
        className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-surface-border bg-surface p-1.5 shadow-card sm:grid-cols-4"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`ml-1.5 inline-flex min-w-[1.25rem] justify-center rounded-md px-1 text-xs ${
                tab === t.id ? 'bg-white/20 text-white' : 'bg-surface-muted text-ink-muted'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          headline={
            tab === 'upcoming'
              ? "You haven't booked any sessions yet"
              : tab === 'pending'
                ? 'No pending requests'
                : tab === 'past'
                  ? 'No past sessions yet'
                  : 'No cancelled bookings'
          }
          description={
            tab === 'upcoming'
              ? 'Browse tutors to schedule your first session.'
              : tab === 'pending'
                ? 'Requests waiting for tutor confirmation will show here.'
                : undefined
          }
          action={
            tab === 'upcoming'
              ? {
                  label: 'Browse tutors',
                  onClick: () => {
                    window.location.href = ROUTES.BROWSE_TUTORS;
                  },
                }
              : undefined
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((b) => (
            <BookingItem
              key={b.id}
              booking={b}
              tab={tab}
              onCancel={() => handleCancel(b.id)}
              cancelling={cancelMutation.isPending}
              isReviewing={reviewing === b.id}
              onStartReview={() => setReviewing(b.id)}
              onCancelReview={() => setReviewing(null)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

interface BookingItemProps {
  booking: BookingWithRelations;
  tab: Tab;
  onCancel: () => void;
  cancelling: boolean;
  isReviewing: boolean;
  onStartReview: () => void;
  onCancelReview: () => void;
}

function BookingItem({
  booking,
  tab,
  onCancel,
  cancelling,
  isReviewing,
  onStartReview,
  onCancelReview,
}: BookingItemProps) {
  const scheduledMs = new Date(booking.scheduledAt).getTime();
  const cutoffOk = scheduledMs - Date.now() >= 2 * 60 * 60 * 1000;
  const isCancellable =
    booking.status === 'PENDING' ||
    (tab === 'upcoming' && booking.status === 'CONFIRMED' && cutoffOk);
  const canReview = booking.status === 'COMPLETED' && !booking.review;
  const price = (booking.tutorProfile.hourlyRate * booking.durationMin) / 60;

  return (
    <li className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-card">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <TutorAvatar
            name={booking.tutorProfile.user.name}
            avatarUrl={booking.tutorProfile.user.avatarUrl}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={ROUTES.TUTOR_DETAIL(booking.tutorProfile.id)}
                className="font-semibold text-ink transition hover:text-brand-600"
              >
                {booking.tutorProfile.user.name}
              </Link>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles(booking.status)}`}
              >
                {booking.status}
              </span>
            </div>
            {booking.tutorProfile.headline && (
              <p className="mt-0.5 truncate text-sm text-ink-muted">
                {booking.tutorProfile.headline}
              </p>
            )}

            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-surface-muted/80 px-3 py-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                  When
                </dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {formatBookingTime(booking.scheduledAt)}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-muted/80 px-3 py-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                  Duration
                </dt>
                <dd className="mt-0.5 font-medium text-ink">{booking.durationMin} min</dd>
              </div>
              <div className="rounded-xl bg-surface-muted/80 px-3 py-2">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                  Price
                </dt>
                <dd className="mt-0.5 font-medium text-brand-600">${price}</dd>
              </div>
            </dl>

            {booking.notes && (
              <p className="mt-3 text-sm italic leading-relaxed text-ink-muted">
                “{booking.notes}”
              </p>
            )}
            {booking.review && (
              <p className="mt-3 text-sm text-ink-soft">
                Your review:{' '}
                <span className="text-warning">{'★'.repeat(booking.review.rating)}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-stretch sm:min-w-[8.5rem]">
          <Link href={ROUTES.TUTOR_DETAIL(booking.tutorProfile.id)}>
            <Button variant="secondary" size="sm" className="w-full">
              View tutor
            </Button>
          </Link>
          {isCancellable && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={onCancel}
              disabled={cancelling}
              isLoading={cancelling}
            >
              Cancel
            </Button>
          )}
          {tab === 'upcoming' && booking.status === 'CONFIRMED' && !cutoffOk && (
            <p className="text-center text-xs text-ink-muted">Needs 2h notice to cancel</p>
          )}
          {canReview && !isReviewing && (
            <Button type="button" size="sm" className="w-full" onClick={onStartReview}>
              Leave review
            </Button>
          )}
        </div>
      </div>

      {isReviewing && (
        <div className="border-t border-surface-border bg-surface-muted/40 px-5 py-5 sm:px-6">
          <p className="mb-3 text-sm font-semibold text-ink">Leave a review</p>
          <ReviewForm
            bookingId={booking.id}
            onSuccess={onCancelReview}
            onCancel={onCancelReview}
          />
        </div>
      )}
    </li>
  );
}
