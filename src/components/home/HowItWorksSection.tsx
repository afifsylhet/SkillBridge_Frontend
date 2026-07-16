import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

const STEPS = [
  {
    n: '01',
    title: 'Search',
    body: 'Filter tutors by subject, price, and rating to find your match.',
  },
  {
    n: '02',
    title: 'Book & pay',
    body: 'Pick an available slot and complete secure Stripe Checkout in minutes.',
  },
  {
    n: '03',
    title: 'Learn',
    body: 'Your tutor confirms, you meet for the session, then leave a review.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-y bg-surface">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft md:text-lg">
            Three steps from sign-up to your first session.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="font-display text-5xl font-bold tracking-tight text-brand-600/30 md:text-6xl">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-ink md:mt-4">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-7 text-base font-medium text-white transition hover:bg-brand-700"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </section>
  );
}
