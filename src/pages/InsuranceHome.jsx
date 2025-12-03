import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { FileText, Settings, LogOut, Search } from "lucide-react";

// Tab Screens
import Pending from "../insuranceTabpages/Pending";
import Approved from "../insuranceTabpages/Approved";
import Completed from "../insuranceTabpages/Completed";
import Reinspection from "../insuranceTabpages/Reinspection";
import Cancelled from "../insuranceTabpages/Cancelled";

// Form
import JobFileSurveyForm from "../insuranceComponents/JobFileSurveyForm";

export default function InsuranceHome() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Pending");
    const [activeInnerTab, setActiveInnerTab] = useState("Add Bill");
    const [searchText, setSearchText] = useState("");

    const [counts, setCounts] = useState({
        Pending: 0,
        Approved: 0,
        Completed: 0,
        "Re-Inspection": 0,
        Cancelled: 0,
    });

    const handleLogout = useCallback(() => {
        localStorage.clear();
        navigate("/");
    }, [navigate]);

    const updateCount = useCallback((tab, count) => {
        setCounts((prev) => (prev[tab] === count ? prev : { ...prev, [tab]: count }));
    }, []);

    const tabComponents = {
        Pending: <Pending searchText={searchText} onCountChange={(c) => updateCount("Pending", c)} />,
        Approved: <Approved searchText={searchText} onCountChange={(c) => updateCount("Approved", c)} />,
        Completed: <Completed searchText={searchText} onCountChange={(c) => updateCount("Completed", c)} />,
        "Re-Inspection": <Reinspection searchText={searchText} onCountChange={(c) => updateCount("Re-Inspection", c)} />,
        Cancelled: <Cancelled searchText={searchText} onCountChange={(c) => updateCount("Cancelled", c)} />,
    };

    const renderTabContent = useMemo(() => tabComponents[activeTab], [activeTab, searchText, counts]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 text-black text-xs md:text-sm">

            {/* Navbar */}
            <header className="bg-white shadow-md rounded-2xl p-2 flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="
      text-3xl font-extrabold tracking-tight
      bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500
      bg-clip-text text-transparent
    ">
                        Yadgar Insurance
                    </h1>
                    <p className="mt-1 text-gray-600 text-sm">💼 Insurance Work | Workshop Management</p>
                </div>

                <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                    <button
                        onClick={() => navigate("/insuranceadmin")}
                        className="
        flex items-center gap-2 px-5 py-2 rounded-xl text-white
        bg-cyan-600
     
        shadow transition
      "
                    >
                        <FileText size={16} /> Claims
                    </button>

                    <button
                        onClick={() => navigate("/settings")}
                        className="
        flex items-center gap-2 px-5 py-2 rounded-xl text-white
        bg-gray-700 hover:bg-gray-600 shadow transition
      "
                    >
                        <Settings size={16} /> Settings
                    </button>

                    <button
                        onClick={handleLogout}
                        className="
        flex items-center gap-2 px-5 py-2 rounded-xl text-white
        bg-red-600 hover:bg-red-500 shadow transition
      "
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>


            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-1 gap-3 p-3 overflow-hidden">

                {/* Left Form */}
                <div className="lg:w-1/2 w-full bg-white shadow-lg rounded-2xl p-4 flex flex-col">
                    <div className="overflow-y-auto flex-1">
                        <JobFileSurveyForm />
                    </div>
                </div>

                {/* Right Section */}
                <div className="lg:w-1/2 w-full bg-white shadow-lg rounded-2xl p-4 flex flex-col">

                    {/* Inner Tabs */}
                    <div className="flex w-full border-b mb-0 text-sm">
                        {["Add Bill", "Add Estimate", "Upload Documents"].map((tab) => {
                            const isActive = activeInnerTab === tab;
                            return (
                                <div
                                    key={tab}
                                    onClick={() => setActiveInnerTab(tab)}
                                    className={`flex-1 text-center py-2 font-semibold cursor-pointer transition-all ${isActive
                                        ? "text-indigo-600 border-b-2 border-indigo-500"
                                        : "text-gray-600 hover:text-black"
                                        }`}
                                >
                                    {tab}
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                        {activeInnerTab === "Add Bill" && (
                            <button
                                onClick={() => navigate("/bill")}
                                className="w-full sm:w-auto px-7 py-3 bg-cyan-600 text-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition"
                            >
                                Create Bill
                            </button>
                        )}
                        {activeInnerTab === "Add Estimate" && (
                            <button
                                onClick={() => navigate("/estimate")}
                                className="w-full sm:w-auto px-7 py-3 bg-green-600 text-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition"
                            >
                                Create Estimate
                            </button>
                        )}
                        {activeInnerTab === "Upload Documents" && (
                            <button
                                onClick={() => navigate("/documents")}
                                className="w-full sm:w-auto px-7 py-3 bg-purple-600 text-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition"
                            >
                                Upload Documents
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Table */}
            <div className="bg-white shadow-lg rounded-2xl flex flex-col flex-1 m-3 overflow-hidden">

                {/* Tabs + Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-3 p-3">

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {["Pending", "Approved", "Completed", "Re-Inspection", "Cancelled"].map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${isActive
                                        ? "bg-cyan-600 text-white shadow"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                        }`}
                                >
                                    {tab} <span className="ml-1 text-xs">({counts[tab]})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Section */}
                    <div className="flex items-center gap-2 w-full md:w-auto">

                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Search Claim No or Vehicle No"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        </div>

                        <button
                            onClick={() => setSearchText("")}
                            className="px-5 py-2 text-white bg-gray-700 hover:bg-gray-600 shadow transition rounded-xl"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="overflow-x-auto">
                    <div className="min-w-max grid grid-cols-2 sm:grid-cols-10 gap-1 bg-gray-100 p-2 font-semibold text-gray-700">
                        <div>📅 Date</div>
                        <div>⏰ Time</div>
                        <div className="hidden sm:block">💼 Claim No</div>
                        <div className="hidden sm:block">👤 Customer</div>
                        <div className="hidden sm:block">📞 Contact</div>
                        <div className="hidden sm:block">🚘 Car</div>
                        <div className="hidden sm:block">🔢 Model</div>
                        <div className="hidden sm:block">🎫 Vehicle #</div>
                        <div className="col-span-2 text-center">🧾 Actions</div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto">
                    {renderTabContent}
                </div>
            </div>
        </div>
    );
}
