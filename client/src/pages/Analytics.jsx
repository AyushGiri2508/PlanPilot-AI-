import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsAPI";
import { DonutChart, WeeklyBarChart } from "../components/analytics/ProgressChart";
import Loader from "../components/common/Loader";
import {
  HiOutlineFlag,
  HiOutlineClipboardCheck,
  HiOutlineTrendingUp,
  HiOutlineFire,
} from "react-icons/hi";
import "./Analytics.css";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAnalytics();
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader text="Loading analytics..." />;
  if (!data) return <div className="page-container"><p>Failed to load analytics</p></div>;

  const { overview } = data;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Your productivity insights and trends</p>
      </div>

      {/* Overview Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon violet"><HiOutlineFlag /></div>
          <div>
            <div className="stat-value">{overview.totalGoals}</div>
            <div className="stat-label">Total Goals</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineClipboardCheck /></div>
          <div>
            <div className="stat-value">{overview.completedTasks}</div>
            <div className="stat-label">Tasks Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan"><HiOutlineTrendingUp /></div>
          <div>
            <div className="stat-value">{overview.completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><HiOutlineFire /></div>
          <div>
            <div className="stat-value">{overview.streak}</div>
            <div className="stat-label">Day Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-charts">
        {data.tasksByPriority?.length > 0 && (
          <DonutChart data={data.tasksByPriority} title="Tasks by Priority" />
        )}
        {data.tasksByStatus?.length > 0 && (
          <DonutChart data={data.tasksByStatus} title="Tasks by Status" />
        )}
        {data.weeklyCompletions?.length > 0 && (
          <WeeklyBarChart data={data.weeklyCompletions} title="Weekly Completions" />
        )}
      </div>

      {/* Goals Progress */}
      {data.goalsProgress?.length > 0 && (
        <div className="glass-card-static analytics-goals-section">
          <h3 className="analytics-goals-title">Goal Progress</h3>
          <div className="analytics-goals-list">
            {data.goalsProgress.map((g) => (
              <div key={g._id} className="analytics-goal-item">
                <div className="analytics-goal-info">
                  <span className="analytics-goal-name">{g.title}</span>
                  <span className="analytics-goal-pct">{g.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
