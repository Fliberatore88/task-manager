import { cn } from '@/lib/utils';

const variants = {
  pending:      'bg-amber-400/10  text-amber-300  border border-amber-400/20',
  'in-progress':'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20',
  completed:    'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20',
  low:          'bg-slate-400/10  text-slate-400  border border-slate-500/20',
  medium:       'bg-orange-400/10 text-orange-300 border border-orange-400/20',
  high:         'bg-red-400/10    text-red-300    border border-red-400/20',
  overdue:      'bg-red-500/20    text-red-300    border border-red-500/30',
};

type BadgeVariant = keyof typeof variants;

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
