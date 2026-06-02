import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Store, Package, CreditCard, BarChart2 } from 'lucide-react';

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
            <div className="w-full h-96 flex items-center justify-center gap-2 text-gray-400 font-semibold text-sm bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin text-[#00B56A]" size={20} />
                <span>Loading vendor overview...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
                {error}
            </div>
        );
    }

    const { totalProducts, totalOrders, totalSales, vendorEarnings, adminCommission, recentOrders, lowStockProducts } = data || {};

    const getStatusStyles = (status) => {
        const checkStatus = status ? status.toLowerCase() : 'pending';
        if (checkStatus === 'delivered') return 'bg-green-50 text-green-600 border-green-100';
        if (checkStatus === 'processing' || checkStatus === 'shipped') return 'bg-blue-50 text-blue-600 border-blue-100';
        return 'bg-amber-50 text-amber-600 border-amber-100';
    };

    return (
        <div className="w-full space-y-8 px-4 animate-fadeIn">

            {/* Low Stock Banner */}
            {lowStockProducts && lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-amber-700 font-semibold">Low Stock Alert!</span>
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{lowStockProducts.length} products</span>
                        </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        {lowStockProducts.map(p => (
                            <div key={p._id} className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-2">
                                <div className="w-10 h-10 rounded-md bg-gray-50 overflow-hidden flex-shrink-0">
                                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : null}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-gray-900">{p.name}</div>
                                    <div className="text-xs text-red-500">Only {p.stock} left!</div>
                                </div>
                                <div className="ml-4">
                                    <button className="text-amber-600 text-sm font-semibold">Update</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Top metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M7 21V7h10v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-900">{totalProducts || 0}</div>
                            <div className="text-xs text-gray-400">Total Products</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M7 21V7h10v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-900">{totalOrders || 0}</div>
                            <div className="text-xs text-gray-400">Total Orders</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-sky-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-900">Rs. { (totalSales || 0).toLocaleString() }</div>
                            <div className="text-xs text-gray-400">This Month Revenue</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-gray-900">Rs. { (vendorEarnings || 0).toLocaleString() }</div>
                            <div className="text-xs text-gray-400">Your Earnings</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Commission Breakdown */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold mb-4">Commission Breakdown</h4>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${adminCommission + vendorEarnings ? Math.min(100, Math.round((vendorEarnings/(vendorEarnings+adminCommission||1))*100)) : 90}%` }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
                        <div className="text-lg font-black">Rs. { (totalSales || 0).toLocaleString() }</div>
                        <div className="text-xs text-gray-400">Total Sales</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
                        <div className="text-lg font-black text-emerald-700">Rs. { (vendorEarnings || 0).toLocaleString() }</div>
                        <div className="text-xs text-emerald-600">Your Earning (90%)</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                        <div className="text-lg font-black text-red-600">Rs. { (adminCommission || 0).toLocaleString() }</div>
                        <div className="text-xs text-red-500">Platform Fee (10%)</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
                    <a className="text-sm text-emerald-600 font-semibold">View All</a>
                </div>

                <div className="divide-y divide-gray-50">
                    {recentOrders && recentOrders.length > 0 ? (
                        recentOrders.map((order) => {
                            const vendorItems = (order.items || []).filter(it => String(it.vendor) === String(order.items[0]?.vendor));
                            const vendorTotal = vendorItems.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
                            return (
                                <div key={order._id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-gray-900">ORD-{String(order._id).slice(-3).toUpperCase()}</h4>
                                        <p className="text-xs text-gray-400">{order.customer?.name || 'Customer'} • {order.items?.[0]?.product?.name || 'Product'}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-gray-900">Rs. {vendorTotal.toLocaleString()}</div>
                                        <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1 ${getStatusStyles(order.status)}`}>{order.status || 'pending'}</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-6 text-xs font-medium text-gray-400">No recent orders found.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default VendorOverview;
