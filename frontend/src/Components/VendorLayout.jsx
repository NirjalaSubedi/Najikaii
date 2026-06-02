import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, PlusCircle, ClipboardList, CreditCard, User } from 'lucide-react';

const VendorLayout = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Overview', path: '/vendor/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'My Products', path: '/vendor/my-products', icon: <ShoppingBag size={20} /> },
        { name: 'Add Product', path: '/vendor/add-product', icon: <PlusCircle size={20} /> },
        { name: 'Orders', path: '/vendor/orders', icon: <ClipboardList size={20} /> },
        { name: 'Earnings', path: '/vendor/earnings', icon: <CreditCard size={20} /> },
        { name: 'Profile', path: '/vendor/profile', icon: <User size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 flex font-sans w-full overflow-x-hidden">
            <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-4 fixed left-0 top-0 z-30 shadow-sm">
                <div>
                    <div className="mb-6 px-4 pt-2">
                        <h1 className="text-xl font-extrabold text-[#0c0c0c]">Najikai</h1>
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Vendor</span>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name} to={item.path}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        isActive ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all w-full text-left mt-auto">
                    Logout
                </button>
            </div>

            <div className="flex-1 pl-72 pr-8 pt-8 pb-12 transition-all duration-300">
                <div className="flex justify-between items-center mb-8 max-w-[1400px] mx-auto">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 capitalize tracking-tight">{location.pathname.split('/').pop() === 'dashboard' ? 'Overview' : location.pathname.split('/').pop()}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Najikai Vendor Dashboard</p>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default VendorLayout;
