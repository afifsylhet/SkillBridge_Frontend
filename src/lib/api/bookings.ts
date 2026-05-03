import { apiCallOrThrow } from './client';
import type { BookingStatus, BookingWithRelations, CreateBookingInput } from '@/types/booking';

export async function getMyBookings(status?: BookingStatus): Promise<BookingWithRelations[]> {
  const qs = status ? `?status=${status}` : '';
  return apiCallOrThrow<BookingWithRelations[]>(`/bookings${qs}`, { method: 'GET' });
}

export async function createBooking(payload: CreateBookingInput): Promise<BookingWithRelations> {
  return apiCallOrThrow<BookingWithRelations>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getBookingById(id: string): Promise<BookingWithRelations> {
  return apiCallOrThrow<BookingWithRelations>(`/bookings/${id}`, { method: 'GET' });
}

export async function cancelBooking(id: string): Promise<BookingWithRelations> {
  return apiCallOrThrow<BookingWithRelations>(`/bookings/${id}/cancel`, { method: 'PATCH' });
}
