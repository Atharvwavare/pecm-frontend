import { User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfileDropdownProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export function UserProfileDropdown({
  user,
  onLogout,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Initials
 // ✅ Initials
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
    <div className="relative" ref={dropdownRef}>
      {/* 🔥 PROFILE BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 cursor-pointer"
      >
        {/* ✅ Avatar ALWAYS visible */}
        <div className="relative">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold shadow">
            {getInitials(user.name)}
          </div>

          {/* 🟢 Online Dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        {/* ❌ Hide text on mobile */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
            {user.name}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[140px]">
            {user.email}
          </span>
        </div>
      </button>

      {/* 🔽 DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {/* HEADER */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(user.name)}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* MENU */}
          <div className="py-2">
           <button
              onClick={() => {
                navigate("/dashboard");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigate("/settings");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
          </div>

          {/* LOGOUT */}
          <div className="border-t py-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
