import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function RecentOrdersModal({
  onClose,
  orders = [],
}) {
  const [search, setSearch] = useState("");

  const statusStyle = {
    Completed: "bg-green-100 text-green-600",
    COMPLETED: "bg-green-100 text-green-600",
    Returned: "bg-green-100 text-green-600",
    InProgress: "bg-orange-100 text-orange-500",
    "In Progress": "bg-orange-100 text-orange-500",
    in_progress: "bg-orange-100 text-orange-500",
    Reserved: "bg-yellow-400/20 text-black font-semibold",
    Active: "bg-green-100 text-green-600",
    ACTIVE: "bg-green-100 text-green-600",
    Overdue: "bg-green-100 text-green-600",
    OVERDUE: "bg-green-100 text-green-600",
    pending: "bg-yellow-400/20 text-black font-semibold",
    ready: "bg-green-100 text-green-600",
    delivered: "bg-gray-100 text-gray-500",
    RETURNED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
  };

  const statusLabel = {
    pending: "Pending",
    in_progress: "In Progress",
    ready: "Ready",
    delivered: "Delivered",
    OVERDUE: "Completed",
    Overdue: "Completed",
    ACTIVE: "Completed",
    Active: "Completed",
  };

  const searchValue = search.toLowerCase().trim();

  const filtered = orders.filter((o) => {
    return (
      o.name?.toLowerCase().includes(searchValue) ||
      o.id?.toLowerCase().includes(searchValue) ||
      o.phone?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-[90%] max-w-5xl flex-col overflow-hidden rounded-xl bg-white p-6">

        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 className="text-lg font-semibold">
            Order History
          </h2>

          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 transition hover:text-black"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="mb-4 flex shrink-0 items-center rounded-lg border border-[#00000014] px-3 py-2">
          <FiSearch className="shrink-0 text-gray-400" />

          <input
            type="text"
            placeholder="Search by order ID, customer name..."
            className="ml-2 w-full text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[650px] table-fixed text-sm">
            <thead className="border-b border-[#00000014] text-xs text-gray-400">
              <tr>
                <th className="w-1/4 py-3 text-left font-medium">
                  ORDER ID
                </th>

                <th className="w-1/4 py-3 text-left font-medium">
                  CUSTOMER
                </th>

                <th className="w-1/4 py-3 text-left font-medium">
                  AMOUNT
                </th>

                <th className="w-1/4 py-3 text-left font-medium">
                  STATUS
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-gray-400"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((o, i) => (
                  <tr
                    key={`${o.id}-${i}`}
                    className="border-b border-[#00000014]"
                  >
                    <td className="py-4 text-left font-medium text-gray-800">
                      {o.id}
                    </td>

                    <td className="py-4 text-left">
                      <p className="font-medium text-gray-800">
                        {o.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {o.phone}
                      </p>
                    </td>

                    <td className="py-4 text-left font-medium text-gray-800">
                      ₹ {Number(o.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 text-left">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[o.status] ||
                          "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {statusLabel[o.status] || o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex shrink-0 items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {filtered.length} orders
          </p>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-[#e5c004]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
