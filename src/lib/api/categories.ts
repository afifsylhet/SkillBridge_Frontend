import { apiCallOrThrow } from './client';
import type { Category, CategoryWithStats, IconKey } from '@/types/category';

export async function getCategories(): Promise<CategoryWithStats[]> {
    return apiCallOrThrow<CategoryWithStats[]>('/categories', { method: 'GET' });
}

export async function createCategory(payload: { name: string; iconKey?: IconKey }): Promise<Category> {
    return apiCallOrThrow<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function updateCategory(
    id: string,
    payload: { name?: string; iconKey?: IconKey | null },
): Promise<Category> {
    return apiCallOrThrow<Category>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function deleteCategory(id: string): Promise<void> {
    await apiCallOrThrow<null>(`/categories/${id}`, { method: 'DELETE' });
}
