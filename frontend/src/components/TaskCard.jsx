import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'done') return false;
  return new Date(dateStr) < new Date();
}

export default function TaskCard({ task, onUpdated, onDeleteRequest }) {
  const [toggling, setToggling] = useState(false);
  const navigate = useNavigate();

  const handleToggle = async () => {
    setToggling(true);
    try {
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      await client.patch(`/tasks/${task._id}/status`, { status: newStatus });
      onUpdated?.({ ...task, status: newStatus });
    } catch {
      // silently fail
    } finally {
      setToggling(false);
    }
  };

  const overdue = isOverdue(task.dueDate, task.status);
  const isDone = task.status === 'done';

  const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  const statusLabel = task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1);

  return (
    <div className="task-card slide-up" data-priority={task.priority}>
      <button
        className={`task-checkbox${isDone ? ' checked' : ''}`}
        onClick={handleToggle}
        disabled={toggling}
        aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
      >
        {isDone && <span className="checkmark">&#10003;</span>}
      </button>

      <div className="task-content">
        <div className={`task-title${isDone ? ' done' : ''}`}>{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>{priorityLabel}</span>
          <span className={`badge badge-${task.status === 'in-progress' ? 'inprogress' : task.status}`}>
            {statusLabel}
          </span>
          {task.dueDate && (
            <span className={`task-due${overdue ? ' overdue' : ''}`}>
              {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn btn-icon btn-ghost"
          onClick={() => navigate(`/tasks/${task._id}/edit`)}
          title="Edit"
        >
          Edit
        </button>
        <button
          className="btn btn-icon btn-danger"
          onClick={() => onDeleteRequest?.(task)}
          title="Delete"
        >
          Del
        </button>
      </div>
    </div>
  );
}
