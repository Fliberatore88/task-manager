import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { CreateTaskDto } from '@task-manager/shared';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(dto: CreateTaskDto): Promise<TaskEntity> {
    const task = TaskEntity.create({
      id: randomUUID(),
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status ?? 'pending',
      priority: dto.priority ?? 'medium',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      assignee: dto.assignee ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.taskRepository.create(task);
  }
}
