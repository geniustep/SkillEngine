'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PermissionGate } from '@/components/shared/permission-gate';
import { Permission } from '@/lib/constants/permissions';
import { Card, CardContent } from '@/components/ui/card';

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Sessions</h1>
          <p className="text-muted-foreground">
            Schedule and manage live class sessions
          </p>
        </div>
        <PermissionGate permission={Permission.SESSIONS_CREATE}>
          <Button asChild>
            <Link href="/sessions/new">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Session
            </Link>
          </Button>
        </PermissionGate>
      </div>

      {/* Placeholder */}
      <Card>
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">Sessions Management</h3>
            <p className="text-sm text-muted-foreground">
              Live session scheduling and calendar view coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
