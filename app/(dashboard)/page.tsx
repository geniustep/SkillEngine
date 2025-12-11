'use client';

import { KpiCard } from '@/components/charts/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  BookOpen,
  Video,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  Calendar,
  Clock,
  PlayCircle,
  ChevronLeft,
  BarChart3,
  FileText,
  Settings,
  Bell,
} from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data - replace with real API data using useDashboardStats()
  const stats = {
    totalStudents: 1247,
    activeStudents: 1089,
    totalCourses: 48,
    publishedCourses: 42,
    totalInstructors: 23,
    activeInstructors: 20,
    totalSessions: 156,
    upcomingSessions: 12,
    revenue: {
      total: 124750,
      thisMonth: 28950,
      lastMonth: 24200,
      growth: 19.6,
    },
    completionRate: 78.5,
  };

  const upcomingSessions = [
    {
      id: '1',
      time: '10:00 AM',
      title: 'React Advanced Patterns',
      instructor: 'أحمد محمد',
      avatar: '/avatars/01.png',
      students: 24,
    },
    {
      id: '2',
      time: '2:00 PM',
      title: 'JavaScript Fundamentals',
      instructor: 'سارة علي',
      avatar: '/avatars/02.png',
      students: 32,
    },
    {
      id: '3',
      time: '4:30 PM',
      title: 'Node.js Best Practices',
      instructor: 'محمد خالد',
      avatar: '/avatars/03.png',
      students: 18,
    },
  ];

  const recentEnrollments = [
    { name: 'فاطمة أحمد', course: 'تطوير الويب', date: 'منذ 5 دقائق' },
    { name: 'علي حسن', course: 'React.js', date: 'منذ 15 دقيقة' },
    { name: 'نور محمد', course: 'Node.js', date: 'منذ ساعة' },
    { name: 'سلمى خالد', course: 'Python', date: 'منذ ساعتين' },
  ];

  const quickLinks = [
    { title: 'المستخدمين', href: '/users', icon: Users, color: 'bg-blue-500' },
    { title: 'الدورات', href: '/courses', icon: BookOpen, color: 'bg-green-500' },
    { title: 'الجلسات', href: '/sessions', icon: Video, color: 'bg-purple-500' },
    { title: 'المدربين', href: '/instructors', icon: GraduationCap, color: 'bg-orange-500' },
    { title: 'التحليلات', href: '/analytics', icon: BarChart3, color: 'bg-pink-500' },
    { title: 'الإعدادات', href: '/settings', icon: Settings, color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            مرحباً بك! إليك نظرة عامة على أكاديميتك
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/analytics">
              <BarChart3 className="ml-2 h-4 w-4" />
              التقارير
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/courses/new">
              إضافة دورة جديدة
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="إجمالي الطلاب"
          value={formatNumber(stats.totalStudents)}
          icon={Users}
          description={`${stats.activeStudents} نشط`}
          trend={{ value: 12.5, isPositive: true }}
        />
        <KpiCard
          title="الدورات المنشورة"
          value={stats.publishedCourses}
          icon={BookOpen}
          description={`${stats.totalCourses} إجمالي`}
          trend={{ value: 8.2, isPositive: true }}
        />
        <KpiCard
          title="المدربين النشطين"
          value={stats.activeInstructors}
          icon={GraduationCap}
          description={`${stats.totalInstructors} إجمالي`}
        />
        <KpiCard
          title="إيرادات الشهر"
          value={formatCurrency(stats.revenue.thisMonth)}
          icon={TrendingUp}
          trend={{ value: stats.revenue.growth, isPositive: true }}
          description="مقارنة بالشهر الماضي"
        />
      </div>

      {/* Quick Links - Mobile Friendly */}
      <Card className="lg:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">الوصول السريع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors hover:bg-accent"
              >
                <div className={`rounded-lg p-2 ${link.color}`}>
                  <link.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium">{link.title}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">الجلسات القادمة</CardTitle>
              <CardDescription>الجلسات المجدولة لليوم</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sessions">
                عرض الكل
                <ChevronLeft className="mr-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{session.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{session.instructor}</span>
                      <span>•</span>
                      <span>{session.students} طالب</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="ml-1 h-3 w-3" />
                      {session.time}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <PlayCircle className="ml-1 h-3 w-3" />
                      بدء
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">التسجيلات الأخيرة</CardTitle>
              <CardDescription>آخر التسجيلات في الدورات</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/users?filter=students">
                عرض الكل
                <ChevronLeft className="mr-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEnrollments.map((enrollment, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {enrollment.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{enrollment.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      سجّل في {enrollment.course}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {enrollment.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">معدل الإكمال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-3xl font-bold">{stats.completionRate}%</div>
                <Progress value={stats.completionRate} className="mt-2 h-2" />
              </div>
              <div className="text-sm text-muted-foreground">
                متوسط معدل<br />إكمال الدورات
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">إجمالي الجلسات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-3xl font-bold">{stats.totalSessions}</div>
                <p className="text-sm text-muted-foreground">
                  {stats.upcomingSessions} مجدولة
                </p>
              </div>
              <Button variant="outline" size="sm" className="mr-auto" asChild>
                <Link href="/sessions/new">
                  <Calendar className="ml-2 h-4 w-4" />
                  جدولة جلسة
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{formatCurrency(stats.revenue.total)}</div>
                <p className="text-sm text-muted-foreground">منذ البداية</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/analytics/revenue">
                  <BarChart3 className="ml-2 h-4 w-4" />
                  التفاصيل
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards - Desktop */}
      <div className="hidden lg:grid gap-4 grid-cols-4">
        <Link
          href="/users"
          className="group rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium group-hover:text-primary">إدارة المستخدمين</h3>
              <p className="text-sm text-muted-foreground">عرض وإدارة الطلاب</p>
            </div>
            <ArrowRight className="mr-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>

        <Link
          href="/courses"
          className="group rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-900/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium group-hover:text-primary">إدارة الدورات</h3>
              <p className="text-sm text-muted-foreground">إنشاء وتعديل الدورات</p>
            </div>
            <ArrowRight className="mr-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>

        <Link
          href="/sessions"
          className="group rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/20">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium group-hover:text-primary">الجلسات المباشرة</h3>
              <p className="text-sm text-muted-foreground">إدارة الجلسات الحية</p>
            </div>
            <ArrowRight className="mr-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>

        <Link
          href="/analytics"
          className="group rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium group-hover:text-primary">التحليلات</h3>
              <p className="text-sm text-muted-foreground">عرض الإحصائيات</p>
            </div>
            <ArrowRight className="mr-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>
      </div>
    </div>
  );
}
