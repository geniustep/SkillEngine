'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { Header } from '@/components/layout/header/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [showContent, setShowContent] = useState(false);
  // Track if we've already initiated a redirect to prevent duplicate redirects
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Wait for session to be determined
    if (status === 'loading') return;
    
    if (status === 'unauthenticated' && !hasRedirected.current) {
      hasRedirected.current = true;
      // Use window.location to avoid React state update loops
      window.location.href = '/login';
    } else if (status === 'authenticated') {
      setShowContent(true);
    }
  }, [status]);

  // Always show loading spinner initially and during auth check
  if (!showContent) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:mr-64">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

