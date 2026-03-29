'use client';

import type { Task } from '@task-manager/shared';
import { Badge } from '@/components/ui/Badge';
import { formatDate, isOverdue } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  index?: number;
  isExiting?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusBorderVar: Record<string, string> = {
  pending:      'var(--status-pending)',
  'in-progress':'var(--status-progress)',
  completed:    'var(--status-completed)',
};

const cardBgVar: Record<string, string> = {
  pending:      'var(--card-bg-pending)',
  'in-progress':'var(--card-bg-progress)',
  completed:    'var(--card-bg-completed)',
};

const priorityDot: Record<string, string> = {
  high:   'var(--danger)',
  medium: 'var(--warning)',
  low:    'var(--text-muted)',
};

const statusLabel: Record<string, string> = {
  pending:      'Pending',
  'in-progress':'In Progress',
  completed:    'Completed',
};

const priorityLabel: Record<string, string> = {
  high:   'High',
  medium: 'Medium',
  low:    'Low',
};

export function TaskCard({ task, index = 0, isExiting = false, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);
  const borderColor = statusBorderVar[task.status] ?? 'var(--border)';
  const cardBg = cardBgVar[task.status] ?? 'var(--bg-card)';

  return (
    <article
      tabIndex={0}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('.task-action-bar')) {
          (e.currentTarget as HTMLElement).focus();
        }
      }}
      className={`card flex flex-col overflow-hidden focus:outline-none ${isExiting ? 'animate-fade-out' : 'animate-fade-in-up'}`}
      style={{ animationDelay: `${index * 40}ms`, background: cardBg }}
    >
      {/* Status stripe */}
      <div className="h-0.5 w-full" style={{ background: borderColor, opacity: 0.7 }} />

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2 flex-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {task.title}
          </h3>
          {/* Priority dot */}
          <div
            className="w-2 h-2 rounded-full shrink-0 mt-1"
            title={`${priorityLabel[task.priority]} priority`}
            style={{ background: priorityDot[task.priority] ?? 'var(--text-muted)' }}
          />
        </div>

        {/* Description */}
        {task.description && (
          <p
            className="text-xs leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={task.status}>{statusLabel[task.status]}</Badge>
          <Badge variant={task.priority}>{priorityLabel[task.priority]}</Badge>
          {overdue && <Badge variant="overdue">Overdue</Badge>}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-auto pt-1">
          {task.assignee && (
            <div className="flex items-center gap-1.5 min-w-0">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{
                  background: 'var(--accent-subtle)',
                  color:      'var(--accent)',
                  fontSize:   '9px',
                }}
              >
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                {task.assignee}
              </span>
            </div>
          )}
          {task.dueDate && (
            <div
              className="flex items-center gap-1 ml-auto shrink-0"
              style={{ color: overdue ? 'var(--danger)' : 'var(--text-muted)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-xs font-medium">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action bar — always visible on touch, hover-revealed on desktop */}
      <div
        className="task-action-bar flex items-center justify-end gap-1.5 px-4 py-2.5"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150"
          style={{ color: 'var(--text-secondary)', background: 'transparent' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-subtle)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150"
          style={{ color: 'var(--text-muted)', background: 'transparent' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--danger-subtle)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
}
