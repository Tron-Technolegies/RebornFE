import {
  FiMapPin,
  FiCalendar,
  FiChevronDown,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] =
    useState("");

  const { logout } = useAuth();

  const getTitle = () => {
    const path = location.pathname.split("/")[1];

    if (!path) return "Dashboard";

    return (
      path.charAt(0).toUpperCase() +
      path.slice(1)
    );
  };

  useEffect(() => {
    const today =
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

    setCurrentDate(today);
  }, []);

  const handleLogout = async () => {
    setOpen(false);

    await logout();
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-[#00000014] transition-all">

      {/* LEFT */}
      <div className="flex gap-3 sm:gap-4 items-center min-w-0">

        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 -ml-1 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <FiMenu size={22} />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-gray-800 truncate">
          {getTitle()}
        </h1>

        <div className="hidden sm:block border-l border-[#00000014] h-[20px]" />

        <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-black bg-yellow-400/20 font-semibold px-3 py-1.5 rounded-lg border border-yellow-400/40 shrink-0">
          <FiMapPin />
          Chavakkad Branch
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">

        {/* DATE */}
        <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
          <FiCalendar className="text-black" />
          {currentDate}
        </div>

        <div className="hidden md:block border-l border-[#00000014] h-[20px]" />

        {/* PROFILE */}
        <div className="relative">

          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 cursor-pointer rounded-lg hover:bg-gray-50"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-extrabold shadow-sm border border-black/10 text-sm">
              A
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-tight">
                Admin
              </p>

              <p className="text-[11px] text-gray-500 leading-tight">
                Store Admin
              </p>
            </div>

            <FiChevronDown
              className={`transition-transform duration-200 text-gray-500 ${open ? "rotate-180" : ""
                }`}
            />
          </div>

          {/* LOGOUT */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#00000014] rounded-xl shadow-lg overflow-hidden py-1 z-50">

              <div className="sm:hidden px-4 py-2 border-b border-gray-100 text-xs text-gray-500 font-medium">
                Signed in as{" "}
                <span className="font-bold text-gray-800">
                  Admin
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
              >
                <FiLogOut />
                Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;
