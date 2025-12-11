'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, type NavItem } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';
import { PermissionGate } from '@/components/shared/permission-gate';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SidebarNavProps {
  collapsed: boolean;
  onItemClick?: () => void;
}

export function SidebarNav({ collapsed, onItemClick }: SidebarNavProps) {
  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <NavItemComponent
          key={item.title}
          item={item}
          collapsed={collapsed}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
}

function NavItemComponent({
  item,
  collapsed,
  onItemClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(
    item.children?.some((child) => child.href === pathname) ?? false
  );

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname;

  if (item.permission) {
    return (
      <PermissionGate permission={item.permission}>
        <NavItemContent
          item={item}
          collapsed={collapsed}
          isActive={isActive}
          hasChildren={hasChildren}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onItemClick={onItemClick}
        />
      </PermissionGate>
    );
  }

  return (
    <NavItemContent
      item={item}
      collapsed={collapsed}
      isActive={isActive}
      hasChildren={hasChildren}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onItemClick={onItemClick}
    />
  );
}

function NavItemContent({
  item,
  collapsed,
  isActive,
  hasChildren,
  isOpen,
  setIsOpen,
  onItemClick,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  hasChildren?: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            collapsed && 'justify-center px-2'
          )}
        >
          {Icon && <Icon className="h-5 w-5 shrink-0" />}
          {!collapsed && (
            <>
              <span className="flex-1 text-right">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </>
          )}
        </button>
        {!collapsed && isOpen && (
          <div className="mr-4 mt-1 space-y-1 border-r pr-4">
            {item.children?.map((child) => {
              const childIsActive = child.href === pathname;
              return (
                <Link
                  key={child.href}
                  href={child.href || '#'}
                  onClick={onItemClick}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                    childIsActive &&
                      'bg-accent font-medium text-accent-foreground'
                  )}
                >
                  {child.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      onClick={onItemClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent font-medium text-accent-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );
}
