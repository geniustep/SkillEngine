'use client';

import { useUsers } from '@/features/users/hooks/use-users';
import { DataTable } from '@/components/tables/data-table/data-table';
import { usersColumns } from '@/components/tables/columns/users-columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { PermissionGate } from '@/components/shared/permission-gate';
import { Permission } from '@/lib/constants/permissions';

export default function UsersPage() {
  const { data, isLoading } = useUsers();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage students, instructors, and administrators
          </p>
        </div>
        <PermissionGate permission={Permission.USERS_CREATE}>
          <Button asChild>
            <Link href="/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </PermissionGate>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={usersColumns}
          data={data?.data || []}
          searchKey="email"
          searchPlaceholder="Search by email..."
        />
      )}
    </div>
  );
}
