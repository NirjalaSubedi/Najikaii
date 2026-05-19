import React from 'react';
import { Users, Store, Clock, ShoppingBag } from 'lucide-react';

const Overview = () => {
    return (
        <div className="w-full space-y-8 px-0.5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { t: "Total Users", c: "5", i: <Users className="text-blue-500" size={22} />, bg: "bg-blue-50/70" },
                    { t: "Total Vendors", c: "5", i: <Store className="text-green-500" size={22} />, bg: "bg-green-50/70" },
                    { t: "Pending Vendors", c: "2", i: <Clock className="text-amber-500" size={22} />, bg: "bg-amber-50/70" },
                    { t: "Total Orders", c: "48", i: <ShoppingBag className="text-purple-500" size={22} />, bg: "bg-purple-50/70" }
                ].map((s, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:shadow-gray-100/50">
                        <div className="space-y-1.5">
                            <span className="text-xs font-bold text-gray-400 block tracking-wide">{s.t}</span>
                            <h3 className="text-2xl font-black text-gray-900 leading-none">{s.c}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                            {s.i}
                        </div>
                    </div>
                ))}
            </div>

            {/* Platform Revenue Statement Split grid layout card columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:shadow-gray-100/50 flex flex-col justify-center items-center text-center space-y-1">
                    <span className="text-xs font-bold text-gray-400 tracking-wide">Total Platform Revenue</span>
                    <h2 className="text-2xl font-black text-gray-900">Rs. 68,450</h2>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:shadow-gray-100/50 flex flex-col justify-center items-center text-center space-y-1">
                    <span className="text-xs font-bold text-green-500 tracking-wide">Vendor Payouts (90%)</span>
                    <h2 className="text-2xl font-black text-green-600">Rs. 61,605</h2>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:shadow-gray-100/50 flex flex-col justify-center items-center text-center space-y-1">
                    <span className="text-xs font-bold text-red-500 tracking-wide">Admin Commission (10%)</span>
                    <h2 className="text-2xl font-black text-red-500">Rs. 6,845</h2>
                </div>
            </div>

            {/* Action Item Status Block Notification Banner */}
            <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm shadow-amber-50/50">
                <div className="flex items-center gap-3.5">
                    <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm border border-amber-100/50">🏠</span>
                    <div>
                        <h4 className="text-sm font-bold text-gray-800">2 Vendors Awaiting Approval</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Review and approve or reject pending local vendor applications.</p>
                    </div>
                </div>
                <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-amber-100 transition-all shrink-0 w-full sm:w-auto">
                    Review Now
                </button>
            </div>
        </div>
    );
};

export default Overview;