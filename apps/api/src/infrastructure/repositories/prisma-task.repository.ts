import { Injectable } from '@nestjs/common';
import { Prisma, Task as PrismaTask } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../domain/entities/task.entity';
import { TaskFilterDto, TaskStats, TaskStatus, TaskPriority } from '@task-manager/shared';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: PrismaTask): TaskEntity {
    return TaskEntity.create({
      id: raw.id,
      title: raw.title,
      description: raw.description,
      status: raw.status as TaskStatus,
      priority: raw.priority as TaskPriority,
      dueDate: raw.dueDate,
      assignee: raw.assignee,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findAll(filters: TaskFilterDto): Promise<TaskEntity[]> {
    const where: Prisma.TaskWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    // SQLite does not support mode:'insensitive' — use LIKE-based contains (case-insensitive by default for ASCII)
    if (filters.assignee) where.assignee = { contains: filters.assignee };

    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };

    const orderBy = this.buildOrderBy(filters.sortBy, filters.sortOrder);

    const rawTasks = await this.prisma.task.findMany({ where, orderBy });
    const domainTasks: TaskEntity[] = rawTasks.map(this.toDomain.bind(this));

    if (filters.sortBy === 'priority') {
      return domainTasks.sort((a, b) => {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return filters.sortOrder === 'desc' ? -diff : diff;
      });
    }

    return domainTasks;
  }

  private buildOrderBy(
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc',
  ): Prisma.TaskOrderByWithRelationInput {
    if (sortBy === 'priority') return { createdAt: sortOrder as Prisma.SortOrder };
    return { [sortBy]: sortOrder } as Prisma.TaskOrderByWithRelationInput;
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const raw = await this.prisma.task.findUnique({ where: { id } });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  async create(task: TaskEntity): Promise<TaskEntity> {
    const raw = await this.prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
    return this.toDomain(raw);
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    const raw = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee,
        updatedAt: task.updatedAt,
      },
    });
    return this.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

  async getStats(): Promise<TaskStats> {
    const [total, byStatusRaw, byPriorityRaw] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.task.groupBy({ by: ['status'], _count: true }),
      this.prisma.task.groupBy({ by: ['priority'], _count: true }),
    ]);

    const toMap = (rows: { _count: number; [key: string]: unknown }[], key: string) =>
      Object.fromEntries(rows.map((r) => [r[key], r._count]));

    const statusMap = toMap(byStatusRaw as never, 'status');
    const priorityMap = toMap(byPriorityRaw as never, 'priority');

    return {
      total,
      byStatus: {
        pending: statusMap['pending'] ?? 0,
        'in-progress': statusMap['in-progress'] ?? 0,
        completed: statusMap['completed'] ?? 0,
      },
      byPriority: {
        low: priorityMap['low'] ?? 0,
        medium: priorityMap['medium'] ?? 0,
        high: priorityMap['high'] ?? 0,
      },
    };
  }
}
