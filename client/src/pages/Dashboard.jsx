import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/analyticsAPI";
import Loader from "../components/common/Loader";
import { formatDate } from "../utils/helpers";
import {
  HiOutlineFlag,
  HiOutlineClipboardCheck,
  HiOutlineTrendingUp,
  HiOutlineFire,
  HiOutlineCalendar,
  HiArrowRight,
} from "react-icons/hi";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard();
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your productivity overview at a glance</p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon violet">
            <HiOutlineFlag />
          </div>
          <div>
            <div className="stat-value">{data?.goals?.total || 0}</div>
            <div className="stat-label">Total Goals</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <HiOutlineClipboardCheck />
          </div>
          <div>
            <div className="stat-value">{data?.tasks?.completed || 0}</div>
            <div className="stat-label">Tasks Done</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cyan">
            <HiOutlineTrendingUp />
          </div>
          <div>
            <div className="stat-value">{data?.completionRate || 0}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <HiOutlineFire />
          </div>
          <div>
            <div className="stat-value">{data?.tasks?.pending || 0}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Today's Schedule */}
        <div className="glass-card-static">
          <div className="dash-section-header">
            <h3>
              <HiOutlineCalendar /> Today's Schedule
            </h3>
            <Link to="/calendar" className="btn btn-ghost btn-sm">
              View Calendar <HiArrowRight />
            </Link>
          </div>

          {data?.todaySchedule?.length > 0 ? (
            <div className="dash-schedule-list">
              {data.todaySchedule.map((item) => (
                <div key={item._id} className="dash-schedule-item">
                  <div
                    className={`dash-schedule-dot ${
                      item.status === "Completed" ? "green" : "blue"
                    }`}
                  />
                  <div className="dash-schedule-info">
                    <span className="dash-schedule-title">
                      {item.task?.title || "Task"}
                    </span>
                    <span className="dash-schedule-meta">
                      {item.plannedHours}h planned
                    </span>
                  </div>
                  <span
                    className={`badge badge-${
                      item.task?.priority?.toLowerCase() || "medium"
                    }`}
                  >
                    {item.task?.priority || "Medium"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tasks scheduled for today</p>
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass-card-static">
          <div className="dash-section-header">
            <h3>
              <HiOutlineFlag /> Upcoming Deadlines
            </h3>
            <Link to="/goals" className="btn btn-ghost btn-sm">
              View Goals <HiArrowRight />
            </Link>
          </div>

          {data?.upcomingDeadlines?.length > 0 ? (
            <div className="dash-deadline-list">
              {data.upcomingDeadlines.map((goal) => (
                <Link
                  key={goal._id}
                  to={`/goals/${goal._id}`}
                  className="dash-deadline-item"
                >
                  <div>
                    <span className="dash-deadline-title">{goal.title}</span>
                    <span className="dash-deadline-date">
                      {formatDate(goal.deadline)}
                    </span>
                  </div>
                  <div className="progress-bar-container" style={{ width: 80 }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No upcoming deadlines</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
