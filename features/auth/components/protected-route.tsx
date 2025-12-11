'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { routes } from '@/lib/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  // Track if we've already initiated a redirect to prevent duplicate redirects
  const hasRedirected = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === 'unauthenticated' && requireAuth && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(routes.login);
    }
  }, [status, requireAuth, router, mounted]);

  // Don't render anything until mounted (to avoid hydration mismatch)
  if (!mounted) {
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (requireAuth && status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
