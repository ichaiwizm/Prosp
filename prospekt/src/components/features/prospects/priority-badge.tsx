import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Basse', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  medium: { label: 'Moyenne', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  high: { label: 'Haute', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  urgent: { label: 'Urgente', className: 'bg-red-100 text-red-700 border-red-200' },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
