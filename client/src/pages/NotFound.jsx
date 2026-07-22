import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <HiArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
