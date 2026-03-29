'use client';

import { useState } from 'react';
import type { Task, CreateTaskDto } from '@task-manager/shared';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { TaskForm } from './TaskForm';
import { StatsBar } from './StatsBar';
import { TaskCharts } from './TaskCharts';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function TasksView() {
  const { tasks, stats, filters, setFilters, loading, error, createTask, updateTask, deleteTask } =
    useTasks();

  const [createOpen, setCreateOpen]     = useState(false);
  const [editingTask, setEditingTask]   = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [exitingId, setExitingId]       = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formError, setFormError]       = useState<string | null>(null);

  const handleCreate = async (data: CreateTaskDto) => {
    try {
      setFormError(null);
      await createTask(data);
      setCreateOpen(false);
    } catch {
      setFormError('Failed to create task. Please try again.');
    }
  };

  const handleUpdate = async (data: CreateTaskDto) => {
    if (!editingTask) return;
    try {
      setFormError(null);
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } catch {
      setFormError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    const id = deletingTask.id;
    setDeleteLoading(true);
    setDeletingTask(null);
    setExitingId(id);
    await new Promise(r => setTimeout(r, 240));
    try {
      await deleteTask(id);
    } finally {
      setExitingId(null);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg-base)' }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30"
        style={{
          background:    'color-mix(in srgb, var(--bg-base) 85%, transparent)',
          backdropFilter:'blur(14px)',
          borderBottom:  '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)', boxShadow: '0 0 14px var(--accent-glow)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Task Manager
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white rounded-lg transition-all duration-150 cursor-pointer"
              style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent-glow)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px var(--accent-glow)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px var(--accent-glow)';
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* Stats */}
        {stats && <StatsBar stats={stats} />}

        {/* Charts */}
        {stats && <TaskCharts stats={stats} />}

        {/* Filter bar */}
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm flex items-center gap-2.5 animate-slide-in"
            style={{
              background:  'var(--danger-subtle)',
              border:      '1px solid color-mix(in srgb, var(--danger) 30%, transparent)',
              color:       'var(--danger)',
            }}
            role="alert"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div className="skeleton h-0.5 w-full rounded-none" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="flex gap-2">
                    <div className="skeleton h-5 w-16 rounded-full" />
                    <div className="skeleton h-5 w-12 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : tasks.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 animate-fade-in-up">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background:  'var(--bg-card)',
                border:      '1px solid var(--border)',
                boxShadow:   'var(--shadow-card)',
              }}
            >
              <svg className="w-8 h-8" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
              No tasks found
            </h3>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {Object.keys(filters).length > 0
                ? 'Try adjusting your filters to see more tasks.'
                : 'Create your first task to get started.'}
            </p>
            {Object.keys(filters).length === 0 && (
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl cursor-pointer transition-all duration-150"
                style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent-glow)' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Task
              </button>
            )}
          </div>

        ) : (
          /* Task grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                index={i}
                isExiting={exitingId === task.id}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Create modal ────────────────────────────────────────── */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setFormError(null); }}
        title="New Task"
      >
        {formError && (
          <p className="text-xs mb-3 -mt-1 animate-slide-in" style={{ color: 'var(--danger)' }}>
            {formError}
          </p>
        )}
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => { setCreateOpen(false); setFormError(null); }}
          submitLabel="Create Task"
        />
      </Modal>

      {/* ── Edit modal ──────────────────────────────────────────── */}
      <Modal
        open={!!editingTask}
        onClose={() => { setEditingTask(null); setFormError(null); }}
        title="Edit Task"
      >
        {formError && (
          <p className="text-xs mb-3 -mt-1 animate-slide-in" style={{ color: 'var(--danger)' }}>
            {formError}
          </p>
        )}
        {editingTask && (
          <TaskForm
            initialValues={editingTask}
            onSubmit={handleUpdate}
            onCancel={() => { setEditingTask(null); setFormError(null); }}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* ── Delete confirm ──────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
