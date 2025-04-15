import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedForAdmins = false }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedForAdmins && !user.isAdmin) {
    return <Navigate to="/form" replace />;
  }

  if (!allowedForAdmins && user.isAdmin) {
    return <Navigate to="/admin-panel" replace />;
  }

  return children;
};

export default ProtectedRoute;
