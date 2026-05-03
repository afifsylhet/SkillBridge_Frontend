import { apiCall, apiCallOrThrow } from './client';
import type { CurrentUser, User } from '@/types/user';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: 'STUDENT' | 'TUTOR';
}

export interface UpdateMePayload {
    name?: string;
    avatarUrl?: string | null;
}

export async function login(payload: LoginPayload): Promise<User> {
    const { user } = await apiCallOrThrow<{ user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return user;
}

export async function register(payload: RegisterPayload): Promise<User> {
    const { user } = await apiCallOrThrow<{ user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return user;
}

export async function logout(): Promise<void> {
    await apiCallOrThrow<null>('/auth/logout', { method: 'POST' });
}

/**
 * Returns the current authenticated user (with tutorProfile when applicable),
 * or null when the request fails or the user is not authenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
    const res = await apiCall<CurrentUser>('/auth/me', { method: 'GET' });
    return res.success ? res.data : null;
}

export async function updateCurrentUser(payload: UpdateMePayload): Promise<CurrentUser> {
    return apiCallOrThrow<CurrentUser>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}
