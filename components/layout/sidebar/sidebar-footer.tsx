'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarFooterProps {
  collapsed: boolean;
}

export function SidebarFooter({ collapsed }: SidebarFooterProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-3">
      <Button
        variant="ghost"
        size={collapsed ? 'icon' : 'sm'}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-full"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        {!collapsed && <span className="ml-2">Toggle theme</span>}
      </Button>
    </div>
  );
}
