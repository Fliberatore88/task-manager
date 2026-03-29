import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from '../../domain/entities/task.entity';

export class TaskResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty({ nullable: true }) description: string | null;
  @ApiProperty({ enum: ['pending', 'in-progress', 'completed'] }) status: string;
  @ApiProperty({ enum: ['low', 'medium', 'high'] }) priority: string;
  @ApiProperty({ nullable: true }) dueDate: string | null;
  @ApiProperty({ nullable: true }) assignee: string | null;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;

  static fromEntity(entity: TaskEntity): TaskResponseDto {
    const dto = new TaskResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.status = entity.status;
    dto.priority = entity.priority;
    dto.dueDate = entity.dueDate ? entity.dueDate.toISOString() : null;
    dto.assignee = entity.assignee;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}

export class TaskStatsResponseDto {
  @ApiProperty() total: number;
  @ApiProperty() byStatus: { pending: number; 'in-progress': number; completed: number };
  @ApiProperty() byPriority: { low: number; medium: number; high: number };
}
