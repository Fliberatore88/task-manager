'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { tasksApi } from '@/lib/api/tasks';
import type { Task, TaskFilterDto, TaskStats, CreateTaskDto, UpdateTaskDto } from '@task-manager/shared';

export function useTasks(initialFilters: Partial<TaskFilterDto> = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [filters, setFilters] = useState<Partial<TaskFilterDto>>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchTasks = useCallback(async () => {
    try {
      if (!hasFetched.current) setLoading(true);
      setError(null);
      const data = await tasksApi.list(filters);
      setTasks(data);
      hasFetched.current = true;
    } catch {
      setError('Failed to load tasks. Is the API running?');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await tasksApi.getStats();
      setStats(data);
    } catch {
      // stats are non-critical, fail silently
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const createTask = async (dto: CreateTaskDto) => {
    const task = await tasksApi.create(dto);
    setTasks((prev) => [task, ...prev]);
    fetchStats();
    return task;
  };

  const updateTask = async (id: string, dto: UpdateTaskDto) => {
    const task = await tasksApi.update(id, dto);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    fetchStats();
    return task;
  };

  const deleteTask = async (id: string) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    fetchStats();
  };

  return {
    tasks,
    stats,
    filters,
    setFilters,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
