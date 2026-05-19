'use client';

import React, { useMemo } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

interface StripeProviderProps {
    children: React.ReactNode;
}

// Memoize stripe promise to avoid reinitialization
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = async () => {
    if (!stripePromise) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
            console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
            return null;
        }
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};

export function StripeProvider({ children }: StripeProviderProps) {
    const stripePromiseValue = useMemo(() => getStripe(), []);

    return (
        <Elements stripe={stripePromiseValue}>
            {children}
        </Elements>
    );
}
