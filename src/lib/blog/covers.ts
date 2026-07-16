/**
 * Fallback cover art per seeded blog slug when coverImageUrl is unset.
 * Paths are local assets under /public/images/blog.
 */
const COVERS_BY_SLUG: Record<string, string> = {
  'first-tutoring-session-tips': '/images/blog/first-session.jpg',
  'become-published-tutor': '/images/blog/published-tutor.jpg',
  'skillbridge-payments-explained': '/images/blog/payments.jpg',
  'choose-learning-category': '/images/blog/categories.jpg',
  'weekly-learning-habit': '/images/blog/habit.jpg',
};

/** Topic-based fallbacks when slug is unknown (admin-created posts). */
const TOPIC_FALLBACKS = [
  { match: /payment|stripe|checkout|refund/i, src: '/images/blog/payments.jpg' },
  { match: /tutor|publish|profile|teach/i, src: '/images/blog/published-tutor.jpg' },
  { match: /categor|subject|path|browse/i, src: '/images/blog/categories.jpg' },
  { match: /habit|weekly|routine|consistency/i, src: '/images/blog/habit.jpg' },
  { match: /session|first|book|learn/i, src: '/images/blog/first-session.jpg' },
] as const;

const DEFAULT_COVER = '/images/blog/first-session.jpg';

export function getBlogCoverUrl(post: {
  slug: string;
  title?: string;
  coverImageUrl?: string | null;
}): string {
  if (post.coverImageUrl) return post.coverImageUrl;

  const bySlug = COVERS_BY_SLUG[post.slug];
  if (bySlug) return bySlug;

  const haystack = `${post.slug} ${post.title ?? ''}`;
  for (const item of TOPIC_FALLBACKS) {
    if (item.match.test(haystack)) return item.src;
  }

  return DEFAULT_COVER;
}
