'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PermissionGate } from '@/components/shared/permission-gate';
import { Permission } from '@/lib/constants/permissions';
import { Card, CardContent } from '@/components/ui/card';

export default function InstructorsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructors</h1>
          <p className="text-muted-foreground">
            Manage instructors and their availability
          </p>
        </div>
        <PermissionGate permission={Permission.INSTRUCTORS_CREATE}>
          <Button asChild>
            <Link href="/instructors/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Instructor
            </Link>
          </Button>
        </PermissionGate>
      </div>

      {/* Placeholder */}
      <Card>
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">Instructors Management</h3>
            <p className="text-sm text-muted-foreground">
              Instructor profiles and availability management coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
