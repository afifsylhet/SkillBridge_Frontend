'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminBookings } from '@/lib/api/admin';
import type { BookingStatus } from '@/types/booking';
import { formatBookingTime } from '@/lib/utils/time';
import PageLoader from '@/components/ui/PageLoader';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminBookingsPage() {
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'bookings', { status, page }],
    queryFn: () => getAdminBookings({ status: status || undefined, page, pageSize: 20 }),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Bookings
      </h1>
      <p className="mb-6 text-sm text-ink-muted">Platform-wide session requests and history.</p>

      <div className="mb-6 rounded-2xl border border-surface-border bg-surface p-4 shadow-card md:p-5">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as BookingStatus | '');
            setPage(1);
          }}
          className="w-full max-w-xs rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-sm text-ink"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-card">
        {isLoading ? (
          <PageLoader label="Loading bookings…" />
        ) : error ? (
          <div className="p-6 text-sm text-danger">Could not load bookings: {error.message}</div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            headline="No bookings available"
            description={
              status
                ? 'No bookings match this status. Try selecting another.'
                : 'When students book sessions with tutors, they will appear here.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted">
                <tr>
                  <Th>Student</Th>
                  <Th>Tutor</Th>
                  <Th>Scheduled</Th>
                  <Th>Duration</Th>
                  <Th>Value</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                  >
                    <Td>
                      <p className="font-medium text-ink">{b.student.name}</p>
                      <p className="text-xs text-ink-muted">{b.student.email}</p>
                    </Td>
                    <Td>
                      <p className="font-medium text-ink">{b.tutorProfile.user.name}</p>
                      <p className="text-xs text-ink-muted">{b.tutorProfile.user.email}</p>
                    </Td>
                    <Td>{formatBookingTime(b.scheduledAt)}</Td>
                    <Td>{b.durationMin} min</Td>
                    <Td>${(b.tutorProfile.hourlyRate * b.durationMin) / 60}</Td>
                    <Td>
                      <StatusPill status={b.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.total > data.pageSize && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-ink-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 text-sm text-ink">{children}</td>;
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles =
    status === 'CONFIRMED'
      ? 'bg-brand-50 text-brand-700'
      : status === 'PENDING'
        ? 'bg-amber-50 text-amber-700'
        : status === 'COMPLETED'
          ? 'bg-green-50 text-success'
          : 'bg-red-50 text-danger';
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles}`}>{status}</span>
  );
}
