import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser } from "../services/authService";

// User interface
interface User {
  name: string;
  email: string;
  role: string;
}

// Context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User | null) => void;   // ⭐ NEW
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);

      const userData: User = {
        name: data.name,
        email: email,
        role: data.role,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      throw new Error(msg);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      await registerUser(name, email, password);
      await login(email, password); // auto-login after register
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Register failed";
      throw new Error(msg);
    }
  };

  // ⭐ Update user (used in SettingsPage)
  const updateUser = (updatedUser: User | null) => {
    setUser(updatedUser);

    if (updatedUser) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };


  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};