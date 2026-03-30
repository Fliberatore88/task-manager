import { NotFoundException } from '@nestjs/common';
import { UpdateTaskUseCase } from './update-task.use-case';
import { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

const makeTask = (overrides = {}) =>
  TaskEntity.create({
    id: 'uuid-1',
    title: 'Original Title',
    description: null,
    status: 'pending',
    priority: 'medium',
    dueDate: null,
    assignee: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
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
    useCase = new UpdateTaskUseCase(mockRepository);
  });

  it('should update and return the task', async () => {
    const existing = makeTask();
    mockRepository.findById.mockResolvedValue(existing);
    mockRepository.update.mockImplementation(async (task) => task);

    const result = await useCase.execute('uuid-1', { title: 'Updated Title' });

    expect(mockRepository.findById).toHaveBeenCalledWith('uuid-1');
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(TaskEntity);
    expect(result.title).toBe('Updated Title');
  });

  it('should throw NotFoundException when task does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('non-existent', { title: 'X' }),
    ).rejects.toThrow(NotFoundException);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should preserve unchanged fields', async () => {
    const existing = makeTask({ status: 'in-progress', priority: 'high' });
    mockRepository.findById.mockResolvedValue(existing);
    mockRepository.update.mockImplementation(async (task) => task);

    const result = await useCase.execute('uuid-1', { title: 'New Title' });

    expect(result.status).toBe('in-progress');
    expect(result.priority).toBe('high');
  });

  it('should allow setting dueDate to null', async () => {
    const existing = makeTask({ dueDate: new Date('2025-01-01') });
    mockRepository.findById.mockResolvedValue(existing);
    mockRepository.update.mockImplementation(async (task) => task);

    const result = await useCase.execute('uuid-1', { dueDate: null });

    expect(result.dueDate).toBeNull();
  });
});
