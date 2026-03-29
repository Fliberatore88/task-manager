'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskSchema, type CreateTaskDto, type Task } from '@task-manager/shared';

interface TaskFormProps {
  initialValues?: Partial<Task>;
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

const today = new Date().toISOString().slice(0, 10);

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '13px',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export function TaskForm({ initialValues, onSubmit, onCancel, submitLabel = 'Create Task' }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskDto>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'pending',
      priority: initialValues?.priority ?? 'medium',
      dueDate: toDateInputValue(initialValues?.dueDate),
      assignee: initialValues?.assignee ?? '',
    },
  });

  const labelClass = 'block text-xs font-medium mb-1.5';
  const errorClass = 'mt-1 text-xs text-red-400';

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'var(--border-accent)');
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'var(--border)');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>
          Title <span style={{ color: '#f87171' }}>*</span>
        </label>
        <input
          {...register('title')}
          style={fieldStyle}
          placeholder="e.g. Fix authentication bug"
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      <div>
        <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Description</label>
        <textarea
          {...register('description')}
          rows={3}
          style={{ ...fieldStyle, resize: 'none' }}
          placeholder="Optional details about this task…"
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Status</label>
          <select {...register('status')} style={fieldStyle} onFocus={focusBorder} onBlur={blurBorder}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Priority</label>
          <select {...register('priority')} style={fieldStyle} onFocus={focusBorder} onBlur={blurBorder}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Due Date</label>
          <input
            type="date"
            min={today}
            {...register('dueDate')}
            style={{ ...fieldStyle, colorScheme: 'dark' }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
          {errors.dueDate && <p className={errorClass}>{errors.dueDate.message}</p>}
        </div>
        <div>
          <label className={labelClass} style={{ color: 'var(--text-secondary)' }}>Assignee</label>
          <input
            {...register('assignee')}
            style={fieldStyle}
            placeholder="e.g. john.doe"
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent-glow)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#818cf8')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          {isSubmitting && (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
