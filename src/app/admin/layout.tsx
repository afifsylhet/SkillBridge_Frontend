import { getCurrentUser } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Server-side role guard
  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar role="ADMIN" />
      <main className="flex-1 overflow-y-auto bg-surface-muted">
        <div className="container py-7 md:py-9">{children}</div>
      </main>
    </div>
  );
}
