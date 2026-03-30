import { Injectable } from '@nestjs/common';
import { Prisma, Task as PrismaTask } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { ITaskRepository } from '../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../domain/entities/task.entity';
import {
  TaskFilterDto,
  TaskStats,
  TaskStatus,
  TaskPriority,
} from '@task-manager/shared';

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

    if (filters.sortBy === 'priority') {
      return this.findAllSortedByPriority(filters);
    }

    const orderBy = this.buildOrderBy(filters.sortBy, filters.sortOrder);
    const rawTasks = await this.prisma.task.findMany({ where, orderBy });
    return rawTasks.map(this.toDomain.bind(this));
  }

  // SQLite doesn't support ordering by enum rank via Prisma's orderBy — use a CASE WHEN expression via $queryRaw.
  private async findAllSortedByPriority(
    filters: TaskFilterDto,
  ): Promise<TaskEntity[]> {
    const conditions: Prisma.Sql[] = [];
    if (filters.status) conditions.push(Prisma.sql`status = ${filters.status}`);
    if (filters.priority)
      conditions.push(Prisma.sql`priority = ${filters.priority}`);
    if (filters.assignee)
      conditions.push(
        Prisma.sql`assignee LIKE ${'%' + filters.assignee + '%'}`,
      );

    const whereClause =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
        : Prisma.empty;

    const orderDir = Prisma.raw(filters.sortOrder === 'asc' ? 'ASC' : 'DESC');

    // $queryRaw returns SQLite-native types: dates come back as ISO strings, not Date objects.
    type RawRow = {
      id: string;
      title: string;
      description: string | null;
      status: string;
      priority: string;
      dueDate: string | null;
      assignee: string | null;
      createdAt: string;
      updatedAt: string;
    };

    const rows = await this.prisma.$queryRaw<RawRow[]>(Prisma.sql`
      SELECT * FROM "Task"
      ${whereClause}
      ORDER BY CASE priority
        WHEN 'low'    THEN 0
        WHEN 'medium' THEN 1
        WHEN 'high'   THEN 2
      END ${orderDir}
    `);

    return rows.map((r) =>
      TaskEntity.create({
        id: r.id,
        title: r.title,
        description: r.description,
        status: r.status as TaskStatus,
        priority: r.priority as TaskPriority,
        dueDate: r.dueDate ? new Date(r.dueDate) : null,
        assignee: r.assignee,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }),
    );
  }

  private buildOrderBy(
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc',
  ): Prisma.TaskOrderByWithRelationInput {
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

    const toMap = <T extends Record<string, unknown> & { _count: number }>(
      rows: T[],
      key: keyof T,
    ) => Object.fromEntries(rows.map((r) => [r[key] as string, r._count]));

    const statusMap = toMap(byStatusRaw, 'status');
    const priorityMap = toMap(byPriorityRaw, 'priority');

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
