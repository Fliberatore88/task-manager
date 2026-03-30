import { TaskEntity } from './task.entity';

const validProps = {
  id: '1',
  title: 'Fix login bug',
  description: null,
  status: 'pending' as const,
  priority: 'medium' as const,
  dueDate: null,
  assignee: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

describe('TaskEntity', () => {
  describe('create', () => {
    it('should create a valid task', () => {
      const task = TaskEntity.create(validProps);
      expect(task.title).toBe('Fix login bug');
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
    });

    it('should throw when title is shorter than 3 characters', () => {
      expect(() => TaskEntity.create({ ...validProps, title: 'AB' })).toThrow(
        'Title must be at least 3 characters',
      );
    });

    it('should throw when title is longer than 100 characters', () => {
      expect(() =>
        TaskEntity.create({ ...validProps, title: 'A'.repeat(101) }),
      ).toThrow('Title must be at most 100 characters');
    });

    it('should throw when description exceeds 500 characters', () => {
      expect(() =>
        TaskEntity.create({ ...validProps, description: 'D'.repeat(501) }),
      ).toThrow('Description must be at most 500 characters');
    });

    it('should allow null description', () => {
      const task = TaskEntity.create({ ...validProps, description: null });
      expect(task.description).toBeNull();
    });

    it('should accept all valid statuses', () => {
      const statuses = ['pending', 'in-progress', 'completed'] as const;
      statuses.forEach((status) => {
        const task = TaskEntity.create({ ...validProps, status });
        expect(task.status).toBe(status);
      });
    });

    it('should accept all valid priorities', () => {
      const priorities = ['low', 'medium', 'high'] as const;
      priorities.forEach((priority) => {
        const task = TaskEntity.create({ ...validProps, priority });
        expect(task.priority).toBe(priority);
      });
    });
  });

  describe('update', () => {
    it('should return a new entity with updated fields', () => {
      const task = TaskEntity.create(validProps);
      const updated = task.update({
        title: 'Updated title',
        status: 'in-progress',
      });

      expect(updated.title).toBe('Updated title');
      expect(updated.status).toBe('in-progress');
      expect(updated.id).toBe(task.id);
    });

    it('should not mutate the original entity', () => {
      const task = TaskEntity.create(validProps);
      task.update({ title: 'Updated title' });
      expect(task.title).toBe('Fix login bug');
    });

    it('should throw when updating with an invalid title', () => {
      const task = TaskEntity.create(validProps);
      expect(() => task.update({ title: 'AB' })).toThrow(
        'Title must be at least 3 characters',
      );
    });
  });

  describe('isOverdue', () => {
    it('should return true for past due dates on non-completed tasks', () => {
      const task = TaskEntity.create({
        ...validProps,
        dueDate: new Date('2020-01-01'),
        status: 'pending',
      });
      expect(task.isOverdue()).toBe(true);
    });

    it('should return false for completed tasks regardless of due date', () => {
      const task = TaskEntity.create({
        ...validProps,
        dueDate: new Date('2020-01-01'),
        status: 'completed',
      });
      expect(task.isOverdue()).toBe(false);
    });

    it('should return false when no due date is set', () => {
      const task = TaskEntity.create({ ...validProps, dueDate: null });
      expect(task.isOverdue()).toBe(false);
    });
  });
});
