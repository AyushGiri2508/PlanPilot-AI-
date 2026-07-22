import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { HiOutlineLogout, HiOutlineUser } from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          <RiRobot2Line className="navbar-logo-icon" />
          <span className="navbar-brand-text">PlanPilot</span>
          <span className="navbar-brand-ai">AI</span>
        </Link>
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <Link to="/profile" className="navbar-user">
              <HiOutlineUser />
              <span>{user.name}</span>
            </Link>
            <button className="navbar-logout" onClick={handleLogout}>
              <HiOutlineLogout />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
