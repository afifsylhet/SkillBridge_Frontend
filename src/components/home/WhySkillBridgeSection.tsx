import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

export default function WhySkillBridgeSection() {
  return (
    <section className="section-y bg-surface-muted">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Why SkillBridge
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
              Tutoring that fits real life — not endless email threads.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
              Transparent rates, live availability, and Stripe checkout mean you spend less time
              coordinating and more time learning. Tutors stay in control of their schedule; learners
              book with confidence.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink-soft md:text-base">
              {[
                'Verified reviews after every completed session',
                'Secure payments handled by Stripe',
                'Favorites, messaging, and dashboards for both roles',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={ROUTES.ABOUT}
              className="mt-8 inline-flex text-sm font-medium text-brand-600 transition hover:text-brand-700"
            >
              Learn more about us →
            </Link>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-border md:aspect-[5/4]">
              <Image
                src="/images/why-skillbridge.jpg"
                alt="Mentor guiding a learner on a laptop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
