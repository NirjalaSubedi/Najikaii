import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, MapPin, Store, Clock3, ShieldCheck, Minus, Plus, Zap, ShoppingCart, BadgePercent } from 'lucide-react';
import { useCart } from '../hooks/CartContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import axios from 'axios'; 

const formatDistance = (distance) => {
  if (distance === undefined || distance === null || Number.isNaN(Number(distance))) {
    return '1.4 km away';
  }
  return `${Number(distance).toFixed(1)} km away`;
};

const ProductDetailModal = ({ product, loading, error, onClose }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Similar Products Fetch Logic
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      const currentProductId = product?._id || product?.id;
      const category = product?.category;

      if (!currentProductId || !category) return;

      try {
        setSimilarLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/auth/similarproduct?category=${category}&currentProductId=${currentProductId}`
        );
        
        if (response.data.success) {
          setSimilarProducts(response.data.products);
        }
      } catch (err) {
        console.error("Error fetching similar items stack:", err);
      } finally {
        setSimilarLoading(false);
      }
    };

    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  useEffect(() => {
    if (!product && !loading && !error) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [product, loading, error, onClose]);

  if (!product && !loading && !error) return null;

  const currentProductKey = product?._id || product?.id;
  
  const cartItem = cartItems?.find((item) => {
    const nestedProduct = item.product || item;
    const itemKey = nestedProduct._id || nestedProduct.id || nestedProduct.productId;
    return String(itemKey) === String(currentProductKey);
  });
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const name = product?.name || 'Unnamed Product';
  const description = product?.description || 'No description available from backend yet.';
  const sellingPrice = Number(product?.sellingPrice || 0);
  const actualPrice = Number(product?.actualPrice || 0);
  const discountPercentage = product?.discountPercentage || (actualPrice > sellingPrice && actualPrice > 0
    ? Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)
    : 0);
  const stock = Number(product?.stock ?? 0);
  const isOutOfStock = stock <= 0;
  const unitType = product?.unitType || 'item';
  const vendor = product?.vendor || {};
  const shopName = vendor?.shopName || vendor?.name || 'Najikai Shop Owner';
  const distance = formatDistance(product?.distance);
  const deliveryCharge = product?.deliveryCharge ?? Math.max(0, Math.round((Number(product?.distance) || 1.5) * 20));
  const deliveryTime = product?.deliveryTime || '15-25 min';
  const rating = Number(product?.rating || 4.6).toFixed(1);
  const reviews = product?.reviewsCount ?? 78;

  const totalPrice = sellingPrice * Math.max(currentQuantity, 1);

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-[#fafafa] overflow-y-auto min-h-screen w-screen text-left antialiased selection:bg-emerald-100 pb-16">
      
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              {product?.category}
            </span>
            <h1 className="text-sm text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-xs">{name}</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-zinc-600 text-white flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center text-sm font-bold text-gray-400 animate-pulse">
          Loading product view...
        </div>
      ) : error ? (
        <div className="h-[calc(100vh-72px)] w-full flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-xs">
            <div className="text-lg font-bold text-slate-900 mb-2">Product load huna sakena</div>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#00B56A] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square w-full overflow-hidden bg-slate-100 rounded-[32px] shadow-xs border border-gray-100 group">
                <img
                  src={product?.image || 'https://via.placeholder.com/800x600'}
                  alt={name}
                  className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                />
                
                <div className="absolute left-5 bottom-5 flex flex-col gap-2">
                  {product?.isFastDelivery !== false && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-xs px-3.5 py-2 text-xs text-emerald-600 shadow-sm border border-emerald-100/20">
                      <Zap size={14} className="fill-emerald-600 text-emerald-600" /> Fast Delivery
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm">
                      -{discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                      <Store size={18} className="text-emerald-500" />
                      <span>{shopName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {rating} ({reviews})</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600"><MapPin size={13} /> {distance}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600 tracking-tight">Rs. {sellingPrice}</div>
                    {actualPrice > sellingPrice && (
                      <div className="text-sm text-slate-400 line-through">Rs. {actualPrice}</div>
                    )}
                    <div className="text-[10px] uppercase text-slate-400 mt-0.5">
                      per {product?.stock ? `${product.stock}${unitType}` : `400${unitType}`}
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                  {name}
                </h2>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
                  {description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700"><BadgePercent size={18} /></div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">Unit Size</div>
                      <div className="text-slate-800 text-sm">{product?.stock || 400} {unitType}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700"><ShoppingCart size={18} /></div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">Delivery Charge</div>
                      <div className="text-slate-800 text-sm">Rs. {deliveryCharge}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700"><Clock3 size={18} /></div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">Delivery Time</div>
                      <div className="text-slate-800 text-sm">{deliveryTime}</div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-700"><ShieldCheck size={18} /></div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider">Availability</div>
                      <div className={`text-sm ${isOutOfStock ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-slate-800 block font-bold">Select Quantity</span>
                    <span className="text-[11px] text-slate-400">Manage order amount bundle</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => removeFromCart(currentProductKey)}
                        className="h-8 w-8 rounded-lg bg-white border border-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-sm font-bold text-slate-900">{Math.max(currentQuantity, 1)}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="h-8 w-8 rounded-lg bg-white border border-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="text-emerald-600 font-bold text-base min-w-[85px] text-right">
                      Rs. {totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-800 shadow-xs transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:bg-gray-50 cursor-pointer"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      navigate('/checkout', { state: { items: [{ ...product, quantity: Math.max(currentQuantity, 1) }] } });
                    }}
                    disabled={isOutOfStock}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00B56A] px-5 py-4 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#009E5B] hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 cursor-pointer"
                  >
                    <Zap size={16} className="fill-white" />
                    Order Now
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-200/60">
            <h3 className="text-base font-bold text-slate-800 mb-4">Similar Products</h3>
            
            {similarLoading ? (
              <div className="text-xs text-gray-400 animate-pulse">Loading similar categories...</div>
            ) : similarProducts.length === 0 ? (
              <div className="text-xs text-gray-400">No other similar products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {similarProducts.map((item) => (
                  <ProductCard 
                    key={item._id || item.id} 
                    product={item} 
                    onClick={() => console.log("Card Preview Clicked")} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default ProductDetailModal;