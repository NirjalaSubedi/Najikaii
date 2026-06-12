import React from 'react';
import { Heart, Star, Plus, Minus, Zap, Store, MapPin } from 'lucide-react';
import { useCart } from '../hooks/CartContext';

const ProductCard = ({ product, onClick }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  if (!product) return null;

  const {
    _id,
    id,
    name = "Unnamed Product",
    price,                  
    sellingPrice,          
    actualPrice,          
    discountPercentage,   
    image = "https://via.placeholder.com/300",
    unitType = "item",   
    distance,          
    isFastDelivery = false,
    stock = 0,
    vendor = {}
  } = product;

  const displayPrice = price !== undefined && price !== null ? Number(price) : (Number(sellingPrice) || 0);
  const currentProductKey = _id || id;
  
  const cartItem = cartItems?.find((item) => {
    const nestedProduct = item.product || item;
    const itemKey = nestedProduct._id || nestedProduct.id || nestedProduct.productId;
    return String(itemKey) === String(currentProductKey);
  });

  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const calculatedDiscount = discountPercentage 
    ? discountPercentage 
    : (actualPrice && actualPrice > displayPrice) 
      ? Math.round(((actualPrice - displayPrice) / actualPrice) * 100) 
      : null;

  const isOutOfStock = stock <= 0;

  const handleAddToCart = (event) => {
    event.stopPropagation();
    
    if (isOutOfStock) {
      alert("Yo item out of stock bhayeko le thapna mildaina!");
      return;
    }

    addToCart({
      ...product,
      _id: currentProductKey,
      id: currentProductKey,
      price: displayPrice  
    });
  };

  const handleRemoveFromCart = (event) => {
    event.stopPropagation();
    removeFromCart(currentProductKey);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(product);
        }
      }}
      className="group relative bg-white rounded-3xl border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-3 min-h-90 cursor-pointer"
    >
      
      <div className="relative w-full h-44 bg-gray-50 rounded-2xl overflow-hidden mb-3">
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
          {isFastDelivery && !isOutOfStock && (
            <span className="bg-[#00B56A] text-white text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
              <Zap size={10} className="fill-current text-white" />
              <span>Fast</span>
            </span>
          )}
          {calculatedDiscount > 0 && !isOutOfStock && (
            <span className="bg-[#FF4D4F] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              -{calculatedDiscount}%
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm text-gray-400 hover:text-red-500 transition-all duration-200"
        >
          <Heart size={16} />
        </button>

        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${isOutOfStock ? 'grayscale-[40%]' : ''}`}
          loading="lazy"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between px-1">
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
            <span className="flex items-center gap-1 truncate max-w-30 hover:text-[#00B56A] cursor-pointer">
              <Store size={13} className="text-gray-400" />
              <span className="truncate">{vendor?.shopName || "Najikai Shop Owner"}</span>
            </span>
            
            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-extrabold">
              <MapPin size={10}/> {distance !== undefined ? `${distance.toFixed(1)} km` : "0.8 km"}
            </span>
          </div>

          <h3 className="text-sm font-bold text-gray-800 mt-1.5 line-clamp-2 tracking-tight group-hover:text-[#00B56A] transition-colors duration-200">
            {name}
          </h3>

          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-amber-400">
              <Star size={12} className="fill-current" />
            </div>
            <span className="text-xs font-bold text-gray-700">4.5</span>
            <span className="text-[10px] text-gray-400 font-semibold">(45)</span>
            <span className="text-gray-300 text-[10px]">•</span>
            <span className="text-[10px] font-bold text-gray-400">{unitType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-1 border-t border-gray-50">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-gray-900 tracking-tight">
                Rs. {displayPrice}
              </span>
              {actualPrice && actualPrice > displayPrice && (
                <span className="text-xs font-medium text-gray-400 line-through decoration-gray-300">
                  Rs. {actualPrice}
                </span>
              )}
            </div>
          </div>

          {currentQuantity > 0 && !isOutOfStock ? (
            <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 min-w-22.5 shadow-sm h-8">
              <button 
                type="button"
                onClick={handleRemoveFromCart}
                className="text-[#00B56A] hover:text-emerald-700 p-0.5 transition-colors duration-150 active:scale-90"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              
              <span className="text-xs font-black text-emerald-950 w-4 text-center">
                {currentQuantity}
              </span>
              
              <button 
                type="button"
                onClick={handleAddToCart}
                className="text-[#00B56A] hover:text-emerald-700 p-0.5 transition-colors duration-150 active:scale-90"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button 
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 h-8 ${
                isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed hidden'
                  : 'bg-[#00B56A] hover:bg-[#009E5B] text-white'
              }`}
            >
              <Plus size={14} strokeWidth={3} />
              <span>Add</span>
            </button>
          )}

        </div>
      </div>

    </div>
  );
};

export default ProductCard;