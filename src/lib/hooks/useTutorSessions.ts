'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeTutorSession,
  confirmTutorSession,
  declineTutorSession,
  getTutorSessions,
} from '@/lib/api/tutors';

export function useTutorSessions() {
  return useQuery({
    queryKey: ['tutor-sessions'],
    queryFn: () => getTutorSessions(),
    staleTime: 60 * 1000,
  });
}

function invalidateSessions(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['tutor-sessions'] });
  // The student's bookings list mirrors the same data — keep it fresh too.
  qc.invalidateQueries({ queryKey: ['bookings'] });
}

export function useCompleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeTutorSession(id),
    onSuccess: () => invalidateSessions(qc),
  });
}

export function useConfirmSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmTutorSession(id),
    onSuccess: () => invalidateSessions(qc),
  });
}

export function useDeclineSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => declineTutorSession(id),
    onSuccess: () => invalidateSessions(qc),
  });
}
