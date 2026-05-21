import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Store, Clock, ShoppingBag, Loader2 } from 'lucide-react';

const Overview = () => {
    const [counts, setCounts] = useState({
        total: 0,
        customers: 0,
        vendors: 0,
        pendingVendors: 0, 
        totalOrders: 0,     
        totalRevenue: 0,   
        vendorPayouts: 0,  
        adminCommission: 0 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/auth/getUserCount', { withCredentials: true });
                if (response.data.success) {
                    const serverData = response.data.data;
                    setCounts(prevState => ({
                        ...prevState,
                        total: serverData.total || 0,
                        customers: serverData.customers || 0,
                        vendors: serverData.vendors || 0,
                        pendingVendors: serverData.pendingVendors || 0 
                    }));
                }
            } catch (err) {
                console.error("Dashboard engine failed to stream analytics dataset values:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center gap-2 text-gray-400 font-semibold text-sm bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin text-[#00B56A]" size={20} />
                <span>Syncing dashboard records with live server data stream...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 px-0.5 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { t: "Total Users", c: counts.total, i: <Users className="text-blue-500" size={22} />, bg: "bg-blue-50/70" },
                    { t: "Total Vendors", c: counts.vendors, i: <Store className="text-green-500" size={22} />, bg: "bg-green-50/70" },
                    { t: "Pending Vendors", c: counts.pendingVendors, i: <Clock className="text-amber-500" size={22} />, bg: "bg-amber-50/70" },
                    { t: "Total Orders", c: counts.totalOrders, i: <ShoppingBag className="text-purple-500" size={22} />, bg: "bg-purple-50/70" }
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

            {/* Platform Revenue Breakdown Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center space-y-1 transition-all hover:shadow-md hover:shadow-gray-100/50">
                    <span className="text-xs font-bold text-gray-400 tracking-wide">Total Platform Revenue</span>
                    <h2 className="text-2xl font-black text-gray-900">Rs. {counts.totalRevenue.toLocaleString()}</h2>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center space-y-1 transition-all hover:shadow-md hover:shadow-gray-100/50">
                    <span className="text-xs font-bold text-green-500 tracking-wide">Vendor Payouts (90%)</span>
                    <h2 className="text-2xl font-black text-green-600">Rs. {counts.vendorPayouts.toLocaleString()}</h2>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center space-y-1 transition-all hover:shadow-md hover:shadow-gray-100/50">
                    <span className="text-xs font-bold text-red-500 tracking-wide">Admin Commission (10%)</span>
                    <h2 className="text-2xl font-black text-red-500">Rs. {counts.adminCommission.toLocaleString()}</h2>
                </div>
            </div>

            {/* Action Required Banner Notification Structure */}
            <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm shadow-amber-50/50">
                <div className="flex items-center gap-3.5">
                    <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm border border-amber-100/50">🏠</span>
                    <div>
                        <h4 className="text-sm font-bold text-gray-800">{counts.pendingVendors} Vendors Awaiting Approval</h4>
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