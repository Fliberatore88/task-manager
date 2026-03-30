import { cn, formatDate, isOverdue } from './utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('returns empty string with no truthy values', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
});

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2025-06-15T12:00:00.000Z');
    expect(result).toMatch(/Jun\s+15,\s+2025/);
  });

  it('returns dash for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });
});

describe('isOverdue', () => {
  it('returns true for past due date on non-completed task', () => {
    expect(isOverdue('2020-01-01', 'pending')).toBe(true);
  });

  it('returns true for in-progress task with past due date', () => {
    expect(isOverdue('2020-01-01', 'in-progress')).toBe(true);
  });

  it('returns false for completed task regardless of due date', () => {
    expect(isOverdue('2020-01-01', 'completed')).toBe(false);
  });

  it('returns false when no due date', () => {
    expect(isOverdue(null, 'pending')).toBe(false);
    expect(isOverdue(undefined, 'pending')).toBe(false);
  });

  it('returns false for future due date', () => {
    expect(isOverdue('2099-12-31', 'pending')).toBe(false);
  });
});
