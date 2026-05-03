'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { completeTutorSession, getTutorSessions } from '@/lib/api/tutors';

export function useTutorSessions() {
  return useQuery({
    queryKey: ['tutor-sessions'],
    queryFn: () => getTutorSessions(),
    staleTime: 60 * 1000,
  });
}

export function useCompleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeTutorSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tutor-sessions'] });
    },
  });
}
