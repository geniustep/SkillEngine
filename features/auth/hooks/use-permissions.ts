'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export function usePermissions() {
  const { data: session } = useSession();

  const permissions = useMemo(() => {
    return session?.user?.permissions || [];
  }, [session]);

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
