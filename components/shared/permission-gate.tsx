'use client';

import { usePermissions } from '@/features/auth/hooks/use-permissions';

interface PermissionGateProps {
  permission?: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({
  permission,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  if (!permission) {
    return <>{children}</>;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : permissions.length === 1
      ? hasPermission(permissions[0])
      : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
