import Link from 'next/link';
import { listBlogPosts } from '@/lib/api/blog';
import SectionHeader from '@/components/ui/SectionHeader';
import { ROUTES } from '@/lib/constants/routes';

export default async function BlogTeaserSection() {
  let posts: Awaited<ReturnType<typeof listBlogPosts>>['items'] = [];
  try {
    const data = await listBlogPosts({ pageSize: 3 });
    posts = data.items;
  } catch {
    posts = [];
  }

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-y bg-surface-muted">
      <div className="container">
        <SectionHeader
          align="left"
          title="From the blog"
          description="Guides and tips for learners and tutors."
          action={
            <Link
              href={ROUTES.BLOG}
              className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
            >
              View all posts →
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={ROUTES.BLOG_POST(post.slug)}
              className="group flex h-full flex-col border-t border-surface-border pt-5 transition"
            >
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-ink transition group-hover:text-brand-600">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft line-clamp-3">
                {post.excerpt}
              </p>
              <p className="mt-5 text-xs text-ink-muted">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}{' '}
                · {post.author.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
