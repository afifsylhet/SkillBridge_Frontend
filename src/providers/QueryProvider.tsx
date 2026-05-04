'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { useToast } from '@/lib/hooks/useToast';

function extractMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Something went wrong. Please try again.';
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
        // Global error surfacing: any query or mutation that fails will show a
        // toast unless the call site opts out via meta.suppressErrorToast.
        queryCache: new QueryCache({
          onError: (err, query) => {
            if (query.meta?.suppressErrorToast) return;
            showToast(extractMessage(err), 'error');
          },
        }),
        mutationCache: new MutationCache({
          onError: (err, _vars, _ctx, mutation) => {
            if (mutation.options.onError) return;
            if (mutation.meta?.suppressErrorToast) return;
            showToast(extractMessage(err), 'error');
          },
        }),
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
