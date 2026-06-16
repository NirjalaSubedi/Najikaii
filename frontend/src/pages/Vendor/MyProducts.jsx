import React, { useState, useEffect } from 'react';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch products from Backend
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products/my-products', {
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
        console.error("Error fetching products:", data.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // 2. Delete Product Handler
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();

        if (response.ok || data.success) {
          alert(data.message || 'Product deleted successfully!');
          // State update directly to remove without full reload
          setProducts(products.filter(item => item._id !== id));
        } else {
          alert(data.message || 'Authorization failed');
        }
      } catch (error) {
        console.error("Delete Action Error:", error);
        alert('Server connection error.');
      }
    }
  };

  // 3. Client Side Search Filtering
  const filteredProducts = products.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-7xl mx-auto mt-4 text-left">
      
      {/* Table Header Controls matching image_8611d9.png */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Products</h2>
        
        {/* Search Bar Container */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {/* Search Glass SVG Icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-gray-100 bg-gray-50/50 text-gray-700 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
          />
        </div>
      </div>

      {/* Main Responsive Table */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-400 font-medium">Fetching items network data...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400 font-medium">No products found inside your dashboard inventory.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase bg-transparent">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Sold</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/70 text-sm">
              {filteredProducts.map((item) => {
                // Dynamic threshold evaluation (Matching low stock indicator behavior in image)
                const isLowStock = item.stock <= 10;
                const isOutOfStock = item.stock === 0;

                return (
                  <tr key={item._id} className="hover:bg-gray-50/40 transition-colors group">
                    {/* Media Thumbnail + Name Column */}
                    <td className="py-3.5 pr-4 flex items-center gap-3">
                      <img
                        src={item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`) : 'https://placehold.co/100x100?text=Item'}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-xl border border-gray-100 bg-gray-50"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-[13.5px] leading-snug">{item.name}</p>
                        {isLowStock && !isOutOfStock && (
                          <span className="flex items-center text-[10px] font-medium text-amber-600 mt-0.5 gap-0.5">
                            ⚠️ Low Stock
                          </span>
                        )}
                        {isOutOfStock && (
                          <span className="flex items-center text-[10px] font-medium text-red-500 mt-0.5 gap-0.5">
                            🚫 Out of Stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-3.5 text-gray-500 text-[13px] capitalize">
                      {item.category || 'General'}
                    </td>

                    {/* Price Column */}
                    <td className="py-3.5 font-semibold text-gray-700 text-[13.5px]">
                      Rs. {item.sellingPrice ?? item.actualPrice}
                    </td>

                    {/* Stock Column (Turns text red dynamically when warning activated) */}
                    <td className={`py-3.5 font-medium text-[13.5px] ${isLowStock ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
                      {item.stock} <span className="text-[10px] text-gray-400 font-normal">{item.unitType || 'pcs'}</span>
                    </td>

                    {/* Sold Column (Can fallback dynamically or set 0 default for dashboard counts) */}
                    <td className="py-3.5 text-gray-600 font-medium text-[13.5px]">
                      {item.soldCount || 0}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        isOutOfStock 
                          ? 'bg-gray-100 text-gray-500' 
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {!isOutOfStock ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Quick Core Actions Controls Container */}
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button 
                          onClick={() => alert('Update logic framework triggers here')}
                          className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                        
                        {/* Delete Button mapped with Backend deleteProduct route parameters */}
                        <button 
                          onClick={() => handleDelete(item._id, item.name)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v4M4 7h16"></path>
                          </svg>
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