import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Trash2, ShoppingBag, AlertCircle } from 'lucide-react';

const Products = () => {
    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    const fetchAdminProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem('token'); 

            const response = await axios.get('http://localhost:5000/api/auth/all-products', {
                withCredentials: true,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.success) {
                setProductsList(response.data.products);
            }
        } catch (err) {
            console.error("Najikai master catalog error:", err);
            setError(err.response?.data?.message || "Server bata products fetch garna sakiyena.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminProducts();
    }, []);

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product from database?")) return;

        try {
            setDeleteLoading(productId);
            const token = localStorage.getItem('token');

            const response = await axios.delete(`http://localhost:5000/api/auth/delete-product/${productId}`, {
                withCredentials: true,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (response.data.success) {
                setProductsList(prev => prev.filter(product => product._id !== productId));
            }
        } catch (err) {
            console.error("Action execution failed:", err);
            alert(err.response?.data?.message || "Product delete garna authorization milena.");
        } finally {
            setDeleteLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-gray-400 font-semibold text-xs bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="animate-spin text-[#00B56A]" size={24} />
                <span className="tracking-wider">Najikai products catalog loading hudai chha...</span>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 animate-fadeIn px-1">
            {/* Title Block Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">ALL Products</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Najikai Admin Dashboard Master Catalog</p>
                </div>
                <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-100 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>Live Verification</span>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-semibold">
                    System Alert Trace: {error}
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-white">
                    <h3 className="text-sm font-black text-gray-900">All Products</h3>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/60 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                                <th className="py-4 px-6">Product</th>
                                <th className="py-4 px-6">Vendor / Shop</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Price</th>
                                <th className="py-4 px-6">Stock</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                            {productsList.length > 0 ? (
                                productsList.map((product, index) => (
                                    <tr key={product._id || index} className="hover:bg-gray-50/30 transition-colors">
                                        
                                        <td className="py-4 px-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ShoppingBag size={18} className="text-gray-400" />
                                                )}
                                            </div>
                                            <span className="font-bold text-gray-900">{product.name || "Unnamed Product"}</span>
                                        </td>
                                        
                                        <td className="py-4 px-6 text-gray-500">
                                            {product.vendor?.shopName || product.vendor?.name || "Najikai Supplier"}
                                        </td>
                                        
                                        {/* Category field display */}
                                        <td className="py-4 px-6 text-gray-500">
                                            {product.category || "General"}
                                        </td>
                                        
                                        <td className="py-4 px-6 font-black text-gray-900">
                                            Rs. {product.price || 0}
                                        </td>
                                        
                                        {/* Stock with low warning threshold detection */}
                                        <td className="py-4 px-6">
                                            <span className={`font-bold ${product.stock <= 5 ? 'text-red-500 font-extrabold bg-red-50/50 px-2 py-0.5 rounded-md' : 'text-gray-700'}`}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        
                                        {/* Status Tags Pills handling active state */}
                                        <td className="py-4 px-6">
                                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                                product.stock === 0
                                                    ? 'bg-red-50 text-red-600 border-red-100' 
                                                    : 'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                                {product.stock === 0 ? 'inactive' : 'active'}
                                            </span>
                                        </td>

                                        {/* Admin Action Action controller (Trash Option) */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center">
                                                <button 
                                                    disabled={deleteLoading === product._id}
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                                                >
                                                    {deleteLoading === product._id ? (
                                                        <Loader2 size={15} className="animate-spin text-red-500" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-16 text-gray-400 font-medium bg-white">
                                        Database catalog ma kunai pani product records bhetiyena.
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

export default Products;