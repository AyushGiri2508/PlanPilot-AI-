import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoals } from "../redux/slices/goalSlice";
import GoalCard from "../components/goals/GoalCard";
import GoalForm from "../components/goals/GoalForm";
import Loader from "../components/common/Loader";
import { HiOutlinePlus } from "react-icons/hi";
import "./Goals.css";

const Goals = () => {
  const dispatch = useDispatch();
  const { goals, loading } = useSelector((state) => state.goals);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const filtered =
    filter === "All"
      ? goals
      : goals.filter((g) => g.status === filter);

  if (loading && goals.length === 0) return <Loader text="Loading goals..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="goals-header-row">
          <div>
            <h1>My Goals</h1>
            <p>Manage and track all your goals</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <HiOutlinePlus /> New Goal
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="goals-filters">
        {["All", "Pending", "In Progress", "Completed"].map((f) => (
          <button
            key={f}
            className={`btn btn-ghost btn-sm ${filter === f ? "goals-filter-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {f !== "All" && (
              <span className="goals-filter-count">
                {goals.filter((g) =>
                  f === "All" ? true : g.status === f
                ).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Goal Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>No goals yet</h3>
          <p>Create your first goal and let AI build your plan</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <HiOutlinePlus /> Create Goal
          </button>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map((goal) => (
            <GoalCard key={goal._id} goal={goal} />
          ))}
        </div>
      )}

      {showForm && <GoalForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Goals;
