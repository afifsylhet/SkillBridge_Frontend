'use client';

import { useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

const FAQS = [
  {
    q: 'How do I book a tutor?',
    a: 'Browse tutors, open a profile, pick an available slot, and complete secure Stripe checkout. The tutor then confirms your session.',
  },
  {
    q: 'Is payment secure?',
    a: 'Yes. Payments are processed by Stripe Checkout. SkillBridge never stores your full card details.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Pending requests can be withdrawn anytime. Confirmed sessions can be cancelled at least 2 hours before start.',
  },
  {
    q: 'How do tutors get paid?',
    a: 'Students pay per session via Stripe. Tutors manage availability and confirm completed sessions from their dashboard.',
  },
  {
    q: 'How do reviews work?',
    a: 'After a completed session, students can leave a rating and comment. Ratings update the tutor average automatically.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-y bg-surface">
      <div className="container max-w-3xl">
        <SectionHeader
          title="Frequently asked questions"
          description={
            <>
              Need more help? Visit our{' '}
              <Link href={ROUTES.HELP} className="font-medium text-brand-600 hover:underline">
                Help center
              </Link>
              .
            </>
          }
        />
        <div className="divide-y divide-surface-border border-y border-surface-border">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-ink transition hover:text-brand-600 md:py-5 md:text-base"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-muted',
                      isOpen && 'bg-brand-50 text-brand-600',
                    )}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed text-ink-soft md:pb-6">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
