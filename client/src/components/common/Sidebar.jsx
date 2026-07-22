import { NavLink, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineFlag,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineCog,
} from "react-icons/hi";
import { RiDashboardLine, RiRobot2Line } from "react-icons/ri";
import "./Sidebar.css";

const navItems = [
  { path: "/dashboard", icon: RiDashboardLine, label: "Dashboard" },
  { path: "/goals", icon: HiOutlineFlag, label: "Goals" },
  { path: "/calendar", icon: HiOutlineCalendar, label: "Calendar" },
  { path: "/analytics", icon: HiOutlineChartBar, label: "Analytics" },
  { path: "/profile", icon: HiOutlineCog, label: "Settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <RiRobot2Line />
          </div>
          <div>
            <h2>PlanPilot</h2>
            <span className="sidebar-badge">Multi-Agent AI</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">MAIN MENU</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <item.icon className="sidebar-link-icon" />
            <span>{item.label}</span>
            {location.pathname === item.path && (
              <div className="sidebar-active-indicator" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-ai-card">
          <RiRobot2Line className="sidebar-ai-icon" />
          <div>
            <p className="sidebar-ai-title">AI Agents</p>
            <p className="sidebar-ai-sub">5 agents ready</p>
          </div>
          <div className="sidebar-ai-dot" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
