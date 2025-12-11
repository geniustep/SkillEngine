'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { Header } from '@/components/layout/header/header';
import { ErrorBoundary } from '@/components/shared/error-boundary';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
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
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:mr-64 transition-all duration-300">
        <Header />
        <main className="flex-1">
          <ErrorBoundary>
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </ErrorBoundary>
        </main>
        {/* Footer */}
        <footer className="border-t bg-card py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} SkillEngine - نظام إدارة التعلم
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
