import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Percent, Search, Landmark, CreditCard, TrendingUp } from 'lucide-react';

const Commission = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalCommission: 0,
        totalVendorPayouts: 0,
        averageCommission: 0,
        transactions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCommissionStats = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/order/admin-commission-stats', {
                withCredentials: true,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.success) {
                setStats(response.data);
            }
        } catch (err) {
            console.error("Commission stats fetch error:", err);
            setError(err.response?.data?.message || "Failed to load commission transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissionStats();
    }, []);

    const filteredTransactions = stats.transactions.filter(t => {
        const query = searchQuery.toLowerCase();
        return (
            t.customerName.toLowerCase().includes(query) ||
            t.vendorName.toLowerCase().includes(query) ||
            t.orderId.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-gray-400 font-semibold text-xs bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="animate-spin text-[#00B56A]" size={24} />
                <span className="tracking-wider">Syncing platform commission metrics...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-fadeIn px-1 text-left">
            {/* Header Block */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Commission Ledger</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Real-time platform financial splits and vendor payouts logs</p>
                </div>
                <div className="bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-1.5">
                    <Percent size={14} />
                    <span>10% Platform Cut Rate</span>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
                    Runtime Error: {error}
                </div>
            )}

            {/* Financial Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                    <div className="space-y-1.5">
                        <span className="text-xs font-bold text-gray-400 block tracking-wide uppercase">Delivered Volume</span>
                        <h3 className="text-2xl font-black text-gray-900 leading-none">Rs. {stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <TrendingUp size={22} />
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                    <div className="space-y-1.5">
                        <span className="text-xs font-bold text-red-500 block tracking-wide uppercase">Admin Comm. (10%)</span>
                        <h3 className="text-2xl font-black text-red-500 leading-none">Rs. {stats.totalCommission.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <Percent size={22} />
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                    <div className="space-y-1.5">
                        <span className="text-xs font-bold text-emerald-500 block tracking-wide uppercase">Vendor Share (90%)</span>
                        <h3 className="text-2xl font-black text-emerald-600 leading-none">Rs. {stats.totalVendorPayouts.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <Landmark size={22} />
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                    <div className="space-y-1.5">
                        <span className="text-xs font-bold text-gray-400 block tracking-wide uppercase">Avg. Comm. / Order</span>
                        <h3 className="text-2xl font-black text-gray-905 leading-none">Rs. {stats.averageCommission.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
                        <CreditCard size={22} />
                    </div>
                </div>
            </div>

            {/* Core Ledger Grid Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-sm font-black text-gray-900 uppercase">Commission Breakdown</h3>
                    
                    {/* Search Field */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by vendor, customer, order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50/50 border border-gray-150 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#00B56A] transition-all"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                                <th className="py-4 px-6">Order ID</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Vendor (Shop)</th>
                                <th className="py-4 px-6">Subtotal</th>
                                <th className="py-4 px-6 text-red-500">Comm. (10%)</th>
                                <th className="py-4 px-6 text-emerald-600">Vendor Share (90%)</th>
                                <th className="py-4 px-6">Payment</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx, index) => {
                                    const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });

                                    return (
                                        <tr key={tx.orderId || index} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-900">
                                                ORD-{String(tx.orderId).slice(-6).toUpperCase()}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 font-medium">
                                                {formattedDate}
                                            </td>
                                            <td className="py-4 px-6 text-gray-700 font-medium">
                                                {tx.customerName}
                                            </td>
                                            <td className="py-4 px-6 text-gray-750 font-bold">
                                                {tx.vendorName}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-gray-900">
                                                Rs. {tx.subTotal}
                                            </td>
                                            <td className="py-4 px-6 text-red-500 font-bold">
                                                Rs. {tx.adminCommission}
                                            </td>
                                            <td className="py-4 px-6 text-emerald-600 font-bold">
                                                Rs. {tx.vendorEarnings}
                                            </td>
                                            <td className="py-4 px-6 font-bold text-gray-600">
                                                {tx.paymentMethod || "COD"}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full border bg-green-50 text-green-600 border-green-200 uppercase tracking-wider">
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-16 text-gray-400 font-medium bg-white">
                                        No commission transactions matching search criteria found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Commission;
