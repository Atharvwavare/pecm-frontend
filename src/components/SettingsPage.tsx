import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Lock, Bell, Save, Eye, EyeOff, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  getUserProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);

  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // 🔹 Load profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      setName(res.data.name);
      setEmail(res.data.email);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  // 🔹 Update profile
  const handleProfileSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const res = await updateProfile({ name, email });

      updateUser({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      });

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  // 🔹 Change password
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await changePassword({ oldPassword, newPassword });

      toast.success("Password updated successfully!");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  //  Confirm Delete
  const confirmDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    try {
      await deleteAccount();

      toast.success("Account deleted successfully");

      updateUser(null);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete account");
    } finally {
      setShowDeleteModal(false);
      setDeleteConfirmText("");
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 p-6 space-y-8">

      {/* Header */}
      <div className="pt-24">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Full Name</label>
            <div className="relative mt-1">
              <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full pl-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
/>
            </div>
          </div>

          <div>
            <label className="text-sm">Email</label>
            <div className="relative mt-1">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleProfileSave}
          className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg flex items-center gap-2"
        >
          <Save size={16} /> Save Profile
        </button>
      </div>

      {/* Password */}
     <div className="bg-white rounded-xl shadow-sm border p-6">
  <h2 className="text-xl font-semibold mb-4">Change Password</h2>

  <div className="grid md:grid-cols-3 gap-4">

    {[{
      label: "Current Password",
      value: oldPassword,
      setter: setOldPassword,
      show: showOldPassword,
      toggle: () => setShowOldPassword(!showOldPassword)
    },{
      label: "New Password",
      value: newPassword,
      setter: setNewPassword,
      show: showNewPassword,
      toggle: () => setShowNewPassword(!showNewPassword)
    },{
      label: "Confirm Password",
      value: confirmPassword,
      setter: setConfirmPassword,
      show: showConfirmPassword,
      toggle: () => setShowConfirmPassword(!showConfirmPassword)
    }].map((field, i) => (
      <div key={i}>
        <label className="text-sm">{field.label}</label>
        <div className="relative mt-1">
          <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type={field.show ? "text" : "password"}
            value={field.value}
            onChange={(e) => field.setter(e.target.value)}
            className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={field.toggle}
            className="absolute right-3 top-2.5 text-gray-400"
          >
            {field.show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    ))}

  </div>

  <button
    onClick={handlePasswordChange}
    className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-lg flex items-center gap-2"
  >
    <Save size={16} /> Update Password
  </button>
</div>
      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, all your data will be permanently removed. This action cannot be undone.
        </p>

        <button
          onClick={() => {
            setDeleteConfirmText("");
            setShowDeleteModal(true);
          }}
          className="bg-red-500 text-white px-5 py-2 rounded-lg"
        >
          Delete Account
        </button>
      </div>

      {/* MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border-2 border-gray-200">

            {/* Header with close button */}
            <div className="flex items-center justify-end p-4 md:p-6 pb-0">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 pt-0">

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center mb-2">
                Delete Account?
              </h3>

              {/* Message */}
              <p className="text-sm md:text-base text-gray-600 text-center mb-2">
                Are you sure you want to delete your account?
              </p>

              <p className="text-xs md:text-sm text-gray-500 text-center mb-4">
                This action cannot be undone.
              </p>

              {/* Type to confirm */}
              <div className="mb-6">
                <label className="text-xs md:text-sm text-gray-600 mb-1.5 block">
                  Type <span className="font-semibold text-gray-800">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteAccount}
                  disabled={deleteConfirmText.trim().toUpperCase() !== "DELETE"}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-500"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}