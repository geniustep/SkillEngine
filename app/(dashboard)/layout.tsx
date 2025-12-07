'use client';

import { ProtectedRoute } from '@/features/auth/components/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar will go here */}
        <main className="flex-1">
          {/* Header will go here */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
