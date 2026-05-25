import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, ShieldCheck } from 'lucide-react';

const Orders = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const loadMasterOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem('token');

            const response = await axios.get('http://localhost:5000/api/order/vieworders', {
                withCredentials: true,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.success) {
                setOrdersList(response.data.orders);
            }
        } catch (err) {
            console.error("Najikai order synchronizer trace failure:", err);
            setError(err.response?.data?.message || "Order tracking logs load huna sakena.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMasterOrders();
    }, []);

    const handleStatusTransition = async (orderId, targetStatus) => {
        try {
            setUpdatingId(orderId);
            const token = localStorage.getItem('token');

            const response = await axios.put(`http://localhost:5000/api/order/update-status/${orderId}`, 
                { status: targetStatus },
                {
                    withCredentials: true,
                    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                }
            );

            if (response.data.success) {
                setOrdersList(prev => prev.map(order => 
                    order._id === orderId ? { ...order, status: targetStatus } : order
                ));
            }
        } catch (err) {
            console.error("Status state update interrupted:", err);
            alert(err.response?.data?.message || "Internal network error during operation.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-gray-400 font-semibold text-xs bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="animate-spin text-[#00B56A]" size={24} />
                <span className="tracking-wider">Najikai centralized database transactions fetching...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 animate-fadeIn px-1">
            {/* Component Title Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">All Orders</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Najikai Admin Master Transaction System Ledger</p>
                </div>
                <div className="bg-green-50 text-[#00B56A] px-3 py-1.5 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Multi-Vendor Vault Secure</span>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
                    Runtime Log Issue: {error}
                </div>
            )}

            {/* Core Ledger Grid Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-white">
                    <h3 className="text-sm font-black text-gray-900">All Orders</h3>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                                <th className="py-4 px-6">Order ID</th>
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Vendor</th>
                                <th className="py-4 px-6">Total</th>
                                <th className="py-4 px-6">Delivery</th>
                                <th className="py-4 px-6">Commission</th>
                                <th className="py-4 px-6">Vendor Earning</th>
                                <th className="py-4 px-6">Payment</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
                            {ordersList.length > 0 ? (
                                ordersList.map((order, index) => {
                                    const vendorName = order.items && order.items[0]?.product?.vendor?.name 
                                        || order.items && order.items[0]?.vendor?.name 
                                        || "Local Vendor";

                                    const grossTotal = order.totalAmount || 0;
                                    const deliveryCost = order.deliveryCharge ?? 30; // default template markup if empty
                                    const computedCommission = order.adminCommission || Math.round(grossTotal * 0.1);
                                    const netVendorEarning = order.vendorEarnings || (grossTotal - computedCommission);

                                    return (
                                        <tr key={order._id || index} className="hover:bg-gray-50/30 transition-colors">
                                            
                                            <td className="py-4 px-6 font-bold text-gray-900">
                                                ORD-{String(order._id).slice(-3).toUpperCase()}
                                            </td>
                                            
                                            <td className="py-4 px-6 text-gray-700 font-medium">
                                                {order.customer?.name || "Aarav Sharma"}
                                            </td>
                                            
                                            <td className="py-4 px-6 text-gray-500 font-medium">
                                                {vendorName}
                                            </td>
                                            
                                            {/* Gross Amount Total */}
                                            <td className="py-4 px-6 font-bold text-gray-900">
                                                Rs. {grossTotal}
                                            </td>
                                            
                                            {/* Distance Delivery Pricing Column */}
                                            <td className="py-4 px-6 text-gray-500 font-medium">
                                                Rs. {deliveryCost}
                                            </td>
                                            
                                            {/* Admin Split Deduction Share (Red Alert Design Highlight) */}
                                            <td className="py-4 px-6 text-red-500 font-bold">
                                                Rs. {computedCommission}
                                            </td>
                                            
                                            {/* Vendor Remittance Income Pay (Green Highlight) */}
                                            <td className="py-4 px-6 text-emerald-600 font-bold">
                                                Rs. {netVendorEarning}
                                            </td>
                                            
                                            {/* Payment Gateway Source Type Mode */}
                                            <td className="py-4 px-6 font-bold text-gray-600">
                                                {order.paymentMethod || "COD"}
                                            </td>
                                            
                                            {/* Dynamic Controller Select Dropdown Pill UI */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    {updatingId === order._id ? (
                                                        <Loader2 size={14} className="animate-spin text-[#00B56A]" />
                                                    ) : (
                                                        <select
                                                            value={order.status || "Pending"}
                                                            onChange={(e) => handleStatusTransition(order._id, e.target.value)}
                                                            className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider bg-transparent outline-none cursor-pointer transition-all ${
                                                                String(order.status).toLowerCase() === 'delivered'
                                                                    ? 'text-green-600 border-green-200 bg-green-50/50' 
                                                                    : String(order.status).toLowerCase() === 'processing'
                                                                    ? 'text-blue-600 border-blue-200 bg-blue-50/50'
                                                                    : String(order.status).toLowerCase() === 'shipped'
                                                                    ? 'text-purple-600 border-purple-200 bg-purple-50/50'
                                                                    : 'text-amber-600 border-amber-200 bg-amber-50/50'
                                                            }`}
                                                        >
                                                            <option value="Pending" className="text-amber-600 bg-white">Pending</option>
                                                            <option value="Processing" className="text-blue-600 bg-white">Processing</option>
                                                            <option value="Shipped" className="text-purple-600 bg-white">Shipped</option>
                                                            <option value="Delivered" className="text-green-600 bg-white">Delivered</option>
                                                            <option value="Cancelled" className="text-red-600 bg-white">Cancelled</option>
                                                        </select>
                                                    )}
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-16 text-gray-400 font-medium bg-white">
                                        Database cluster map ma kunai pani transaction records register bhayeko chhaina.
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

export default Orders;