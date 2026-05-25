import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Store, MapPin, Calendar, Phone, Mail } from 'lucide-react';

const Vendors = () => {
    const [vendorsList, setVendorsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterTab, setFilterTab] = useState("all");

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                setError("");
                
                const token = localStorage.getItem('token'); 

                const response = await axios.get('http://localhost:5000/api/shops/getAllShopsForAdmin', { 
                    withCredentials: true,
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data && response.data.success) {
                    setVendorsList(response.data.data);
                }
            } catch (err) {
                console.error("Admin vendor listing grid load failed:", err);
                setError(err.response?.data?.message || "Failed to fetch Najikai vendor directory.");
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    const filteredVendors = vendorsList.filter(vendor => {
        if (filterTab === "all") return true;
        return vendor.status?.toLowerCase() === filterTab.toLowerCase();
    });

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center gap-2 text-gray-400 font-semibold text-sm bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin text-[#00B56A]" size={20} />
                <span>Syncing Najikai vendors registry database...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 animate-fadeIn px-1">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Vendors</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Najikai Admin Dashboard Store Registrations Directory</p>
                </div>

                {/* Filter Navigation Tabs */}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 p-1 rounded-xl text-xs font-bold text-gray-500">
                    {["all", "approved", "pending", "rejected"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterTab(tab)}
                            className={`px-4 py-1.5 rounded-lg capitalize transition-all ${
                                filterTab === tab 
                                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100/50' 
                                    : 'hover:text-gray-900'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message Layout */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
                    Error trace mapping target: {error}
                </div>
            )}

            {/* Dynamic Vendors Card List Display */}
            <div className="space-y-4">
                {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor, index) => (
                        <div key={vendor._id || index} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md/40 transition-all">
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    {/* Shop Image Or Fallback Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-[#00B56A] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {vendor.shopImage && vendor.shopImage !== 'https://via.placeholder.com/150' ? (
                                            <img src={vendor.shopImage} alt={vendor.shopName} className="w-full h-full object-cover" />
                                        ) : (
                                            <Store size={22} />
                                        )}
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {/* Shop Name Display */}
                                            <h3 className="text-sm font-black text-gray-900">{vendor.shopName || "Unnamed Store"}</h3>
                                            
                                            {/* Status Badge डिस्प्ले */}
                                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                                String(vendor.status).toLowerCase() === 'approved' 
                                                    ? 'bg-green-50 text-green-600 border-green-100' 
                                                    : String(vendor.status).toLowerCase() === 'pending'
                                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                    : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {vendor.status || 'Pending'}
                                            </span>
                                        </div>

                                        {/* Vendor Owner Context Details */}
                                        <p className="text-xs text-gray-400 font-semibold mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <span className="text-gray-900 font-bold">{vendor.name}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="flex items-center gap-0.5 font-normal"><Mail size={12} /> {vendor.email}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="flex items-center gap-0.5 font-mono"><Phone size={12} /> {vendor.PhoneNumber || 'No Phone'}</span>
                                        </p>
                                        
                                        {/* Meta Coordinates Mapping Display */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[11px] text-gray-400 font-medium">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={13} className="text-gray-400" /> 
                                                {vendor.Address?.city || 'Jhumka'}, {vendor.Address?.province || 'Koshi'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} /> Registered: {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'Recent'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Revenue & Static Multi-Vendor Counters Grid Right Segment */}
                                <div className="flex items-center justify-between md:justify-end gap-8 text-right bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-xl md:bg-transparent md:border-none md:p-0">
                                    <div className="text-left md:text-right">
                                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Revenue</span>
                                        <span className="text-sm font-black text-gray-900">Rs. 0</span> {/* Default placeholders for now */}
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center md:text-right">Products</span>
                                        <span className="block text-xs font-bold text-gray-600 text-center md:text-right">0 products</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl text-gray-400 font-medium text-xs shadow-sm">
                        No vendors profile records found under the "{filterTab}" segment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vendors;