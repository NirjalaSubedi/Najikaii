import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api/auth';

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token'); 
      
      if (!token) {
        setError('You are logged out. Please login first.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.get(`${API_BASE_URL}/GetCart`, config);
      
      if (response.data && response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (err) {
      console.error("Cart fetch error details:", err.response || err);
      setError(err.response?.data?.message || 'Cart fetch garna sakiyena!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, currentQty, type) => {
    if (type === 'dec' && currentQty <= 1) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const quantityChange = type === 'inc' ? 1 : -1;

      const response = await axios.post(
        `${API_BASE_URL}/AddToCart`,
        { 
          productid: productId, 
          quantity: quantityChange 
        },
        config
      );

      if (response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Quantity update error!');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(`${API_BASE_URL}/remove-item/${productId}`, config);
      
      if (response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Item hatauna sakiyena!');
    }
  };

  const deliveryCharge = cartItems.length > 0 ? 20 : 0;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price !== undefined && item.price !== null ? Number(item.price) : (Number(item.product?.price) || 0);
    return acc + (price * (Number(item.quantity) || 0));
  }, 0);

  const platformCommission = Math.round(subtotal * 0.10);
  const totalAmount = subtotal + deliveryCharge + platformCommission;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#00B56A]" size={40} />
          <p className="text-slate-500 font-medium text-xs">Cart load hudai chha...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border max-w-sm">
          <p className="text-red-500 font-bold text-xs mb-4">{error}</p>
          <div className="flex flex-col gap-2">
            <button onClick={fetchCart} className="bg-[#00B56A] hover:bg-[#009b5a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
              Feri Try Garne
            </button>
            <button onClick={() => navigate('/login')} className="text-xs text-slate-500 hover:underline">
              Back To Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 text-slate-800">
      <header className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-100 p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-900 tracking-tight">
              Najikai
            </span>
          </div>
          <h1 className="text-xs font-bold text-slate-400 ml-4 border-l border-slate-200 pl-4 uppercase tracking-wider">
            My Cart ({cartItems.length})
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <section className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm flex flex-col items-center gap-3">
              <ShoppingBag size={40} className="text-slate-300" />
              <p className="text-slate-400 text-xs font-bold">Your Najikai cart is empty!</p>
              <Link to="/" className="text-xs text-[#00B56A] font-black hover:underline">Saman Haru Herne</Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product || {};
              
              // ✅ FIXED: सिधै ब्याकइन्डको item.price लाई प्राथमिकता दिने
              const resolvedPrice = item.price !== undefined && item.price !== null 
                ? Number(item.price) 
                : (Number(product.price) || Number(product.sellingPrice) || 0);
              
              const currentItemKey = product._id || product.id || item._id;
              
              return (
                <div 
                  key={item._id || currentItemKey} 
                  className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={product.image || 'https://via.placeholder.com/80?text=Product'} 
                      alt={product.title || product.name || 'Product'} 
                      className="w-20 h-20 object-cover rounded-2xl bg-slate-50 border border-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-0.5 line-clamp-1">
                        {product.title || product.name || 'Unknown Product'}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mb-1">
                        Stock: {product.stock ?? 0} pieces available
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[#00B56A] font-black text-sm">Rs. {resolvedPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 h-8">
                      <button 
                        onClick={() => handleQuantityChange(product._id || product.id, item.quantity, 'dec')}
                        disabled={item.quantity <= 1}
                        className={`p-1 rounded-md transition-all ${item.quantity <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-white active:scale-90'}`}
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(product._id || product.id, item.quantity, 'inc')}
                        className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-slate-700 transition-all active:scale-90"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 min-w-[100px] justify-end">
                      <span className="font-black text-slate-800 text-sm tracking-tight">
                        Rs. {resolvedPrice * (item.quantity || 0)}
                      </span>
                      <button 
                        onClick={() => handleRemoveItem(product._id || product.id)}
                        className="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <section className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">
              Order Summary
            </h2>
            
            <div className="space-y-3 text-xs font-bold border-b border-dashed border-slate-100 pb-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-extrabold text-slate-800">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Charge</span>
                <span className="font-extrabold text-slate-800">Rs. {deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="text-[11px] font-medium text-slate-400">Platform Commission (10%)</span>
                <span className="text-slate-500">Rs. {platformCommission}</span>
              </div>
            </div>

            <div className="flex justify-between items-center my-5">
              <span className="text-sm font-black text-slate-900">Total</span>
              <span className="text-lg font-black text-[#00B56A]">Rs. {totalAmount}</span>
            </div>

            <div className="space-y-2">
              <button 
                disabled={cartItems.length === 0}
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#00B56A] hover:bg-[#009b5a] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold py-3 px-4 rounded-xl transition-all shadow-sm text-xs uppercase tracking-wider"
              >
                Proceed to Checkout
              </button>
              <button onClick={() => navigate('/')} className="w-full bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 font-bold py-3 px-4 rounded-xl transition-colors text-xs">
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 flex gap-3">
            <div>
              <h4 className="text-[10px] font-black text-[#00B56A] uppercase tracking-wider mb-0.5 flex items-center gap-1">
                Fast Delivery Available
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Items from vendors within 2km qualify for fast delivery in 15 - 25 min.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewCart;