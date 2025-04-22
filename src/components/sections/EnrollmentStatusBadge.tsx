import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";

interface EnrollmentStatusBadgeProps {
  status: 'active' | 'transferred' | 'withdrawn' | 'pending';
}

export const EnrollmentStatusBadge = ({ status }: EnrollmentStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          icon: Check,
          className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        };
      case 'transferred':
        return {
          variant: 'secondary' as const,
          icon: ArrowRight,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        };
      case 'withdrawn':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
        };
      case 'pending':
        return {
          variant: 'secondary' as const,
          icon: Check,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        };
      default:
        return {
          variant: 'outline' as const,
          icon: AlertTriangle,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};