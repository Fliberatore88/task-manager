import { GetStatsUseCase } from './get-stats.use-case';
import { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskStats } from '@task-manager/shared';

const makeStats = (overrides: Partial<TaskStats> = {}): TaskStats => ({
  total: 5,
  byStatus: { pending: 2, 'in-progress': 2, completed: 1 },
  byPriority: { low: 1, medium: 3, high: 1 },
  ...overrides,
});

describe('GetStatsUseCase', () => {
  let useCase: GetStatsUseCase;
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
    useCase = new GetStatsUseCase(mockRepository);
  });

  it('should return stats from the repository', async () => {
    const stats = makeStats();
    mockRepository.getStats.mockResolvedValue(stats);

    const result = await useCase.execute();

    expect(result).toBe(stats);
    expect(mockRepository.getStats).toHaveBeenCalledTimes(1);
  });

  it('should return zero counts when no tasks exist', async () => {
    const stats = makeStats({
      total: 0,
      byStatus: { pending: 0, 'in-progress': 0, completed: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
    });
    mockRepository.getStats.mockResolvedValue(stats);

    const result = await useCase.execute();

    expect(result.total).toBe(0);
  });
});
