import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ProspectStatus = 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

interface StatusBadgeProps {
  status: ProspectStatus;
  className?: string;
}

const statusConfig: Record<ProspectStatus, { label: string; className: string }> = {
  lead: { label: 'Lead', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  contacted: { label: 'Contact\u00e9', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  qualified: { label: 'Qualifi\u00e9', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  proposal: { label: 'Proposition', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  negotiation: { label: 'N\u00e9gociation', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  won: { label: 'Gagn\u00e9', className: 'bg-green-100 text-green-800 border-green-200' },
  lost: { label: 'Perdu', className: 'bg-red-100 text-red-800 border-red-200' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.lead;

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
