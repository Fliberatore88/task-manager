import axios from 'axios';
import { tasksApi } from './tasks';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

const api = (axios.create as jest.Mock).mock.results[0].value;

const mockTask = {
  id: '1',
  title: 'Test task',
  description: null,
  status: 'pending' as const,
  priority: 'medium' as const,
  dueDate: null,
  assignee: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mockStats = {
  total: 5,
  byStatus: { pending: 2, 'in-progress': 1, completed: 2 },
  byPriority: { low: 1, medium: 3, high: 1 },
};

beforeEach(() => jest.clearAllMocks());

describe('tasksApi', () => {
  it('list() calls GET /api/tasks with filters as params', async () => {
    api.get.mockResolvedValue({ data: [mockTask] });
    const filters = { status: 'pending' as const };

    const result = await tasksApi.list(filters);

    expect(api.get).toHaveBeenCalledWith('/api/tasks', { params: filters });
    expect(result).toEqual([mockTask]);
  });

  it('list() works without filters', async () => {
    api.get.mockResolvedValue({ data: [] });

    const result = await tasksApi.list();

    expect(api.get).toHaveBeenCalledWith('/api/tasks', { params: undefined });
    expect(result).toEqual([]);
  });

  it('create() calls POST /api/tasks with dto', async () => {
    api.post.mockResolvedValue({ data: mockTask });
    const dto = { title: 'Test task' };

    const result = await tasksApi.create(dto as never);

    expect(api.post).toHaveBeenCalledWith('/api/tasks', dto);
    expect(result).toEqual(mockTask);
  });

  it('update() calls PUT /api/tasks/:id with dto', async () => {
    api.put.mockResolvedValue({ data: { ...mockTask, title: 'Updated' } });
    const dto = { title: 'Updated' };

    const result = await tasksApi.update('1', dto);

    expect(api.put).toHaveBeenCalledWith('/api/tasks/1', dto);
    expect(result.title).toBe('Updated');
  });

  it('delete() calls DELETE /api/tasks/:id', async () => {
    api.delete.mockResolvedValue({});

    await tasksApi.delete('1');

    expect(api.delete).toHaveBeenCalledWith('/api/tasks/1');
  });

  it('getStats() calls GET /api/tasks/stats', async () => {
    api.get.mockResolvedValue({ data: mockStats });

    const result = await tasksApi.getStats();

    expect(api.get).toHaveBeenCalledWith('/api/tasks/stats');
    expect(result).toEqual(mockStats);
  });
});
