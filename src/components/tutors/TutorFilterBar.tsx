'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { CategoryWithStats } from '@/types/category';

interface TutorFilterBarProps {
  categories: CategoryWithStats[];
}

export default function TutorFilterBar({ categories }: TutorFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

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
      className="space-y-4 rounded-xl bg-surface p-5 shadow-card"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">Filters</h2>

      <div>
        <label htmlFor="filter-q" className="mb-1 block text-sm font-medium text-ink">
          Keyword
        </label>
        <input
          id="filter-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Name or headline"
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div>
        <label htmlFor="filter-category" className="mb-1 block text-sm font-medium text-ink">
          Category
        </label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="filter-min-price" className="mb-1 block text-sm font-medium text-ink">
            Min $/hr
          </label>
          <input
            id="filter-min-price"
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor="filter-max-price" className="mb-1 block text-sm font-medium text-ink">
            Max $/hr
          </label>
          <input
            id="filter-max-price"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="filter-min-rating" className="mb-1 block text-sm font-medium text-ink">
          Minimum rating
        </label>
        <select
          id="filter-min-rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">Any</option>
          <option value="3">3.0+</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-sort" className="mb-1 block text-sm font-medium text-ink">
          Sort by
        </label>
        <select
          id="filter-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="rating">Top rated</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
