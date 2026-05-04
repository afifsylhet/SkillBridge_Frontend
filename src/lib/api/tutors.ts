import { apiCallOrThrow } from './client';
import type {
  AvailabilitySlot,
  TutorDetail,
  TutorListFilters,
  TutorListItem,
  TutorListResponse,
} from '@/types/tutor';
import type { BookingWithRelations } from '@/types/booking';

export type TutorProfileUpdate = {
  bio: string;
  headline?: string;
  hourlyRate: number;
  experience: number;
  categoryIds: string[];
  isPublished: boolean;
};

export async function getTutors(filters?: TutorListFilters): Promise<TutorListResponse> {
  const params = new URLSearchParams();
  if (filters?.q) params.append('q', filters.q);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
  if (filters?.minRating !== undefined) params.append('minRating', String(filters.minRating));
  if (filters?.sort) params.append('sort', filters.sort);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));

  const qs = params.toString();
  return apiCallOrThrow<TutorListResponse>(`/tutors${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function getTutorById(id: string): Promise<TutorDetail> {
  return apiCallOrThrow<TutorDetail>(`/tutors/${id}`, { method: 'GET' });
}

export async function updateTutorProfile(payload: TutorProfileUpdate) {
  return apiCallOrThrow('/tutor/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getMyAvailability(): Promise<AvailabilitySlot[]> {
  return apiCallOrThrow<AvailabilitySlot[]>('/tutor/availability', { method: 'GET' });
}

export async function updateTutorAvailability(slots: AvailabilitySlot[]) {
  return apiCallOrThrow<AvailabilitySlot[]>('/tutor/availability', {
    method: 'PUT',
    body: JSON.stringify({ slots }),
  });
}

export async function getTutorSessions(): Promise<BookingWithRelations[]> {
  return apiCallOrThrow<BookingWithRelations[]>('/tutor/sessions', { method: 'GET' });
}

export async function completeTutorSession(bookingId: string): Promise<BookingWithRelations> {
  return apiCallOrThrow<BookingWithRelations>(`/tutor/sessions/${bookingId}/complete`, {
    method: 'PATCH',
  });
}

export async function confirmTutorSession(bookingId: string): Promise<BookingWithRelations> {
  return apiCallOrThrow<BookingWithRelations>(`/tutor/sessions/${bookingId}/confirm`, {
    method: 'PATCH',
  });
}

export async function declineTutorSession(bookingId: string): Promise<BookingWithRelations> {
  return apiCallOrThrow<BookingWithRelations>(`/tutor/sessions/${bookingId}/decline`, {
    method: 'PATCH',
  });
}

export async function getFeaturedTutors(limit = 8): Promise<TutorListItem[]> {
  const data = await getTutors({ sort: 'rating', pageSize: limit, page: 1 });
  return data.items;
}
