import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NewsletterForm from '@/components/home/NewsletterForm';
import { FinalCtaSection } from '@/components/home/NewsletterSection';
import { listBlogPosts, type BlogPostSummary } from '@/lib/api/blog';
import { getBlogCoverUrl } from '@/lib/blog/covers';
import { ROUTES } from '@/lib/constants/routes';
import { formatDate } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | SkillBridge',
  description:
    'Guides, tips, and updates for learners and tutors — from first sessions to building a weekly learning habit.',
};

const HERO_IMAGE = '/images/blog-hero.jpg';

type Props = {
  searchParams: Promise<{ page?: string }>;
};

function AuthorMeta({
  post,
  light = false,
}: {
  post: BlogPostSummary;
  light?: boolean;
}) {
  const date = post.publishedAt ? formatDate(post.publishedAt) : null;
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold ${
          light
            ? 'bg-white/15 text-white ring-1 ring-white/25'
            : 'bg-brand-50 text-brand-700 ring-1 ring-surface-border'
        }`}
      >
        {post.author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.author.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          (post.author.name?.[0] ?? '?').toUpperCase()
        )}
      </div>
      <div className={`text-sm ${light ? 'text-white/75' : 'text-ink-muted'}`}>
        <span className={light ? 'text-white/90' : 'text-ink-soft'}>{post.author.name}</span>
        {date ? (
          <>
            <span className="mx-1.5 opacity-50">·</span>
            <time dateTime={post.publishedAt ?? undefined}>{date}</time>
          </>
        ) : null}
      </div>
    </div>
  );
}

function PostCover({
  post,
  className,
  priority = false,
}: {
  post: BlogPostSummary;
  className?: string;
  priority?: boolean;
}) {
  const src = getBlogCoverUrl(post);

  return (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 50vw"
      className={`object-cover transition duration-500 group-hover:scale-[1.03] ${className ?? ''}`}
    />
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  let data = {
    items: [] as BlogPostSummary[],
    totalPages: 0,
    total: 0,
    page: 1,
  };
  try {
    data = await listBlogPosts({ page, pageSize: 9 });
  } catch {
    // empty list on error
  }

  const featured = page === 1 && data.items.length > 0 ? data.items[0] : null;
  const rest = featured ? data.items.slice(1) : data.items;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero — brand first, one composition */}
        <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-[#020617] md:min-h-[64vh]">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/75 to-[#020617]/35"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_35%,rgba(37,99,235,0.32),transparent_52%)]"
            aria-hidden
          />

          <div className="container relative z-10 pb-14 pt-28 md:pb-16 md:pt-36">
            <p className="animate-slide-up font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              SkillBridge
            </p>
            <h1 className="mt-4 max-w-xl animate-fade-in text-xl font-medium leading-snug text-white/95 md:mt-5 md:text-2xl">
              Ideas for better learning.
            </h1>
            <p className="mt-3 max-w-lg animate-fade-in text-base leading-relaxed text-white/70 md:text-lg">
              Practical guides for students and tutors — first sessions, habits, payments, and getting
              published.
            </p>
            {data.total > 0 && (
              <p className="mt-6 animate-fade-in text-sm text-white/50">
                {data.total} {data.total === 1 ? 'article' : 'articles'}
                {data.totalPages > 1 ? ` · Page ${page} of ${data.totalPages}` : ''}
              </p>
            )}
          </div>
        </section>

        {data.items.length === 0 ? (
          <section className="section-y bg-surface">
            <div className="container">
              <div className="mx-auto max-w-lg py-10 text-center">
                <p className="font-display text-2xl font-bold tracking-tight text-ink">
                  No published posts yet
                </p>
                <p className="mt-3 text-ink-soft">
                  We&apos;re preparing guides for learners and tutors. Check back soon — or find a
                  mentor today.
                </p>
                <Link
                  href={ROUTES.BROWSE_TUTORS}
                  className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-medium text-white transition hover:bg-brand-500"
                >
                  Browse tutors
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Featured — page 1 only */}
            {featured && (
              <section className="section-y bg-surface">
                <div className="container">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                    Featured
                  </p>
                  <Link
                    href={ROUTES.BLOG_POST(featured.slug)}
                    className="group mt-5 grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#020617] lg:col-span-7 lg:aspect-auto lg:min-h-[22rem]">
                      <PostCover post={featured} priority />
                    </div>
                    <div className="flex flex-col justify-center lg:col-span-5">
                      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink transition group-hover:text-brand-600 md:text-4xl">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="mt-6">
                        <AuthorMeta post={featured} />
                      </div>
                      <span className="mt-8 inline-flex text-sm font-medium text-brand-600 transition group-hover:text-brand-700">
                        Read article →
                      </span>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* Index — editorial list, no cards */}
            <section className={`section-y ${featured ? 'bg-surface-muted' : 'bg-surface'}`}>
              <div className="container">
                <div className="mb-10 flex flex-col gap-2 md:mb-12 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                      {featured ? 'More to read' : 'All articles'}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                      {featured ? 'Continue exploring' : 'From the journal'}
                    </h2>
                  </div>
                  <p className="max-w-sm text-sm text-ink-muted">
                    Tips for booking with confidence, teaching well, and building a rhythm that sticks.
                  </p>
                </div>

                {rest.length === 0 ? (
                  <p className="text-sm text-ink-muted">You&apos;re all caught up on this page.</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-x-10 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, i) => {
                      const n = String((featured ? i + 2 : i + 1)).padStart(2, '0');
                      return (
                        <li key={post.id}>
                          <Link
                            href={ROUTES.BLOG_POST(post.slug)}
                            className="group flex h-full flex-col border-t border-surface-border py-7 transition md:py-8"
                          >
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                                {n}
                              </span>
                              {post.publishedAt && (
                                <time
                                  dateTime={post.publishedAt}
                                  className="text-xs text-ink-muted"
                                >
                                  {formatDate(post.publishedAt)}
                                </time>
                              )}
                            </div>
                            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-[#020617]">
                              <PostCover post={post} />
                            </div>
                            <h3 className="mt-5 font-display text-xl font-semibold leading-snug tracking-tight text-ink transition group-hover:text-brand-600">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}
                            <p className="mt-4 text-xs text-ink-muted">{post.author.name}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {data.totalPages > 1 && (
                  <nav
                    aria-label="Blog pagination"
                    className="mt-12 flex items-center justify-center gap-4 border-t border-surface-border pt-10"
                  >
                    {page > 1 ? (
                      <Link
                        href={page === 2 ? ROUTES.BLOG : `${ROUTES.BLOG}?page=${page - 1}`}
                        className="inline-flex h-10 items-center rounded-xl border border-surface-border bg-surface px-4 text-sm font-medium text-ink transition hover:bg-surface-muted"
                      >
                        ← Previous
                      </Link>
                    ) : (
                      <span className="inline-flex h-10 items-center px-4 text-sm text-ink-muted/50">
                        ← Previous
                      </span>
                    )}
                    <span className="min-w-[7rem] text-center text-sm text-ink-muted">
                      Page {page} of {data.totalPages}
                    </span>
                    {page < data.totalPages ? (
                      <Link
                        href={`${ROUTES.BLOG}?page=${page + 1}`}
                        className="inline-flex h-10 items-center rounded-xl border border-surface-border bg-surface px-4 text-sm font-medium text-ink transition hover:bg-surface-muted"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span className="inline-flex h-10 items-center px-4 text-sm text-ink-muted/50">
                        Next →
                      </span>
                    )}
                  </nav>
                )}
              </div>
            </section>
          </>
        )}

        {/* Newsletter */}
        <section className="relative overflow-hidden border-y border-white/10 bg-[#020617] py-14 text-white md:py-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(37,99,235,0.28),transparent_50%)]"
            aria-hidden
          />
          <div className="container relative z-10 max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Newsletter
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
              Stay sharp between sessions
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
              Learning tips, new categories, and SkillBridge updates — no spam.
            </p>
            <div className="mt-7 text-left">
              <NewsletterForm />
            </div>
          </div>
        </section>

        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
