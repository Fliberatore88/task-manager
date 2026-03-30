import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository.interface';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    await this.taskRepository.delete(id);
  }
}
