'use client';

import type { TaskFilterDto } from '@task-manager/shared';

interface TaskFiltersProps {
  filters: Partial<TaskFilterDto>;
  onChange: (filters: Partial<TaskFilterDto>) => void;
}

const selectStyle = {
  background:  'var(--bg-surface)',
  border:      '1px solid var(--border)',
  color:       'var(--text-primary)',
  borderRadius:'8px',
  padding:     '0.375rem 0.625rem',
  fontSize:    '0.8125rem',
  fontFamily:  'inherit',
  outline:     'none',
  cursor:      'pointer',
  transition:  'border-color 0.15s',
  minWidth:    '110px',
} as React.CSSProperties;

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const set = (key: keyof TaskFilterDto, value: string) =>
    onChange({ ...filters, [key]: value || undefined });

  const hasActive = filters.status || filters.priority || filters.assignee;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status */}
      <select
        value={filters.status ?? ''}
        onChange={e => set('status', e.target.value)}
        aria-label="Filter by status"
        style={selectStyle}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority */}
      <select
        value={filters.priority ?? ''}
        onChange={e => set('priority', e.target.value)}
        aria-label="Filter by priority"
        style={selectStyle}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Assignee search */}
      <input
        type="text"
        placeholder="Assignee…"
        value={filters.assignee ?? ''}
        onChange={e => set('assignee', e.target.value)}
        aria-label="Filter by assignee"
        className="field-input"
        style={{ minWidth: '120px', maxWidth: '160px', padding: '0.375rem 0.625rem', fontSize: '0.8125rem' }}
      />

      {/* Divider */}
      <div className="w-px h-5 mx-1 shrink-0" style={{ background: 'var(--border)' }} />

      {/* Sort by */}
      <select
        value={filters.sortBy ?? 'createdAt'}
        onChange={e => set('sortBy', e.target.value)}
        aria-label="Sort by"
        style={selectStyle}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <option value="createdAt">Newest</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      {/* Sort order */}
      <select
        value={filters.sortOrder ?? 'desc'}
        onChange={e => set('sortOrder', e.target.value)}
        aria-label="Sort order"
        style={{ ...selectStyle, minWidth: '80px' }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <option value="desc">↓ Desc</option>
        <option value="asc">↑ Asc</option>
      </select>

      {/* Clear */}
      {hasActive && (
        <button
          onClick={() => onChange({})}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 animate-slide-in"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--danger)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
