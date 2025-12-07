'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const mockData = [
  { date: 'الإثنين', enrollments: 12, completions: 5 },
  { date: 'الثلاثاء', enrollments: 19, completions: 8 },
  { date: 'الأربعاء', enrollments: 15, completions: 12 },
  { date: 'الخميس', enrollments: 25, completions: 10 },
  { date: 'الجمعة', enrollments: 22, completions: 15 },
  { date: 'السبت', enrollments: 18, completions: 9 },
  { date: 'الأحد', enrollments: 16, completions: 11 },
];

export function EnrollmentTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>التسجيلات الأخيرة</CardTitle>
        <CardDescription>تسجيلات الطلاب خلال آخر 7 أيام</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="enrollments"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="التسجيلات"
            />
            <Line
              type="monotone"
              dataKey="completions"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              name="الإكمال"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
