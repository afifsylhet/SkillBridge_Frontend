import { cookies } from 'next/headers';
import type { CurrentUser } from '@/types/user';

function resolveApiBase(): string {
    const raw =
        process.env.API_URL_INTERNAL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:4000/api';
    const trimmed = raw.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('sb_token')?.value;

    if (!token) return null;

    try {
        const url = `${resolveApiBase()}/auth/me`;

        const res = await fetch(url, {
            headers: { cookie: `sb_token=${token}` },
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const json = await res.json();
        return (json.data as CurrentUser | undefined) ?? null;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}
