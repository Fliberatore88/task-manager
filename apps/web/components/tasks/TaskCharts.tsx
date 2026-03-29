'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TaskStats } from '@task-manager/shared';

const PRIORITY_COLORS = {
  High:   '#ef4444',
  Medium: '#f59e0b',
  Low:    '#64748b',
};

export function TaskCharts({ stats }: { stats: TaskStats }) {
  const completionPct =
    stats.total === 0 ? 0 : Math.round((stats.byStatus.completed / stats.total) * 100);

  const priorityData = [
    { name: 'Low',    value: stats.byPriority.low },
    { name: 'Medium', value: stats.byPriority.medium },
    { name: 'High',   value: stats.byPriority.high },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* ── Completion progress ───────────────────────────────────── */}
      <div
        className="rounded-xl p-4 animate-fade-in-up"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', animationDelay: '40ms' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Completion
          </span>
          <span className="text-2xl font-bold tabular-nums leading-none" style={{ color: 'var(--success)' }}>
            {completionPct}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="relative h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--border-hover)' }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${completionPct}%`, background: 'var(--success)', boxShadow: '0 0 8px color-mix(in srgb, var(--success) 50%, transparent)' }}
          />
        </div>

        <div className="flex justify-between mt-2.5">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {stats.byStatus.completed} completed
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {stats.total} total
          </span>
        </div>
      </div>

      {/* ── Priority distribution ─────────────────────────────────── */}
      <div
        className="rounded-xl px-4 pt-4 pb-1 animate-fade-in-up"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', animationDelay: '80ms' }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          By Priority
        </span>
        <ResponsiveContainer width="100%" height={72}>
          <BarChart data={priorityData} margin={{ top: 6, right: 4, left: -28, bottom: 0 }} barSize={32}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.06)', radius: 4 }}
              contentStyle={{
                background:   'var(--bg-elevated)',
                border:       '1px solid var(--border-hover)',
                borderRadius: '8px',
                fontSize:     '12px',
                color:        'var(--text-primary)',
                boxShadow:    'var(--shadow-md)',
              }}
              itemStyle={{ color: 'var(--text-secondary)' }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {priorityData.map((entry) => (
                <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
