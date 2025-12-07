'use client';

import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { Header } from '@/components/layout/header/header';
import { useUiStore } from '@/store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
