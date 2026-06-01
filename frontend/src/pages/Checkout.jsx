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
  const placeOrderLabel = isEsewaSelected
    ? 'Place Order & Pay with eSewa →'
    : 'Place Order (Cash on Delivery)';

  const handlePlaceOrder = async () => {
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
      };

      const response = await axios.post('http://localhost:5000/api/order/placeorder', payload, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });

      if (response.data?.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Order place garna sakiyena.');
    } finally {
      setPlacingOrder(false);
    }
  };

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
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-2 text-lg font-black tracking-tight">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[#00B56A]"><MapPin size={16} /></div>
                Delivery Information
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-600">
                  <span>Full Name *</span>
                  <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.fullName} onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Aarav Sharma" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-600">
                  <span>Phone Number *</span>
                  <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.phoneNumber} onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="98XXXXXXXX" />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-600 sm:col-span-2">
                  <span>Delivery Address *</span>
                  <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#00B56A]" value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} placeholder="Street, Tole, Landmark..." />
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
                  <div
                    key={method.value}
                    className={`rounded-2xl border p-4 text-left transition-none cursor-default select-none ${formData.paymentMethod === method.value ? 'border-[#00B56A] bg-[#00B56A] text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                  >
                    <div className={formData.paymentMethod === method.value ? 'font-bold text-white' : 'font-bold text-slate-900'}>{method.title}</div>
                    <div className={formData.paymentMethod === method.value ? 'text-sm text-white/80' : 'text-sm text-slate-500'}>{method.subtitle}</div>
                  </div>
                ))}
              </div>

              {isEsewaSelected ? (
                <div className="mt-4 rounded-3xl border border-[#00B56A]/20 bg-[#00B56A]/8 p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00B56A]">
                    <CircleCheckBig size={18} />
                    Pay with eSewa
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="text-slate-500">eSewa ID</div>
                    <div className="text-lg font-medium text-slate-800">9800000000</div>
                    <div className="text-slate-500">Merchant</div>
                    <div className="text-lg font-medium text-slate-800">Najikai Payments</div>
                    <div className="text-slate-500">Amount to Pay</div>
                    <div className="text-2xl font-medium text-[#00B56A]">Rs. {total}</div>
                  </div>
                  <p className="mt-3 text-sm text-emerald-800/80">
                    After clicking Place Order, you will be redirected to eSewa to complete the payment securely.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-[#00B56A]/20 bg-[#00B56A]/8 p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#00B56A]">
                    <CircleCheckBig size={18} />
                    Cash on Delivery
                  </div>
                  <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-600 leading-6">
                    Please keep exact change of <span className="font-bold text-slate-900">Rs. {total}</span> ready at the time of delivery. Our delivery partner will collect the payment.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder || loading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00B56A] px-6 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/20 transition-none disabled:cursor-not-allowed disabled:bg-[#00B56A] disabled:text-white disabled:opacity-70"
              >
                <Truck size={18} />
                {placeOrderLabel}
              </button>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 text-xl font-black">Order Summary</div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-slate-700">{item.name}</div>
                        <div className="text-xs text-slate-400">× {item.quantity || 1}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-slate-700">Rs. {(Number(item.sellingPrice ?? item.actualPrice ?? 0) * (item.quantity || 1))}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-700">Rs. {subtotal}</span></div>
                <div className="flex items-center justify-between text-slate-500"><span>Delivery ({deliveryInfo ? `${deliveryInfo.distance.toFixed(1)} km` : '0.8 km'})</span><span className="font-bold text-slate-700">Rs. {deliveryInfo?.deliveryCharge ?? 0}</span></div>
                <div className="flex items-center justify-between text-slate-500"><span>Platform Fee (10%)</span><span className="font-bold text-slate-700">Rs. {deliveryInfo ? Math.round(deliveryInfo.adminCommission) : Math.round(subtotal * 0.1)}</span></div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-lg font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-[#00B56A]">Rs. {total}</span>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 text-lg font-black text-slate-900">Delivery Charge Breakdown</div>
              <div className="space-y-3 text-sm text-slate-500">
                <div className="flex items-center justify-between"><span>0–1 km</span><span className="font-semibold text-slate-700">Rs. 0</span></div>
                <div className="flex items-center justify-between"><span>1–2 km</span><span className="font-semibold text-slate-700">Rs. 10</span></div>
                <div className="flex items-center justify-between"><span>2–3 km</span><span className="font-semibold text-slate-700">Rs. 20</span></div>
                <div className="flex items-center justify-between"><span>3–4 km</span><span className="font-semibold text-slate-700">Rs. 30</span></div>
                <div className="flex items-center justify-between"><span>4–5 km</span><span className="font-semibold text-slate-700">Rs. 40</span></div>
                <div className="flex items-center justify-between"><span>5+ km</span><span className="font-semibold text-slate-700">Rs. 50</span></div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;