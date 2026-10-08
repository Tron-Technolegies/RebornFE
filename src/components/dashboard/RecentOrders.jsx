import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRentals } from "../../api/rentalApi";
import { getStitchingOrders } from "../../api/stitchingApi";
import { FiRefreshCw } from "react-icons/fi";

export default function RecentOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const [rentalRes, stitchingRes] = await Promise.all([
        getRentals(),
        getStitchingOrders(),
      ]);

      // Rental / Sale Orders
      const rentals = (rentalRes.data || []).map((r) => ({
        id:
          r.order_code ||
          `#RNT-${String(r.id).padStart(4, "0")}`,
        name: r.customer_name || "-",
        phone: r.customer_phone || "-",
        type: "Sale",
        amount: Number(r.rental_amount || 0),
        status:
          !r.status ||
          r.status === "OVERDUE" ||
          r.status === "ACTIVE" ||
          r.status === "RETURNED" ||
          r.status === "COMPLETED"
            ? "Completed"
            : r.status,
        date: r.rental_date || r.created_at || null,
        originalData: r,
      }));

      // Stitching Orders
      const stitching = (stitchingRes.data || []).map((s) => ({
        id: `#STC-${String(s.id).padStart(4, "0")}`,
        name: s.customer || "-",
        phone: s.phone || "-",
        type: "Stitching",
        amount: Number(s.total_amount || 0),
        status: s.status,
        date:
          s.order_date ||
          s.delivery_date ||
          s.created_at ||
          null,
        originalData: s,
      }));

      // Combine and sort newest first
      const combined = [...rentals, ...stitching].sort(
        (a, b) =>
          new Date(b.date || 0) - new Date(a.date || 0)
      );

      // Only latest 5 on dashboard
      setOrders(combined.slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div className="rounded-xl border border-[#00000014] bg-white p-5">

      {/* HEADER */}
      <div className="mb-4 flex justify-between">
        <h3 className="font-semibold">Recent Orders</h3>

        <button
          onClick={() => navigate("/rental")}
          className="cursor-pointer text-sm font-bold text-black hover:underline"
        >
          View All
        </button>

      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="space-y-4">
        <table className="w-full table-fixed text-sm">
          <thead className="border-b border-[#00000014] text-xs text-gray-400">
            <tr>
              <th className="w-1/4 py-2 text-left font-medium">
                ORDER ID
              </th>

              <th className="w-1/4 py-2 text-left font-medium">
                CUSTOMER
              </th>

              <th className="w-1/4 py-2 text-left font-medium">
                AMOUNT
              </th>

              <th className="w-1/4 py-2 text-left font-medium">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-400"
                >
                  <FiRefreshCw className="mr-2 inline animate-spin" />
                  Loading recent activity...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-400"
                >
                  No recent orders.
                </td>
              </tr>
            ) : (
              orders.map((o, i) => (
                <tr
                  key={`${o.id}-${i}`}
                  className="border-b border-[#00000014]"
                >
                  <td className="w-1/4 py-4 text-left">
                    {o.id}
                  </td>

                  <td className="w-1/4 py-4 text-left">
                    <p className="font-medium">
                      {o.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {o.phone}
                    </p>
                  </td>

                  <td className="w-1/4 py-4 text-left">
                    ₹{" "}
                    {Number(o.amount || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="w-1/4 py-4 text-left">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium uppercase tracking-tight ${statusStyle[o.status] ||
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
    </div>
  );
}
