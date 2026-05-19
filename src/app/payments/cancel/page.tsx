'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function PaymentCancelPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteBooking = async () => {
        if (!bookingId) return;

        setDeleting(true);
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete booking');
            }

            router.push('/dashboard?tab=bookings');
        } catch (error) {
            const err = error as any;
            setDeleteError(err?.message || 'Failed to delete booking');
        } finally {
            setDeleting(false);
        }
    };

    const handleRetryPayment = () => {
        router.push('/dashboard?tab=bookings');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-yellow-100 p-3">
                        <svg
                            className="h-6 w-6 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4v2m0 0a9 9 0 110-18 9 9 0 010 18z"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-ink mb-2">Payment Cancelled</h1>
                <p className="text-secondary mb-6">
                    You cancelled the payment process. Your booking has not been confirmed yet.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-secondary">
                        What would you like to do next?
                    </p>
                </div>

                {deleteError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-600">{deleteError}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleRetryPayment}
                        disabled={deleting}
                        className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                    >
                        Continue to Dashboard
                    </button>
                    <button
                        onClick={handleDeleteBooking}
                        disabled={deleting || !bookingId}
                        className="w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {deleting ? 'Deleting...' : 'Delete Booking'}
                    </button>
                    <Link
                        href="/tutors"
                        className="w-full bg-secondary text-white font-medium py-2 px-4 rounded-lg hover:bg-secondary-dark transition text-center"
                    >
                        Browse Tutors
                    </Link>
                </div>
            </div>
        </div>
    );
}
