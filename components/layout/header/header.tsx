'use client';

import { useUiStore } from '@/store';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from './breadcrumbs';
import { NotificationsDropdown } from './notifications-dropdown';
import { SearchCommand } from './search-command';

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

      {/* Search Command */}
      <SearchCommand />

      {/* Notifications */}
      <NotificationsDropdown />
    </header>
  );
}
