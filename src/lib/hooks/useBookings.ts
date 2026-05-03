'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelBooking,
  createBooking,
  getMyBookings,
} from '@/lib/api/bookings';
import type { BookingStatus, CreateBookingInput } from '@/types/booking';

export function useMyBookings(status?: BookingStatus) {
  return useQuery({
    queryKey: ['bookings', { status: status ?? null }],
    queryFn: () => getMyBookings(status),
    staleTime: 60 * 1000,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingInput) => createBooking(payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['tutors', vars.tutorProfileId] });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
