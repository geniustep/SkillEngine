'use client';

import { useCourses } from '@/features/courses/hooks/use-courses';
import { DataTable } from '@/components/tables/data-table/data-table';
import { coursesColumns } from '@/components/tables/columns/courses-columns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { PermissionGate } from '@/components/shared/permission-gate';
import { Permission } from '@/lib/constants/permissions';

export default function CoursesPage() {
  const { data, isLoading } = useCourses();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الدورات</h1>
          <p className="text-muted-foreground">
            إدارة كتالوج دورات الأكاديمية
          </p>
        </div>
        <PermissionGate permission={Permission.COURSES_CREATE}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            إنشاء دورة
          </Button>
        </PermissionGate>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={coursesColumns}
          data={data?.data || []}
          searchKey="title"
          searchPlaceholder="البحث عن دورة..."
        />
      )}
    </div>
  );
}
