import { Module } from '@nestjs/common';
import { TasksModule } from './presentation/tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}
