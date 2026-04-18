import React from 'react';
import { Search, MapPin, ShoppingCart, Heart, ChevronDown, UserCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Naji<span className="text-[#00B56A]">kai</span>
        </h1>

        {/* Location Picker */}
        <button className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-full border border-orange-100 transition-hover hover:bg-orange-100">
          <MapPin size={18} />
          <span className="text-sm font-medium">Enable Location</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-10">
        <div className="relative group">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A]" 
            size={20} 
          />
          <input
            type="text"
            placeholder="Search products, vendors..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B56A]/20 focus:border-[#00B56A] transition-all"
          />
        </div>
      </div>

      {/*Wishlist, Cart, Profile*/}
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Heart size={24} />
        </button>
        
        <button className="relative p-2.5 bg-[#00B56A] text-white rounded-xl hover:bg-[#009e5b] transition-all shadow-md shadow-[#00B56A]/20">
          <ShoppingCart size={24} />
          {/* Cart Count Badge*/}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            0
          </span>
        </button>

        {/* Profile Icon Section*/}
        <button className="p-2 text-[#00B56A] hover:bg-green-50 rounded-full transition-all flex items-center justify-center">
             <UserCircle size={32} strokeWidth={1.5} />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;