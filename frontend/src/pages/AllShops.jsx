import React, { useEffect, useState } from 'react';
import { Star, Clock, MapPin, Loader2, Search, ArrowLeft, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AllShops = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem("userCoords");
    return saved ? JSON.parse(saved) : null;
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  const getDistanceInKm = (shop) => {
    if (!coords || !shop.location?.coordinates || shop.location.coordinates.length !== 2) {
      return null;
    }
    const [lng, lat] = shop.location.coordinates;
    return calculateDistance(coords.lat, coords.lng, lat, lng);
  };

  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/shops/viewallshops');
      const data = await response.json();
      
      // The API returns an array directly on success or a JSON object on error
      if (Array.isArray(data)) {
        setShops(data);
      } else if (data.success && Array.isArray(data.shops)) {
        setShops(data.shops);
      } else {
        setError(data.message || "Failed to load shops.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server connection failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Helper to format image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1542838132-92c53300491e";
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    if (imagePath === 'default_shop_placeholder.jpg') {
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e';
    }
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `http://localhost:5000/${cleanPath}`;
  };

  const filteredShops = shops.filter(shop => {
    const query = searchQuery.toLowerCase();
    const name = (shop.shopName || shop.name || "").toLowerCase();
    const city = (shop.Address?.city || "").toLowerCase();
    return name.includes(query) || city.includes(query);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
        <Loader2 className="animate-spin text-[#00B56A] mb-2" size={40} />
        <p className="text-gray-500 animate-pulse font-semibold">Synchronizing shops directory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-10 animate-fadeIn">
        
        {/* Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 hover:bg-gray-50 border border-gray-200/80 rounded-2xl transition-all"
            >
              <ArrowLeft size={16} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">All Stores</h1>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">Explore registered shops on the Najikai network</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search store name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-150 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#00B56A] transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs font-semibold">
            Status Sync Issue: {error}
          </div>
        )}

        {/* Store Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredShops.length > 0 ? (
            filteredShops.map((shop) => {
              const distance = getDistanceInKm(shop);
              
              return (
                <div 
                  key={shop._id} 
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-150">
                      <img
                        src={getImageUrl(shop.shopImage)}
                        alt={shop.shopName || shop.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e";
                          e.target.onerror = null;
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <Link 
                          to={`/shop/${shop._id}`} 
                          className="bg-white text-gray-900 px-5 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#00B56A] hover:text-white"
                        >
                          <Eye size={14} />
                          View Shop
                        </Link>
                      </div>

                      {distance !== null && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                          <MapPin size={11} className="text-[#00B56A]" />
                          {distance.toFixed(1)} km
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 truncate mb-1.5">{shop.shopName || shop.name}</h3>
                      <div className="flex items-center text-gray-400 text-xs">
                        <MapPin size={12} className="mr-1 shrink-0" />
                        <span className="truncate">{shop.Address?.street ? `${shop.Address.street}, ` : ''}{shop.Address?.city || 'Local Area'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <Link 
                      to={`/shop/${shop._id}`}
                      className="w-full py-2.5 bg-gray-50 border border-gray-150 text-gray-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all hover:bg-[#00B56A] hover:border-[#00B56A] hover:text-white"
                    >
                      Explore Products
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-medium">No registered shops match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllShops;