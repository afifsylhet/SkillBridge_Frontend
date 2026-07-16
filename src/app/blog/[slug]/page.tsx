import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FinalCtaSection } from '@/components/home/NewsletterSection';
import { getBlogPost } from '@/lib/api/blog';
import { getBlogCoverUrl } from '@/lib/blog/covers';
import { ROUTES } from '@/lib/constants/routes';
import { formatDate } from '@/lib/utils/format';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getBlogPost(slug);
    return {
      title: `${post.title} | SkillBridge Blog`,
      description: post.excerpt || undefined,
    };
  } catch {
    return { title: 'Article | SkillBridge Blog' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getBlogPost>> | null = null;
  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const date = post.publishedAt ? formatDate(post.publishedAt) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Article hero */}
        <header className="relative overflow-hidden bg-[#020617] text-white">
          <Image
            src={getBlogCoverUrl(post)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-[#020617]/45"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_40%,rgba(37,99,235,0.28),transparent_50%)]"
            aria-hidden
          />

          <div className="container relative z-10 max-w-3xl pb-14 pt-28 md:pb-16 md:pt-36">
            <Link
              href={ROUTES.BLOG}
              className="inline-flex text-sm font-medium text-white/70 transition hover:text-white"
            >
              ← Back to blog
            </Link>
            <p className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white/45">
              SkillBridge
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                {post.excerpt}
              </p>
            )}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/15 text-sm font-semibold ring-1 ring-white/25">
                {post.author.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.author.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (post.author.name?.[0] ?? '?').toUpperCase()
                )}
              </div>
              <div className="text-sm text-white/70">
                <span className="text-white/90">{post.author.name}</span>
                {date ? (
                  <>
                    <span className="mx-1.5 opacity-50">·</span>
                    <time dateTime={post.publishedAt ?? undefined}>{date}</time>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <article className="section-y bg-surface">
          <div className="container max-w-3xl">
            <div className="whitespace-pre-wrap text-base leading-[1.8] text-ink-soft md:text-lg">
              {post.content}
            </div>

            <div className="mt-14 flex flex-col gap-4 border-t border-surface-border pt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={ROUTES.BLOG}
                className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
              >
                ← More articles
              </Link>
              <Link
                href={ROUTES.BROWSE_TUTORS}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-medium text-white transition hover:bg-brand-500"
              >
                Find a tutor
              </Link>
            </div>
          </div>
        </article>

        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
