import { cookies, headers } from 'next/headers';
import type { CurrentUser } from '@/types/user';

// Build an absolute URL pointing at our own /api proxy, which then forwards to
// the real backend. This avoids relying on a separately-configured
// `API_URL_INTERNAL` for the server-side auth check — if the proxy works for
// the browser (login succeeded, navbar shows the user), it also works here.
async function resolveSelfBase(): Promise<string | null> {
    const headerStore = await headers();
    const host = headerStore.get('host');
    if (!host) return null;
    const proto =
        headerStore.get('x-forwarded-proto') ??
        (host.startsWith('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('sb_token')?.value;

    if (!token) {
        console.warn('[getCurrentUser] no sb_token cookie on incoming request');
        return null;
    }

    const base = await resolveSelfBase();
    if (!base) {
        console.error('[getCurrentUser] could not resolve self host');
        return null;
    }

    try {
        const url = `${base}/api/auth/me`;
        const res = await fetch(url, {
            headers: { cookie: `sb_token=${token}` },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(
                `[getCurrentUser] ${url} returned ${res.status} ${res.statusText}`,
            );
            return null;
        }

        const json = (await res.json()) as { data?: CurrentUser };
        return json.data ?? null;
    } catch (error) {
        console.error('[getCurrentUser] fetch failed:', error);
        return null;
    }
}
