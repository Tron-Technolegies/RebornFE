import React, { useState } from "react";
import FinancialExpensesModal from "./FinancialExpensesModal";

export default function FinancialTable({ data = [] }) {
  const [showModal, setShowModal] = useState(false);

  const formatCurrency = (val) =>
    Number(val || 0).toLocaleString("en-IN");

  // Show only the latest 3 expenses
  const recentExpenses = data.slice(0, 3);

  return (
    <>
      {/* Recent Expenses */}
      <div className="bg-white p-5 rounded-xl border border-[#00000014]">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            Recent Expenses
          </h3>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-sm text-black font-bold hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>

        {/* Table */}
        <div className="w-full">

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.3fr_1fr_0.8fr] gap-4 items-center pb-2 mb-2 border-b border-[#00000014] text-xs font-semibold text-gray-400">
            <p>Date / Description</p>
            <p>Category</p>
            <p>Amount</p>
            <p>Status</p>
          </div>

          {/* Recent 3 Expenses */}
          <div className="space-y-3">

            {recentExpenses.length > 0 ? (
              recentExpenses.map((d, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[2fr_1.3fr_1fr_0.8fr] gap-4 items-center border-b border-[#00000014] pb-3 text-sm"
                >
                  {/* Date + Description */}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {d.date}
                    </p>

                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {d.desc}
                    </p>
                  </div>

                  {/* Category */}
                  <p className="capitalize text-gray-700 truncate">
                    {d.category}
                  </p>

                  {/* Amount */}
                  <p className="font-medium text-gray-800 whitespace-nowrap">
                    ₹{formatCurrency(d.amount)}
                  </p>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex text-xs px-2 py-1 rounded ${d.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-500"
                        }`}
                    >
                      {d.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">
                No recent expenses.
              </p>
            )}

          </div>
        </div>
      </div>

      {/* Full Expenses Modal */}
      {showModal && (
        <FinancialExpensesModal
          data={data}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
