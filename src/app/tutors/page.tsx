import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TutorCard from '@/components/tutors/TutorCard';
import TutorFilterBar from '@/components/tutors/TutorFilterBar';
import TutorPagination from '@/components/tutors/TutorPagination';
import { getCategories } from '@/lib/api/categories';
import { getTutors } from '@/lib/api/tutors';
import type { TutorListFilters, TutorListResponse } from '@/types/tutor';
import type { CategoryWithStats } from '@/types/category';

type TutorsSearchParams = Promise<{
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
  page?: string;
}>;

function parseFilters(sp: Awaited<TutorsSearchParams>): TutorListFilters {
  const allowedSort = ['rating', 'priceAsc', 'priceDesc', 'newest'] as const;
  return {
    q: sp.q?.trim() || undefined,
    category: sp.category || undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    minRating: sp.minRating ? Number(sp.minRating) : undefined,
    sort: (allowedSort as readonly string[]).includes(sp.sort ?? '')
      ? (sp.sort as (typeof allowedSort)[number])
      : 'rating',
    page: sp.page ? Math.max(1, Number(sp.page)) : 1,
    pageSize: 12,
  };
}

async function safeData(filters: TutorListFilters): Promise<{
  data: TutorListResponse;
  categories: CategoryWithStats[];
  error?: string;
}> {
  try {
    const [data, categories] = await Promise.all([getTutors(filters), getCategories()]);
    return { data, categories };
  } catch (err) {
    return {
      data: { items: [], page: 1, pageSize: 12, total: 0 },
      categories: [],
      error: err instanceof Error ? err.message : 'Failed to load tutors',
    };
  }
}

export default async function BrowseTutorsPage({
  searchParams,
}: {
  searchParams: TutorsSearchParams;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const { data, categories, error } = await safeData(filters);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-surface-muted">
        <div className="container py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-ink md:text-4xl">Browse Tutors</h1>
            <p className="mt-2 text-ink-muted">
              {data.total} {data.total === 1 ? 'tutor' : 'tutors'} match your filters.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <TutorFilterBar categories={categories} />
            </aside>

            <section>
              {error ? (
                <div className="rounded-xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
                  {error}
                </div>
              ) : data.items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-surface-border bg-surface p-12 text-center">
                  <p className="text-lg font-semibold text-ink">No tutors match your filters</p>
                  <p className="mt-1 text-ink-muted">
                    Try clearing filters or broadening your search.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {data.items.map((t) => (
                      <TutorCard key={t.id} tutor={t} />
                    ))}
                  </div>
                  <TutorPagination
                    page={data.page}
                    pageSize={data.pageSize}
                    total={data.total}
                  />
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
