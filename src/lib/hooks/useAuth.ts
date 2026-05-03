'use client';

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import {
  login,
  register,
  logout,
  type LoginPayload,
  type RegisterPayload,
} from '@/lib/api/auth';
import type { User } from '@/types/user';

export function useLogin(): UseMutationResult<User, Error, LoginPayload> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useRegister(): UseMutationResult<User, Error, RegisterPayload> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout(): UseMutationResult<void, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      qc.setQueryData(['auth', 'me'], null);
      qc.invalidateQueries();
    },
  });
}
