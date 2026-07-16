'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { SimpleBarChart, SimpleLineChart } from '@/components/charts/DashboardCharts';
import { getTutorAnalytics } from '@/lib/api/stats';
import { useToast } from '@/lib/hooks/useToast';
import {
  useCompleteSession,
  useConfirmSession,
  useDeclineSession,
  useTutorSessions,
} from '@/lib/hooks/useTutorSessions';
import { formatBookingTime } from '@/lib/utils/time';
import { ROUTES } from '@/lib/constants/routes';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';

export default function TutorDashboardPage() {
  const { data, isLoading, error, refetch } = useTutorSessions();
  const { data: analytics } = useQuery({
    queryKey: ['analytics', 'tutor'],
    queryFn: getTutorAnalytics,
    staleTime: 60_000,
  });
  const completeMutation = useCompleteSession();
  const confirmMutation = useConfirmSession();
  const declineMutation = useDeclineSession();
  const { showToast } = useToast();

  if (isLoading) {
    return <PageLoader label="Loading your sessions…" />;
  }

  if (error) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Tutor Dashboard</h1>
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

  const pending = sessions
    .filter((s) => s.status === 'PENDING')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const upcoming = sessions.filter(
    (s) => s.status === 'CONFIRMED' && new Date(s.scheduledAt).getTime() > now,
  );
  const completed = sessions.filter((s) => s.status === 'COMPLETED');
  const pendingCompletion = sessions.filter((s) => {
    if (s.status !== 'CONFIRMED') return false;
    return new Date(s.scheduledAt).getTime() + s.durationMin * 60_000 <= now;
  });
  const ratings = completed
    .map((s) => s.review?.rating)
    .filter((r): r is number => typeof r === 'number');
  const avgRating =
    ratings.length === 0
      ? null
      : ratings.reduce((a, b) => a + b, 0) / ratings.length;

  const handleComplete = async (id: string) => {
    try {
      await completeMutation.mutateAsync(id);
      showToast('Session marked complete', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete';
      showToast(message, 'error');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirmMutation.mutateAsync(id);
      showToast('Session confirmed', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm';
      showToast(message, 'error');
    }
  };

  const handleDecline = async (id: string) => {
    if (!confirm('Decline this session request?')) return;
    try {
      await declineMutation.mutateAsync(id);
      showToast('Session declined', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to decline';
      showToast(message, 'error');
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Tutor Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard label="Pending Requests" value={pending.length} accent="brand" />
        <StatCard label="Upcoming Sessions" value={upcoming.length} accent="brand" />
        <StatCard label="Completed Sessions" value={completed.length} accent="success" />
        <StatCard
          label="Average Rating"
          value={avgRating ? avgRating.toFixed(1) : '—'}
          accent="brand"
        />
      </div>

      {analytics && (
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SimpleBarChart
            title="Sessions by month"
            data={analytics.byMonth.map((m) => ({ month: m.month, sessions: m.sessions }))}
            xKey="month"
            yKey="sessions"
          />
          <SimpleLineChart
            title="Earnings by month"
            data={analytics.byMonth.map((m) => ({ month: m.month, earnings: m.earnings }))}
            xKey="month"
            yKey="earnings"
          />
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-6 rounded-xl bg-surface p-6 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Pending requests</h2>
            <Link
              href={ROUTES.TUTOR_SESSIONS}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Manage all →
            </Link>
          </div>
          <p className="mb-4 text-sm text-ink-muted">
            Confirm or decline session requests from students.
          </p>
          <ul className="divide-y divide-surface-border">
            {pending.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{s.student.name}</p>
                  <p className="text-ink-muted">
                    {formatBookingTime(s.scheduledAt)} · {s.durationMin} min
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirm(s.id)}
                    disabled={confirmMutation.isPending}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecline(s.id)}
                    disabled={declineMutation.isPending}
                    className="rounded-lg border border-danger px-4 py-2 text-sm font-medium text-danger hover:bg-red-50 disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pendingCompletion.length > 0 && (
        <section className="mb-6 rounded-xl bg-surface p-6 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-ink">Awaiting completion</h2>
          <p className="mb-4 text-sm text-ink-muted">
            These sessions ended already. Mark them complete so the student can leave a review.
          </p>
          <ul className="divide-y divide-surface-border">
            {pendingCompletion.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-ink">{s.student.name}</p>
                  <p className="text-ink-muted">
                    {formatBookingTime(s.scheduledAt)} · {s.durationMin} min
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleComplete(s.id)}
                  disabled={completeMutation.isPending}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  {completeMutation.isPending ? 'Saving…' : 'Mark complete'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl bg-surface p-6 shadow-card">
        <h2 className="mb-3 text-lg font-semibold text-ink">Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <EmptyState
            headline="No upcoming sessions"
            description="Once students book with you, sessions will appear here."
          />
        ) : (
          <ul className="divide-y divide-surface-border">
            {upcoming.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-ink">{s.student.name}</p>
                  <p className="text-ink-muted">{formatBookingTime(s.scheduledAt)}</p>
                </div>
                <span className="text-xs text-ink-muted">{s.durationMin} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: 'brand' | 'success';
}) {
  return (
    <div className="rounded-xl bg-surface p-6 shadow-card">
      <p className="text-sm text-ink-muted">{label}</p>
      <p
        className={`text-3xl font-bold ${accent === 'success' ? 'text-success' : 'text-brand-600'}`}
      >
        {value}
      </p>
    </div>
  );
}
