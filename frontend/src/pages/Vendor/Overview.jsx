import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Loader2, 
    Store, 
    Package, 
    CreditCard, 
    TrendingUp 
} from 'lucide-react';

const VendorOverview = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        vendorEarnings: 0,
        adminCommission: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVendorDashboardData = async () => {
            try {
                setLoading(true);
                setError('');
                const token = localStorage.getItem('token');
                
                const res = await axios.get('http://localhost:5000/api/order/vieworders', {
                    withCredentials: true,
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                });

                if (res.data && res.data.success) {
                    // res.data.orders एरे नै हो भनी सुनिश्चित गर्न Array.isArray प्रयोग गरिएको
                    const ordersList = Array.isArray(res.data.orders) ? res.data.orders : [];

                    const totalSales = ordersList.reduce((sum, order) => sum + (order.vendorSpecificTotal || 0), 0);
                    const vendorEarnings = totalSales * 0.90;
                    const adminCommission = totalSales * 0.10;

                    const uniqueProductIds = new Set();
                    ordersList.forEach(order => {
                        order.items?.forEach(item => {
                            if (item.product?._id) uniqueProductIds.add(item.product._id);
                        });
                    });

                    setStats({
                        totalProducts: uniqueProductIds.size, 
                        totalOrders: res.data.count || ordersList.length,
                        totalSales,
                        vendorEarnings,
                        adminCommission,
                        recentOrders: ordersList.slice(0, 4)
                    });
                } else {
                    setError(res.data?.message || 'Failed to fetch dashboard metrics');
                }
            } catch (err) {
                console.error('Dashboard load error:', err);
                setError(err.response?.data?.message || 'Failed to fetch dashboard metrics');
            } finally {
                setLoading(false);
            }
        };

        fetchVendorDashboardData();
    }, []); 

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center gap-3 text-gray-500 font-normal text-base bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin text-emerald-500" size={24} />
                <span>Loading vendor dashboard analytics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-base font-normal text-left">
                {error}
            </div>
        );
    }

    const getStatusStyles = (status) => {
        const checkStatus = status ? status.toLowerCase() : 'pending';
        if (checkStatus === 'delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (checkStatus === 'processing') return 'bg-blue-50 text-blue-600 border-blue-100';
        if (checkStatus === 'shipped') return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        if (checkStatus === 'cancelled') return 'bg-rose-50 text-rose-600 border-rose-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    const totalCap = stats.vendorEarnings + stats.adminCommission;
    const vendorPercentage = totalCap > 0 ? Math.min(100, Math.round((stats.vendorEarnings / totalCap) * 100)) : 90;
    const adminPercentage = 100 - vendorPercentage;

    return (
        <div className="w-full space-y-7 text-left font-sans animate-fadeIn">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Store size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-3xl text-gray-900 tracking-tight">{stats.totalProducts}</div>
                        <div className="text-sm text-gray-700 font-semibold mt-1">Active Item Types</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">From live orders</div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <Package size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-3xl text-gray-900 tracking-tight">{stats.totalOrders}</div>
                        <div className="text-sm text-gray-700 font-semibold mt-1">Total Orders</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">Assigned to you</div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500">
                        <TrendingUp size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-3xl text-gray-900 tracking-tight">Rs. {stats.totalSales.toLocaleString()}</div>
                        <div className="text-sm text-gray-700 font-semibold mt-1">Gross Revenue</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">Total product sales base</div>
                    </div>
                </div>

                {/* Net Earnings */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <CreditCard size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-3xl text-gray-900 tracking-tight">Rs. {stats.vendorEarnings.toLocaleString()}</div>
                        <div className="text-sm text-gray-700 font-semibold mt-1">Your Net Earnings</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">90% cutout payout share</div>
                    </div>
                </div>
            </div>

            {/* Commission Breakdown Section */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-2xs">
                <h4 className="text-base font-bold text-gray-900 mb-5 tracking-tight uppercase">Platform Split Breakdown</h4>
                
                <div className="flex items-center justify-between gap-5 mb-6">
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${vendorPercentage}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 whitespace-nowrap bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">
                        {vendorPercentage}% Vendor / {adminPercentage}% Admin
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gray-50/60 border border-gray-100/60 rounded-xl p-5 text-center">
                        <div className="text-2xl font-bold text-gray-900">Rs. {stats.totalSales.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 font-bold mt-1.5 uppercase tracking-wider">Total Product Vol.</div>
                    </div>
                    <div className="bg-emerald-50/40 border border-emerald-100/40 rounded-xl p-5 text-center">
                        <div className="text-2xl font-bold text-emerald-600">Rs. {stats.vendorEarnings.toLocaleString()}</div>
                        <div className="text-xs text-emerald-500 font-bold mt-1.5 uppercase tracking-wider">Your Earnings (90%)</div>
                    </div>
                    <div className="bg-rose-50/40 border border-rose-100/40 rounded-xl p-5 text-center">
                        <div className="text-2xl font-bold text-rose-500">Rs. {stats.adminCommission.toLocaleString()}</div>
                        <div className="text-xs text-rose-400 font-bold mt-1.5 uppercase tracking-wider">Platform Charge (10%)</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-2xs">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">Recent Live Orders</h3>
                    <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 hover:underline bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl transition-all">
                        View Full History
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {stats.recentOrders && stats.recentOrders.length > 0 ? (
                        stats.recentOrders.map((order) => {
                            const orderDate = order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'N/A';
                            
                            return (
                                <div key={order._id} className="flex justify-between items-center py-4.5 transition-colors px-1">
                                    <div className="space-y-1">
                                        <h4 className="text-base font-bold text-gray-900 tracking-tight">
                                            ORD-{String(order._id).slice(-6).toUpperCase()}
                                        </h4>
                                        <p className="text-sm text-gray-500 font-medium">
                                            {order.customer?.name || 'Anonymous Customer'} 
                                            <span className="text-gray-200 mx-1.5">•</span> 
                                            {orderDate}
                                        </p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div className="text-lg font-bold text-gray-900">
                                            Rs. {(order.vendorSpecificTotal || 0).toLocaleString()}
                                        </div>
                                        <div className={`text-[11px] font-bold px-3 py-1 rounded-full border tracking-wider uppercase ${getStatusStyles(order.status)}`}>
                                            {order.status || 'Pending'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-base font-normal text-gray-400">
                            No recent orders found for your products.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default VendorOverview;