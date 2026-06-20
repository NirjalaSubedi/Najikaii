import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Clock, Truck, CheckCircle2, XCircle, Package, Settings } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/order/vieworders', {
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
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-dropdown="true"]')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setOpenDropdownId(null);
    
    console.log(`Sending update request for Order: ${orderId} to status: ${newStatus}`);

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
      console.log("Backend Response:", data);

      if (response.ok || data.success) {
        setOrders(prevOrders =>
          prevOrders.map(ord => ord._id === orderId ? { ...ord, status: newStatus } : ord)
        );
        alert(`Status successfully updated to ${newStatus}!`);
      } else {
        alert(`Backend Error: ${data.message || "Failed to update status on server"}`);
      }
    } catch (error) {
      console.error("Status update catch error:", error);
      alert(`Network Error: cannot provide connection with backend`);
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock size={14} className="text-amber-600" />;
      case 'processing':
        return <Settings size={14} className="text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />;
      case 'shipped':
        return <Truck size={14} className="text-purple-600" />;
      case 'delivered':
        return <CheckCircle2 size={14} className="text-emerald-600" />;
      case 'cancelled':
        return <XCircle size={14} className="text-rose-600" />;
      default:
        return <Clock size={14} className="text-gray-600" />;
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
            const isDropdownOpen = openDropdownId === order._id;
            const isSelectDisabled = updatingId === order._id || order.status === 'Cancelled';

            return (
              <div 
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all shadow-xs relative"
              >
                <div 
                  onClick={() => toggleExpand(order._id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none group rounded-t-2xl"
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
                  <div className="bg-gray-50/50 border-t border-gray-50 p-5 text-left transition-all rounded-b-2xl">
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

                      <div className="relative w-full sm:w-48" data-dropdown="true">
                        <button
                          type="button"
                          disabled={isSelectDisabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(isDropdownOpen ? null : order._id);
                          }}
                          className="w-full bg-gray-50/70 hover:bg-gray-50 border border-gray-200 hover:border-emerald-400/60 text-gray-800 pl-9 pr-10 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <div className="absolute left-3.5 pointer-events-none z-10 flex items-center">
                            {getStatusIcon(order.status)}
                          </div>
                          <span className="truncate ml-1">{order.status || 'Pending'}</span>
                          <div className="absolute right-3.5 pointer-events-none text-gray-400">
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute left-0 z-[100] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl py-1 overflow-hidden top-full">
                            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((statusOption) => (
                              <button
                                key={statusOption}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order._id, statusOption);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                                  (order.status || 'Pending').toLowerCase() === statusOption.toLowerCase()
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {getStatusIcon(statusOption)}
                                <span>{statusOption}</span>
                              </button>
                            ))}
                          </div>
                        )}
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