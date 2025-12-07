'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';
import { config } from '@/lib/constants/config';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(routes.dashboard);
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    await login('keycloak');
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {config.app.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to access your dashboard
        </p>
      </div>

      <button
        onClick={handleLogin}
        className="w-full rounded-md bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Sign in with SSO
      </button>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Use your organization credentials to sign in
      </p>
    </div>
  );
}
