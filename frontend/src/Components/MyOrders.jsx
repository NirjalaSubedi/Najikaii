import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Package, Clock, CheckCircle2, XCircle, ArrowLeft, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Customer Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await axios.get('http://localhost:5000/api/order/vieworders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success(res.data.message || "Order cancelled successfully!");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  // Modern Status Badges Component with Icons
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <Clock size={13} className="animate-pulse" /> Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={13} /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <XCircle size={13} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/60">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50">
        <div className="w-12 h-12 border-4 border-[#00B56A] border-t-transparent rounded-full animate-spin shadow-sm"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500 animate-pulse">Fetching your orders live...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="flex items-center justify-between mb-10 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all"
            >
              <ArrowLeft size={16} className="text-slate-700" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#00B56A] tracking-tight">My Orders</h1>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Track and manage your dynamic retail purchases</p>
            </div>
          </div>

          <button 
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#00B56A] text-white rounded-xl transition-all text-xs font-bold shadow-sm"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-md max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Package size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              You haven't purchased anything yet. Browse your local shops nearby now!
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-6 px-6 py-2.5 bg-[#00B56A] text-white font-bold rounded-xl text-xs shadow-md shadow-[#00B56A]/20 hover:bg-[#009e5b] transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block mb-0.5">ORDER ID</span>
                      <span className="font-mono font-bold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                        #{order._id.slice(-8)}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                    <div>
                      <span className="text-slate-400 font-medium block mb-0.5">DATE PLACED</span>
                      <p className="font-semibold text-slate-600 flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Order Status Badge */}
                  <div>{renderStatusBadge(order.status)}</div>
                </div>

                {/* Product Items List */}
                <div className="p-6 divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.product?.image || "https://images.unsplash.com/photo-1542838132-92c53300491e"} 
                          alt={item.product?.name || "Product"} 
                          className="w-14 h-14 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0 shadow-inner"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.product?.name || "Item Removed"}</h4>
                          <p className="text-xs font-medium text-slate-400 mt-1">
                            Rs. {item.price} <span className="text-slate-300 mx-1">×</span> {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-800 shrink-0">
                        Rs. {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Cost & Action Row */}
                <div className="px-6 py-4 bg-slate-50/40 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 w-full sm:w-auto">
                    <span>Subtotal: <strong className="text-slate-700 font-semibold">Rs. {order.subTotal}</strong></span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span>Delivery: <strong className="text-slate-700 font-semibold">Rs. {order.deliveryCharge}</strong></span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="text-slate-800 font-semibold flex items-center gap-1.5 w-full sm:w-auto mt-1 sm:mt-0">
                      Total Amount: 
                      <strong className="text-[#00B56A] font-extrabold text-base">Rs. {order.totalAmount}</strong>
                    </span>
                  </div>

                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="w-full sm:w-auto px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors shadow-sm text-center"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;