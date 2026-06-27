import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductDetailModal from './ProductDetailModal';

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      const response = await axios.get(`${API_BASE_URL}/GetCart`, config);
      if (response.data && response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Cart fetch garna sakiyena!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleQuantityChange = async (productId, currentQty, type) => {
    if (type === 'dec' && currentQty <= 1) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      const quantityChange = type === 'inc' ? 1 : -1;
      const response = await axios.post(`${API_BASE_URL}/AddToCart`, { productid: productId, quantity: quantityChange }, config);
      if (response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (err) { alert(err.response?.data?.message || 'Quantity update error!'); }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.delete(`${API_BASE_URL}/remove-item/${productId}`, config);
      if (response.data.success) { setCartItems(response.data.cart || []); }
    } catch (err) { alert(err.response?.data?.message || 'Item hatauna sakiyena!'); }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 text-slate-800">
      <header className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <span className="text-base font-black text-slate-900 tracking-tight">Najikai</span>
          <h1 className="text-xs font-bold text-slate-400 ml-4 border-l border-slate-200 pl-4 uppercase tracking-wider">
            My Cart ({cartItems.length})
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <section className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm flex flex-col items-center gap-3">
              <ShoppingBag size={40} className="text-slate-300" />
              <p className="text-slate-400 text-xs font-bold">Your Najikai cart is empty!</p>
              <Link to="/" className="text-xs text-[#00B56A] font-black hover:underline">Saman Haru Herne</Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product || {};
              const resolvedPrice = item.price !== undefined && item.price !== null ? Number(item.price) : (Number(product.price) || Number(product.sellingPrice) || 0);
              
              return (
                <div key={item._id || product._id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 transition-all hover:shadow-md">
                  
                  <div 
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalOpen(true);
                    }}
                    className="flex items-center gap-4 flex-1 cursor-pointer group"
                  >
                    <img src={product.image || 'https://via.placeholder.com/80?text=Product'} alt={product.title || product.name} className="w-20 h-20 object-cover rounded-2xl bg-slate-50 border border-slate-100 group-hover:opacity-90 transition-opacity" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-0.5 line-clamp-1 group-hover:text-[#00B56A] transition-colors">{product.title || product.name || 'Unknown Product'}</h3>
                      <p className="text-[11px] font-bold text-slate-400 mb-1">Stock: {product.stock ?? 0} pieces available</p>
                      <span className="text-[#00B56A] font-black text-sm">Rs. {resolvedPrice}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 h-8">
                      <button onClick={() => handleQuantityChange(product._id || product.id, item.quantity, 'dec')} disabled={item.quantity <= 1} className={`p-1 rounded-md ${item.quantity <= 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-white'}`}><Minus size={12} /></button>
                      <span className="w-8 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(product._id || product.id, item.quantity, 'inc')} className="p-1 hover:bg-white rounded-md text-slate-500"><Plus size={12} /></button>
                    </div>
                    <div className="flex items-center gap-3 min-w-[100px] justify-end">
                      <span className="font-black text-slate-800 text-sm">Rs. {resolvedPrice * (item.quantity || 0)}</span>
                      <button onClick={() => handleRemoveItem(product._id || product.id)} className="text-slate-300 hover:text-red-500 p-1.5"><Trash2 size={14} /></button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </section>
      </main>

      {modalOpen && selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          loading={false} 
          error={""} 
          onClose={() => {
            setModalOpen(false);
            setSelectedProduct(null);
            fetchCart(); 
          }} 
        />
      )}
    </div>
  );
};

export default ViewCart;