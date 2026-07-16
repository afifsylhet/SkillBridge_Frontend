'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import { useToast } from '@/lib/hooks/useToast';
import { adminListContacts, adminUpdateContactStatus } from '@/lib/api/blog';
import { formatDateTime } from '@/lib/utils/format';

type ContactStatus = 'NEW' | 'READ' | 'ARCHIVED';

export default function AdminContactsPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [status, setStatus] = useState<ContactStatus | ''>('');
  const [page, setPage] = useState(1);

  const filters = { status: status || undefined, page };

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'contacts', filters],
    queryFn: () => adminListContacts(filters),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: ContactStatus }) =>
      adminUpdateContactStatus(id, next),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
    onError: (err: Error) => showToast(err.message || 'Failed to update status', 'error'),
  });

  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Contact submissions
      </h1>
      <p className="mb-6 text-sm text-ink-muted">Review and triage messages from the contact form.</p>

      <div className="mb-6 max-w-xs">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ContactStatus | '');
            setPage(1);
          }}
          className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-sm text-ink shadow-card"
        >
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="READ">Read</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-card">
        {isLoading ? (
          <PageLoader label="Loading contacts…" />
        ) : error ? (
          <div className="p-6 text-sm text-danger">{error.message}</div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState headline="No contact messages" description="Submissions will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted">
                <tr>
                  <Th>From</Th>
                  <Th>Subject</Th>
                  <Th>Message</Th>
                  <Th>Status</Th>
                  <Th>Received</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                  >
                    <Td>
                      <span className="font-medium text-ink">{item.name}</span>
                      <p className="text-xs text-ink-muted">{item.email}</p>
                    </Td>
                    <Td className="max-w-[160px] truncate text-ink">{item.subject}</Td>
                    <Td className="max-w-[240px]">
                      <p className="line-clamp-2 text-ink-muted">{item.body}</p>
                    </Td>
                    <Td>
                      <StatusBadge status={item.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-ink-muted">
                      {formatDateTime(item.createdAt)}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        {item.status !== 'READ' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              statusMutation.mutate({ id: item.id, next: 'READ' })
                            }
                            isLoading={statusMutation.isPending}
                          >
                            Mark read
                          </Button>
                        )}
                        {item.status !== 'ARCHIVED' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              statusMutation.mutate({ id: item.id, next: 'ARCHIVED' })
                            }
                            isLoading={statusMutation.isPending}
                          >
                            Archive
                          </Button>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === 'NEW'
      ? 'bg-brand-50 text-brand-700'
      : status === 'READ'
        ? 'bg-green-50 text-success'
        : 'bg-surface-muted text-ink-muted';
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles}`}>{status}</span>
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
