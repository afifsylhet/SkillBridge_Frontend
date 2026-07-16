import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ROUTES, SITE } from '@/lib/constants/routes';

export default function PrivacyPage() {
  const updated = 'July 16, 2026';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted py-12 md:py-16">
        <article className="container max-w-3xl rounded-2xl border border-surface-border bg-surface px-6 py-8 shadow-card prose prose-slate md:px-10 md:py-10 dark:prose-invert">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink not-prose">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-ink-muted not-prose">Last updated: {updated}</p>

          <p className="text-ink-soft">
            SkillBridge (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the SkillBridge
            marketplace that connects students with tutors. This Privacy Policy explains what
            information we collect, how we use it, and your choices.
          </p>

          <h2>Information we collect</h2>
          <h3>Account information</h3>
          <p>
            When you register, we collect your name, email address, password (stored hashed), role
            (student, tutor, or admin), and optional profile details such as avatar URL and bio.
          </p>

          <h3>Booking and session data</h3>
          <p>
            We store booking requests, confirmed sessions, scheduled times, duration, status,
            notes, and messages exchanged between students and tutors through our messaging feature.
          </p>

          <h3>Payment information</h3>
          <p>
            Payments are processed by Stripe, Inc. When you pay for a session, Stripe collects
            payment card details and billing information according to{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              Stripe&apos;s Privacy Policy
            </a>
            . SkillBridge receives transaction identifiers, payment status, amounts, and booking
            references — not your full card number.
          </p>

          <h3>Reviews and favorites</h3>
          <p>
            Students may save favorite tutors and submit ratings and comments after completed
            sessions. This content is associated with your account and displayed on tutor profiles
            as described in our Terms.
          </p>

          <h3>Cookies and similar technologies</h3>
          <p>
            We use essential cookies to maintain your login session and remember theme preferences
            (light/dark mode). We may use analytics cookies to understand how the site is used and
            improve performance. You can control non-essential cookies through your browser settings.
          </p>

          <h2>How we use your information</h2>
          <ul>
            <li>Provide, operate, and improve the SkillBridge platform</li>
            <li>Process bookings and payments through Stripe</li>
            <li>Facilitate communication between students and tutors</li>
            <li>Send transactional emails related to bookings and account activity</li>
            <li>Detect fraud, enforce our Terms, and protect user safety</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Sharing of information</h2>
          <p>
            We share data with service providers who help us operate the platform, including Stripe
            for payments and hosting providers for infrastructure. Tutor profiles are visible to other
            users as part of the marketplace. We do not sell your personal information.
          </p>

          <h2>Data retention</h2>
          <p>
            We retain account and booking records while your account is active and as needed for
            legal, accounting, or dispute-resolution purposes. You may request deletion of your
            account by contacting us.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, delete, or export
            your personal data. Contact us at{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> to exercise these rights.
          </p>

          <h2>Children</h2>
          <p>
            SkillBridge is not directed at children under 13. We do not knowingly collect personal
            information from children under 13.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will be posted on this
            page with an updated date.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this Privacy Policy? Email{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or visit our{' '}
            <Link href={ROUTES.CONTACT}>contact page</Link>.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
