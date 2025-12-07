'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (provider = 'keycloak') => {
    await signIn(provider, { callbackUrl: routes.dashboard });
  };

  const logout = async () => {
    await signOut({ callbackUrl: routes.login });
  };

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    session,
  };
}
