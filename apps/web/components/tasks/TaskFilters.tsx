'use client';

import type { TaskFilterDto } from '@task-manager/shared';

interface TaskFiltersProps {
  filters: Partial<TaskFilterDto>;
  onChange: (filters: Partial<TaskFilterDto>) => void;
}

const selectStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  borderRadius: '8px',
  padding: '6px 12px',
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 0.15s, color 0.15s',
  appearance: 'none',
  cursor: 'pointer',
};

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const update = (key: keyof TaskFilterDto, value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const hasFilters = filters.status || filters.priority || filters.assignee;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.status ?? ''}
        onChange={(e) => update('status', e.target.value)}
        style={selectStyle}
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={filters.priority ?? ''}
        onChange={(e) => update('priority', e.target.value)}
        style={selectStyle}
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={filters.sortBy ?? 'createdAt'}
        onChange={(e) => update('sortBy', e.target.value)}
        style={selectStyle}
      >
        <option value="createdAt">Sort: Newest</option>
        <option value="dueDate">Sort: Due Date</option>
        <option value="priority">Sort: Priority</option>
      </select>

      <input
        type="text"
        placeholder="Filter by assignee…"
        value={filters.assignee ?? ''}
        onChange={(e) => update('assignee', e.target.value)}
        style={{ ...selectStyle, width: '160px' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      />

      {hasFilters && (
        <button
          onClick={() => onChange({})}
          className="text-xs transition-colors px-2 py-1 rounded-md"
          style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          Clear ×
        </button>
      )}
    </div>
  );
}
