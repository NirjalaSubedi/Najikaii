import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Eye, Trash2, Search } from 'lucide-react';

const Users = () => {
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsersDataset = async () => {
            try {
                setLoading(true);
                setError("");
                
                const token = localStorage.getItem('token'); 

                const response = await axios.get('http://localhost:5000/api/auth/getAllUserInfo', { 
                    withCredentials: true,
                    headers: {
                        // Backend middleware standard pipeline lai match garna exact token pass gareko
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data && response.data.success) {
                    setUsersList(response.data.data);
                }
            } catch (err) {
                console.error("Frontend client grid loading failed:", err);
                setError(err.response?.data?.message || "Failed to fetch user database records.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsersDataset();
    }, []);

    const filteredUsers = usersList.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center gap-2 text-gray-400 font-semibold text-sm bg-white/40 backdrop-blur-sm rounded-2xl border border-gray-100">
                <Loader2 className="animate-spin text-[#00B56A]" size={20} />
                <span>Loading Najikai user records directory...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 animate-fadeIn px-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Manage User</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Najikai Admin Dashboard User Directory Management</p>
                </div>

                {/* Search Panel field matching UI mockup standards */}
                <div className="relative w-full sm:w-72 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search system clients..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400/20 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Error fallback alert element layout display indicator */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
                    Error trace mapping target: {error} (Check local token storage credentials session)
                </div>
            )}

            {/* Core Data Presentation Interface Tables sheet grids */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                                <th className="py-4 px-6">User</th>
                                <th className="py-4 px-6">Email</th>
                                <th className="py-4 px-6">Phone</th>
                                <th className="py-4 px-6 text-center">Orders</th>
                                <th className="py-4 px-6">Spent</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user._id || index} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="py-4 px-6 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center text-xs font-bold font-sans">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span className="font-bold text-gray-900">{user.name || "Nirjala Customer"}</span>
                                        </td>
                                        
                                        <td className="py-4 px-6 text-gray-500">{user.email || "user@gmail.com"}</td>
                                        
                                        {/* FIXED SCHEMA CASE SENSITIVITY: PhoneNumber match structure */}
                                        <td className="py-4 px-6 text-gray-500 font-mono">
                                            {user.PhoneNumber || "98XXXXXXXX"}
                                        </td>
                                        
                                        {/* Dynamic Order values computed directly from aggregate parameters lookup */}
                                        <td className="py-4 px-6 text-center font-bold text-gray-800">
                                            {user.totalOrders || 0}
                                        </td>
                                        
                                        {/* Dynamic Spent financial metrics computed */}
                                        <td className="py-4 px-6 font-black text-gray-900">
                                            Rs. {(user.totalSpent || 0).toLocaleString()}
                                        </td>
                                        
                                        <td className="py-4 px-6">
                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                                String(user.status).toLowerCase() === 'inactive' 
                                                    ? 'bg-gray-50 text-gray-400 border-gray-200' 
                                                    : 'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                                {user.status || 'active'}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                                    <Eye size={15} />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-400 font-medium bg-white">
                                        No users matching directory records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;