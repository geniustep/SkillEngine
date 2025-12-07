'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Course } from '@/lib/types/course.types';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/constants/routes';
import { Badge } from '@/components/ui/badge';

export const coursesColumns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: 'الدورة',
    cell: ({ row }) => {
      const course = row.original;
      return (
        <div className="flex items-center gap-3">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-10 w-16 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium">{course.title}</div>
            {course.shortDescription && (
              <div className="text-sm text-muted-foreground line-clamp-1">
                {course.shortDescription}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'instructor',
    header: 'المدرب',
    cell: ({ row }) => {
      const instructor = row.original.instructor;
      return instructor
        ? `${instructor.firstName} ${instructor.lastName}`
        : '-';
    },
  },
  {
    accessorKey: 'level',
    header: 'المستوى',
    cell: ({ row }) => {
      const levelMap: Record<string, string> = {
        beginner: 'مبتدئ',
        intermediate: 'متوسط',
        advanced: 'متقدم',
      };
      return (
        <Badge variant="outline">
          {levelMap[row.getValue('level')] || row.getValue('level')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'enrollmentCount',
    header: 'التسجيلات',
    cell: ({ row }) => row.getValue('enrollmentCount') || 0,
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'price',
    header: 'السعر',
    cell: ({ row }) => {
      const price = row.getValue('price');
      return price ? formatCurrency(price as number) : 'مجاني';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.courses.view(course.id)}>
                <Eye className="mr-2 h-4 w-4" />
                عرض
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.courses.edit(course.id)}>
                <Edit className="mr-2 h-4 w-4" />
                تعديل
              </Link>
            </DropdownMenuItem>
            {course.status === 'draft' && (
              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4" />
                نشر
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
