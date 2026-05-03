'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCurrentUser } from '@/lib/api/auth';
import type { CurrentUser } from '@/types/user';

export function useCurrentUser(): UseQueryResult<CurrentUser | null, Error> {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => getCurrentUser(),
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}
