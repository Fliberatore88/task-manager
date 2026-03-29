import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ZodValidationPipe } from './zod-validation.pipe';
import { CreateTaskUseCase } from '../../application/tasks/use-cases/create-task.use-case';
import { ListTasksUseCase } from '../../application/tasks/use-cases/list-tasks.use-case';
import { GetTaskUseCase } from '../../application/tasks/use-cases/get-task.use-case';
import { UpdateTaskUseCase } from '../../application/tasks/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../../application/tasks/use-cases/delete-task.use-case';
import { GetStatsUseCase } from '../../application/tasks/use-cases/get-stats.use-case';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFilterSchema,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStats,
} from '@task-manager/shared';
import { TaskResponseDto } from './task-response.dto';

@ApiTags('tasks')
@Controller('api/tasks')
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly listTasks: ListTasksUseCase,
    private readonly getTask: GetTaskUseCase,
    private readonly updateTask: UpdateTaskUseCase,
    private readonly deleteTask: DeleteTaskUseCase,
    private readonly getStats: GetStatsUseCase,
  ) {}

  // NOTE: 'stats' must come before ':id' to avoid Express treating "stats" as an ID
  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics grouped by status and priority' })
  @ApiResponse({ status: 200, description: 'Task counts grouped by status and priority' })
  async stats(): Promise<TaskStats> {
    return this.getStats.execute();
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks with optional filters and sorting' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in-progress', 'completed'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high'] })
  @ApiQuery({ name: 'assignee', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['dueDate', 'priority', 'createdAt'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, type: [TaskResponseDto] })
  async list(@Query() query: Record<string, string>): Promise<TaskResponseDto[]> {
    const filters = TaskFilterSchema.parse(query);
    const tasks = await this.listTasks.execute(filters);
    return tasks.map(TaskResponseDto.fromEntity);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    const task = await this.getTask.execute(id);
    return TaskResponseDto.fromEntity(task);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  @UsePipes(new ZodValidationPipe(CreateTaskSchema))
  async create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.createTask.execute(dto);
    return TaskResponseDto.fromEntity(task);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTaskSchema)) dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.updateTask.execute(id, dto);
    return TaskResponseDto.fromEntity(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteTask.execute(id);
  }
}
