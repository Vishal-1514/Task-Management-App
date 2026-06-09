import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/tasks", {
        params: {
          search,
          status,
          page,
          limit: 6
        }
      });

      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotalTasks(data.totalTasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, page]);

  const handleSubmitTask = async (taskData) => {
    try {
      setError("");

      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, taskData);
        setEditingTask(null);
      } else {
        await API.post("/tasks", taskData);
      }

      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task operation failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/tasks/${id}/toggle`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your tasks efficiently.</p>
        </div>

        <div className="stats-card">
          <strong>{totalTasks}</strong>
          <span>Total Tasks</span>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="dashboard-grid">
        <TaskForm
          onSubmit={handleSubmitTask}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        <div className="tasks-section">
          <div className="filters">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearchChange}
            />

            <select value={status} onChange={handleStatusChange}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <div className="empty">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty">No tasks found.</div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                className="btn btn-outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;