import React, { useEffect, useState } from 'react';
import { Star, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';

const NearbyShops = ({ coords }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // sorting ra filtering shops
  const processedShops = shops
  .filter(shop => shop.distanceInKm <= 5) 
  .sort((a, b) => a.distanceInKm - b.distanceInKm) 
  .slice(0, 4);

  useEffect(() => {
    //if coords exist before fetching
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
        setShops(data.shops);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#00B56A] mb-2" size={40} />
        <p className="text-gray-500 animate-pulse">Searching nearby shops...</p>
      </div>
    );
  }

  if (error && shops.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-gray-500">
        <AlertCircle size={40} className="mb-2 opacity-20" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 ">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nearby Shops</h2>
          <p className="text-gray-500 text-sm">Find vendors within your reach in Jhumka</p>
        </div>
        <button className="text-[#00B56A] font-semibold hover:text-[#008f54] transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {shops.length > 0 ? (
          processedShops.map((shop) => (
            <div 
              key={shop._id} 
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={shop.shopImage} 
                  alt={shop.shopName || shop.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Distance Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <MapPin size={12} className="text-[#00B56A]" fill="#00B56A" fillOpacity="0.2" />
                  {shop.distanceInKm ? `${shop.distanceInKm.toFixed(1)} km` : '0.5 km'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 truncate mb-1">
                  {shop.shopName || shop.name}
                </h3>
                
                <div className="flex items-center text-gray-400 text-xs mb-4">
                  <MapPin size={12} className="mr-1" />
                  <span className="truncate">
                    {shop.Address?.street ? `${shop.Address.street}, ` : ''}
                    {shop.Address?.city || 'Jhumka'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <div className="bg-yellow-50 p-1 rounded-md">
                      <Star size={14} className="text-yellow-500" fill="currentColor" />
                    </div>
                    <span className="font-bold text-sm text-gray-700">{shop.rating || '4.8'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium bg-gray-50 px-3 py-1 rounded-full">
                    <Clock size={12} className="text-[#00B56A]" />
                    15-25 min
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Koi pani shop bhetiyena. Distance badhaunu hos!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;