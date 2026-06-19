import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Clock, Truck, CheckCircle2, XCircle, Package } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/vieworders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok || data.success) {
        setOrders(data.orders || []);
      } else {
        console.error(data.message || "Orders are unable to load");
      }
    } catch (error) {
      console.error("error in fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`http://localhost:5000/api/auth/update-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok || data.success) {
        setOrders(prevOrders =>
          prevOrders.map(ord => ord._id === orderId ? { ...ord, status: newStatus } : ord)
        );
      } else {
        alert(data.message || "Unable to  update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'All') return true;
    return order.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 text-sm animate-pulse">
        Orders are loading wait......
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 text-left">Orders</h2>
        
        <div className="flex flex-wrap gap-2 bg-gray-100/80 p-1 rounded-xl w-fit">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl bg-white">
          <ShoppingBag className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            no orders to fetch 
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const isExpanded = expandedOrder === order._id;
            const currentTotal = order.vendorSpecificTotal ?? order.totalAmount ?? 0;
            const orderIndexString = `ORD-${String(index + 1).padStart(3, '0')}`;

            return (
              <div 
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all shadow-xs overflow-hidden"
              >
                <div 
                  onClick={() => toggleExpand(order._id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex flex-wrap items-center gap-3 text-left">
                    <span className="font-bold text-gray-900 text-base">{orderIndexString}</span>
                    
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>

                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wider">
                      {order.paymentMethod || 'COD'}
                    </span>
                    
                    <div className="w-full md:w-auto text-xs text-gray-400 mt-1 md:mt-0 flex flex-wrap gap-x-2 divide-x divide-gray-200">
                      <span className="text-gray-500 font-medium">{order.customer?.name || 'Customer'}</span>
                      <span className="pl-2">{order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'मिति उपलब्ध छैन'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-3 md:pt-0">
                    <div className="text-right leading-tight">
                      <div className="text-base font-bold text-gray-900">Rs. {currentTotal}</div>
                      {order.vendorSpecificTotal !== undefined && (
                        <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                          You earn: Rs. {(currentTotal * 0.9).toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-gray-50/50 border-t border-gray-50 p-5 text-left transition-all">
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                        {order.items?.map((item) => (
                          <div key={item._id} className="p-3 flex items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.product?.image ? `http://localhost:5000/${item.product.image}` : "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f3f4f6'/></svg>"} 
                                  alt={item.product?.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-family='sans-serif' font-size='14' fill='%239ca3af' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>"; }}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 capitalize">{item.product?.name || 'Unknown Product'}</p>
                                <p className="text-xs text-gray-400">Rate: Rs. {item.price}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 font-medium bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                                Qty: <strong className="text-gray-900">{item.quantity}</strong>
                              </span>
                              <p className="font-bold text-gray-900 mt-1.5">Rs. {item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2.5 text-xs text-gray-500">
                        <Package size={16} className="text-gray-400" />
                        <span>To update orders change the status</span>
                      </div>

                      <div className="relative w-full sm:w-auto">
                        <select
                          disabled={updatingId === order._id || order.status === 'Cancelled'}
                          value={order.status || 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="w-full sm:w-44 bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                        >
                          <option value="Pending">🕒 Pending</option>
                          <option value="Processing">⚙️ Processing</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                          <option value="Cancelled" disabled>❌ Cancelled</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;