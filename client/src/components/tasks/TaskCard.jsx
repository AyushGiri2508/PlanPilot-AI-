import { useDispatch } from "react-redux";
import { editTask } from "../../redux/slices/taskSlice";
import { HiOutlineCheck, HiOutlineClock, HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import "./TaskCard.css";

const TaskCard = ({ task, goalId, onDelete }) => {
  const dispatch = useDispatch();

  const handleToggleStatus = async () => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await dispatch(
        editTask({
          goalId,
          taskId: task._id,
          taskData: { status: newStatus },
        })
      ).unwrap();
      toast.success(
        newStatus === "Completed" ? "Task completed! 🎉" : "Task reopened"
      );
    } catch (err) {
      toast.error(err || "Failed to update task");
    }
  };

  return (
    <div className={`task-card ${task.status === "Completed" ? "completed" : ""}`}>
      <button
        className={`task-check ${task.status === "Completed" ? "checked" : ""}`}
        onClick={handleToggleStatus}
      >
        {task.status === "Completed" && <HiOutlineCheck />}
      </button>

      <div className="task-card-content">
        <h4 className="task-card-title">{task.title}</h4>
        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}
        <div className="task-card-meta">
          <span className={`badge badge-${task.priority?.toLowerCase()}`}>
            {task.priority}
          </span>
          {task.estimatedHours > 0 && (
            <span className="task-card-hours">
              <HiOutlineClock /> {task.estimatedHours}h
            </span>
          )}
          {task.aiGenerated && (
            <span className="task-ai-badge">AI</span>
          )}
        </div>
      </div>

      {onDelete && (
        <button
          className="task-delete"
          onClick={() => onDelete(task._id)}
        >
          <HiOutlineTrash />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
