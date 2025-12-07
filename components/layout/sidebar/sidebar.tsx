'use client';

import { cn } from '@/lib/utils';
import { useUiStore } from '@/store';
import { SidebarNav } from './sidebar-nav';
import { SidebarUser } from './sidebar-user';
import { SidebarFooter } from './sidebar-footer';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUiStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">A</span>
              </div>
              <span className="text-lg font-semibold">Academy LMS</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">A</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapsed}
            className={cn(
              'h-8 w-8',
              sidebarCollapsed && 'absolute -right-3 top-6 rounded-full border bg-background shadow-md'
            )}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                sidebarCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <SidebarNav collapsed={sidebarCollapsed} />
        </ScrollArea>

        {/* User Section */}
        <div className="border-t">
          <Separator />
          <SidebarUser collapsed={sidebarCollapsed} />
          <SidebarFooter collapsed={sidebarCollapsed} />
        </div>
      </div>
    </aside>
  );
}
