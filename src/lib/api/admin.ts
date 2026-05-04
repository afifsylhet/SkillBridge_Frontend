import { apiCallOrThrow } from './client';
import type { UserRole } from '@/types/user';
import type { BookingStatus } from '@/types/booking';

export interface AdminStats {
    totals: { users: number; students: number; tutors: number; admins: number };
    bookings: { pending?: number; confirmed: number; completed: number; cancelled: number };
    revenueProxy: number;
    topCategories: { name: string; tutorCount: number }[];
}

export interface AdminUserItem {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl: string | null;
    isBanned: boolean;
    createdAt: string;
    tutorProfile: {
        id: string;
        ratingAvg: number;
        ratingCount: number;
        isPublished: boolean;
    } | null;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
}

export interface AdminBookingItem {
    id: string;
    status: BookingStatus;
    scheduledAt: string;
    durationMin: number;
    notes: string | null;
    createdAt: string;
    student: { id: string; name: string; email: string };
    tutorProfile: {
        id: string;
        hourlyRate: number;
        user: { id: string; name: string; email: string };
    };
}

export async function getAdminStats(): Promise<AdminStats> {
    return apiCallOrThrow<AdminStats>('/admin/stats', { method: 'GET' });
}

export async function getAdminUsers(filters?: {
    role?: UserRole;
    banned?: boolean;
    q?: string;
    page?: number;
    pageSize?: number;
}): Promise<PaginatedResponse<AdminUserItem>> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.banned !== undefined) params.append('banned', String(filters.banned));
    if (filters?.q) params.append('q', filters.q);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));
    const qs = params.toString();
    return apiCallOrThrow<PaginatedResponse<AdminUserItem>>(`/admin/users${qs ? `?${qs}` : ''}`, {
        method: 'GET',
    });
}

export async function updateUserBanStatus(id: string, isBanned: boolean): Promise<AdminUserItem> {
    return apiCallOrThrow<AdminUserItem>(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isBanned }),
    });
}

export async function getAdminBookings(filters?: {
    status?: BookingStatus;
    page?: number;
    pageSize?: number;
}): Promise<PaginatedResponse<AdminBookingItem>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));
    const qs = params.toString();
    return apiCallOrThrow<PaginatedResponse<AdminBookingItem>>(`/admin/bookings${qs ? `?${qs}` : ''}`, {
        method: 'GET',
    });
}
