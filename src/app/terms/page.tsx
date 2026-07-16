import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ROUTES, SITE } from '@/lib/constants/routes';

export default function TermsPage() {
  const updated = 'July 16, 2026';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted py-12 md:py-16">
        <article className="container max-w-3xl rounded-2xl border border-surface-border bg-surface px-6 py-8 shadow-card prose prose-slate md:px-10 md:py-10 dark:prose-invert">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink not-prose">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-ink-muted not-prose">Last updated: {updated}</p>

          <p className="text-ink-soft">
            These Terms of Service (&quot;Terms&quot;) govern your use of the SkillBridge marketplace
            at skillbridge.com and related services. By creating an account or using SkillBridge, you
            agree to these Terms.
          </p>

          <h2>1. The SkillBridge marketplace</h2>
          <p>
            SkillBridge provides a platform where independent tutors offer live tutoring sessions
            and students can discover, book, and pay for those sessions. SkillBridge is not the
            employer of tutors and does not guarantee specific learning outcomes.
          </p>

          <h2>2. Accounts and roles</h2>
          <p>
            You must provide accurate registration information and keep your credentials secure.
            Student accounts may browse tutors, book sessions, save favorites, and leave reviews.
            Tutor accounts must maintain accurate profiles, availability, and pricing. Admin accounts
            are for platform operators only.
          </p>

          <h2>3. Bookings and sessions</h2>
          <ul>
            <li>Students submit booking requests by selecting available time slots.</li>
            <li>Tutors may confirm or decline pending requests.</li>
            <li>Confirmed sessions should be attended at the scheduled time.</li>
            <li>Tutors mark sessions complete after they occur; students may then submit reviews.</li>
            <li>Cancellation rules described in our Help center apply to pending and confirmed bookings.</li>
          </ul>

          <h2>4. Payments</h2>
          <p>
            Session fees are displayed on tutor profiles and collected through Stripe Checkout.
            SkillBridge may charge a platform fee as disclosed at checkout. All payment processing is
            subject to Stripe&apos;s terms. Failed or cancelled payments may result in booking
            cancellation.
          </p>

          <h2>5. Reviews and content</h2>
          <p>
            Reviews must be honest and related to completed sessions. You may not post harassing,
            defamatory, or misleading content. SkillBridge may remove content that violates these
            Terms or applicable law.
          </p>

          <h2>6. Tutor responsibilities</h2>
          <p>
            Tutors represent that they have the right to offer the subjects they list, that profile
            information is accurate, and that they will deliver sessions professionally. Tutors are
            responsible for their own tax and regulatory obligations.
          </p>

          <h2>7. Prohibited conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Circumvent SkillBridge payments or solicit off-platform payments for booked sessions</li>
            <li>Impersonate others or create fraudulent accounts</li>
            <li>Harass, abuse, or discriminate against other users</li>
            <li>Attempt to access accounts or data without authorization</li>
            <li>Use the platform for any unlawful purpose</li>
          </ul>

          <h2>8. Account suspension</h2>
          <p>
            We may suspend or terminate accounts that violate these Terms, receive repeated
            complaints, or pose a risk to the community. Banned users may not create new accounts
            without permission.
          </p>

          <h2>9. Disclaimers</h2>
          <p>
            SkillBridge is provided &quot;as is.&quot; We do not warrant uninterrupted service or
            specific academic results. To the fullest extent permitted by law, SkillBridge disclaims
            implied warranties of merchantability and fitness for a particular purpose.
          </p>

          <h2>10. Limitation of liability</h2>
          <p>
            SkillBridge&apos;s total liability for claims arising from your use of the platform is
            limited to the amount you paid to SkillBridge in the twelve months before the claim, or
            one hundred U.S. dollars, whichever is greater.
          </p>

          <h2>11. Privacy</h2>
          <p>
            Our collection and use of personal data is described in our{' '}
            <Link href={ROUTES.PRIVACY}>Privacy Policy</Link>.
          </p>

          <h2>12. Changes</h2>
          <p>
            We may modify these Terms. Continued use after changes are posted constitutes acceptance
            of the updated Terms.
          </p>

          <h2>13. Contact</h2>
          <p>
            For questions about these Terms, contact{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use our{' '}
            <Link href={ROUTES.CONTACT}>contact form</Link>.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
