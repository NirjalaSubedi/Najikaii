import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, BadgeInfo, CreditCard, Truck, CircleCheckBig } from 'lucide-react';
import { useCart } from '../hooks/CartContext';

const loadSavedCoords = () => {
  try {
    const saved = localStorage.getItem('userCoords');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();

  const initialItems = useMemo(() => {
    const stateItems = location.state?.items;
    if (Array.isArray(stateItems) && stateItems.length > 0) return stateItems;
    return cartItems;
  }, [cartItems, location.state]);

  const [items, setItems] = useState(initialItems);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: 'Kathmandu',
    note: '',
    paymentMethod: 'esewa',
  });

  const coords = useMemo(() => loadSavedCoords(), []);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const fetchEstimate = async () => {
      if (!items || items.length === 0) {
        setLoading(false);
        setError('No products selected for checkout.');
        return;
      }

      if (!coords?.lat || !coords?.lng) {
        setLoading(false);
        setError('Location not available. Location enable garepachi checkout huncha.');
        return;
      }

      try {
        setLoading(true);
        setError('');
        const firstItem = items[0];
        const response = await axios.post('http://localhost:5000/api/order/estimate-order', {
          productId: firstItem._id || firstItem.id,
          quantity: firstItem.quantity || 1,
          customerCoords: coords,
        }, {
          withCredentials: true,
          headers: getAuthHeaders(),
        });

        if (response.data?.success) {
          setDeliveryInfo(response.data.pricing);
          setFormData((prev) => ({
            ...prev,
            fullName: JSON.parse(localStorage.getItem('user') || '{}')?.name || prev.fullName,
          }));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Delivery estimate fetch garna sakiyena.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [items, coords]);

  const subtotal = deliveryInfo?.subTotal || items.reduce((acc, item) => {
    const price = Number(item.sellingPrice ?? item.actualPrice ?? 0);
    return acc + (price * (item.quantity || 1));
  }, 0);

  const total = deliveryInfo?.totalAmount || subtotal + (deliveryInfo?.deliveryCharge || 0);
  const selectedPaymentMethod = formData.paymentMethod;
  const isEsewaSelected = selectedPaymentMethod === 'esewa';
  const placeOrderLabel = placingOrder 
    ? 'Processing...' 
    : isEsewaSelected
      ? 'Place Order & Pay with eSewa →'
      : 'Place Order (Cash on Delivery)';

  // ==================== UPDATE: MODIFIED PAYMENT PIPELINE ====================
  const handlePlaceOrder = async () => {
    // Form fields valuation check basic requirements
    if (!formData.fullName || !formData.phoneNumber || !formData.address) {
      setError('Required fields (Name, Phone, Address) empty huna bhayena.');
      return;
    }

    try {
      setPlacingOrder(true);
      setError('');

      const payload = {
        items: items.map((item) => ({
          product: item._id || item.id,
          quantity: item.quantity || 1,
        })),
        paymentMethod: formData.paymentMethod,
        customerCoords: coords,
        shippingDetails: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          note: formData.note
        }
      };

      // 1. First, create main order tracking in database
      const orderResponse = await axios.post('http://localhost:5000/api/order/placeorder', payload, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });

      if (!orderResponse.data?.success) {
        throw new Error(orderResponse.data?.message || "Order instance failure.");
      }

      const generatedOrderId = orderResponse.data.order._id || orderResponse.data.order.id;

      // 2. Conditional Branching for Payment Modes
      if (formData.paymentMethod === 'COD') {
        // Cash on delivery scenario direct success navigation route
        navigate('/'); 
      } else if (formData.paymentMethod === 'esewa') {
        // eSewa selection: Call initiation microservice to fetch secure hash
        const esewaInitResponse = await axios.post('http://localhost:5000/api/payment/initiate-esewa', {
          amount: total,
          orderId: generatedOrderId
        }, {
          withCredentials: true,
          headers: getAuthHeaders(),
        });

        if (esewaInitResponse.data.success) {
          const { payment_data } = esewaInitResponse.data;

          // 3. Automated Virtual Hidden Form Append Injection
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'; // Sandbox endpoint

          Object.keys(payment_data).forEach((key) => {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = payment_data[key];
            form.appendChild(hiddenField);
          });

          document.body.appendChild(form);
          form.submit();
        } else {
          setError('eSewa transaction hash injection failed backend sequence ma.');
        }
      }
    } catch (err) {
      console.error("Order workflow execution crashed:", err);
      setError(err.response?.data?.message || err.message || 'Order execution error workflow.');
    } finally {
      setPlacingOrder(false);
    }
  };
  // ===========================================================================

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900 font-sans">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/70 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="leading-tight">
            <div className="text-lg font-black tracking-tight">Najikai</div>
            <div className="text-sm font-semibold text-slate-500">Checkout</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-400">
          <span>Cart</span>
          <span>›</span>
          <span className="text-[#00B56A]">Checkout</span>
          <span>›</span>
          <span>Confirm</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-2 text-lg font-black tracking-tight">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[#00B56A]"><MapPin size={16} /></div>
                  Delivery Information
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-semibold text-slate-600">
                    <span>Full Name *</span>
                    <input required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.fullName} onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Aarav Sharma" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-600">
                    <span>Phone Number *</span>
                    <input required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.phoneNumber} onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="98XXXXXXXX" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-600 sm:col-span-2">
                    <span>Delivery Address *</span>
                    <input required className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} placeholder="Street, Tole, Landmark..." />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-600">
                    <span>City</span>
                    <select className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.city} onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}>
                      <option>Kathmandu</option>
                      <option>Biratnagar</option>
                      <option>Pokhara</option>
                      <option>Dharan</option>
                    </select>
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-slate-600">
                    <span>Order Note (Optional)</span>
                    <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.note} onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))} placeholder="Any special instructions..." />
                  </label>
                </div>
              </section>
            </form>

            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2 text-lg font-black tracking-tight">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[#00B56A]"><CreditCard size={16} /></div>
                Payment Method
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: 'COD', title: 'Cash on Delivery', subtitle: 'Pay when you receive' },
                  { value: 'esewa', title: 'eSewa', subtitle: 'Digital wallet payment' },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method.value }))}
                    className={`rounded-2xl border p-4 text-left transition-all duration-150 active:scale-98 ${formData.paymentMethod === method.value ? 'border-[#00B56A] bg-[#00B56A] text-white font-bold' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'}`}
                  >
                    <div className="font-bold">{method.title}</div>
                    <div className={formData.paymentMethod === method.value ? 'text-sm text-white/80 font-normal' : 'text-sm text-slate-500 font-normal'}>{method.subtitle}</div>
                  </button>
                ))}
              </div>

              {isEsewaSelected ? (
                <div className="mt-4 rounded-3xl border border-[#00B56A]/20 bg-[#00B56A]/5 p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00B56A]">
                    <CircleCheckBig size={18} />
                    Pay with eSewa
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 text-sm sm:grid-cols-[1fr_auto] sm:items-center shadow-sm">
                    <div className="text-slate-500 font-medium">Merchant</div>
                    <div className="text-sm font-bold text-slate-800 text-right">Najikai Payments</div>
                    <div className="text-slate-500 font-medium">Amount to Pay</div>
                    <div className="text-xl font-black text-[#00B56A] text-right">Rs. {total}</div>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-emerald-800/80 leading-relaxed">
                    After clicking Place Order, you will be redirected to eSewa to complete the payment securely.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-[#00B56A]/20 bg-[#00B56A]/5 p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00B56A]">
                    <CircleCheckBig size={18} />
                    Cash on Delivery
                  </div>
                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-600 leading-relaxed shadow-sm">
                    Please keep exact change of <span className="font-black text-slate-900">Rs. {total}</span> ready at the time of delivery. Our delivery partner will collect the payment.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder || loading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00B56A] hover:bg-[#009E5B] px-6 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:opacity-70"
              >
                <Truck size={18} />
                {placeOrderLabel}
              </button>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 text-xl font-black tracking-tight">Order Summary</div>

              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-slate-100" />
                      <div>
                        <div className="text-sm font-bold text-slate-700 max-w-[150px] truncate">{item.name}</div>
                        <div className="text-xs font-semibold text-slate-400">× {item.quantity || 1}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black text-slate-700">Rs. {(Number(item.sellingPrice ?? item.actualPrice ?? 0) * (item.quantity || 1))}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-500 font-medium"><span>Subtotal</span><span className="font-bold text-slate-700">Rs. {subtotal}</span></div>
                <div className="flex items-center justify-between text-slate-500 font-medium"><span>Delivery ({deliveryInfo ? `${deliveryInfo.distance.toFixed(1)} km` : '0.8 km'})</span><span className="font-bold text-slate-700">Rs. {deliveryInfo?.deliveryCharge ?? 0}</span></div>
                <div className="flex items-center justify-between text-slate-500 font-medium"><span>Platform Fee (10%)</span><span className="font-bold text-slate-700">Rs. {deliveryInfo ? Math.round(deliveryInfo.adminCommission) : Math.round(subtotal * 0.1)}</span></div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900 tracking-tight">Total</span>
                <span className="text-2xl font-black text-[#00B56A]">Rs. {total}</span>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 text-base font-black text-slate-900 tracking-tight">Delivery Charge Breakdown</div>
              <div className="space-y-3 text-xs font-semibold text-slate-400">
                <div className="flex items-center justify-between"><span>0–1 km</span><span className="font-bold text-slate-700">Rs. 0</span></div>
                <div className="flex items-center justify-between"><span>1–2 km</span><span className="font-bold text-slate-700">Rs. 10</span></div>
                <div className="flex items-center justify-between"><span>2–3 km</span><span className="font-bold text-slate-700">Rs. 20</span></div>
                <div className="flex items-center justify-between"><span>3–4 km</span><span className="font-bold text-slate-700">Rs. 30</span></div>
                <div className="flex items-center justify-between"><span>4–5 km</span><span className="font-bold text-slate-700">Rs. 40</span></div>
                <div className="flex items-center justify-between"><span>5+ km</span><span className="font-bold text-slate-700">Rs. 50</span></div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;