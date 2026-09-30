import React from "react";
import { FiX } from "react-icons/fi";

export default function FinancialExpensesModal({ data = [], onClose }) {
    const formatCurrency = (val) =>
        Number(val || 0).toLocaleString("en-IN");

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#00000014]">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            All Expenses
                        </h2>

                        <p className="text-xs text-gray-400 mt-1">
                            Complete expense history
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">

                    {data.length > 0 ? (
                        <div className="w-full">

                            {/* Table Header */}
                            <div className="grid grid-cols-[2fr_1.3fr_1fr_0.8fr] gap-4 items-center pb-3 mb-3 border-b border-[#00000014] text-xs font-semibold text-gray-400">
                                <p>Date / Description</p>
                                <p>Category</p>
                                <p>Amount</p>
                                <p>Status</p>
                            </div>

                            {/* Expenses */}
                            <div className="space-y-3">

                                {data.map((d, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-[2fr_1.3fr_1fr_0.8fr] gap-4 items-center border-b border-[#00000014] pb-3 text-sm"
                                    >
                                        {/* Date + Description */}
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {d.date}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1 truncate">
                                                {d.desc}
                                            </p>
                                        </div>

                                        {/* Category */}
                                        <p className="capitalize text-gray-700 truncate">
                                            {d.category}
                                        </p>

                                        {/* Amount */}
                                        <p className="font-semibold text-gray-800 whitespace-nowrap">
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
                                ))}

                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 py-10 text-center">
                            No expenses found.
                        </p>
                    )}

                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-[#00000014]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-900 cursor-pointer"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
