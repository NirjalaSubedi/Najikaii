import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, ShoppingBag, ClipboardList, Percent, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Customers', path: '/admin/Customers', icon: <Users size={20} /> },
        { name: 'Vendors', path: '/admin/vendors', icon: <Store size={20} />, badge: 2 },
        { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={20} /> },
        { name: 'Commission', path: '/admin/commission', icon: <Percent size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 flex w-full">
            {/* Sidebar Container - Fixed layout with full height */}
            <aside className="w-64 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-50 flex flex-col">
                
                {/* Top Section */}
                <div className="p-6">
                    <h1 className="text-xl font-extrabold text-[#0c0c0c]">Najikai</h1>
                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Admin Panel</span>
                </div>

                {/* Profile Box */}
                <div className="px-4 mb-6">
                    <div className="p-3 bg-red-200/50 rounded-2xl border border-red-50">
                        <h4 className="text-sm font-bold text-red-500">Super Admin</h4>
                        <p className="text-[11px] text-gray-400 truncate">nirjalasubedi944@gmail.com</p>
                    </div>
                </div>

                {/* Navigation - flex-grow le button lai tala thaildincha */}
                <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
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

                {/* Logout Button - Abhi yo sidebar ko bottom ma fixed bascha */}
                <div className="p-4 border-t border-gray-100">
                    <button 
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all w-full text-left cursor-pointer z-[100]"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 transition-all duration-300">
                <div className="flex justify-between items-center mb-8 max-w-[1400px] mx-auto">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 capitalize tracking-tight">
                            {location.pathname.split('/').pop() === 'dashboard' ? 'Overview' : location.pathname.split('/').pop()}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/all-shops" className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs px-4 py-2 rounded-xl">
                            View Store
                        </Link>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;