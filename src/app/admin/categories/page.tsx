'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/lib/hooks/useToast';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/lib/api/categories';
import { ICON_KEYS, type CategoryWithStats, type IconKey } from '@/types/category';
import PageLoader from '@/components/ui/PageLoader';
import EmptyState from '@/components/ui/EmptyState';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const qc = useQueryClient();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState<IconKey>('code');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState<IconKey>('code');

  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] });

  const createMutation = useMutation({
    mutationFn: () => createCategory({ name: newName.trim(), iconKey: newIcon }),
    onSuccess: () => {
      showToast('Category created', 'success');
      setNewName('');
      setNewIcon('code');
      invalidate();
    },
    onError: (err: Error) => showToast(err.message || 'Failed to create', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateCategory(editingId ?? '', { name: editName.trim(), iconKey: editIcon }),
    onSuccess: () => {
      showToast('Category updated', 'success');
      setEditingId(null);
      invalidate();
    },
    onError: (err: Error) => showToast(err.message || 'Failed to update', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      showToast('Category deleted', 'success');
      invalidate();
    },
    onError: (err: Error) => showToast(err.message || 'Failed to delete', 'error'),
  });

  const startEdit = (c: CategoryWithStats) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditIcon((c.iconKey as IconKey) ?? 'code');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Categories</h1>

      <section className="mb-6 rounded-xl bg-surface p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold">Add new category</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            label="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Web Development"
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Icon</label>
            <select
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value as IconKey)}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-ink"
            >
              {ICON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={() => createMutation.mutate()}
              isLoading={createMutation.isPending}
              disabled={!newName.trim()}
              className="w-full"
            >
              Add
            </Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-muted">The slug is auto-generated from the name.</p>
      </section>

      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        {isLoading ? (
          <PageLoader label="Loading categories…" />
        ) : error ? (
          <div className="p-6 text-sm text-danger">
            Could not load categories: {error.message}
          </div>
        ) : !categories || categories.length === 0 ? (
          <EmptyState
            headline="No categories available"
            description="Add your first category using the form above."
          />
        ) : (
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                <Th>Name</Th>
                <Th>Slug</Th>
                <Th>Icon</Th>
                <Th>Tutors</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) =>
                editingId === c.id ? (
                  <tr key={c.id} className="border-b border-surface-border bg-brand-50/30">
                    <Td>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded border border-surface-border bg-surface px-2 py-1 text-sm"
                      />
                    </Td>
                    <Td className="text-ink-muted">{c.slug}</Td>
                    <Td>
                      <select
                        value={editIcon}
                        onChange={(e) => setEditIcon(e.target.value as IconKey)}
                        className="rounded border border-surface-border bg-surface px-2 py-1 text-sm"
                      >
                        {ICON_KEYS.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </Td>
                    <Td>{c.tutorCount}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateMutation.mutate()}
                          isLoading={updateMutation.isPending}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ) : (
                  <tr
                    key={c.id}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                  >
                    <Td>
                      <span className="font-medium text-ink">{c.name}</span>
                    </Td>
                    <Td className="text-ink-muted">{c.slug}</Td>
                    <Td className="text-ink-muted">{c.iconKey ?? '—'}</Td>
                    <Td>{c.tutorCount}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => startEdit(c)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm(`Delete "${c.name}"? This cannot be undone.`)) {
                              deleteMutation.mutate(c.id);
                            }
                          }}
                          isLoading={
                            deleteMutation.isPending && deleteMutation.variables === c.id
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
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
  return <td className={`px-6 py-4 text-sm text-ink ${className ?? ''}`}>{children}</td>;
}
