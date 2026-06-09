const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  return (
    <div className={`task-card ${task.status === "completed" ? "done" : ""}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`badge ${task.status}`}>
          {task.status}
        </span>
      </div>

      <p>{task.description || "No description provided."}</p>

      <small>
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </small>

      <div className="task-actions">
        <button className="btn btn-success" onClick={() => onToggle(task._id)}>
          {task.status === "pending" ? "Complete" : "Mark Pending"}
        </button>

        <button className="btn btn-warning" onClick={() => onEdit(task)}>
          Edit
        </button>

        <button className="btn btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;