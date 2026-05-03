import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-surface p-8 rounded-xl shadow-card max-w-md text-center">
                <h1 className="text-6xl font-bold text-danger mb-4">404</h1>
                <p className="text-ink-muted mb-6">
                    The page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link
                    href={ROUTES.HOME}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}

