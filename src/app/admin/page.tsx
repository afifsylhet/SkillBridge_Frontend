'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/api/admin';
import PageLoader from '@/components/ui/PageLoader';

export default function AdminPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => getAdminStats(),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <PageLoader label="Loading admin dashboard…" />;
  }

  if (error || !data) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
          Could not load stats: {error?.message ?? 'Unknown error'}
        </div>
      </div>
    );
  }

  const pending = data.bookings.pending ?? 0;
  const totalBookings =
    pending + data.bookings.confirmed + data.bookings.completed + data.bookings.cancelled;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile label="Total Users" value={data.totals.users} />
        <Tile label="Tutors" value={data.totals.tutors} />
        <Tile label="Students" value={data.totals.students} />
        <Tile label="Bookings" value={totalBookings} accent="success" />
      </div>

      <section className="mb-8 rounded-xl bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold">Bookings by status</h2>
        <BookingsBar
          pending={pending}
          confirmed={data.bookings.confirmed}
          completed={data.bookings.completed}
          cancelled={data.bookings.cancelled}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-surface p-6 shadow-card">
          <h2 className="mb-3 text-lg font-semibold">Top Categories</h2>
          {data.topCategories.length === 0 ? (
            <p className="text-sm text-ink-muted">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {data.topCategories.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-ink">{c.name}</span>
                  <span className="text-ink-muted">{c.tutorCount} tutors</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl bg-surface p-6 shadow-card">
          <h2 className="mb-3 text-lg font-semibold">Revenue proxy</h2>
          <p className="text-3xl font-bold text-brand-600">
            ${data.revenueProxy.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Estimated total value of completed sessions (hours × hourly rate).
          </p>
        </section>
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  accent = 'brand',
}: {
  label: string;
  value: number;
  accent?: 'brand' | 'success';
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

function BookingsBar({
  pending,
  confirmed,
  completed,
  cancelled,
}: {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}) {
  const total = pending + confirmed + completed + cancelled;
  if (total === 0) {
    return <p className="text-sm text-ink-muted">No bookings yet.</p>;
  }
  const pct = (n: number) => Math.round((n / total) * 1000) / 10;
  return (
    <div>
      <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full bg-amber-400" style={{ width: `${pct(pending)}%` }} />
        <div className="h-full bg-brand-600" style={{ width: `${pct(confirmed)}%` }} />
        <div className="h-full bg-success" style={{ width: `${pct(completed)}%` }} />
        <div className="h-full bg-danger" style={{ width: `${pct(cancelled)}%` }} />
      </div>
      <ul className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
        <li>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-400" />
          Pending: {pending}
        </li>
        <li>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-600" />
          Confirmed: {confirmed}
        </li>
        <li>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
          Completed: {completed}
        </li>
        <li>
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-danger" />
          Cancelled: {cancelled}
        </li>
      </ul>
    </div>
  );
}
