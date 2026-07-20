import { Menu, LogIn, UserPlus, User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);

  const handleMobileLogout = () => {
    logout();
    setShowMobileUserMenu(false);
  };

  const handleMobileLogin = () => {
    setShowMobileUserMenu(false);
    navigate("/");
  };

  const handleMobileRegister = () => {
    setShowMobileUserMenu(false);
    navigate("/");
  };

  // ✅ INITIALS FUNCTION
  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return "?";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-800">
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800">
              PECM <span className="hidden sm:inline">– Personal Expense Control Manager</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 hidden sm:block">
              Track and manage your expenses efficiently
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {loading ? (
            <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <>
              {/* DESKTOP */}
              <div className="hidden sm:block">
                <UserProfileDropdown user={user} onLogout={logout} />
              </div>

              {/* MOBILE */}
              <div className="sm:hidden relative">

                {/* ✅ FIXED BUTTON */}
                <button
                  onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all active:scale-95"
                >
                  {/* Avatar */}
                  <div className="relative pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(user.name)}
                      </span>
                    </div>

                    {/* Online Dot */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>

                  {/* Chevron */}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showMobileUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ✅ DROPDOWN */}
                {showMobileUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMobileUserMenu(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

                      {/* USER INFO */}
                      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                        <div className="flex items-center gap-3">

                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-lg">
                              {getInitials(user.name)}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-800 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {user.email}
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* LOGOUT */}
                      <div className="p-2">
                        <button
                          onClick={handleMobileLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {/* DESKTOP LOGIN */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </button>
              </div>

              {/* MOBILE LOGIN */}
              <div className="sm:hidden relative">
                <button
                  onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </button>

                {showMobileUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMobileUserMenu(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border z-50">

                      <button
                        onClick={handleMobileLogin}
                        className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50"
                      >
                        <LogIn className="w-5 h-5" />
                        Login
                      </button>

                      <button
                        onClick={handleMobileRegister}
                        className="w-full flex items-center gap-3 px-4 py-3 text-green-600 hover:bg-green-50"
                      >
                        <UserPlus className="w-5 h-5" />
                        Register
                      </button>

                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}