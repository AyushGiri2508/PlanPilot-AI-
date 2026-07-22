import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoalById, removeGoal, editGoal } from "../redux/slices/goalSlice";
import { fetchTasks, removeTask } from "../redux/slices/taskSlice";
import { generateAIPlan, regenerateAIPlan, recoverAIPlan, clearAIResult } from "../redux/slices/aiSlice";
import TaskList from "../components/tasks/TaskList";
import AgentActivity from "../components/ai/AgentActivity";
import GoalForm from "../components/goals/GoalForm";
import Loader from "../components/common/Loader";
import { CATEGORY_ICONS } from "../utils/constants";
import { formatDate, daysRemaining } from "../utils/helpers";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiArrowLeft,
  HiOutlineLightningBolt,
  HiOutlineRefresh,
} from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import toast from "react-hot-toast";
import "./GoalDetails.css";

const GoalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentGoal, loading: goalLoading } = useSelector((state) => state.goals);
  const { tasks, loading: tasksLoading } = useSelector((state) => state.tasks);
  const { loading: aiLoading } = useSelector((state) => state.ai);

  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchGoalById(id));
    dispatch(fetchTasks(id));
    return () => dispatch(clearAIResult());
  }, [dispatch, id]);

  // Update goal progress when tasks change
  useEffect(() => {
    if (tasks.length > 0 && currentGoal) {
      const completed = tasks.filter((t) => t.status === "Completed").length;
      const progress = Math.round((completed / tasks.length) * 100);
      if (progress !== currentGoal.progress) {
        dispatch(editGoal({ id, goalData: { progress } }));
      }
    }
  }, [tasks, currentGoal, dispatch, id]);

  const handleGeneratePlan = async () => {
    try {
      await dispatch(generateAIPlan(id)).unwrap();
      toast.success("AI plan generated! 🤖");
      dispatch(fetchTasks(id));
    } catch (err) {
      toast.error(err || "Failed to generate plan");
    }
  };

  const handleRegeneratePlan = async () => {
    try {
      await dispatch(regenerateAIPlan(id)).unwrap();
      toast.success("Plan regenerated! 🔄");
      dispatch(fetchTasks(id));
    } catch (err) {
      toast.error(err || "Failed to regenerate plan");
    }
  };

  const handleRecoverPlan = async () => {
    try {
      await dispatch(recoverAIPlan(id)).unwrap();
      toast.success("Schedule recovered! ✅");
    } catch (err) {
      toast.error(err || "Failed to recover plan");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this goal and all its tasks?")) return;
    try {
      await dispatch(removeGoal(id)).unwrap();
      toast.success("Goal deleted");
      navigate("/goals");
    } catch (err) {
      toast.error(err || "Failed to delete");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dispatch(removeTask({ goalId: id, taskId })).unwrap();
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err || "Failed to delete task");
    }
  };

  if (goalLoading && !currentGoal) return <Loader text="Loading goal..." />;
  if (!currentGoal) return <div className="page-container"><p>Goal not found</p></div>;

  const days = daysRemaining(currentGoal.deadline);

  return (
    <div className="page-container">
      {/* Back */}
      <button className="btn btn-ghost" onClick={() => navigate("/goals")} style={{ marginBottom: 16 }}>
        <HiArrowLeft /> Back to Goals
      </button>

      {/* Goal Header */}
      <div className="goal-detail-header glass-card-static">
        <div className="goal-detail-top">
          <div className="goal-detail-left">
            <span className="goal-detail-emoji">
              {CATEGORY_ICONS[currentGoal.category] || "📋"}
            </span>
            <div>
              <h1 className="goal-detail-title">{currentGoal.title}</h1>
              <div className="goal-detail-badges">
                <span className={`badge badge-${currentGoal.priority?.toLowerCase()}`}>
                  {currentGoal.priority}
                </span>
                <span className={`badge badge-${currentGoal.status === "Completed" ? "completed" : currentGoal.status === "In Progress" ? "progress" : "pending"}`}>
                  {currentGoal.status}
                </span>
                <span className="badge" style={{ background: "var(--bg-glass-strong)", color: "var(--text-secondary)" }}>
                  {currentGoal.category}
                </span>
              </div>
            </div>
          </div>

          <div className="goal-detail-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setShowEdit(true)}>
              <HiOutlinePencil /> Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              <HiOutlineTrash /> Delete
            </button>
          </div>
        </div>

        {currentGoal.description && (
          <p className="goal-detail-desc">{currentGoal.description}</p>
        )}

        <div className="goal-detail-stats">
          <div className="goal-detail-stat">
            <span className="goal-detail-stat-value">{currentGoal.progress}%</span>
            <span className="goal-detail-stat-label">Progress</span>
          </div>
          <div className="goal-detail-stat">
            <span className="goal-detail-stat-value">{tasks.length}</span>
            <span className="goal-detail-stat-label">Tasks</span>
          </div>
          <div className="goal-detail-stat">
            <span className={`goal-detail-stat-value ${days < 0 ? "text-danger" : ""}`}>
              {days < 0 ? `${Math.abs(days)}d` : `${days}d`}
            </span>
            <span className="goal-detail-stat-label">
              {days < 0 ? "Overdue" : "Remaining"}
            </span>
          </div>
          <div className="goal-detail-stat">
            <span className="goal-detail-stat-value">{formatDate(currentGoal.deadline)}</span>
            <span className="goal-detail-stat-label">Deadline</span>
          </div>
        </div>

        <div className="progress-bar-container" style={{ marginTop: 8 }}>
          <div className="progress-bar-fill" style={{ width: `${currentGoal.progress}%` }} />
        </div>
      </div>

      {/* AI Actions */}
      <div className="goal-detail-ai-actions">
        <button
          className="btn btn-primary"
          onClick={handleGeneratePlan}
          disabled={aiLoading}
        >
          <RiRobot2Line /> {tasks.length > 0 ? "Generate More Tasks" : "Generate AI Plan"}
        </button>

        {tasks.length > 0 && (
          <>
            <button className="btn btn-secondary" onClick={handleRegeneratePlan} disabled={aiLoading}>
              <HiOutlineLightningBolt /> Regenerate Plan
            </button>
            <button className="btn btn-secondary" onClick={handleRecoverPlan} disabled={aiLoading}>
              <HiOutlineRefresh /> Recover Schedule
            </button>
          </>
        )}
      </div>

      {/* Agent Activity */}
      <AgentActivity />

      {/* Task List */}
      {tasksLoading && tasks.length === 0 ? (
        <Loader text="Loading tasks..." />
      ) : (
        <TaskList tasks={tasks} goalId={id} onDelete={handleDeleteTask} />
      )}

      {showEdit && (
        <GoalForm goal={currentGoal} onClose={() => setShowEdit(false)} />
      )}
    </div>
  );
};

export default GoalDetails;
