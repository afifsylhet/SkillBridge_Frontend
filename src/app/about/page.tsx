import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getPublicStats } from '@/lib/api/stats';
import { ROUTES } from '@/lib/constants/routes';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About SkillBridge',
  description:
    'SkillBridge connects learners with vetted tutors for live, one-on-one sessions — booked securely and managed in one place.',
};

const HERO_IMAGE = '/images/about-hero.jpg';
const MISSION_IMAGE = '/images/about-mission.jpg';

const STEPS = [
  {
    n: '01',
    title: 'Browse and compare',
    body: 'Filter by subject, rate, and ratings. Read bios, reviews, and availability before you commit.',
  },
  {
    n: '02',
    title: 'Book and pay securely',
    body: 'Pick an open slot and check out with Stripe. Your tutor confirms the session from their dashboard.',
  },
  {
    n: '03',
    title: 'Learn and review',
    body: 'Meet for your session, mark it complete, and leave a review so others can choose with confidence.',
  },
];

const PRINCIPLES = [
  {
    title: 'Clarity over clutter',
    body: 'Transparent rates, real availability, and a booking flow that ends in one secure checkout.',
  },
  {
    title: 'Experts, not ads',
    body: 'Profiles are built around teaching experience and verified reviews — not paid placements.',
  },
  {
    title: 'Respect for time',
    body: 'Both learners and tutors deserve schedules that stick, cancellations with notice, and less back-and-forth.',
  },
];

export default async function AboutPage() {
  let stats = { tutors: 0, students: 0, sessionsCompleted: 0, categories: 0, avgRating: 0 };
  try {
    stats = await getPublicStats();
  } catch {
    // show zeros if API unavailable
  }

  const statItems = [
    { label: 'Expert tutors', value: stats.tutors.toLocaleString() },
    { label: 'Active learners', value: stats.students.toLocaleString() },
    { label: 'Sessions completed', value: stats.sessionsCompleted.toLocaleString() },
    {
      label: 'Avg. tutor rating',
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero — one composition, brand-first, full-bleed visual */}
        <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-[#020617] md:min-h-[92vh]">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-[#020617]/25"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(37,99,235,0.28),transparent_55%)]" aria-hidden />

          <div className="container relative z-10 pb-16 pt-32 md:pb-20 md:pt-40">
            <p className="animate-slide-up font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              SkillBridge
            </p>
            <h1 className="mt-5 max-w-xl animate-fade-in text-xl font-medium leading-snug text-white/95 md:mt-6 md:text-2xl">
              Quality tutoring, without the friction.
            </h1>
            <p className="mt-4 max-w-lg animate-fade-in text-base leading-relaxed text-white/75 md:text-lg">
              Live, one-on-one sessions with vetted tutors — discovered, booked, and paid for in one
              place.
            </p>
            <div className="mt-8 flex animate-slide-up flex-col gap-3 sm:flex-row">
              <Link
                href={ROUTES.BROWSE_TUTORS}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-7 text-base font-medium text-white transition hover:bg-brand-500"
              >
                Browse tutors
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Create free account
              </Link>
            </div>
          </div>
        </section>

        {/* Mission — editorial split, real visual anchor */}
        <section className="section-y bg-surface">
          <div className="container">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[5/6]">
                  <Image
                    src={MISSION_IMAGE}
                    alt="Student focused on learning with notes and a laptop"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                  Our mission
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl lg:text-[2.75rem]">
                  Make finding the right tutor as simple as booking a calendar slot.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
                  Whether you are preparing for exams, switching careers, or picking up a new skill,
                  you should be able to find an expert, book a time that works, and pay with
                  confidence — without endless email threads or unclear pricing.
                </p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
                  SkillBridge exists so learners and tutors can spend their energy on the session
                  itself, not the logistics around it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works — one job, no card chrome */}
        <section className="section-y bg-surface-muted">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                How SkillBridge works
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft md:text-lg">
                Three steps from discovery to your first completed session.
              </p>
            </div>

            <ol className="mt-12 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
              {STEPS.map((step, i) => (
                <li
                  key={step.n}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="font-display text-5xl font-bold tracking-tight text-brand-600/25 md:text-6xl">
                    {step.n}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ink md:mt-4">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Impact — typographic numbers */}
        <section className="border-y border-white/10 bg-[#020617] py-16 text-white md:py-20">
          <div className="container">
            <h2 className="text-center font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Built for real learning momentum
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-white/65 md:text-base">
              Live platform activity from tutors and learners on SkillBridge.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 md:mt-14 md:grid-cols-4 md:gap-6">
              {statItems.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-white/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="section-y bg-surface">
          <div className="container">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                What we stand for
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft md:text-lg">
                A marketplace only works when trust is designed into every step.
              </p>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-10 md:mt-14 md:grid-cols-3 md:gap-12">
              {PRINCIPLES.map((item) => (
                <li key={item.title} className="border-l-2 border-brand-600 pl-5 md:pl-6">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft md:text-base">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="section-y bg-surface-muted">
          <div className="container">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#0f766e] px-8 py-14 text-center text-white md:px-16 md:py-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 85% 80%, rgba(15,118,110,0.45), transparent 45%)',
                }}
                aria-hidden
              />
              <div className="relative">
                <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Your next session starts here
                </p>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
                  Browse tutors today, or create a free account and book your first session in
                  minutes.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href={ROUTES.BROWSE_TUTORS}
                    className="inline-flex h-12 items-center rounded-xl bg-white px-7 text-sm font-semibold text-[#1e40af] transition hover:bg-blue-50"
                  >
                    Find a tutor
                  </Link>
                  <Link
                    href={ROUTES.CONTACT}
                    className="inline-flex h-12 items-center rounded-xl border border-white/40 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Talk to us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
