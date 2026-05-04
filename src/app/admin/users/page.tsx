'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/hooks/useToast';
import { useCurrentUser } from '@/lib/auth/client';
import { getAdminUsers, updateUserBanStatus } from '@/lib/api/admin';
import type { UserRole } from '@/types/user';
import PageLoader from '@/components/ui/PageLoader';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const { data: me } = useCurrentUser();

  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [bannedFilter, setBannedFilter] = useState<'' | 'true' | 'false'>('');
  const [page, setPage] = useState(1);

  const filters = {
    q: search || undefined,
    role: role || undefined,
    banned: bannedFilter === '' ? undefined : bannedFilter === 'true',
    page,
    pageSize: 20,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => getAdminUsers(filters),
  });

  const banMutation = useMutation({
    mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) =>
      updateUserBanStatus(id, isBanned),
    onSuccess: (_d, vars) => {
      showToast(vars.isBanned ? 'User banned' : 'User unbanned', 'success');
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (err: Error) => showToast(err.message || 'Failed to update user', 'error'),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Users</h1>

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-surface p-5 shadow-card md:grid-cols-3">
        <input
          type="search"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as UserRole | '');
            setPage(1);
          }}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="TUTOR">Tutor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={bannedFilter}
          onChange={(e) => {
            setBannedFilter(e.target.value as typeof bannedFilter);
            setPage(1);
          }}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">All statuses</option>
          <option value="false">Active</option>
          <option value="true">Banned</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        {isLoading ? (
          <PageLoader label="Loading users…" />
        ) : error ? (
          <div className="p-6 text-sm text-danger">Could not load users: {error.message}</div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            headline="No users available"
            description={
              search || role || bannedFilter
                ? 'Try clearing the filters to see more results.'
                : 'No users have signed up yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted">
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Tutor stats</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => {
                  const isSelf = me?.id === u.id;
                  const isAdmin = u.role === 'ADMIN';
                  const disabled = isSelf || isAdmin;
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                    >
                      <Td>
                        <span className="font-medium text-ink">{u.name}</span>
                      </Td>
                      <Td className="text-ink-muted">{u.email}</Td>
                      <Td>
                        <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
                          {u.role}
                        </span>
                      </Td>
                      <Td>
                        {u.tutorProfile ? (
                          <span>
                            {u.tutorProfile.ratingAvg.toFixed(1)} ★ ({u.tutorProfile.ratingCount})
                            {u.tutorProfile.isPublished ? '' : ' · hidden'}
                          </span>
                        ) : (
                          <span className="text-ink-muted">—</span>
                        )}
                      </Td>
                      <Td>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            u.isBanned ? 'bg-red-50 text-danger' : 'bg-green-50 text-success'
                          }`}
                        >
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          variant={u.isBanned ? 'primary' : 'destructive'}
                          onClick={() =>
                            banMutation.mutate({ id: u.id, isBanned: !u.isBanned })
                          }
                          isLoading={banMutation.isPending}
                          disabled={disabled || banMutation.isPending}
                          title={
                            isSelf
                              ? 'You cannot ban yourself'
                              : isAdmin
                                ? 'Admins cannot be banned'
                                : ''
                          }
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </Td>
                    </tr>
                  );
                })}
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

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 text-sm ${className ?? ''}`}>{children}</td>;
}
