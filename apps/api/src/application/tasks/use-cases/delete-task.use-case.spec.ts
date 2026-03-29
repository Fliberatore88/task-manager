import { NotFoundException } from '@nestjs/common';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskEntity } from '../../../domain/entities/task.entity';

const makeTask = (overrides = {}) =>
  TaskEntity.create({
    id: 'uuid-1',
    title: 'Task to Delete',
    description: null,
    status: 'pending',
    priority: 'medium',
    dueDate: null,
    assignee: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
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
    useCase = new DeleteTaskUseCase(mockRepository);
  });

  it('should delete the task when it exists', async () => {
    mockRepository.findById.mockResolvedValue(makeTask());
    mockRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('uuid-1');

    expect(mockRepository.findById).toHaveBeenCalledWith('uuid-1');
    expect(mockRepository.delete).toHaveBeenCalledWith('uuid-1');
  });

  it('should throw NotFoundException when task does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundException);
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
