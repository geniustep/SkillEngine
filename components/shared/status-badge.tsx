import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<
  string,
  { variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; label: string }
> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  suspended: { variant: 'destructive', label: 'Suspended' },
  pending: { variant: 'warning', label: 'Pending' },
  completed: { variant: 'success', label: 'Completed' },
  draft: { variant: 'secondary', label: 'Draft' },
  published: { variant: 'success', label: 'Published' },
  archived: { variant: 'outline', label: 'Archived' },
  scheduled: { variant: 'default', label: 'Scheduled' },
  live: { variant: 'success', label: 'Live' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  present: { variant: 'success', label: 'Present' },
  absent: { variant: 'destructive', label: 'Absent' },
  late: { variant: 'warning', label: 'Late' },
  excused: { variant: 'secondary', label: 'Excused' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || {
    variant: 'outline' as const,
    label: status,
  };

  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      {config.label}
    </Badge>
  );
}
