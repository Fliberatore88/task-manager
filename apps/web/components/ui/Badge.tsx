import { cn } from '@/lib/utils';

const keyMap: Record<string, string> = {
  pending:      'pending',
  'in-progress':'progress',
  completed:    'done',
  low:          'low',
  medium:       'medium',
  high:         'high',
  overdue:      'overdue',
};

type BadgeVariant = keyof typeof keyMap;

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const k = keyMap[variant] ?? variant;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border',
        className,
      )}
      style={{
        background:   `var(--badge-${k}-bg)`,
        color:        `var(--badge-${k}-text)`,
        borderColor:  `var(--badge-${k}-border)`,
      }}
    >
      {children}
    </span>
  );
}
