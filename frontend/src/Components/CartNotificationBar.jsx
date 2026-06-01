import React, { useEffect } from 'react'; // useEffect thapiyo
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/CartContext';

const CartNotificationBar = () => {
  const { cartItems } = useCart();
const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);;

  useEffect(() => {
    console.log("Cart change tracking triggered! Current total items:", totalItems);
  }, [cartItems, totalItems]);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-bounce-short">
      <div className="bg-[#00B56A] text-white px-5 py-3.5 rounded-full flex items-center justify-between shadow-xl shadow-emerald-950/20 backdrop-blur-sm bg-opacity-95 transition-all duration-300">
        
        <div className="flex items-center gap-2 font-bold text-xs tracking-wide">
          <ShoppingBag size={16} />
          <span>
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
          </span>
        </div>

        <Link 
          to="/cart" 
          className="bg-white/20 hover:bg-white/30 text-white pl-3 pr-2 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 transition-all"
        >
          View Cart
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default CartNotificationBar;