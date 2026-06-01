import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, MapPin, Store, Clock3, ShieldCheck, Minus, Plus, Zap, ShoppingCart, BadgePercent } from 'lucide-react';
import { useCart } from '../hooks/CartContext';
import { useNavigate } from 'react-router-dom';

const formatDistance = (distance) => {
  if (distance === undefined || distance === null || Number.isNaN(Number(distance))) {
    return '1.4 km away';
  }

  return `${Number(distance).toFixed(1)} km away`;
};

const ProductDetailModal = ({ product, loading, error, onClose }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

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
  const cartItem = cartItems.find((item) => String(item._id || item.id) === String(currentProductKey));
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
  const deliveryCharge = product?.deliveryCharge ?? Math.max(15, Math.round((Number(product?.distance) || 1.5) * 20));
  const deliveryTime = product?.deliveryTime || '15-25 min';
  const rating = Number(product?.rating || 4.6).toFixed(1);
  const reviews = product?.reviewsCount ?? 78;

  const totalPrice = sellingPrice * Math.max(currentQuantity, 1);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-190 max-h-dvh sm:max-h-[90vh] overflow-y-auto bg-[#f7f7f4] sm:rounded-[28px] shadow-2xl shadow-black/30 border border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="min-h-[70vh] flex items-center justify-center text-sm font-semibold text-gray-500">
            Loading product details...
          </div>
        ) : error ? (
          <div className="min-h-[70vh] flex items-center justify-center p-8 text-center">
            <div className="max-w-sm space-y-3">
              <div className="text-lg font-black text-slate-900">Product load huna sakena</div>
              <p className="text-sm text-gray-500">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-[#00B56A] px-4 py-2 text-sm font-bold text-white"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative h-65 sm:h-80 overflow-hidden bg-slate-900">
              <img
                src={product?.image || 'https://via.placeholder.com/800x600'}
                alt={name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/20" />

              <div className="absolute left-4 bottom-5 flex gap-2 flex-wrap max-w-[70%]">
                {product?.isFastDelivery !== false && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#00B56A] px-3 py-1 text-[11px] font-extrabold text-white shadow-lg">
                    <Zap size={12} /> Fast Delivery
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FF4D4F] px-3 py-1 text-[11px] font-extrabold text-white shadow-lg">
                    -{discountPercentage}% OFF
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white text-slate-900 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-white px-4 sm:px-6 pb-5 pt-5 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3 sm:pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#00B56A]">
                      {product?.category || 'Dairy'}
                    </span>
                    <span className="text-xs font-bold text-gray-400">per {product?.stock ? `${product.stock}${unitType}` : `400${unitType}`}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">{name}</h2>

                  <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1.5"><Store size={15} className="text-[#00B56A]" /> {shopName}</span>
                    <span className="inline-flex items-center gap-1.5"><Star size={15} className="fill-amber-400 text-amber-400" /> {rating} <span className="text-slate-400">({reviews} reviews)</span></span>
                    <span className="inline-flex items-center gap-1.5 text-[#00A86B]"><MapPin size={15} /> {distance}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-black text-[#00A86B] leading-none">Rs. {sellingPrice}</div>
                  {actualPrice > sellingPrice && (
                    <div className="text-xs sm:text-sm text-slate-400 font-semibold line-through">Rs. {actualPrice}</div>
                  )}
                  <div className="text-[11px] sm:text-xs font-medium text-slate-400">per {product?.stock ? `${product.stock}${unitType}` : `400${unitType}`}</div>
                </div>
              </div>

              <p className="mt-5 text-sm sm:text-[15px] leading-7 text-slate-500">{description}</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-[#00B56A] shadow-sm"><BadgePercent size={18} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Unit Size</div>
                    <div className="font-bold text-slate-900">{product?.stock || 400}{unitType}</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-[#00B56A] shadow-sm"><ShoppingCart size={18} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Delivery Charge</div>
                    <div className="font-bold text-slate-900">Rs. {deliveryCharge}</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-[#00B56A] shadow-sm"><Clock3 size={18} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Delivery Time</div>
                    <div className="font-bold text-slate-900">{deliveryTime}</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-[#00B56A] shadow-sm"><ShieldCheck size={18} /></div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Availability</div>
                    <div className="font-bold text-slate-900">{isOutOfStock ? 'Out of Stock' : 'In Stock'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-100 px-4 py-4 sm:px-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-slate-700">Quantity</div>
                    <div className="text-xs text-slate-400 mt-1">Choose amount before checkout</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 px-3 py-2 shadow-sm">
                      <button
                        type="button"
                        onClick={() => removeFromCart(currentProductKey)}
                        className="h-9 w-9 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-8 text-center text-lg font-black text-slate-900">{Math.max(currentQuantity, 1)}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="h-9 w-9 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-[#00A86B] font-black text-base">= Rs. {totalPrice}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  disabled={isOutOfStock}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#00B56A] px-5 py-4 text-base font-black text-[#00B56A] transition-all hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:bg-gray-50"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    navigate('/checkout', { state: { items: [{ ...product, quantity: Math.max(currentQuantity, 1) }] } });
                  }}
                  disabled={isOutOfStock}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00B56A] px-5 py-4 text-base font-black text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-[#009E5B] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Zap size={18} />
                  Order Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default ProductDetailModal;