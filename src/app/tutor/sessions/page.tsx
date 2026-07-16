'use client';

import { useMemo } from 'react';
import { useToast } from '@/lib/hooks/useToast';
import {
  useCompleteSession,
  useConfirmSession,
  useDeclineSession,
  useTutorSessions,
} from '@/lib/hooks/useTutorSessions';
import { formatBookingTime } from '@/lib/utils/time';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';

export default function TutorSessionsPage() {
  const { data, isLoading, error, refetch } = useTutorSessions();
  const confirmMutation = useConfirmSession();
  const declineMutation = useDeclineSession();
  const completeMutation = useCompleteSession();
  const { showToast } = useToast();

  const sessions = useMemo(() => data ?? [], [data]);
  const now = Date.now();

  const pending = sessions
    .filter((s) => s.status === 'PENDING')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const upcoming = sessions
    .filter((s) => s.status === 'CONFIRMED' && new Date(s.scheduledAt).getTime() > now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const awaitingCompletion = sessions.filter((s) => {
    if (s.status !== 'CONFIRMED') return false;
    return new Date(s.scheduledAt).getTime() + s.durationMin * 60_000 <= now;
  });

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

  const handleComplete = async (id: string) => {
    try {
      await completeMutation.mutateAsync(id);
      showToast('Session marked complete', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete';
      showToast(message, 'error');
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        My Sessions
      </h1>
      <p className="mb-8 text-sm text-ink-muted">
        Manage incoming session requests and your schedule.
      </p>

      {pending.length > 0 && (
        <section className="mb-5 rounded-2xl border border-surface-border bg-surface p-5 shadow-card md:p-6">
          <h2 className="mb-1 font-display text-lg font-semibold tracking-tight text-ink">
            Pending requests
          </h2>
          <p className="mb-4 text-sm text-ink-muted">
            Review and confirm or decline requests from students.
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
                  {s.notes && (
                    <p className="mt-1 italic text-ink-muted">“{s.notes}”</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirm(s.id)}
                    disabled={confirmMutation.isPending}
                    className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecline(s.id)}
                    disabled={declineMutation.isPending}
                    className="rounded-xl border border-danger/40 px-4 py-2 text-sm font-medium text-danger transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {awaitingCompletion.length > 0 && (
        <section className="mb-5 rounded-2xl border border-surface-border bg-surface p-5 shadow-card md:p-6">
          <h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-ink">
            Awaiting completion
          </h2>
          <ul className="divide-y divide-surface-border">
            {awaitingCompletion.map((s) => (
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
                  className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
                >
                  Mark complete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-surface-border bg-surface p-5 shadow-card md:p-6">
        <h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-ink">
          Upcoming sessions
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState
            headline="No upcoming sessions"
            description="Once you confirm requests, they will appear here."
          />
        ) : (
          <ul className="divide-y divide-surface-border">
            {upcoming.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3 text-sm">
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
