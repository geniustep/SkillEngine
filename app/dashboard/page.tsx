'use client';

import { KpiCard } from '@/components/charts/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Video, GraduationCap, TrendingUp } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your academy.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Students"
          value={formatNumber(stats.totalStudents)}
          icon={Users}
          description={`${stats.activeStudents} active`}
          trend={{ value: 12.5, isPositive: true }}
        />
        <KpiCard
          title="Published Courses"
          value={stats.publishedCourses}
          icon={BookOpen}
          description={`${stats.totalCourses} total`}
          trend={{ value: 8.2, isPositive: true }}
        />
        <KpiCard
          title="Active Instructors"
          value={stats.activeInstructors}
          icon={GraduationCap}
          description={`${stats.totalInstructors} total`}
        />
        <KpiCard
          title="Revenue This Month"
          value={formatCurrency(stats.revenue.thisMonth)}
          icon={TrendingUp}
          trend={{ value: stats.revenue.growth, isPositive: true }}
          description="vs last month"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Student enrollments over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart will be implemented with Recharts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Live sessions scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '10:00 AM', title: 'React Advanced Patterns', instructor: 'John Doe' },
                { time: '2:00 PM', title: 'JavaScript Fundamentals', instructor: 'Jane Smith' },
                { time: '4:30 PM', title: 'Node.js Best Practices', instructor: 'Bob Wilson' },
              ].map((session, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">{session.instructor}</p>
                  </div>
                  <div className="text-sm font-medium">{session.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Course Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completionRate}%</div>
            <p className="text-sm text-muted-foreground">Average completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
            <p className="text-sm text-muted-foreground">{stats.upcomingSessions} scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.revenue.total)}</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

