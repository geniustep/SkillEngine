'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export function NotificationsDropdown() {
  const unreadCount = 3; // This would come from your notifications store/API

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">New enrollment</span>
              <span className="text-xs text-muted-foreground">5 min ago</span>
            </div>
            <p className="text-sm text-muted-foreground">
              John Doe enrolled in React Advanced Course
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">Session starting soon</span>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Live session starts in 30 minutes
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">Course completed</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Jane Smith completed JavaScript Basics
            </p>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center font-medium">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
