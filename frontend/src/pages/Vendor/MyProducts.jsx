import React, { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { getImageUrl } from '../../utils/image';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/my-products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (response.ok || data.success) {
          setProducts(data.products || []);
        } else {
          console.error(data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm animate-pulse">
        Loading your products...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs max-w-6xl mx-auto mt-2">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-900">My Products</h2>
        </div>
        
        {/* Search Input Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Products Table View */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
          No products found. Add a product to see it here!
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-t-xl">
                <th className="py-4 px-4 rounded-l-xl">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredProducts.map((item) => {
                const isLowStock = item.stock <= 5; // Alert if stock is 5 or less
                
                return (
                  <tr key={item._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200/60 overflow-hidden flex-shrink-0 block relative">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover block"
                            onError={(e) => { 
                          
                              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' font-family='sans-serif' font-size='14' fill='%239ca3af' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>";
                            }}
                          />
                        </div>
                        <div className="text-left leading-tight">
                          <h4 className="font-semibold text-gray-900 capitalize truncate max-w-[180px]">{item.name}</h4>
                          {isLowStock && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-medium mt-1 bg-amber-50 px-1.5 py-0.5 rounded-md">
                              <AlertTriangle size={10} /> Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-4 text-gray-500 capitalize">{item.category}</td>

                    {/* Price Column */}
                    <td className="py-4 px-4 font-bold text-gray-900">
                      Rs. {item.sellingPrice}
                    </td>

                    {/* Stock Count Column */}
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${isLowStock ? 'text-rose-600' : 'text-gray-600'}`}>
                        {item.stock}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">{item.unitType || 'pcs'}</span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.stock > 0 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.stock > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          title="Edit Item"
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          title="Delete Item"
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProducts;