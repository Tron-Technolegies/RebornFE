import React, { useState } from "react";
import {
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
  FiLoader,
} from "react-icons/fi";
import { getServerUrl, getCsrfToken } from "../../api/backendApi";

export default function AccessSecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const csrfToken = getCsrfToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }

      const res = await fetch(getServerUrl("/api/auth/change-password/"), {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok && data?.success) {
        setSuccess(data.message || "Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data?.error || "Failed to update password. Please check your current password.");
      }
    } catch (err) {
      console.error("Password change error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-[#00000014] shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* SECTION HEADER */}
      <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
        <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
          <FiShield size={22} className="stroke-[2.2]" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Administrator Security
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage your administrator account password.
          </p>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <FiAlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="font-medium leading-snug">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
          <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="font-medium leading-snug">{success}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleChangePassword} autoComplete="off" className="space-y-4">
        {/* CURRENT PASSWORD */}
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiLock size={16} />
            </div>
            <input
              id="currentPassword"
              name="current_password"
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="off"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-3 focus:ring-amber-400/20 transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
              tabIndex={-1}
              aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
            >
              {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label
            htmlFor="newPassword"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5"
          >
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiLock size={16} />
            </div>
            <input
              id="newPassword"
              name="new_password"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-3 focus:ring-amber-400/20 transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
              tabIndex={-1}
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            >
              {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* CONFIRM NEW PASSWORD */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <FiLock size={16} />
            </div>
            <input
              id="confirmPassword"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-3 focus:ring-amber-400/20 transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-3 focus:ring-amber-400/30"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Change Password</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
