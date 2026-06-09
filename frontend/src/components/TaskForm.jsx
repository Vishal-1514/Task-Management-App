import { useEffect, useState } from "react";

const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending"
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: "pending"
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Task title is required");
      return;
    }

    setError("");
    onSubmit(form);

    if (!editingTask) {
      setForm({
        title: "",
        description: "",
        status: "pending"
      });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Task description"
        value={form.description}
        onChange={handleChange}
      />

      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;