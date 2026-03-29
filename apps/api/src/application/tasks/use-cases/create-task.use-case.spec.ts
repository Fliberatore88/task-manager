import { CreateTaskUseCase } from './create-task.use-case';
import { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
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
    useCase = new CreateTaskUseCase(mockRepository);
  });

  it('should create a task and persist it via the repository', async () => {
    const dto = { title: 'New Task', status: 'pending' as const, priority: 'medium' as const };

    mockRepository.create.mockImplementation(async (task) => task);

    const result = await useCase.execute(dto);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(TaskEntity);
    expect(result.title).toBe('New Task');
    expect(result.status).toBe('pending');
  });

  it('should set default status to pending and priority to medium', async () => {
    const dto = { title: 'Minimal Task', status: 'pending' as const, priority: 'medium' as const };
    mockRepository.create.mockImplementation(async (task) => task);

    const result = await useCase.execute(dto);

    expect(result.status).toBe('pending');
    expect(result.priority).toBe('medium');
  });

  it('should generate a unique id for each task', async () => {
    const dto = { title: 'Task One', status: 'pending' as const, priority: 'medium' as const };
    mockRepository.create.mockImplementation(async (task) => task);

    const result1 = await useCase.execute(dto);
    const result2 = await useCase.execute({ ...dto, title: 'Task Two' });

    expect(result1.id).not.toBe(result2.id);
  });

  it('should propagate repository errors', async () => {
    const dto = { title: 'Failing Task', status: 'pending' as const, priority: 'medium' as const };
    mockRepository.create.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute(dto)).rejects.toThrow('DB error');
  });
});
