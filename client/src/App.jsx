import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Pages that don't show sidebar/navbar
const PUBLIC_ROUTES = ["/", "/login", "/signup"];

function App() {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const isPublic = PUBLIC_ROUTES.includes(location.pathname);
  const showLayout = token && !isPublic;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            fontSize: "0.88rem",
          },
        }}
      />

      {showLayout ? (
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <AppRoutes />
          </div>
        </div>
      ) : (
        <AppRoutes />
      )}
    </>
  );
}

export default App;
