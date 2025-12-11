'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants/routes';
import { config } from '@/lib/constants/config';
import { apiClient } from '@/lib/api/client';
import { signIn, useSession } from 'next-auth/react';

interface LoginFormData {
  email: string;
  password: string;
}

interface SetupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState<LoginFormData>({ email: '', password: '' });
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [setupForm, setSetupForm] = useState<SetupFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    organizationName: 'SkillEngine Academy',
  });
  // Track if we've already initiated a redirect to prevent duplicate redirects
  const hasRedirected = useRef(false);

  // Check if system is setup
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await apiClient.get<{ data: { isSetup: boolean } }>('/auth/setup/status');
        setIsSetup(response.data.data.isSetup);
      } catch (err) {
        // If API is not available, assume setup is needed
        setIsSetup(false);
      }
    };
    checkSetup();
  }, []);

  // Redirect if authenticated (only after session is fully loaded)
  useEffect(() => {
    // Only redirect if we have a valid session with user data and haven't redirected yet
    if (status === 'authenticated' && session?.user && !hasRedirected.current) {
      hasRedirected.current = true;
      // Use window.location to avoid React state update loops
      window.location.href = routes.dashboard;
    }
  }, [status, session]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading || hasRedirected.current) return;
    
    setIsLoading(true);
    setError('');

    // Get values directly from refs to ensure we have the actual input values
    const email = emailRef.current?.value || loginForm.email;
    const password = passwordRef.current?.value || loginForm.password;

    if (!email || !password) {
      setError('البريد الإلكتروني وكلمة المرور مطلوبان');
      setIsLoading(false);
      return;
    }

    try {
      // Use NextAuth signIn with credentials provider
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || 'فشل تسجيل الدخول');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Mark as redirected to prevent duplicate redirects from useEffect
        hasRedirected.current = true;
        // Use window.location to avoid React state update loops
        window.location.href = routes.dashboard;
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('فشل تسجيل الدخول');
      setIsLoading(false);
    }
  }, [isLoading, loginForm.email, loginForm.password, router]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post<{ data: { accessToken: string; refreshToken: string; user: { tenantId: string } } }>(
        '/auth/setup',
        setupForm
      );
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Store tokens
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('tenant_id', user.tenantId);
      
      // Redirect to dashboard
      router.push(routes.dashboard);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'فشل إعداد النظام');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = () => {
    signIn('keycloak', { callbackUrl: routes.dashboard });
  };

  if (isSetup === null || status === 'loading') {
    return (
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Setup form for first-time installation
  if (!isSetup) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            إعداد {config.app.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            أنشئ حساب المسؤول الأول للبدء
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSetup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الاسم الأول
              </label>
              <input
                type="text"
                required
                value={setupForm.firstName}
                onChange={(e) => setSetupForm({ ...setupForm, firstName: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="أحمد"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                اسم العائلة
              </label>
              <input
                type="text"
                required
                value={setupForm.lastName}
                onChange={(e) => setSetupForm({ ...setupForm, lastName: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="محمد"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={setupForm.email}
              onChange={(e) => setSetupForm({ ...setupForm, email: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              كلمة المرور
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={setupForm.password}
              onChange={(e) => setSetupForm({ ...setupForm, password: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              اسم المؤسسة
            </label>
            <input
              type="text"
              value={setupForm.organizationName}
              onChange={(e) => setSetupForm({ ...setupForm, organizationName: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="SkillEngine Academy"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'جارٍ الإعداد...' : 'إعداد النظام'}
          </button>
        </form>
      </div>
    );
  }

  // Login form
  return (
    <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {config.app.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          سجل الدخول للوصول إلى لوحة التحكم
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            ref={emailRef}
            defaultValue={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            كلمة المرور
          </label>
          <input
            type="password"
            required
            ref={passwordRef}
            defaultValue={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              أو
            </span>
          </div>
        </div>

        <button
          onClick={handleSSOLogin}
          className="mt-4 w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          تسجيل الدخول عبر SSO
        </button>
      </div>
    </div>
  );
}
