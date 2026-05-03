'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';

interface RoleGuardProps {
  requiredRoles: string[];
  children: React.ReactNode;
  userRole: string | null;
  isLoading: boolean;
}

export function RoleGuard({
  requiredRoles,
  userRole,
  isLoading,
  children,
}: RoleGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!userRole || !requiredRoles.includes(userRole)) {
        redirect('/login');
      }
      setIsAuthorized(true);
    }
  }, [isLoading, userRole, requiredRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
