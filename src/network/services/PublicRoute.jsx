import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (user && token) {
    if (user.isAdmin) {
      return <Navigate to="/admin-panel" state={{ from: location }} replace />;
    }

    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute;
