'use client';

import { cn } from '@/lib/utils';
import { useUiStore } from '@/store';
import { SidebarNav } from './sidebar-nav';
import { SidebarUser } from './sidebar-user';
import { SidebarFooter } from './sidebar-footer';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed, sidebarOpen, setSidebarOpen } = useUiStore();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop Sidebar
  const DesktopSidebar = (
    <aside
      className={cn(
        'fixed right-0 top-0 z-40 h-screen border-l bg-card transition-all duration-300 hidden lg:block',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">S</span>
              </div>
              <span className="text-lg font-semibold">SkillEngine</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">S</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapsed}
            className={cn(
              'h-8 w-8',
              sidebarCollapsed && 'absolute -left-3 top-6 rounded-full border bg-background shadow-md'
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

  // Mobile Sidebar Content
  const MobileSidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo/Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">S</span>
          </div>
          <span className="text-lg font-semibold">SkillEngine</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <SidebarNav collapsed={false} onItemClick={() => setSidebarOpen(false)} />
      </ScrollArea>

      {/* User Section */}
      <div className="border-t">
        <Separator />
        <SidebarUser collapsed={false} />
        <SidebarFooter collapsed={false} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {DesktopSidebar}

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="w-64 p-0">
          {MobileSidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
