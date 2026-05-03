'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-surface p-8 rounded-xl shadow-card max-w-md text-center">
                <h1 className="text-3xl font-bold text-danger mb-4">Oops!</h1>
                <p className="text-ink-muted mb-6">
                    {error.message || 'Something went wrong while loading this page.'}
                </p>
                <div className="flex gap-3">
                    <Button onClick={() => reset()} variant="primary" className="flex-1">
                        Try again
                    </Button>
                    <Link
                        href={ROUTES.HOME}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg border border-ink text-ink hover:bg-surface-muted"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
