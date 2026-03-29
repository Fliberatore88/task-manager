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

const priorityAccent: Record<string, string> = {
  high:   'rgba(248,113,113,0.8)',
  medium: 'rgba(251,146,60,0.7)',
  low:    'rgba(100,116,139,0.5)',
};

// Full-card tint by status — stronger on in-progress/completed to fight the blue bg
const statusCardBg: Record<string, string> = {
  pending:      'rgba(251, 191, 36,  0.10)',
  'in-progress':'rgba(34, 211, 238, 0.14)',   // cyan — contrasts vs blue bg
  completed:    'rgba(52,  211, 153, 0.14)',
};

export function TaskCard({ task, index = 0, isExiting = false, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);
  const accent  = priorityAccent[task.priority];
  const cardBg  = statusCardBg[task.status] ?? 'transparent';

  return (
    <div
      className={`group relative rounded-xl p-4 transition-all duration-200 ${
        isExiting ? 'animate-fade-out pointer-events-none' : 'animate-fade-in-up'
      }`}
      style={{
        background: `linear-gradient(145deg, ${cardBg} 0%, var(--bg-card) 60%)`,
        border: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        animationDelay: isExiting ? '0ms' : `${index * 45}ms`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(99,102,241,0.3)';
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = `0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.12)`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
      }}
    >
      {/* Priority accent line */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: accent }}
      />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-medium leading-snug line-clamp-2 flex-1 text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#818cf8';
                e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f87171';
                e.currentTarget.style.background = 'rgba(248,113,113,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <Badge variant={task.status}>{task.status}</Badge>
          <Badge variant={task.priority}>{task.priority}</Badge>
          {overdue && <Badge variant="overdue">overdue</Badge>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            {task.assignee && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}
                >
                  {task.assignee.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {task.assignee}
                </span>
              </div>
            )}
          </div>
          {task.dueDate && (
            <span
              className="text-xs"
              style={{ color: overdue ? '#f87171' : 'var(--text-muted)' }}
            >
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
