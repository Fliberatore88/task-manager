import { TaskEntity } from '../entities/task.entity';
import { TaskFilterDto, TaskStats } from '@task-manager/shared';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface ITaskRepository {
  findAll(filters: TaskFilterDto): Promise<TaskEntity[]>;
  findById(id: string): Promise<TaskEntity | null>;
  create(task: TaskEntity): Promise<TaskEntity>;
  update(task: TaskEntity): Promise<TaskEntity>;
  delete(id: string): Promise<void>;
  getStats(): Promise<TaskStats>;
}
