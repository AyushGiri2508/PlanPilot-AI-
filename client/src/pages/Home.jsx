import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addGoal } from "../redux/slices/goalSlice";
import { generateAIPlan } from "../redux/slices/aiSlice";
import { RiRobot2Line } from "react-icons/ri";
import {
  HiOutlineSearch,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineRefresh,
  HiOutlineCode,
} from "react-icons/hi";
import toast from "react-hot-toast";
import "./Home.css";

const SUGGESTIONS = [
  "Become a MERN developer",
  "Prepare for an Amazon SDE interview",
  "Ship a SaaS side project",
  "Learn machine learning fundamentals",
];

const AGENTS = [
  {
    icon: HiOutlineSearch,
    name: "Goal Analyzer",
    desc: "Extracts skills & scope",
  },
  {
    icon: HiOutlineClipboardList,
    name: "Task Generator",
    desc: "Turns skills into tasks",
  },
  {
    icon: HiOutlineStar,
    name: "Priority Agent",
    desc: "Ranks importance",
  },
  {
    icon: HiOutlineCalendar,
    name: "Scheduler",
    desc: "Places tasks on calen...",
  },
  {
    icon: HiOutlineRefresh,
    name: "Recovery Agent",
    desc: "Reshuffles missed work",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { loading: aiLoading } = useSelector((state) => state.ai);

  const [goalText, setGoalText] = useState("");
  const [timelineDays, setTimelineDays] = useState(60);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [generating, setGenerating] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);

  const handleSuggestionClick = (text) => {
    setGoalText(text);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/signup");
      return;
    }

    if (!goalText.trim()) {
      toast.error("Please enter a goal");
      return;
    }

    setGenerating(true);

    try {
      // Step 1: Create the goal
      setActiveAgent(0);
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + Number(timelineDays));

      const goal = await dispatch(
        addGoal({
          title: goalText.trim(),
          description: `Timeline: ${timelineDays} days, ${hoursPerDay} hours/day`,
          category: "Career",
          priority: "High",
          deadline: deadline.toISOString(),
        })
      ).unwrap();

      // Step 2: Generate AI plan
      setActiveAgent(1);
      await new Promise((r) => setTimeout(r, 400));
      setActiveAgent(2);
      await new Promise((r) => setTimeout(r, 400));
      setActiveAgent(3);

      await dispatch(generateAIPlan(goal._id)).unwrap();

      setActiveAgent(4);
      toast.success("Plan generated! 🚀");

      setTimeout(() => {
        navigate(`/goals/${goal._id}`);
      }, 800);
    } catch (err) {
      toast.error(err || "Failed to generate plan");
      setActiveAgent(-1);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="home-page">
      {/* Top Bar */}
      <header className="home-topbar">
        <div className="home-topbar-left">
          <div className="home-brand-icon">
            <RiRobot2Line />
          </div>
          <span className="home-brand-name">PlanPilot</span>
          <span className="home-brand-badge">MULTI-AGENT</span>
        </div>
        <div className="home-topbar-right">
          {token ? (
            <button className="home-topbar-link" onClick={() => navigate("/dashboard")}>
              <HiOutlineCode /> Dashboard
            </button>
          ) : (
            <button className="home-topbar-link" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-left">
          <h1 className="home-hero-title">
            Turn any goal into a{" "}
            <span className="home-hero-accent">scheduled plan.</span>
          </h1>
          <p className="home-hero-desc">
            Five AI agents collaborate — analyzing your goal, generating tasks,
            ranking priorities, and laying them across your calendar. Powered
            by Gemini.
          </p>
          <div className="home-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="home-suggestion-chip"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="home-hero-right">
          <form className="home-form-card" onSubmit={handleGenerate}>
            <label className="home-form-label">YOUR GOAL</label>
            <textarea
              className="home-form-textarea"
              placeholder="e.g. Become a MERN developer in 90 days"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              rows={3}
            />

            <div className="home-form-row">
              <div className="home-form-field">
                <label className="home-form-label">TIMELINE (DAYS)</label>
                <input
                  type="number"
                  className="home-form-input"
                  value={timelineDays}
                  onChange={(e) => setTimelineDays(e.target.value)}
                  min={1}
                  max={365}
                />
              </div>
              <div className="home-form-field">
                <label className="home-form-label">HOURS / DAY</label>
                <input
                  type="number"
                  className="home-form-input"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  min={1}
                  max={16}
                />
              </div>
            </div>

            <button
              type="submit"
              className="home-generate-btn"
              disabled={generating}
            >
              <RiRobot2Line />
              {generating ? "Generating..." : "Generate plan"}
            </button>
          </form>
        </div>
      </section>

      {/* Agent Pipeline */}
      <section className="home-pipeline">
        <h3 className="home-pipeline-title">AGENT PIPELINE</h3>
        <div className="home-pipeline-agents">
          {AGENTS.map((agent, i) => (
            <div
              key={i}
              className={`home-agent-card ${
                generating && activeAgent === i
                  ? "active"
                  : generating && activeAgent > i
                  ? "done"
                  : ""
              }`}
            >
              <div className="home-agent-icon">
                <agent.icon />
              </div>
              <div className="home-agent-info">
                <span className="home-agent-name">{agent.name}</span>
                <span className="home-agent-desc">{agent.desc}</span>
              </div>
              <span className="home-agent-status">
                {generating && activeAgent === i
                  ? "RUNNING"
                  : generating && activeAgent > i
                  ? "DONE"
                  : "IDLE"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
