import { Suspense } from 'react';
import TutorCard from '@/components/tutors/TutorCard';
import TutorFilterBar from '@/components/tutors/TutorFilterBar';
import TutorPagination from '@/components/tutors/TutorPagination';
import Skeleton from '@/components/ui/Skeleton';
import { getCategories } from '@/lib/api/categories';
import { getTutors } from '@/lib/api/tutors';
import type { TutorListFilters, TutorListResponse } from '@/types/tutor';
import type { CategoryWithStats } from '@/types/category';

export type TutorsSearchParams = {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
  page?: string;
};

function parseFilters(sp: TutorsSearchParams): TutorListFilters {
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

export function tutorsSearchKey(sp: TutorsSearchParams): string {
  const params = new URLSearchParams();
  if (sp.q) params.set('q', sp.q);
  if (sp.category) params.set('category', sp.category);
  if (sp.minPrice) params.set('minPrice', sp.minPrice);
  if (sp.maxPrice) params.set('maxPrice', sp.maxPrice);
  if (sp.minRating) params.set('minRating', sp.minRating);
  if (sp.sort) params.set('sort', sp.sort);
  if (sp.page) params.set('page', sp.page);
  return params.toString() || 'default';
}

export default async function TutorsBrowseContent({ sp }: { sp: TutorsSearchParams }) {
  const filters = parseFilters(sp);
  const { data, categories, error } = await safeData(filters);

  return (
    <>
      <p className="mb-8 mt-2 text-ink-soft md:mb-10">
        {data.total} {data.total === 1 ? 'tutor' : 'tutors'} match your filters.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[17.5rem_1fr] lg:gap-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<Skeleton variant="card" className="h-80" />}>
            <TutorFilterBar categories={categories} />
          </Suspense>
        </aside>

        <section>
          {error ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6 text-sm text-danger">
              {error}
            </div>
          ) : data.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-border bg-surface p-12 text-center">
              <p className="text-lg font-semibold text-ink">No tutors match your filters</p>
              <p className="mt-2 text-sm text-ink-muted">
                Try clearing filters or broadening your search.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {data.items.map((t) => (
                  <TutorCard key={t.id} tutor={t} />
                ))}
              </div>
              <Suspense fallback={null}>
                <TutorPagination page={data.page} pageSize={data.pageSize} total={data.total} />
              </Suspense>
            </>
          )}
        </section>
      </div>
    </>
  );
}
