'use client';

import { useQuery } from '@tanstack/react-query';
import { getTutorById, getTutors } from '@/lib/api/tutors';
import type { TutorListFilters } from '@/types/tutor';

export function useTutors(filters?: TutorListFilters) {
  return useQuery({
    queryKey: ['tutors', filters ?? {}],
    queryFn: () => getTutors(filters),
    staleTime: 60 * 1000,
  });
}

export function useTutor(tutorId: string) {
  return useQuery({
    queryKey: ['tutors', tutorId],
    queryFn: () => getTutorById(tutorId),
    enabled: !!tutorId,
    staleTime: 60 * 1000,
  });
}
