import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

@Injectable()
export class GetTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return task;
  }
}
