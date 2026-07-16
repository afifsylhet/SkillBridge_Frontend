import { apiCallOrThrow } from './client';

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  author: { id: string; name: string; avatarUrl: string | null };
};

export type BlogPost = BlogPostSummary & {
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listBlogPosts(params?: { page?: number; pageSize?: number; q?: string }) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  if (params?.pageSize) sp.set('pageSize', String(params.pageSize));
  if (params?.q) sp.set('q', params.q);
  const qs = sp.toString();
  return apiCallOrThrow<{
    items: BlogPostSummary[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/blog${qs ? `?${qs}` : ''}`);
}

export async function getBlogPost(slug: string) {
  return apiCallOrThrow<BlogPost>(`/blog/${slug}`);
}

export async function adminListBlogPosts(params?: { page?: number; q?: string }) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  if (params?.q) sp.set('q', params.q);
  const qs = sp.toString();
  return apiCallOrThrow<{
    items: BlogPost[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/admin/blog${qs ? `?${qs}` : ''}`);
}

export async function adminCreateBlogPost(data: {
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  published?: boolean;
}) {
  return apiCallOrThrow<BlogPost>('/admin/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateBlogPost(
  id: string,
  data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    coverImageUrl: string | null;
    published: boolean;
  }>,
) {
  return apiCallOrThrow<BlogPost>(`/admin/blog/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteBlogPost(id: string) {
  return apiCallOrThrow(`/admin/blog/${id}`, { method: 'DELETE' });
}

export async function subscribeNewsletter(email: string) {
  return apiCallOrThrow('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function adminListNewsletter(page = 1) {
  return apiCallOrThrow<{
    items: Array<{ id: string; email: string; subscribedAt: string }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/newsletter?page=${page}`);
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  body: string;
}) {
  return apiCallOrThrow('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminListContacts(params?: { page?: number; status?: string }) {
  const sp = new URLSearchParams();
  if (params?.page) sp.set('page', String(params.page));
  if (params?.status) sp.set('status', params.status);
  const qs = sp.toString();
  return apiCallOrThrow<{
    items: Array<{
      id: string;
      name: string;
      email: string;
      subject: string;
      body: string;
      status: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/contact${qs ? `?${qs}` : ''}`);
}

export async function adminUpdateContactStatus(id: string, status: 'NEW' | 'READ' | 'ARCHIVED') {
  return apiCallOrThrow(`/contact/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function getGoogleOAuthStatus() {
  return apiCallOrThrow<{ enabled: boolean }>('/oauth/google/status');
}
