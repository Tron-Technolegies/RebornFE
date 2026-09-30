import React, { useState } from "react";
import { FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiAlertCircle, FiLoader } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function LockScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-7 sm:p-9 my-auto transition-all">
        {/* HEADER */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-xs mx-auto mb-4">
            <FiLock size={22} className="stroke-[2.2]" />
          </div>

          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
            Reborn Fitness
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Administrator Login
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="mt-6 sm:mt-7 space-y-4 sm:space-y-4.5">
          {/* ERROR ALERT */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-xs sm:text-sm">
              <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-snug font-medium">{error}</span>
            </div>
          )}

          {/* USERNAME FIELD */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5 text-left"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiUser size={17} />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck="false"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-3 focus:ring-amber-400/20 transition-all placeholder:text-slate-400 font-normal"
                autoFocus
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5 text-left"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock size={17} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-3 focus:ring-amber-400/20 transition-all placeholder:text-slate-400 font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-semibold text-sm sm:text-base rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-3 focus:ring-amber-400/30"
            >
              {loading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* SUBTLE FOOTER */}
        <p className="text-[12px] text-slate-400 mt-6 text-center">
          Protected Management Portal • Authorized Access Only
        </p>
      </div>
    </div>
  );
}
