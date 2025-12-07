'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

const mockData = [
  { month: 'يناير', revenue: 24500 },
  { month: 'فبراير', revenue: 28200 },
  { month: 'مارس', revenue: 31800 },
  { month: 'أبريل', revenue: 29500 },
  { month: 'مايو', revenue: 35200 },
  { month: 'يونيو', revenue: 38900 },
];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الإيرادات الشهرية</CardTitle>
        <CardDescription>إيرادات آخر 6 أشهر</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="الإيرادات" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
