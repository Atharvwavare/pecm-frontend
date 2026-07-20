import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking loading state
  if (loading) return null;

  // Redirect non-logged-in users to login
if (!user) {
  return <Navigate to="/" state={{ from: location }} replace />;
}

  // Redirect logged-in users visiting "/" to dashboard
  if (user && location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise render the protected page
  return <>{children}</>;
};