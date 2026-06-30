import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'warning' | 'danger';
}

const variantStyles = {
  default: { icon: 'bg-primary/10 text-primary', value: 'text-foreground' },
  warning: { icon: 'bg-amber-100 text-amber-600', value: 'text-amber-700' },
  danger: { icon: 'bg-red-100 text-red-600', value: 'text-red-700' },
};

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: KPICardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className="bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium mb-1">{title}</p>
            <p className={cn('text-2xl font-bold leading-none', styles.value)}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 font-light">{subtitle}</p>
            )}
          </div>
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', styles.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
