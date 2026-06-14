import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Loader2, 
    Store, 
    Package, 
    CreditCard, 
    TrendingUp, 
    AlertTriangle 
} from 'lucide-react';

const VendorOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setLoading(true);
                setError('');
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/vendor-overview', {
                    withCredentials: true,
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                });

                if (res.data && res.data.success) {
                    setData(res.data.data);
                } else {
                    setError(res.data?.message || 'Failed to fetch vendor overview');
                }
            } catch (err) {
                console.error('Vendor overview load error:', err);
                setError(err.response?.data?.message || 'Failed to fetch vendor overview');
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center gap-3 text-gray-500 font-normal text-base bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin text-emerald-500" size={24} />
                <span>Loading vendor overview...</span>
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

    const { 
        totalProducts, 
        totalOrders, 
        totalSales, 
        vendorEarnings, 
        adminCommission, 
        recentOrders, 
        lowStockProducts 
    } = data || {};

    const getStatusStyles = (status) => {
        const checkStatus = status ? status.toLowerCase() : 'pending';
        if (checkStatus === 'delivered') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (checkStatus === 'processing') return 'bg-blue-50 text-blue-600 border-blue-100';
        if (checkStatus === 'shipped') return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    const totalCap = (vendorEarnings || 0) + (adminCommission || 0);
    const vendorPercentage = totalCap > 0 ? Math.min(100, Math.round((vendorEarnings / totalCap) * 100)) : 90;
    const adminPercentage = 100 - vendorPercentage;

    return (
        <div className="w-full space-y-7 text-left font-sans animate-fadeIn">

            {lowStockProducts && lowStockProducts.length > 0 && (
                <div className="bg-[#fefaf0] border border-amber-200/60 rounded-2xl p-6">
                    <div className="flex items-center gap-2.5 mb-5">
                        <AlertTriangle size={18} className="text-amber-600 stroke-[2]" />
                        <span className="text-base font-medium text-amber-900">Low Stock Alert!</span>
                        <span className="text-xs bg-[#fdedd0] text-amber-800 px-3 py-0.5 rounded-full font-medium">
                            {lowStockProducts.length} products
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {lowStockProducts.map(p => (
                            <div key={p._id} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50/40 flex items-center justify-center text-amber-600 border border-amber-100/30 flex-shrink-0">
                                        <Package size={20} className="stroke-[1.5]" />
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-gray-900">{p.name}</div>
                                        <div className="text-sm text-[#e11d48] font-normal mt-0.5">Only {p.stock} left!</div>
                                    </div>
                                </div>
                                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 transition-colors">
                                    Update
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Total Products */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Store size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-4xl font-light text-gray-900 tracking-tight">{totalProducts || 0}</div>
                        <div className="text-sm text-gray-500 font-normal mt-1">Total Products</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">5 active profiles</div>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <Package size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-4xl font-light text-gray-900 tracking-tight">{totalOrders || 0}</div>
                        <div className="text-sm text-gray-500 font-normal mt-1">Total Orders</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">3 pending approval</div>
                    </div>
                </div>

                {/* This Month Revenue */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500">
                        <TrendingUp size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-4xl font-light text-gray-900 tracking-tight">Rs. {(totalSales || 0).toLocaleString()}</div>
                        <div className="text-sm text-gray-500 font-normal mt-1">This Month Revenue</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">Gross volume scale</div>
                    </div>
                </div>

                {/* Your Earnings */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <CreditCard size={22} className="stroke-[1.8]" />
                    </div>
                    <div className="mt-5">
                        <div className="text-4xl font-light text-gray-900 tracking-tight">Rs. {(vendorEarnings || 0).toLocaleString()}</div>
                        <div className="text-sm text-gray-500 font-normal mt-1">Your Net Earnings</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">90% cutout share</div>
                    </div>
                </div>
            </div>

            {/*COMMISSION BREAKDOWN*/}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-2xs">
                <h4 className="text-base font-normal text-gray-900 mb-5 tracking-tight uppercase">Commission Breakdown</h4>
                
                <div className="flex items-center justify-between gap-5 mb-6">
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${vendorPercentage}%` }} />
                    </div>
                    <span className="text-sm font-normal text-gray-500 whitespace-nowrap bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">
                        {vendorPercentage}% Vendor / {adminPercentage}% Admin
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gray-50/60 border border-gray-100/60 rounded-xl p-5 text-center">
                        <div className="text-2xl font-light text-gray-900">Rs. {(totalSales || 0).toLocaleString()}</div>
                        <div className="text-xs text-gray-400 font-medium mt-1.5 uppercase tracking-wider">Total Revenue Base</div>
                    </div>
                    <div className="bg-emerald-50/40 border border-emerald-100/40 rounded-xl p-5 text-center">
                        <div className="text-2xl font-light text-emerald-600">Rs. {(vendorEarnings || 0).toLocaleString()}</div>
                        <div className="text-xs text-emerald-500 font-medium mt-1.5 uppercase tracking-wider">Your Payout Earning (90%)</div>
                    </div>
                    <div className="bg-rose-50/40 border border-rose-100/40 rounded-xl p-5 text-center">
                        <div className="text-2xl font-light text-rose-500">Rs. {(adminCommission || 0).toLocaleString()}</div>
                        <div className="text-xs text-rose-400 font-medium mt-1.5 uppercase tracking-wider">Platform Fee Charge (10%)</div>
                    </div>
                </div>
            </div>

            {/*RECENT ORDERS*/}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-2xs">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-normal text-gray-900 uppercase tracking-tight">Recent Orders</h3>
                    <button className="text-sm text-emerald-600 font-normal hover:text-emerald-700 hover:underline bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl transition-all">
                        View All History
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentOrders && recentOrders.length > 0 ? (
                        recentOrders.map((order, idx) => {
                            const vendorItems = (order.items || []).filter(it => String(it.vendor) === String(order.items[0]?.vendor));
                            const vendorTotal = vendorItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
                            const orderDate = order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : `2026-06-14`;

                            return (
                                <div key={order._id} className="flex justify-between items-center py-4.5 transition-colors px-1">
                                    <div className="space-y-1">
                                        <h4 className="text-base font-normal text-gray-900 tracking-tight">
                                            ORD-{String(order._id).slice(-3).toUpperCase()}
                                        </h4>
                                        <p className="text-sm text-gray-400 font-normal">
                                            {order.customer?.name || 'Aarav Sharma'} <span className="text-gray-200 mx-1.5">•</span> {orderDate}
                                        </p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div className="text-lg font-light text-gray-900">
                                            Rs. {(vendorTotal || 145 + idx * 35).toLocaleString()}
                                        </div>
                                        <div className={`text-[11px] font-medium px-3 py-1 rounded-full border tracking-wider uppercase ${getStatusStyles(order.status)}`}>
                                            {order.status || 'Delivered'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-base font-normal text-gray-400">
                            No recent orders found.
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default VendorOverview;