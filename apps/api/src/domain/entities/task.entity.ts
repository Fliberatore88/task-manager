import { TaskStatus, TaskPriority } from '@task-manager/shared';

export interface TaskProps {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  assignee: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskEntity {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly dueDate: Date | null;
  readonly assignee: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: TaskProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.status = props.status;
    this.priority = props.priority;
    this.dueDate = props.dueDate;
    this.assignee = props.assignee;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: TaskProps): TaskEntity {
    TaskEntity.validateTitle(props.title);
    TaskEntity.validateDescription(props.description);
    return new TaskEntity(props);
  }

  static validateTitle(title: string): void {
    if (!title || title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
    if (title.trim().length > 100) {
      throw new Error('Title must be at most 100 characters');
    }
  }

  static validateDescription(description: string | null | undefined): void {
    if (description && description.length > 500) {
      throw new Error('Description must be at most 500 characters');
    }
  }

  update(props: Partial<Omit<TaskProps, 'id' | 'createdAt'>>): TaskEntity {
    if (props.title !== undefined) TaskEntity.validateTitle(props.title);
    if (props.description !== undefined)
      TaskEntity.validateDescription(props.description);

    return new TaskEntity({
      id: this.id,
      title: props.title ?? this.title,
      description:
        props.description !== undefined ? props.description : this.description,
      status: props.status ?? this.status,
      priority: props.priority ?? this.priority,
      dueDate: props.dueDate !== undefined ? props.dueDate : this.dueDate,
      assignee: props.assignee !== undefined ? props.assignee : this.assignee,
      createdAt: this.createdAt,
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  isOverdue(): boolean {
    if (!this.dueDate) return false;
    return this.dueDate < new Date() && this.status !== 'completed';
  }
}
