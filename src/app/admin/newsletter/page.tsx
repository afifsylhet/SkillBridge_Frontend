'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import { adminListNewsletter } from '@/lib/api/blog';
import { formatDateTime } from '@/lib/utils/format';

export default function AdminNewsletterPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'newsletter', page],
    queryFn: () => adminListNewsletter(page),
  });

  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Newsletter subscribers
      </h1>
      <p className="mb-6 text-sm text-ink-muted">People who opted in from the marketing site.</p>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-card">
        {isLoading ? (
          <PageLoader label="Loading subscribers…" />
        ) : error ? (
          <div className="p-6 text-sm text-danger">{error.message}</div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState headline="No subscribers yet" description="Newsletter sign-ups will appear here." />
        ) : (
          <>
            <p className="border-b border-surface-border px-6 py-3 text-sm text-ink-muted">
              {data.total} subscriber{data.total === 1 ? '' : 's'} total
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-muted">
                  <tr>
                    <Th>Email</Th>
                    <Th>Subscribed</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                    >
                      <Td className="font-medium text-ink">{row.email}</Td>
                      <Td className="text-ink-muted">{formatDateTime(row.subscribedAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {data && data.totalPages > 1 && (
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

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 text-sm ${className ?? ''}`}>{children}</td>;
}
