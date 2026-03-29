import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { CreateTaskUseCase } from '../../application/tasks/use-cases/create-task.use-case';
import { ListTasksUseCase } from '../../application/tasks/use-cases/list-tasks.use-case';
import { GetTaskUseCase } from '../../application/tasks/use-cases/get-task.use-case';
import { UpdateTaskUseCase } from '../../application/tasks/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../../application/tasks/use-cases/delete-task.use-case';
import { GetStatsUseCase } from '../../application/tasks/use-cases/get-stats.use-case';
import { PrismaTaskRepository } from '../../infrastructure/repositories/prisma-task.repository';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface';

@Module({
  controllers: [TasksController],
  providers: [
    PrismaService,
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    GetStatsUseCase,
  ],
})
export class TasksModule {}
