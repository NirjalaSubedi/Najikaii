import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, ArrowLeft, Search, ShoppingCart, Info, Phone } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/shops/myshop/${id}`);
        
        if (res.data.success) {
          setShop(res.data.shop);
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error("Error fetching shop data:", error);
        toast.error(error.response?.data?.message || "Failed to load shop details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShopDetails();
    }
  }, [id]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-[#00B56A] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading Najikai Shop details...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-slate-800">Shop Not Found</h2>
        <p className="text-slate-500 mt-2">The vendor profile you are trying to view does not exist.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-5 py-2.5 bg-[#00B56A] text-white font-bold rounded-xl text-sm">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden">
        <img 
          src={shop?.shopImage || 'https://via.placeholder.com/150'} 
          alt={shop?.shopName || shop?.name || "Shop Image"}
          className="w-full h-full object-cover opacity-70"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-3 bg-white hover:bg-slate-100 text-slate-800 rounded-xl transition-all shadow-lg flex items-center gap-2 text-xs font-bold z-20"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="inline-block px-3 py-1 bg-green-50 text-[#00B56A] text-[11px] font-black tracking-wide uppercase rounded-md mb-2">
                Verified Local Vendor
              </span>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                {shop?.shopName || shop?.name || "Local Store"}
              </h1>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mt-2">
                <MapPin size={16} className="text-[#FF7F50]" />
                {shop?.Address?.street ? `${shop.Address.street}, ` : ''}{shop?.Address?.city || "Jhumka"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-2 rounded-xl border border-amber-100 font-black text-sm">
                <Star size={16} className="fill-amber-500 stroke-amber-500" />
                <span>4.8</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl border border-blue-100 font-bold text-xs">
                <Clock size={16} />
                <span>15-25 min delivery</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 self-start sm:self-center">
              Products Available <span className="text-sm font-bold text-slate-400 ml-1">({filteredProducts.length})</span>
            </h3>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search items in this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00B56A]/5 focus:border-[#00B56A] transition-all text-xs font-bold text-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
              <Info size={36} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-bold text-sm">No items match your search entry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col group">
                  <div className="h-40 bg-slate-50 relative overflow-hidden">
                    <img 
                      src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock <= 0 && (
                      <span className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center text-xs font-black text-red-500 tracking-wide uppercase">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-[#00B56A] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">Unit: {product.unit || 'kg'}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-sm font-black text-slate-900">Rs. {product.sellingPrice}</span>
                        {product.price > product.sellingPrice && (
                          <span className="text-[11px] font-bold text-slate-400 line-through block -mt-1">
                            Rs. {product.price}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        disabled={product.stock <= 0}
                        className={`p-2 rounded-xl transition-all ${
                          product.stock > 0 
                            ? 'bg-[#00B56A] text-white hover:bg-[#009e5b] shadow-md shadow-[#00B56A]/10' 
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewShop;