import Link from 'next/link';
import { ROUTES, SITE } from '@/lib/constants/routes';
import NewsletterForm from '@/components/home/NewsletterForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Product',
      links: [
        { href: ROUTES.BROWSE_TUTORS, label: 'Browse Tutors' },
        { href: `${ROUTES.HOME}#categories`, label: 'Categories' },
        { href: `${ROUTES.HOME}#how-it-works`, label: 'How It Works' },
        { href: ROUTES.BLOG, label: 'Blog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: ROUTES.ABOUT, label: 'About' },
        { href: ROUTES.CONTACT, label: 'Contact' },
        { href: ROUTES.HELP, label: 'Help / FAQ' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: ROUTES.TERMS, label: 'Terms' },
        { href: ROUTES.PRIVACY, label: 'Privacy' },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-surface-border bg-surface-muted">
      <div className="container section-y">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h3 className="font-display text-lg font-bold text-brand-600">{SITE.name}</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
              Connecting learners with expert tutors worldwide. Book secure sessions and grow skills
              that matter.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-block text-sm font-medium text-ink-soft transition hover:text-brand-600"
            >
              {SITE.email}
            </a>
            <div className="mt-5 flex gap-4 text-sm text-ink-muted">
              <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                Twitter
              </a>
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                LinkedIn
              </a>
              <a href={SITE.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                GitHub
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-muted transition hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-ink">Newsletter</h4>
            <p className="mt-2 mb-3 text-xs leading-relaxed text-ink-muted">
              Tips and product updates — no spam.
            </p>
            <NewsletterForm compact />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-surface-border pt-8 md:flex-row">
          <p className="text-sm text-ink-muted">
            © {currentYear} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
