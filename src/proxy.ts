import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES: Record<string, ('STUDENT' | 'TUTOR' | 'ADMIN')[]> = {
    '/dashboard': ['STUDENT'],
    '/tutor': ['TUTOR'],
    '/admin': ['ADMIN'],
};

export function proxy(req: NextRequest) {
    const token = req.cookies.get('sb_token')?.value;
    const path = req.nextUrl.pathname;

    const matched = Object.entries(PROTECTED_PREFIXES)
        .find(([prefix]) => path.startsWith(prefix));

    if (!matched) return NextResponse.next();
    if (!token) return NextResponse.redirect(new URL('/login', req.url));

    // Role enforcement is done server-side in each protected layout
    // because proxy cannot decode JWT without the secret here.
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/tutor/:path*', '/admin/:path*'],
};
