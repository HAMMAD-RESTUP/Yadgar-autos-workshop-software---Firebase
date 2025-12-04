import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Claim() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full p-4 bg-gray-100 dark:bg-gray-900">

      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-semibold">Claim</h1>
      </div>

      {/* Page Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Claim Page</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Yahan aap apna Claim form / data show ya edit kar sakte ho.
        </p>
      </div>
    </div>
  );
}
