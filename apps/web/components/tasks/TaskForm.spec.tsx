import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

const mockSubmit = jest.fn().mockResolvedValue(undefined);
const mockCancel = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe('TaskForm', () => {
  it('renders all form fields', () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
  });

  it('has correct default values for status and priority', () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    expect(screen.getByLabelText(/status/i)).toHaveValue('pending');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('medium');
  });

  it('shows validation error when title is too short', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    await user.type(screen.getByLabelText(/title/i), 'AB');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    await user.type(screen.getByLabelText(/title/i), 'Valid task title');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Valid task title',
          status: 'pending',
          priority: 'medium',
        }),
        expect.anything(),
      );
    });
  });

  it('pre-fills form when editing an existing task', () => {
    const task = {
      id: '1',
      title: 'Existing task',
      description: 'A description',
      status: 'in-progress' as const,
      priority: 'high' as const,
      dueDate: '2025-06-15T00:00:00.000Z',
      assignee: 'Alice',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };

    render(
      <TaskForm
        initialValues={task}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        submitLabel="Save Changes"
      />,
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue('Existing task');
    expect(screen.getByLabelText(/description/i)).toHaveValue('A description');
    expect(screen.getByLabelText(/status/i)).toHaveValue('in-progress');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('high');
    expect(screen.getByLabelText(/assignee/i)).toHaveValue('Alice');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockCancel).toHaveBeenCalled();
  });
});
