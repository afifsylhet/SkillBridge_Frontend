import Link from 'next/link';
import { getCategories } from '@/lib/api/categories';
import SectionHeader from '@/components/ui/SectionHeader';
import { ROUTES } from '@/lib/constants/routes';
import type { CategoryWithStats, IconKey } from '@/types/category';

const ICON_GLYPHS: Record<IconKey, string> = {
  code: '</>',
  chart: '◆',
  palette: '◇',
  book: '▣',
  globe: '◎',
  flask: '△',
  music: '♪',
  briefcase: '▢',
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
    <section id="categories" className="section-y bg-surface">
      <div className="container">
        <SectionHeader
          align="left"
          title="Popular categories"
          description="Find the right tutor for whatever you’re learning."
          action={
            <Link
              href={ROUTES.BROWSE_TUTORS}
              className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
            >
              Browse all →
            </Link>
          }
        />

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border bg-surface-muted px-6 py-12 text-center text-ink-muted">
            Categories will appear here once seeded.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {categories.slice(0, 8).map((c) => {
              const glyph = c.iconKey ? ICON_GLYPHS[c.iconKey as IconKey] ?? '·' : '·';
              return (
                <Link
                  key={c.id}
                  href={`${ROUTES.BROWSE_TUTORS}?category=${c.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-surface-border bg-surface-muted/60 p-5 transition hover:border-brand-400 hover:bg-surface md:p-6"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-2xl font-semibold text-brand-700 transition group-hover:bg-brand-100 md:h-16 md:w-16 md:text-3xl">
                    {glyph}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {c.tutorCount} {c.tutorCount === 1 ? 'tutor' : 'tutors'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
