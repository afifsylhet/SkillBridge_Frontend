'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import PageLoader from '@/components/ui/PageLoader';
import { useToast } from '@/lib/hooks/useToast';
import {
  adminCreateBlogPost,
  adminDeleteBlogPost,
  adminListBlogPosts,
  adminUpdateBlogPost,
  type BlogPost,
} from '@/lib/api/blog';
import { formatDate } from '@/lib/utils/format';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  published: false,
};

export default function AdminBlogPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyForm);

  const filters = { q: q || undefined, page };

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'blog', filters],
    queryFn: () => adminListBlogPosts(filters),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      adminCreateBlogPost({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        published: form.published,
      }),
    onSuccess: () => {
      showToast('Post created', 'success');
      setForm(emptyForm);
      qc.invalidateQueries({ queryKey: ['admin', 'blog'] });
    },
    onError: (err: Error) => showToast(err.message || 'Failed to create post', 'error'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      adminUpdateBlogPost(id, { published }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'blog'] });
    },
    onError: (err: Error) => showToast(err.message || 'Failed to update post', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteBlogPost(id),
    onSuccess: () => {
      showToast('Post deleted', 'success');
      qc.invalidateQueries({ queryKey: ['admin', 'blog'] });
    },
    onError: (err: Error) => showToast(err.message || 'Failed to delete post', 'error'),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }
    createMutation.mutate();
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
        Blog posts
      </h1>
      <p className="mb-6 text-sm text-ink-muted">Create and publish content for the public blog.</p>

      <form
        onSubmit={handleCreate}
        className="mb-8 space-y-4 rounded-2xl border border-surface-border bg-surface p-5 shadow-card md:p-6"
      >
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">Create post</h2>
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <Input
          label="Excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
        />
        <Textarea
          label="Content"
          rows={6}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          required
        />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="rounded border-surface-border text-brand-600 focus:ring-brand-500"
          />
          Publish immediately
        </label>
        <Button type="submit" isLoading={createMutation.isPending}>
          Create post
        </Button>
      </form>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search posts…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-sm text-ink shadow-card focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-card">
        {isLoading ? (
          <PageLoader label="Loading posts…" />
        ) : error ? (
          <div className="p-6 text-sm text-danger">{error.message}</div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState headline="No blog posts" description="Create your first post above." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-muted">
                <tr>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th>Updated</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((post: BlogPost) => (
                  <tr
                    key={post.id}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                  >
                    <Td>
                      <span className="font-medium text-ink">{post.title}</span>
                      <p className="text-xs text-ink-muted">{post.slug}</p>
                    </Td>
                    <Td>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          post.published
                            ? 'bg-green-50 text-success'
                            : 'bg-amber-50 text-warning'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </Td>
                    <Td className="text-ink-muted">{formatDate(post.updatedAt)}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            toggleMutation.mutate({ id: post.id, published: !post.published })
                          }
                          isLoading={toggleMutation.isPending}
                        >
                          {post.published ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm('Delete this post?')) deleteMutation.mutate(post.id);
                          }}
                          isLoading={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-ink-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 text-sm ${className ?? ''}`}>{children}</td>;
}
