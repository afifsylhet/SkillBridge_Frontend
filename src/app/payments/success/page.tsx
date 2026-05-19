'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPaymentBySession } from '@/lib/api/payments';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('sessionId');

    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'succeeded' | 'failed' | null>(null);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError('Missing session ID');
                setLoading(false);
                return;
            }

            try {
                const payment = await getPaymentBySession(sessionId);
                setPaymentStatus(payment.status === 'SUCCEEDED' ? 'succeeded' : 'failed');
                setBookingId(payment.bookingId);
            } catch (err) {
                const error = err as any;
                setError(error?.message || 'Failed to verify payment');
                setPaymentStatus('failed');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    // Auto-redirect after 5 seconds if payment succeeded
    useEffect(() => {
        if (paymentStatus === 'succeeded' && bookingId) {
            const timer = setTimeout(() => {
                router.push(`/dashboard?tab=bookings`);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [paymentStatus, bookingId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-ink">Verifying payment...</p>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'succeeded') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-3">
                            <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-ink mb-2">Payment Successful!</h1>
                    <p className="text-secondary mb-6">
                        Your booking has been confirmed. A confirmation email has been sent to you.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-secondary">
                            Redirecting to your dashboard in a few seconds...
                        </p>
                    </div>
                    <Link
                        href="/dashboard?tab=bookings"
                        className="inline-block bg-primary text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-dark transition"
                    >
                        Go to Dashboard Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-red-100 p-3">
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-ink mb-2">Payment Failed</h1>
                <p className="text-secondary mb-6">
                    {error || 'There was an issue processing your payment. Please try again.'}
                </p>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard?tab=bookings"
                        className="flex-1 bg-secondary text-white font-medium py-2 px-4 rounded-lg hover:bg-secondary-dark transition"
                    >
                        Back to Dashboard
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-dark transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
