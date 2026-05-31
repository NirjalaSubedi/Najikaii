import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartNotificationBar = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.length;

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-bounce-short">
      <div className="bg-[#00B56A] text-white px-5 py-3.5 rounded-full flex items-center justify-between shadow-xl shadow-emerald-900/20 backdrop-blur-sm bg-opacity-95 transition-all duration-300">
        
        <div className="flex items-center gap-2.5 font-bold text-sm tracking-wide">
          <ShoppingBag size={18} className="animate-pulse" />
          <span>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
          </span>
        </div>

        <Link 
          to="/cart" 
          className="bg-white/15 hover:bg-white/25 active:scale-95 text-white pl-4 pr-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1 transition-all duration-200"
        >
          View Cart
          <ArrowRight size={14} className="mt-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default CartNotificationBar;