import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toaster, toast } from "sonner";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/routes/protectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";

// Pages & Modals
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import CategoriesTable from "./components/CategoriesTable";
import ExpensesTable from "./components/ExpensesTable";
import Report from "./components/Report";
import FeaturedReports from "./components/FeaturedReports";
import Analytics from "./components/Analytics";
import AddCategories from "./components/AddCategories";

import { LoginModal } from "./components/LoginModal";
import { RegisterModal } from "./components/RegisterModal";

// Layout
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import SettingsPage from "./components/SettingsPage";

import AdminUsers from "./components/AdminUsers";
import { AdminRoute } from "./components/routes/AdminRoute";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <AuthProvider>
      <ScrollToTop />
      <Toaster position="top-right" richColors />

      {/* Login/Register Modals */}
      <LoginRegisterModals
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
      />

      <Routes>
        {/* Landing page */}
        <Route
          path="/"
          element={
            <LandingPage
              openLogin={() => setIsLoginOpen(true)}
              openRegister={() => setIsRegisterOpen(true)}
            />
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRouteWrapper
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<CategoriesTable />} />
          <Route path="/expenses" element={<ExpensesTable />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/featured_reports" element={<FeaturedReports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/addcategories" element={<AddCategories />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

// Wrapper for protected routes
function ProtectedRouteWrapper({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet /> {/* Render child routes */}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Component to manage Login/Register Modals
function LoginRegisterModals({
  isLoginOpen,
  setIsLoginOpen,
  isRegisterOpen,
  setIsRegisterOpen,
}: {
  isLoginOpen: boolean;
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRegisterOpen: boolean;
  setIsRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success("Login successful!");
      setIsLoginOpen(false);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast.error(msg);
    }
  };
  //  Handle Register
  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
      setIsRegisterOpen(false);
      setIsLoginOpen(true); // open login after registration
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      toast.error(msg);
    }
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegister}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}
