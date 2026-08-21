import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';

const DEFAULT_FILTERS = {
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  order: 'desc',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page, limit: 10, ...filters });
      // Remove empty params
      for (const [key, val] of [...params.entries()]) {
        if (!val) params.delete(key);
      }
      const res = await client.get(`/tasks?${params}`);
      setTasks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Debounce search
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.priority, filters.sortBy, filters.order]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key !== 'search') setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await client.delete(`/tasks/${deleteTarget._id}`);
      showToast('Task deleted.');
      fetchTasks();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="tasks-header">
          <div>
            <h1 className="tasks-title">All Tasks</h1>
            <p className="text-muted text-sm mt-8">
              {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link to="/tasks/new" className="btn btn-primary" id="tasks-new-btn">
            + New Task
          </Link>
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {error && <div className="error-banner">⚠️ {error}</div>}

        {/* Task List */}
        {loading ? (
          <div className="spinner-page"><div className="spinner-lg" /></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdated={handleTaskUpdated}
                onDeleteRequest={setDeleteTarget}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ‹
            </button>

            {pages.map((p) => (
              <button
                key={p}
                className={`page-btn${p === page ? ' active' : ''}`}
                onClick={() => setPage(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <Modal
          title="Delete Task"
          description={`Are you sure you want to delete "${deleteTarget.title}"?`}
          danger
          confirmText="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
