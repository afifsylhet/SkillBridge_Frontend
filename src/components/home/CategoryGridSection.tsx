import Link from 'next/link';
import { getCategories } from '@/lib/api/categories';
import { ROUTES } from '@/lib/constants/routes';
import type { CategoryWithStats, IconKey } from '@/types/category';

const ICON_GLYPHS: Record<IconKey, string> = {
  code: '</>',
  chart: '📊',
  palette: '🎨',
  book: '📘',
  globe: '🌐',
  flask: '🧪',
  music: '🎵',
  briefcase: '💼',
};

async function safeGetCategories(): Promise<CategoryWithStats[]> {
  try {
    return await getCategories();
  } catch {
    return [];
  }
}

export default async function CategoryGridSection() {
  const categories = await safeGetCategories();

  return (
    <section id="categories" className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">Popular Categories</h2>
          <p className="mt-3 text-ink-muted">
            Find the right tutor for whatever you&apos;re learning.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-surface-border bg-surface-muted p-12 text-center text-ink-muted">
            Categories will appear here once seeded.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.slice(0, 8).map((c) => {
              const glyph = c.iconKey ? ICON_GLYPHS[c.iconKey as IconKey] ?? '·' : '·';
              return (
                <Link
                  key={c.id}
                  href={`${ROUTES.BROWSE_TUTORS}?category=${c.slug}`}
                  className="group rounded-xl bg-surface p-6 text-center shadow-card transition hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl text-brand-700">
                    {glyph}
                  </div>
                  <p className="font-semibold text-ink">{c.name}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {c.tutorCount} {c.tutorCount === 1 ? 'tutor' : 'tutors'}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
