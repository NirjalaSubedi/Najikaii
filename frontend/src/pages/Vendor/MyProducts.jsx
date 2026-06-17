import React, { useEffect, useState } from 'react';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setProducts(data.products);
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

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm animate-pulse">
        Loading your products...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto mt-4 text-left">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">My Products</h2>
        <p className="text-xs text-gray-400">Manage your listed items inside the Najikai network.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
          No products listed yet. Click "Add Product" to create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item._id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
              {/* Product Image*/}
              <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                <img 
                  src={`http://localhost:5000/${item.image}`} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} 
                />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {item.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-base truncate capitalize">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 min-h-[32px]">{item.description}</p>
                
                <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-gray-50">
                  <div>
                    <span className="text-base font-extrabold text-gray-900">Rs. {item.sellingPrice}</span>
                    {item.actualPrice > item.sellingPrice && (
                      <span className="text-xs text-gray-400 line-through ml-2">Rs. {item.actualPrice}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    Qty: {item.stock} {item.unitType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;