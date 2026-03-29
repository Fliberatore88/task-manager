'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskSchema, type CreateTaskDto, type Task } from '@task-manager/shared';

interface TaskFormProps {
  initialValues?: Task;
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

const labelStyle = {
  display:    'block',
  fontSize:   '0.75rem',
  fontWeight: '500',
  marginBottom: '0.375rem',
  color:      'var(--text-secondary)',
} as React.CSSProperties;

const errorStyle = {
  fontSize: '0.7rem',
  color:    'var(--danger)',
  marginTop: '0.25rem',
} as React.CSSProperties;

export function TaskForm({ initialValues, onSubmit, onCancel, submitLabel = 'Create Task' }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskDto>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: initialValues
      ? {
          title:       initialValues.title,
          description: initialValues.description ?? undefined,
          status:      initialValues.status,
          priority:    initialValues.priority,
          dueDate:     toDateInputValue(initialValues.dueDate) || undefined,
          assignee:    initialValues.assignee ?? undefined,
        }
      : { status: 'pending', priority: 'medium' },
  });

  const fieldClass = 'field-input';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label htmlFor="task-title" style={labelStyle}>
          Title <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id="task-title"
          type="text"
          placeholder="What needs to be done?"
          className={fieldClass}
          {...register('title')}
        />
        {errors.title && <p style={errorStyle}>{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-desc" style={labelStyle}>Description</label>
        <textarea
          id="task-desc"
          rows={3}
          placeholder="Add details (optional)…"
          className={fieldClass}
          style={{ resize: 'vertical' }}
          {...register('description')}
        />
        {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
      </div>

      {/* Status + Priority row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-status" style={labelStyle}>Status</label>
          <select id="task-status" className={fieldClass} {...register('status')}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-priority" style={labelStyle}>Priority</label>
          <select id="task-priority" className={fieldClass} {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Due date + Assignee row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="task-due" style={labelStyle}>Due Date</label>
          <input id="task-due" type="date" className={fieldClass} {...register('dueDate')} />
          {errors.dueDate && <p style={errorStyle}>{errors.dueDate.message}</p>}
        </div>
        <div>
          <label htmlFor="task-assignee" style={labelStyle}>Assignee</label>
          <input
            id="task-assignee"
            type="text"
            placeholder="Name or email"
            className={fieldClass}
            {...register('assignee')}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-150"
          style={{
            color:      'var(--text-secondary)',
            background: 'var(--bg-surface)',
            border:     '1px solid var(--border)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-hover)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-semibold text-white rounded-lg cursor-pointer transition-all duration-150 disabled:opacity-50 flex items-center gap-2"
          style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent-glow)' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)'}
        >
          {isSubmitting && (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          )}
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
