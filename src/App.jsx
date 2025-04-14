import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./network/services/AuthContext";
import PublicRoute from "./network/services/PublicRoute";
import ProtectedRoute from "./network/services/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPanel from "./components/AdminPanel";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          index
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="form"
          element={
            <ProtectedRoute allowedForAdmins={false}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin-login"
          element={
            <PublicRoute>
              <AdminLoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="admin-panel"
          element={
            <ProtectedRoute allowedForAdmins={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
