import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api/auth/GetCar';

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token'); 
      
      if (!token) {
        setError('you are loged out login first');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.get(`${API_BASE_URL}/cart/get`, config);
      
      if (response.data.success) {
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
        `${API_BASE_URL}/cart/add`,
        { productid: productId, quantity: quantityChange },
        config
      );

      if (response.data.success) {
        fetchCart();
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

      const response = await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`, config);
      
      if (response.data.success) {
        setCartItems(prev => prev.filter(item => item.product?._id !== productId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Item hatauna sakiyena!');
    }
  };

  // Calculations
  const deliveryCharge = cartItems.length > 0 ? 20 : 0;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const platformCommission = Math.round(subtotal * 0.10);
  const totalAmount = subtotal + deliveryCharge + platformCommission;

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#10B981]" size={40} />
          <p className="text-slate-500 font-medium">Cart load hudai chha...</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border max-w-sm">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <div className="flex flex-col gap-2">
            <button onClick={fetchCart} className="bg-[#10B981] hover:bg-[#0fA774] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              Feri Try Garne
            </button>
            <button onClick={() => navigate('/login')} className="text-sm text-slate-500 hover:underline">
              Back To Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 text-slate-800">
      {/* Header Bar */}
      <header className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#10B981] text-white p-1.5 rounded-lg font-bold flex items-center justify-center text-sm">
              N
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Najikai
            </span>
          </div>
          <h1 className="text-base font-semibold text-slate-800 ml-4 border-l border-slate-200 pl-4">
            My Cart ({cartItems.length})
          </h1>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Cart Items List */}
        <section className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl text-center border border-slate-100 shadow-sm flex flex-col items-center gap-3">
              <ShoppingBag size={48} className="text-slate-300" />
              <p className="text-slate-400 font-medium">Your Najikai cart is empty!</p>
              <Link to="/" className="text-sm text-[#10B981] font-bold hover:underline">Saman Haru Herne</Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product || {};
              return (
                <div 
                  key={item._id} 
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 transition-all hover:shadow-md"
                >
                  {/* Product Info Group */}
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={product.image || 'https://via.placeholder.com/80?text=Product'} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base leading-tight mb-0.5">
                        {product.name || 'Unknown Product'}
                      </h3>
                      <p className="text-xs text-slate-400 mb-1">
                        Stock: {product.stock || 0} pieces available
                      </p>
                      <div className="flex items-baseline gap-1.5 text-xs">
                        <span className="text-[#10B981] font-bold text-sm">Rs. {product.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price Group */}
                  <div className="flex items-center gap-6">
                    {/* Quantity Controller */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                      <button 
                        onClick={() => handleQuantityChange(product._id, item.quantity, 'dec')}
                        disabled={item.quantity <= 1}
                        className={`p-1.5 rounded-md transition-colors ${item.quantity <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-white'}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(product._id, item.quantity, 'inc')}
                        className="p-1.5 hover:bg-white rounded-md text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Calculated Subtotal per Item */}
                    <div className="flex items-center gap-3 min-w-[90px] justify-end">
                      <span className="font-bold text-slate-800 text-sm">
                        Rs. {(product.price || 0) * item.quantity}
                      </span>
                      <button 
                        onClick={() => handleRemoveItem(product._id)}
                        className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Right Side: Order Summary */}
        <section className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">
              Order Summary
            </h2>
            
            <div className="space-y-3 text-sm border-b border-dashed border-slate-100 pb-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-semibold text-slate-800">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-800">Rs. {deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Platform Commission (10%)</span>
                <span>Rs. {platformCommission}</span>
              </div>
            </div>

            <div className="flex justify-between items-center my-5">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-xl font-black text-[#10B981]">Rs. {totalAmount}</span>
            </div>

            <div className="space-y-2.5">
              <button 
                disabled={cartItems.length === 0}
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#10B981] hover:bg-[#0fA774] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm text-sm"
              >
                Proceed to Checkout
              </button>
              <button onClick={() => navigate('/')} className="w-full bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Delivery Note Badge */}
          <div className="bg-[#EFFAF5] border border-[#D1F2E5] rounded-2xl p-4 flex gap-3">
            <div className="text-[#10B981] mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.52.142A.5.5 0 0 1 6 .5v6.257l5.42-3.142a.5.5 0 0 1 .75.434v6.291l4.312-2.5a.5.5 0 0 1 .75.434v4.536a.5.5 0 0 1-.25.433l-11 6.364a.5.5 0 0 1-.5 0l-11-6.364A.5.5 0 0 1 0 12.35V7.814a.5.5 0 0 1 .75-.434l4.312 2.5V3.65L.142 1.242A.5.5 0 0 1 .5.5h5a.5.5 0 0 1 .02.142zM4.5 7.707V1.793L1.22 3.25 4.5 7.707zM5.5 7.707l3.28-4.457L5.5 1.793v5.914zm6-4.225V9.39l2.78-1.61L11.5 3.482zm-6 6.126l4.28 2.482-4.28 2.482V9.608zm-1 4.964V9.608l-4.28 2.482 4.28 2.482zm6.5-3.354l2.78 1.61-2.78 1.61V11.218z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#10B981] uppercase tracking-wide mb-0.5 flex items-center gap-1">
                ⚡ Fast Delivery Available
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
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