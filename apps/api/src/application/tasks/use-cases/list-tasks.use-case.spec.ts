import { ListTasksUseCase } from './list-tasks.use-case';
import { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

const makeTask = (overrides = {}) =>
  TaskEntity.create({
    id: 'uuid-1',
    title: 'Test Task',
    description: null,
    status: 'pending',
    priority: 'medium',
    dueDate: null,
    assignee: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('ListTasksUseCase', () => {
  let useCase: ListTasksUseCase;
  let mockRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getStats: jest.fn(),
    };
    useCase = new ListTasksUseCase(mockRepository);
  });

  it('should return tasks from the repository', async () => {
    const tasks = [makeTask({ id: 'uuid-1' }), makeTask({ id: 'uuid-2', title: 'Second' })];
    mockRepository.findAll.mockResolvedValue(tasks);

    const filters = { sortBy: 'createdAt' as const, sortOrder: 'desc' as const };
    const result = await useCase.execute(filters);

    expect(result).toBe(tasks);
    expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
  });

  it('should return an empty array when no tasks match', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const filters = { status: 'completed' as const, sortBy: 'createdAt' as const, sortOrder: 'desc' as const };
    const result = await useCase.execute(filters);

    expect(result).toEqual([]);
  });

  it('should pass filters through to the repository', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const filters = {
      status: 'pending' as const,
      priority: 'high' as const,
      assignee: 'alice',
      sortBy: 'dueDate' as const,
      sortOrder: 'asc' as const,
    };
    await useCase.execute(filters);

    expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
  });
});
