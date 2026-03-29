'use client';

import type { TaskStats } from '@task-manager/shared';

interface StatItem {
  label: string;
  value: number;
  colorVar: string;
  icon: React.ReactNode;
  delay: number;
}

function StatCard({ label, value, colorVar, icon, delay }: StatItem) {
  return (
    <div
      className="animate-fade-in-up rounded-xl p-4 flex items-center gap-3.5 min-w-0"
      style={{
        background:  'var(--bg-card)',
        border:      '1px solid var(--border)',
        boxShadow:   'var(--shadow-card)',
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in srgb, ${colorVar} 12%, transparent)`, color: colorVar }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xl font-bold tabular-nums leading-none" style={{ color: 'var(--text-primary)' }}>
          {value}
        </div>
        <div className="text-xs font-medium mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export function StatsBar({ stats }: { stats: TaskStats }) {
  const items: StatItem[] = [
    {
      label: 'Total',
      value: stats.total,
      colorVar: 'var(--text-secondary)',
      delay: 0,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      label: 'Pending',
      value: stats.byStatus.pending,
      colorVar: 'var(--warning)',
      delay: 40,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: 'In Progress',
      value: stats.byStatus['in-progress'],
      colorVar: 'var(--info)',
      delay: 80,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      ),
    },
    {
      label: 'Completed',
      value: stats.byStatus.completed,
      colorVar: 'var(--success)',
      delay: 120,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
    },
    {
      label: 'High Priority',
      value: stats.byPriority.high,
      colorVar: 'var(--danger)',
      delay: 160,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    {
      label: 'Low Priority',
      value: stats.byPriority.low,
      colorVar: 'var(--text-muted)',
      delay: 200,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}
