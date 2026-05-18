import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, ShoppingBag, ClipboardList, Percent, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();
    
    const menuItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Vendors', path: '/admin/vendors', icon: <Store size={20} />, badge: 2 },
        { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={20} /> },
        { name: 'Commission', path: '/admin/commission', icon: <Percent size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 flex font-sans">
            {/* Fixed Sidebar */}
            <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-4 fixed left-0 top-0 z-20">
                <div>
                    <div className="mb-6 px-4">
                        <h1 className="text-xl font-extrabold text-[#00B56A]">Najikai</h1>
                        <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin Panel</span>
                    </div>

                    <div className="mb-6 p-3 bg-red-50/50 rounded-2xl flex items-center gap-3 border border-red-50">
                        <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm">SA</div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">Super Admin</h4>
                            <p className="text-[11px] text-gray-400">nirjalasubedi944@gmail.com</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name} to={item.path}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        isActive ? 'bg-red-50 text-red-500 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all w-full text-left">
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Dynamic Dashboard View Space Wrapper */}
            <div className="flex-1 pl-64 p-8">
                {/* Global Dashboard Header component */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 capitalize">{location.pathname.split('/').pop()}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Najikai Admin Dashboard</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm">🔔 2 pending</span>
                        <button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2 rounded-xl shadow-sm">View Store</button>
                    </div>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;