import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, Heart, ChevronDown, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ Address }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:opacity-90">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Naji<span className="text-[#00B56A]">kai</span>
          </h1>
        </Link>

        {/* Location Picker */}
        <button className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-full border border-orange-100 transition-hover hover:bg-orange-100">
          <MapPin size={18} />
          <span className="text-sm font-medium">{Address || "Select Location"}</span>
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
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B56A]/20 focus:border-[#00B56A] transition-all text-sm"
          />
        </div>
      </div>

      {/* Wishlist, Cart, Profile Section */}
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Heart size={24} />
        </button>
        
        <button className="relative p-2.5 bg-[#00B56A] text-white rounded-xl hover:bg-[#009e5b] transition-all shadow-md shadow-[#00B56A]/20">
          <ShoppingCart size={24} />
          {/* Cart Count Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            0
          </span>
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 p-1 rounded-full border border-gray-200 hover:border-[#00B56A] bg-gray-50 transition-all active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#00B56A] flex items-center justify-center font-bold text-sm uppercase shadow-inner">
                {user.name ? user.name.charAt(0) : <User size={18} />}
              </div>
              <ChevronDown size={14} className="text-gray-500 pr-1" />
            </button>

            {/* Dropdown Card Modal */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-1.5 z-50">
                <div className="px-3 py-2 border-b border-gray-50">
                  <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                  <p className="text-[10px] font-medium text-gray-400 truncate">{user.email}</p>
                  <span className="inline-block bg-emerald-50 text-[#00B56A] text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1.5">
                    {user.role || "Customer"}
                  </span>
                </div>
                
                <button
                  onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#00B56A] rounded-xl transition-all"
                >
                  <User size={14} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all mt-0.5"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 px-5 py-2 text-[#00B56A] hover:bg-green-50 rounded-xl border border-[#00B56A] transition-all font-semibold text-sm">
              <User size={20} strokeWidth={2} />
              <span>Login</span>
            </button>
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;