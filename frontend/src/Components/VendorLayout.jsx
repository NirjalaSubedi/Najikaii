import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    PlusCircle, 
    ClipboardList, 
    CreditCard, 
    User, 
    LogOut, 
    Bell,
    AlertTriangle,
    Package
} from 'lucide-react';

const VendorLayout = () => {
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Balanced icon sizes for subtle layout look
    const menuItems = [
        { name: 'Overview', path: '/vendor/dashboard', icon: <LayoutDashboard size={16} /> },
        { name: 'My Products', path: '/vendor/my-products', icon: <ShoppingBag size={16} /> },
        { name: 'Add Product', path: '/vendor/add-product', icon: <PlusCircle size={16} /> },
        { name: 'Orders', path: '/vendor/orders', icon: <ClipboardList size={16} /> },
        { name: 'Earnings', path: '/vendor/earnings', icon: <CreditCard size={16} /> },
        { name: 'Profile', path: '/vendor/profile', icon: <User size={16} /> }
    ];

    return (
        <div className="min-h-screen bg-[#f9fafb] font-sans w-full flex flex-col antialiased">
            
            {/* ─── TOP HORIZONTAL NAVBAR ─── */}
            <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    
                    {/* Left: Brand Identity (Perfect size matching image_56b72a.png) */}
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm">
                            <ShoppingBag size={18} className="stroke-[2.5]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-gray-900 tracking-tight">Najikai</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Vendor
                            </span>
                        </div>
                    </div>

                    {/* Center: Navigation Links (Clean text-sm layout) */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                        isActive 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Vendor Details & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Notification Bell */}
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
                        </button>

                        {/* Profile Pill Block */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-full transition-all text-left"
                            >
                                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                    GV
                                </div>
                                <div className="hidden sm:block leading-tight">
                                    <h4 className="text-xs font-bold text-gray-800">Green Valley Farm</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">Vendor Account</p>
                                </div>
                            </button>

                            {/* Dropdown Action Toggle */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 text-left">
                                    <Link 
                                        to="/vendor/profile" 
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <User size={14} /> My Profile
                                    </Link>
                                    <hr className="border-gray-50 my-1" />
                                    <button 
                                        onClick={() => alert('Logout Triggered')}
                                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/50 w-full text-left transition-colors"
                                    >
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </header>

            {/* ─── MAIN CONTENT WRAPPER ─── */}
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8">
                
                {/* Low Stock Alert Panel */}
                {location.pathname === '/vendor/dashboard' && (
                    <div className="mb-6 bg-amber-50/40 border border-amber-100 rounded-2xl p-4 text-left">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle size={16} className="text-amber-600 stroke-[2.5]" />
                            <h3 className="text-xs font-bold text-amber-800">Low Stock Alert!</h3>
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                                3 products
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { name: 'Alphonso Mangoes', stock: '8 left!' },
                                { name: 'Cherry Tomatoes', stock: '5 left!' },
                                { name: 'Red Apple Pack', stock: '3 left!' }
                            ].map((prod, idx) => (
                                <div key={idx} className="bg-white border border-amber-100/50 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-amber-50/60 flex items-center justify-center text-amber-600">
                                            <Package size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-800">{prod.name}</h4>
                                            <p className="text-[10px] text-rose-600 font-semibold">Only {prod.stock}</p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                                        Update
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamic Sub-pages Output view block */}
                <div className="w-full transition-all duration-300">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default VendorLayout;