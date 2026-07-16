'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import Button from '@/components/ui/Button';
import TutorsNavSpinner from '@/components/tutors/TutorsNavSpinner';
import { signalNavigationStart } from '@/lib/navigation';
import type { CategoryWithStats } from '@/types/category';

interface TutorFilterBarProps {
  categories: CategoryWithStats[];
}

const fieldClass =
  'w-full rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-sm text-ink transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500';

export default function TutorFilterBar({ categories }: TutorFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'rating');

  const apply = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('minRating', minRating);
    if (sort && sort !== 'rating') params.set('sort', sort);
    signalNavigationStart();
    startTransition(() => {
      router.push(`/tutors${params.toString() ? `?${params.toString()}` : ''}`);
    });
  };

  const clear = () => {
    setQ('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('rating');
    signalNavigationStart();
    startTransition(() => {
      router.push('/tutors');
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="space-y-4 rounded-2xl border border-surface-border bg-surface p-5 shadow-card"
    >
      <TutorsNavSpinner show={isPending} />
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Filters</h2>

      <div className="space-y-1.5">
        <label htmlFor="filter-q" className="block text-sm font-medium text-ink">
          Keyword
        </label>
        <input
          id="filter-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name or headline"
          className={fieldClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="filter-category" className="block text-sm font-medium text-ink">
          Category
        </label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={fieldClass}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="filter-min-price" className="block text-sm font-medium text-ink">
            Min $/hr
          </label>
          <input
            id="filter-min-price"
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="filter-max-price" className="block text-sm font-medium text-ink">
            Max $/hr
          </label>
          <input
            id="filter-max-price"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="filter-min-rating" className="block text-sm font-medium text-ink">
          Minimum rating
        </label>
        <select
          id="filter-min-rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className={fieldClass}
        >
          <option value="">Any</option>
          <option value="3">3.0+</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="filter-sort" className="block text-sm font-medium text-ink">
          Sort by
        </label>
        <select
          id="filter-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={fieldClass}
        >
          <option value="rating">Top rated</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" variant="primary" className="flex-1" size="sm" isLoading={isPending}>
          Apply
        </Button>
        <Button type="button" variant="secondary" onClick={clear} size="sm" disabled={isPending}>
          Clear
        </Button>
      </div>
    </form>
  );
}
