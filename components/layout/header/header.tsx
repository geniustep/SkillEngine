'use client';

import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUiStore } from '@/store';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from './breadcrumbs';
import { NotificationsDropdown } from './notifications-dropdown';

export function Header() {
  const { sidebarCollapsed } = useUiStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search... (⌘K)"
          className="w-64 pl-8"
          readOnly
        />
      </div>

      {/* Notifications */}
      <NotificationsDropdown />
    </header>
  );
}
