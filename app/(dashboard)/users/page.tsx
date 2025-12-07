'use client';

import { useState } from 'react';
import { useUsers } from '@/features/users/hooks/use-users';
import { DataTable } from '@/components/tables/data-table/data-table';
import { usersColumns } from '@/components/tables/columns/users-columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { PermissionGate } from '@/components/shared/permission-gate';
import { Permission } from '@/lib/constants/permissions';
import { UserFormDialog } from '@/features/users/components/user-form-dialog';

export default function UsersPage() {
  const { data, isLoading } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">المستخدمون</h1>
          <p className="text-muted-foreground">
            إدارة الطلاب والمدربين والمديرين
          </p>
        </div>
        <PermissionGate permission={Permission.USERS_CREATE}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة مستخدم
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
          searchPlaceholder="البحث بالبريد الإلكتروني..."
        />
      )}

      {/* Create/Edit Dialog */}
      <UserFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
