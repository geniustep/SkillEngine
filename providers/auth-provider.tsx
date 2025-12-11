'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      // Reduce session polling to prevent excessive requests
      // Only refetch session every 5 minutes instead of default
      refetchInterval={5 * 60}
      // Don't refetch on window focus to prevent request storms
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
