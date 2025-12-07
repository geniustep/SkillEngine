'use client';

import { KpiCard } from '@/components/charts/kpi-card';
import { EnrollmentTrendChart } from '@/components/charts/enrollment-trend-chart';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  // Mock data
  const stats = {
    totalStudents: 1247,
    activeEnrollments: 2389,
    averageCompletion: 78.5,
    totalRevenue: 124750,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">التحليلات</h1>
        <p className="text-muted-foreground">
          نظرة شاملة على أداء الأكاديمية
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="إجمالي الطلاب"
          value={formatNumber(stats.totalStudents)}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          description="هذا الشهر"
        />
        <KpiCard
          title="التسجيلات النشطة"
          value={formatNumber(stats.activeEnrollments)}
          icon={BookOpen}
          trend={{ value: 8.2, isPositive: true }}
          description="في جميع الدورات"
        />
        <KpiCard
          title="معدل الإكمال"
          value={`${stats.averageCompletion}%`}
          icon={Award}
          trend={{ value: 3.1, isPositive: true }}
          description="للدورات المنشورة"
        />
        <KpiCard
          title="إجمالي الإيرادات"
          value={formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          trend={{ value: 19.6, isPositive: true }}
          description="جميع الأوقات"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <EnrollmentTrendChart />
        <RevenueChart />
      </div>
    </div>
  );
}
