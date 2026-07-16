'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { signalNavigationStart } from '@/lib/navigation';

/**
 * Drop-in useRouter that starts the global navigation progress on push/replace.
 */
export function useAppRouter() {
  const router = useRouter();

  const push = useCallback(
    (...args: Parameters<typeof router.push>) => {
      signalNavigationStart();
      return router.push(...args);
    },
    [router],
  );

  const replace = useCallback(
    (...args: Parameters<typeof router.replace>) => {
      signalNavigationStart();
      return router.replace(...args);
    },
    [router],
  );

  return useMemo(
    () => ({
      push,
      replace,
      back: () => router.back(),
      forward: () => router.forward(),
      refresh: () => router.refresh(),
      prefetch: (...args: Parameters<typeof router.prefetch>) => router.prefetch(...args),
    }),
    [router, push, replace],
  );
}
