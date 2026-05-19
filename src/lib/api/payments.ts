import { apiCallOrThrow } from './client';

export interface CreateCheckoutSessionResponse {
    success: boolean;
    data: {
        sessionId: string;
        checkoutUrl: string;
        amount: number;
    };
}

export interface PaymentStatusResponse {
    success: boolean;
    data: {
        id: string;
        bookingId: string;
        stripeSessionId: string;
        stripePaymentIntentId?: string;
        amount: number;
        currency: string;
        status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
        createdAt: string;
        updatedAt: string;
    };
}

/**
 * Initiate checkout for a booking
 */
export async function initiateCheckout(bookingId: string): Promise<{ sessionId: string; checkoutUrl: string; amount: number }> {
    return apiCallOrThrow('/payments/checkout', {
        method: 'POST',
        body: JSON.stringify({ bookingId }),
    });
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse['data']> {
    return apiCallOrThrow(`/payments/${paymentId}/status`);
}

/**
 * Get payment by session ID (for success page)
 */
export async function getPaymentBySession(sessionId: string): Promise<PaymentStatusResponse['data']> {
    return apiCallOrThrow(`/payments/session/${sessionId}`);
}
