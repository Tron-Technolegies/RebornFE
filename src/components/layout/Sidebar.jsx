import React from "react";
import {
  FiBox,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiLayers,
  FiSettings,
  FiTag,
  FiX,
} from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import LOGO from "../../assets/LOGO.jpeg";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
    isActive
      ? "bg-yellow-400 text-black font-bold shadow-sm"
      : "text-gray-600 hover:bg-gray-100"
  }`;

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 w-64 h-screen bg-white border-r border-[#00000014] flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* LOGO & Mobile Close */}
        <div className="p-4 border-b border-[#00000014] flex items-center justify-between">
          <div className="flex items-center justify-center p-1 flex-1">
            <img
              src={LOGO}
              alt="Reborn Fitness Logo"
              className="max-h-14 sm:max-h-16 w-auto object-contain"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* DASHBOARD */}
          <NavLink
            to="/dashboard"
            className={linkClass}
            onClick={() => onClose && onClose()}
          >
            <MdOutlineDashboard /> Dashboard
          </NavLink>

          {/* CORE */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
              Core Modules
            </p>
            <div className="space-y-1">
              <NavLink
                to="/inventory"
                className={linkClass}
                onClick={() => onClose && onClose()}
              >
                <FiBox /> Inventory Management
              </NavLink>

              <NavLink
                to="/categories"
                className={linkClass}
                onClick={() => onClose && onClose()}
              >
                <FiLayers /> Categories
              </NavLink>

              <NavLink
                to="/rental"
                className={linkClass}
                onClick={() => onClose && onClose()}
              >
                <FiCalendar /> Sales & Orders
              </NavLink>

              <NavLink
                to="/coupons"
                className={linkClass}
                onClick={() => onClose && onClose()}
              >
                <FiTag /> Coupons & Offers
              </NavLink>
            </div>
          </div>

          {/* FINANCE */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
              Finance & Analytics
            </p>
            <div className="space-y-1">
              <NavLink
                to="/financial"
                className={linkClass}
                onClick={() => onClose && onClose()}
              >
                <FiCreditCard /> Financial Management
              </NavLink>
            </div>
          </div>

          {/* ADMIN */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">
              Administration
            </p>
            <div className="space-y-1">
              <NavLink
                to="/settings"
                className={linkClass}
                onClick={() => onClose && onClose()}
              >
                <FiSettings /> System Settings
              </NavLink>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

