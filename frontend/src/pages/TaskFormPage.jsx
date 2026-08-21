import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import client from '../api/client';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    client
      .get(`/tasks/${id}`)
      .then((res) => {
        const t = res.data.data;
        setForm({
          title: t.title || '',
          description: t.description || '',
          status: t.status || 'todo',
          priority: t.priority || 'medium',
          dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
        });
      })
      .catch((err) => setServerError(err.message))
      .finally(() => setFetchLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    else if (form.title.length > 120) e.title = 'Max 120 characters.';
    if (form.description.length > 1000) e.description = 'Max 1000 characters.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    const payload = {
      ...form,
      dueDate: form.dueDate || undefined,
      description: form.description || undefined,
    };

    try {
      if (isEdit) {
        await client.put(`/tasks/${id}`, payload);
      } else {
        await client.post('/tasks', payload);
      }
      navigate('/tasks');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="spinner-page"><div className="spinner-lg" /></div>;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="form-card slide-up">
          <h1 className="form-title">{isEdit ? 'Edit Task' : 'New Task'}</h1>

          {serverError && <div className="error-banner">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="input-group mb-24">
              <label className="input-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                name="title"
                type="text"
                className={`input${errors.title ? ' input-error' : ''}`}
                placeholder="Task title"
                value={form.title}
                onChange={handleChange}
                maxLength={120}
              />
              {errors.title && <span className="error-msg">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="input-group mb-24">
              <label className="input-label" htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                name="description"
                className={`input${errors.description ? ' input-error' : ''}`}
                placeholder="Optional description..."
                rows={3}
                value={form.description}
                onChange={handleChange}
                maxLength={1000}
                style={{ resize: 'vertical' }}
              />
              {errors.description && <span className="error-msg">{errors.description}</span>}
            </div>

            {/* Status, Priority, Due Date */}
            <div className="form-grid mb-24">
              <div className="input-group">
                <label className="input-label" htmlFor="task-status">Status</label>
                <select id="task-status" name="status" className="input" value={form.status} onChange={handleChange}>
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="task-priority">Priority</label>
                <select id="task-priority" name="priority" className="input" value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="task-duedate">Due Date</label>
                <input
                  id="task-duedate"
                  name="dueDate"
                  type="date"
                  className="input"
                  value={form.dueDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <Link to="/tasks" className="btn btn-ghost">
                Cancel
              </Link>
              <button
                id="task-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <><span className="spinner" /> Saving…</> : isEdit ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
