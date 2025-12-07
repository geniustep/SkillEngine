'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, Users, BookOpen, Video, GraduationCap, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { routes } from '@/lib/constants/routes';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  url: string;
  category: string;
}

const searchData: SearchResult[] = [
  // Users
  { id: '1', title: 'المستخدمون', description: 'إدارة المستخدمين', icon: Users, url: routes.users.root, category: 'الصفحات' },
  // Courses
  { id: '2', title: 'الدورات', description: 'إدارة الدورات', icon: BookOpen, url: routes.courses.root, category: 'الصفحات' },
  // Sessions
  { id: '3', title: 'الجلسات المباشرة', description: 'جدولة الجلسات', icon: Video, url: routes.sessions.root, category: 'الصفحات' },
  // Instructors
  { id: '4', title: 'المدربون', description: 'إدارة المدربين', icon: GraduationCap, url: routes.instructors.root, category: 'الصفحات' },
  // Analytics
  { id: '5', title: 'التحليلات', description: 'التقارير والإحصائيات', icon: FileText, url: routes.analytics.root, category: 'الصفحات' },
  // Settings
  { id: '6', title: 'الإعدادات', description: 'إعدادات النظام', icon: Settings, url: routes.settings.root, category: 'الصفحات' },
];

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filteredResults = searchData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (url: string) => {
    setOpen(false);
    setSearch('');
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative hidden h-10 w-64 items-center justify-start rounded-md border bg-background px-3 text-sm text-muted-foreground md:flex"
      >
        <Search className="mr-2 h-4 w-4" />
        <span>بحث... (⌘K)</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <div className="border-b">
            <div className="flex items-center px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن الصفحات والإجراءات..."
                className="flex h-12 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-4">
            {filteredResults.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                لا توجد نتائج
              </div>
            ) : (
              <div className="space-y-2">
                {filteredResults.map((result) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result.url)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="font-medium">{result.title}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.category}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
