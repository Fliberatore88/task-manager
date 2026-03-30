import axios from 'axios';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskFilterDto, TaskStats } from '@task-manager/shared';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

export const tasksApi = {
  list: (filters?: Partial<TaskFilterDto>) =>
    api.get<Task[]>('/api/tasks', { params: filters }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Task>(`/api/tasks/${id}`).then((r) => r.data),

  create: (dto: CreateTaskDto) =>
    api.post<Task>('/api/tasks', dto).then((r) => r.data),

  update: (id: string, dto: UpdateTaskDto) =>
    api.put<Task>(`/api/tasks/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/tasks/${id}`),

  getStats: () =>
    api.get<TaskStats>('/api/tasks/stats').then((r) => r.data),
};
