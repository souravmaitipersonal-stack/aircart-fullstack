'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'customer';
}

export function ProtectedRoute({ children, requiredRole = 'customer' }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole === 'admin' && user.role !== 'admin') {
      router.push('/');
      return;
    }

    if (requiredRole === 'customer' && user.role !== 'customer') {
      // Customers can only access checkout and customer pages
      if (!pathname?.includes('/checkout') && !pathname?.includes('/products')) {
        router.push('/');
      }
    }
  }, [user, isLoading, router, requiredRole, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user || (requiredRole === 'admin' && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}
