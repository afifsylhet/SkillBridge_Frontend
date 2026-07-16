'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { SimpleBarChart, SimplePieChart } from '@/components/charts/DashboardCharts';
import { useMyBookings } from '@/lib/hooks';
import { getStudentAnalytics } from '@/lib/api/stats';
import { ROUTES } from '@/lib/constants/routes';
import { formatBookingTime } from '@/lib/utils/time';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';

export default function DashboardPage() {
  const { data, isLoading, error } = useMyBookings();
  const { data: analytics } = useQuery({
    queryKey: ['analytics', 'student'],
    queryFn: getStudentAnalytics,
    staleTime: 60_000,
  });

  if (isLoading) {
    return <PageLoader label="Loading your dashboard…" />;
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          Could not load your bookings: {error.message}
        </div>
      </div>
    );
  }

  const bookings = data ?? [];
  const now = Date.now();
  const upcoming = bookings.filter(
    (b) => b.status === 'CONFIRMED' && new Date(b.scheduledAt).getTime() > now,
  );
  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED');
  const totalHours = completed.reduce((sum, b) => sum + b.durationMin / 60, 0);
  const next = upcoming
    .slice()
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
  const recent = bookings.slice(0, 5);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard label="Upcoming Sessions" value={upcoming.length} accent="brand" />
        <StatCard label="Completed Sessions" value={completed.length} accent="success" />
        <StatCard label="Hours Learned" value={Math.round(totalHours * 10) / 10} accent="brand" />
      </div>

      {analytics && (
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SimpleBarChart
            title="Sessions by month"
            data={analytics.byMonth.map((m) => ({ month: m.month, count: m.count }))}
            xKey="month"
            yKey="count"
          />
          <SimplePieChart
            title="Bookings by status"
            data={Object.entries(analytics.byStatus).map(([name, value]) => ({ name, value }))}
          />
        </div>
      )}

      {next && (
        <div className="mb-6 rounded-xl bg-surface p-6 shadow-card">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
            Next session
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">{next.tutorProfile.user.name}</p>
              <p className="text-sm text-ink-muted">{formatBookingTime(next.scheduledAt)}</p>
            </div>
            <Link
              href={ROUTES.DASHBOARD_BOOKINGS}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Manage bookings →
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-ink">Recent activity</h2>
        {recent.length === 0 ? (
          <EmptyState
            headline="You haven't booked any sessions yet"
            description="Browse tutors to schedule your first session."
            action={{ label: 'Browse tutors', onClick: () => (window.location.href = ROUTES.BROWSE_TUTORS) }}
          />
        ) : (
          <ul className="divide-y divide-surface-border">
            {recent.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{b.tutorProfile.user.name}</p>
                  <p className="text-ink-muted">{formatBookingTime(b.scheduledAt)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    b.status === 'CONFIRMED'
                      ? 'bg-brand-50 text-brand-700'
                      : b.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700'
                        : b.status === 'COMPLETED'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-danger'
                  }`}
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {cancelled.length > 0 && (
        <p className="mt-4 text-xs text-ink-muted">
          {cancelled.length} cancelled session{cancelled.length === 1 ? '' : 's'} in your history.
        </p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
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
