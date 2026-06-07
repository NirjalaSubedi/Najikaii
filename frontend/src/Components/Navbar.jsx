import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, Heart, ChevronDown, User, LogOut, Settings, LayoutDashboard, Trash2, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ Address }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("Current Logged In User Schema Check:", parsedUser);
        setUser(parsedUser);
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
    <nav className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-gray-100 sticky top-0 z-50">
      {/*Logo & Location */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:opacity-90">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Naji<span className="text-[#00B56A]">kai</span>
          </h1>
        </Link>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF5EE] text-[#FF7F50] rounded-full border border-[#FFE4D1] transition-all hover:bg-[#FFE4D1]">
          <MapPin size={15} className="fill-[#FF7F50]/10" />
          <span className="text-xs font-bold tracking-tight">{Address || "Enable Location"}</span>
          <ChevronDown size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/*Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <div className="relative group">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors" 
            size={18} 
          />
          <input
            type="text"
            placeholder="Search products, vendors..."
            className="w-full pl-11 pr-4 py-2 bg-[#F8F9FA] border border-gray-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00B56A]/5 focus:border-[#00B56A] transition-all text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      {/*Actions & Profile */}
      <div className="flex items-center gap-3.5">
        {/*borderless subtle stroke */}
        <button className="p-2 text-slate-700 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all">
          <Heart size={20} strokeWidth={2} />
        </button>
        
        {/* Cart Button */}
        <button className="relative p-2 bg-[#00B56A] text-white rounded-xl hover:bg-[#009e5b] transition-all shadow-md shadow-[#00B56A]/10">
          <ShoppingCart size={20} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 bg-[#FF4D4D] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
            0
          </span>
        </button>

        {/* Profile Card & Custom Dropdown Integration */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-0.5 p-0.5 rounded-full border border-gray-100 hover:border-[#00B56A] bg-white transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-[#00B56A] text-white flex items-center justify-center font-black text-sm tracking-wide shadow-sm">
                {user.name ? user.name.substring(0, 2).toUpperCase() : "US"}
              </div>
            </button>

            {/*Dropdown Modal Structure */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 rounded-[24px] shadow-2xl shadow-slate-200/80 p-4 z-50 transition-all transform origin-top-right">
                
                {/* User Header block segment */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  {/* Fixed User Avatar Icon */}
                  <div className="w-12 h-12 rounded-full bg-[#E6F8F0] text-[#00B56A] flex items-center justify-center font-black text-lg shrink-0">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                  </div>

                  <div className="leading-tight max-w-[180px]">
                    <p className="text-sm font-black text-slate-800 truncate">{user.name || "User Name"}</p>
                    
                    {/* Fixed Fallback Email Structure */}
                    <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">
                      {user.email || `${user.name ? user.name.toLowerCase().replace(/\s+/g, '') : 'user'}@gmail.com`}
                    </p>
                    
                    <span className="inline-block bg-[#E6F8F0] text-[#00B56A] text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5">
                      {user.role || "Customer"}
                    </span>
                  </div>
                </div>
                
                {/* Navigation Options List */}
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F9FA] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F8F9FA] group-hover:bg-white text-slate-500 group-hover:text-[#00B56A] rounded-xl transition-colors">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800">My Profile</div>
                        <div className="text-[10px] font-semibold text-slate-400">View your details</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
                  </button>

                  <button
                    onClick={() => { setShowDropdown(false); navigate("/edit-profile"); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F9FA] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F8F9FA] group-hover:bg-white text-slate-500 group-hover:text-[#00B56A] rounded-xl transition-colors">
                        <Settings size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800">Edit Profile</div>
                        <div className="text-[10px] font-semibold text-slate-400">Update your information</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
                  </button>

                  <button
                    onClick={() => { setShowDropdown(false); navigate("/dashboard"); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F9FA] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#F8F9FA] group-hover:bg-white text-slate-500 group-hover:text-[#00B56A] rounded-xl transition-colors">
                        <LayoutDashboard size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800">My Dashboard</div>
                        <div className="text-[10px] font-semibold text-slate-400">Orders, wishlist, profile</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400" />
                  </button>

                  <button
                    onClick={() => { /*Account Delete*/ }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-50/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#FFF0F0] text-red-500 rounded-xl">
                        <Trash2 size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-red-500">Delete Account</div>
                        <div className="text-[10px] font-semibold text-red-400/80">Permanently remove account</div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <LogOut size={16} className="text-slate-400" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 px-5 py-2 text-[#00B56A] hover:bg-green-50 rounded-xl border border-[#00B56A] transition-all font-bold text-sm">
              <User size={18} strokeWidth={2.5} />
              <span>Login</span>
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;