import Link from 'next/link';
import { routes } from '@/lib/constants/routes';

export default function UnauthorizedPage() {
  return (
    <div className="rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
      <div className="mb-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You don&apos;t have permission to access this resource.
        </p>
      </div>

      <Link
        href={routes.dashboard}
        className="inline-block rounded-md bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
