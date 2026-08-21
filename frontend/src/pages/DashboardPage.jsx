import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import AnalyticsCards from '../components/AnalyticsCards';
import DonutChart from '../components/DonutChart';
import TrendChart from '../components/TrendChart';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError('');
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const [summaryRes, trendRes, tasksRes] = await Promise.all([
        client.get('/analytics/summary'),
        client.get(`/analytics/trend?timezone=${encodeURIComponent(tz)}`),
        client.get('/tasks?limit=5&sortBy=createdAt&order=desc'),
      ]);
      setSummary(summaryRes.data.data);
      setTrend(trendRes.data.data);
      setRecentTasks(tasksRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => { fetchData(true); }, []);

  const handleTaskUpdated = (updatedTask) => {
    setRecentTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    fetchData(false); // refresh analytics in background without reloading the page
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await client.delete(`/tasks/${deleteTarget._id}`);
      setRecentTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      showToast('Task deleted.');
      fetchData(false); // background refresh
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <p className="dashboard-greeting">Hey, {firstName}</p>
            <h1 className="dashboard-title">Your Dashboard</h1>
          </div>
          <Link to="/tasks/new" className="btn btn-primary" id="dashboard-new-task-btn">
            + New Task
          </Link>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="spinner-page"><div className="spinner-lg" /></div>
        ) : (
          <>
            {/* Stat Cards */}
            <AnalyticsCards data={summary} />

            {/* Charts */}
            <div className="charts-row">
              <div className="chart-card">
                <div className="chart-title">Task Distribution</div>
                <DonutChart data={summary} />
              </div>
              <div className="chart-card">
                <div className="chart-title">Tasks Created (Last 7 Days)</div>
                <TrendChart data={trend} />
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="recent-tasks-section">
              <div className="section-header">
                <h2 className="section-title">Recent Tasks</h2>
                <Link to="/tasks" className="btn btn-secondary btn-sm">View all →</Link>
              </div>

              {recentTasks.length === 0 ? (
                <div className="empty-state">
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started</p>
                </div>
              ) : (
                <div className="tasks-list">
                  {recentTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdated={handleTaskUpdated}
                      onDeleteRequest={setDeleteTarget}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <Modal
          title="Delete Task"
          description={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
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
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
