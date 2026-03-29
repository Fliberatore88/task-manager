'use client';

import type { TaskStats } from '@task-manager/shared';

interface StatCardProps {
  label: string;
  value: number;
  accent: string;   // border + glow color
  delay?: number;
}

function StatCard({ label, value, accent, delay = 0 }: StatCardProps) {
  return (
    <div
      className="animate-fade-in-up rounded-xl p-4 flex flex-col gap-1.5 relative overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderTop: `1px solid ${accent}`,
        animationDelay: `${delay}ms`,
        boxShadow: `0 0 20px -8px ${accent}`,
      }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
      <span
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </div>
  );
}

export function StatsBar({ stats }: { stats: TaskStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard label="Total"       value={stats.total}                    accent="rgba(148,163,184,0.4)" delay={0}   />
      <StatCard label="Pending"     value={stats.byStatus.pending}         accent="rgba(251,191,36,0.5)"  delay={50}  />
      <StatCard label="In Progress" value={stats.byStatus['in-progress']}  accent="rgba(34,211,238,0.5)"  delay={100} />
      <StatCard label="Completed"   value={stats.byStatus.completed}       accent="rgba(52,211,153,0.5)"  delay={150} />
      <StatCard label="High"        value={stats.byPriority.high}          accent="rgba(248,113,113,0.5)" delay={200} />
      <StatCard label="Low"         value={stats.byPriority.low}           accent="rgba(100,116,139,0.4)" delay={250} />
    </div>
  );
}
