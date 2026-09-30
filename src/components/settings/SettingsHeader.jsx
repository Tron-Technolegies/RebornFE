import React from "react";

export default function SettingsHeader() {
  return (
    <div className="flex justify-between items-center mb-6 pt-2">
      <div>
        <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage system configurations and administrator security.
        </p>
      </div>
    </div>
  );
}
