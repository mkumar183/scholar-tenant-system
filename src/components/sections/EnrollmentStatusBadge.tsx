import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, ArrowRight } from "lucide-react";

interface EnrollmentStatusBadgeProps {
  status: 'active' | 'transferred' | 'withdrawn';
}

export const EnrollmentStatusBadge = ({ status }: EnrollmentStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          variant: 'success' as const,
          icon: Check,
          className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        };
      case 'transferred':
        return {
          variant: 'warning' as const,
          icon: ArrowRight,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        };
      case 'withdrawn':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
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