import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';
import { UpdateTaskDto } from '@task-manager/shared';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    const updated = existing.update({
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && {
        description: dto.description ?? null,
      }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.priority !== undefined && { priority: dto.priority }),
      ...(dto.dueDate !== undefined && {
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      }),
      ...(dto.assignee !== undefined && { assignee: dto.assignee ?? null }),
      updatedAt: new Date(),
    });

    return this.taskRepository.update(updated);
  }
}
