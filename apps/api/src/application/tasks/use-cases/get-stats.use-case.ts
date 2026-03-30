import { Injectable, Inject } from '@nestjs/common';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '../../../domain/repositories/task.repository.interface';
import { TaskStats } from '@task-manager/shared';

@Injectable()
export class GetStatsUseCase {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(): Promise<TaskStats> {
    return this.taskRepository.getStats();
  }
}
