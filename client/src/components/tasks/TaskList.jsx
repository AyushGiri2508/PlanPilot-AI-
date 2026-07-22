import { useState } from "react";
import TaskCard from "./TaskCard";
import { HiOutlineFilter } from "react-icons/hi";
import "./TaskList.css";

const TaskList = ({ tasks, goalId, onDelete }) => {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  const completed = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div className="task-list-info">
          <h3>Tasks</h3>
          <span className="task-list-count">
            {completed}/{tasks.length} completed
          </span>
        </div>

        <div className="task-list-filters">
          <HiOutlineFilter className="task-filter-icon" />
          {["All", "Pending", "In Progress", "Completed"].map((f) => (
            <button
              key={f}
              className={`task-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="task-list-items">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              goalId={goalId}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
