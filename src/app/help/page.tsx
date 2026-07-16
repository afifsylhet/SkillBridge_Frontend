'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ROUTES } from '@/lib/constants/routes';

const SECTIONS = [
  {
    title: 'Booking sessions',
    items: [
      {
        q: 'How do I book a tutor?',
        a: 'Browse tutors, open a profile, select an available time slot, and complete Stripe checkout. Your tutor will confirm the session from their dashboard.',
      },
      {
        q: 'Can I cancel or reschedule?',
        a: 'Pending requests can be withdrawn before the tutor confirms. Confirmed sessions can be cancelled at least 2 hours before the scheduled start time from your bookings page.',
      },
      {
        q: 'What happens after I pay?',
        a: 'Payment is captured through Stripe Checkout. Once the tutor confirms, your session status updates to confirmed and appears on both dashboards.',
      },
    ],
  },
  {
    title: 'Payments',
    items: [
      {
        q: 'Is my payment information secure?',
        a: 'Yes. SkillBridge uses Stripe Checkout for all payments. We never store your full card number on our servers.',
      },
      {
        q: 'When am I charged?',
        a: 'You are charged when you complete checkout for a session. If a booking is cancelled before confirmation, you will not be charged for that session.',
      },
      {
        q: 'How do refunds work?',
        a: 'Contact support if a tutor cancels a confirmed session or a payment issue occurs. Refunds are processed back to your original payment method via Stripe.',
      },
    ],
  },
  {
    title: 'Reviews',
    items: [
      {
        q: 'When can I leave a review?',
        a: 'After a session is marked complete by the tutor, you can rate and comment from your sessions or bookings page.',
      },
      {
        q: 'Can tutors respond to reviews?',
        a: 'Reviews are visible on tutor profiles and contribute to their average rating. Tutors can see feedback on their dashboard.',
      },
    ],
  },
  {
    title: 'Account roles',
    items: [
      {
        q: 'What is a student account?',
        a: 'Students browse tutors, book sessions, save favorites, message tutors, and leave reviews after completed sessions.',
      },
      {
        q: 'What is a tutor account?',
        a: 'Tutors create a public profile, set availability and hourly rates, confirm or decline booking requests, and mark sessions complete.',
      },
      {
        q: 'Can I have both roles?',
        a: 'Each email is tied to one role. If you need both student and tutor access, use separate accounts or contact us for guidance.',
      },
    ],
  },
];

export default function HelpPage() {
  const [openKey, setOpenKey] = useState<string | null>('0-0');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted">
        <section className="section-y border-b border-surface-border bg-surface">
          <div className="container max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink">Help center</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              Answers to common questions about booking, payments, reviews, and account types on
              SkillBridge. Still stuck?{' '}
              <Link href={ROUTES.CONTACT} className="font-medium text-brand-600 hover:underline">
                Contact our team
              </Link>
              .
            </p>
          </div>
        </section>

        <div className="container max-w-3xl section-y">
          <div className="space-y-8">
            {SECTIONS.map((section, si) => (
              <section key={section.title}>
                <h2 className="mb-3 font-display text-xl font-semibold tracking-tight text-ink">
                  {section.title}
                </h2>
                <div className="space-y-2.5">
                  {section.items.map((item, ii) => {
                    const key = `${si}-${ii}`;
                    const isOpen = openKey === key;
                    return (
                      <div
                        key={item.q}
                        className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-card"
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-ink transition hover:bg-surface-muted/60 md:text-base"
                          aria-expanded={isOpen}
                          onClick={() => setOpenKey(isOpen ? null : key)}
                        >
                          {item.q}
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm text-ink-muted ${
                              isOpen ? 'text-brand-600' : ''
                            }`}
                          >
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <p className="border-t border-surface-border px-5 py-4 text-sm leading-relaxed text-ink-soft">
                            {item.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
