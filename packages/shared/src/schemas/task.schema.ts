import { z } from 'zod';

export const TaskStatusSchema = z.enum(['pending', 'in-progress', 'completed']);
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high']);

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  status: TaskStatusSchema.default('pending'),
  priority: TaskPrioritySchema.default('medium'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)')
    .refine((v) => !isNaN(Date.parse(v)), 'Invalid date')
    .optional()
    .nullable(),
  assignee: z.string().optional().nullable(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const TaskFilterSchema = z.object({
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  assignee: z.string().optional(),
  sortBy: z.enum(['dueDate', 'priority', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  dueDate: z.string().nullable(),
  assignee: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TaskStatsSchema = z.object({
  total: z.number(),
  byStatus: z.object({
    pending: z.number(),
    'in-progress': z.number(),
    completed: z.number(),
  }),
  byPriority: z.object({
    low: z.number(),
    medium: z.number(),
    high: z.number(),
  }),
});

export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
export type TaskFilterDto = z.infer<typeof TaskFilterSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type TaskStats = z.infer<typeof TaskStatsSchema>;
