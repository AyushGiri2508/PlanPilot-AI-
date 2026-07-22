import { Link } from "react-router-dom";
import { CATEGORY_ICONS } from "../../utils/constants";
import { formatDate, daysRemaining } from "../../utils/helpers";
import { HiOutlineClock, HiOutlineFlag } from "react-icons/hi";
import "./GoalCard.css";

const GoalCard = ({ goal }) => {
  const days = daysRemaining(goal.deadline);
  const isOverdue = days < 0;

  return (
    <Link to={`/goals/${goal._id}`} className="goal-card glass-card">
      <div className="goal-card-header">
        <span className="goal-card-emoji">
          {CATEGORY_ICONS[goal.category] || "📋"}
        </span>
        <span className={`badge badge-${goal.priority?.toLowerCase()}`}>
          {goal.priority}
        </span>
      </div>

      <h3 className="goal-card-title">{goal.title}</h3>

      {goal.description && (
        <p className="goal-card-desc">{goal.description}</p>
      )}

      <div className="goal-card-progress">
        <div className="goal-card-progress-header">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="goal-card-footer">
        <div className="goal-card-meta">
          <HiOutlineClock />
          <span>{formatDate(goal.deadline)}</span>
        </div>
        <span
          className={`goal-card-days ${isOverdue ? "overdue" : days <= 7 ? "urgent" : ""}`}
        >
          {isOverdue
            ? `${Math.abs(days)}d overdue`
            : `${days}d left`}
        </span>
      </div>

      <div className={`goal-card-status badge-${goal.status === "Completed" ? "completed" : goal.status === "In Progress" ? "progress" : "pending"}`}>
        {goal.status}
      </div>
    </Link>
  );
};

export default GoalCard;
