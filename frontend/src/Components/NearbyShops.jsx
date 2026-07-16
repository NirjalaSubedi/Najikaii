import React, { useEffect, useState } from 'react';
import { Star, Clock, MapPin, Loader2, AlertCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const NearbyShops = ({ coords }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processedShops = shops
    .filter(shop => shop.distanceInKm <= 5)
    .sort((a, b) => a.distanceInKm - b.distanceInKm)
    .slice(0, 4);

  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      fetchNearbyShops();
    }
  }, [coords]);

  const fetchNearbyShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/shops/getNearbyShops?lat=${coords.lat}&lng=${coords.lng}&distance=15`
      );
      const data = await response.json();

      if (data.success) {
        setShops(data.shops || []);
      } else {
        setShops([]);
        setError(data.message || "Shops bhetiyena.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server connect huna sakiyena.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    if (imagePath === 'default_shop_placeholder.jpg') {
      return 'https://via.placeholder.com/150';
    }
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `http://localhost:5000/${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#00B56A] mb-2" size={40} />
        <p className="text-gray-500 animate-pulse">Searching nearby shops...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nearby Shops</h2>
          <p className="text-gray-500 text-sm">Find vendors within your reach</p>
        </div>
        <Link to="/all-shops" className="text-[#00B56A] font-semibold hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {processedShops.length > 0 ? (
          processedShops.map((shop) => (
            <div 
              key={shop._id} 
              className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {shop.shopImage ? (
                  <img
                    src={getImageUrl(shop.shopImage)}
                    alt={shop.shopName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e5e7eb%22%2F%3E%3C%2Fsvg%3E";
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
 
                <div className='absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
                  <Link 
                    to={`/shop/${shop._id}`} 
                    className="bg-white text-gray-900 px-5 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#00B56A] hover:text-white"
                  >
                    <Eye size={14} />
                    View Shop
                  </Link>
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <MapPin size={12} className="text-[#00B56A]" />
                  {Number.isFinite(Number(shop.distanceInKm)) ? `${Number(shop.distanceInKm).toFixed(1)} km` : 'N/A'}
                </div>
              </div>             

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{shop.shopName || shop.name}</h3>
                <div className="flex items-center text-gray-400 text-xs mb-4">
                  <MapPin size={12} className="mr-1" />
                  <span className="truncate">{shop.Address?.city}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No shops found within 5km.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;