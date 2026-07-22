import { useSelector } from "react-redux";
import { RiRobot2Line } from "react-icons/ri";
import {
  HiOutlineSearch,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineCheck,
} from "react-icons/hi";
import "./AgentActivity.css";

const AGENTS = [
  { name: "Goal Analyzer", icon: HiOutlineSearch, desc: "Analyzing goal complexity & skills" },
  { name: "Task Generator", icon: HiOutlineClipboardList, desc: "Creating actionable tasks" },
  { name: "Priority Agent", icon: HiOutlineStar, desc: "Setting task priorities" },
  { name: "Scheduler Agent", icon: HiOutlineCalendar, desc: "Building daily schedule" },
  { name: "Complete", icon: HiOutlineCheck, desc: "Plan generated successfully!" },
];

const AgentActivity = () => {
  const { loading, currentStep } = useSelector((state) => state.ai);

  if (!loading && !currentStep) return null;

  const activeIndex = loading
    ? Math.min(
        AGENTS.findIndex((a) =>
          currentStep?.toLowerCase().includes(a.name.toLowerCase().split(" ")[0])
        ),
        AGENTS.length - 2
      )
    : AGENTS.length - 1;

  return (
    <div className="agent-activity glass-card-static">
      <div className="agent-activity-header">
        <RiRobot2Line className="agent-activity-icon" />
        <h3>Multi-Agent Pipeline</h3>
        {loading && <span className="agent-activity-badge animate-pulse">Processing</span>}
      </div>

      <div className="agent-pipeline">
        {AGENTS.map((agent, i) => (
          <div
            key={agent.name}
            className={`agent-step ${
              i < activeIndex
                ? "done"
                : i === activeIndex
                ? loading
                  ? "active"
                  : "done"
                : "pending"
            }`}
          >
            <div className="agent-step-icon">
              <agent.icon />
            </div>
            <div className="agent-step-info">
              <span className="agent-step-name">{agent.name}</span>
              <span className="agent-step-desc">{agent.desc}</span>
            </div>
            {i < AGENTS.length - 1 && <div className="agent-step-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentActivity;
