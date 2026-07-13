import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    
    const [lowStockProducts, setLowStockProducts] = useState([]);
    
    const [shopName, setShopName] = useState('Loading...');

    const menuItems = [
        { name: 'Overview', path: '/vendor/dashboard', icon: <LayoutDashboard size={16} /> },
        { name: 'My Products', path: '/vendor/MyProducts', icon: <ShoppingBag size={16} /> }, 
        { name: 'Add Product', path: '/vendor/add-product', icon: <PlusCircle size={16} /> },
        { name: 'Orders', path: '/vendor/orders', icon: <ClipboardList size={16} /> },
        { name: 'Earnings', path: '/vendor/earnings', icon: <CreditCard size={16} /> },
        { name: 'Profile', path: '/vendor/profile', icon: <User size={16} /> }
    ];

    // Fetch Vendor Profile Data using backend route
    useEffect(() => {
        const fetchVendorProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/auth/MyProfileInfo', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                
                if (data.success && data.userInfo) {
                    setShopName(data.userInfo.shopName || data.userInfo.name || 'My Shop');
                } else if (data.success && data.user) { 
                    setShopName(data.user.shopName || data.user.name || 'My Shop');
                }
            } catch (error) {
                console.error("Profile data fetch garna error aayo:", error);
                setShopName('My Shop');
            }
        };

        fetchVendorProfile();
    }, []);

    // Fetch Low Stock Products From Backend
    useEffect(() => {
        const fetchLowStockData = async () => {
            try {
                const token = localStorage.getItem('token'); 

                const response = await fetch('http://localhost:5000/api/auth/getLowStockProducts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                if (data.success) {
                    setLowStockProducts(data.products);
                }
            } catch (error) {
                console.error("Low stock data fetch garna error aayo:", error);
            }
        };

        if (location.pathname === '/vendor/dashboard') {
            fetchLowStockData();
        }
    }, [location.pathname]);

    const getInitials = (name) => {
        if (!name || name === 'Loading...') return 'V';
        return name.split(' ').filter(Boolean).map(word => word[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] font-sans w-full flex flex-col antialiased">
            
            <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                    
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

                    <nav className="hidden lg:flex items-center gap-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all duration-200 ${
                                        isActive 
                                        ? 'bg-emerald-50 text-emerald-600 font-semibold' 
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* Profile */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-full transition-all text-left"
                            >
                                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm select-none">
                                    {getInitials(shopName)}
                                </div>
                                <div className="hidden sm:block leading-tight">
                                    <h4 className="text-xs font-bold text-gray-800 tracking-tight">{shopName}</h4>
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
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('role');
                                            navigate('/login');
                                        }}
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

            <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-8">
                
                {location.pathname === '/vendor/dashboard' && lowStockProducts.length > 0 && (
                    <div className="mb-6 bg-[#fefaf0] border border-amber-200/60 rounded-2xl p-5 text-left shadow-2xs">
                        
                        <div className="flex items-center gap-2.5 mb-4">
                            <AlertTriangle size={18} className="text-amber-600 stroke-[2]" />
                            <h3 className="text-base font-medium text-amber-900">Low Stock Alert!</h3>
                            <span className="text-xs bg-[#fdedd0] text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
                                {lowStockProducts.length} {lowStockProducts.length === 1 ? 'product' : 'products'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {lowStockProducts.map((prod) => (
                                <div key={prod._id} className="bg-white border border-gray-100 rounded-xl p-3.5 flex items-center justify-between shadow-3xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50/40 flex items-center justify-center text-amber-600 border border-amber-100/30 flex-shrink-0">
                                            <Package size={18} className="stroke-[1.5]" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 tracking-tight">{prod.name}</h4>
                                            <p className="text-xs text-[#e11d48] font-normal mt-0.5">
                                                Only {prod.stock} {prod.unitType || 'pcs'} left!
                                            </p>
                                        </div>
                                    </div>
                                    {/* FIXED: Changed path to matched CamelCase pattern */}
                                    <Link 
                                        to={`/vendor/MyProducts`}
                                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 transition-colors"
                                    >
                                        Update
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="w-full transition-all duration-300">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default VendorLayout;