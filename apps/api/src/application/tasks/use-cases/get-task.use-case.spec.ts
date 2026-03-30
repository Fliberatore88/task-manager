import { NotFoundException } from '@nestjs/common';
import { GetTaskUseCase } from './get-task.use-case';
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

describe('GetTaskUseCase', () => {
  let useCase: GetTaskUseCase;
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
    useCase = new GetTaskUseCase(mockRepository);
  });

  it('should return the task when found', async () => {
    const task = makeTask();
    mockRepository.findById.mockResolvedValue(task);

    const result = await useCase.execute('uuid-1');

    expect(result).toBe(task);
    expect(mockRepository.findById).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException when task does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
