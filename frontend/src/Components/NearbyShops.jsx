import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, Clock, Zap, MapPin } from 'lucide-react';

  const NearbyShops = ({ coords }) => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (coords) {
            fetchNearbyShops();
        }
    }, [coords]);

    const fetchNearbyShops = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/shops/nearby?lat=${coords.lat}&lng=${coords.lng}&distance=10`);
            const data = await response.json();
            
            if (data.success) {
                setShops(data.shops);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };
  
  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nearby Shops</h2>
          <p className="text-gray-500 text-sm">Vendors close to your location</p>
        </div>
        <button className="text-[#00B56A] font-semibold hover:underline">View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shops && shops.length > 0 ? (
          shops.map((shop) => (
            <div key={shop._id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
              
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={shop.image || 'https://via.placeholder.com/150'} 
                  alt={shop.shopName || shop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-3 right-3 bg-[#00B56A] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <MapPin size={10} fill="white" />
                  {/* Aggregation field for distance */}
                  {shop.distanceInKm ? `${shop.distanceInKm.toFixed(1)} km` : 'N/A'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{shop.shopName || shop.name}</h3>
                
                <p className="text-gray-500 text-xs mb-2">
                  {shop.Address?.street ? `${shop.Address.street}, ` : ''}
                  {shop.Address?.city || 'Jhumka'}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="font-bold">{shop.rating || '4.5'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock size={14} />
                    20-30 min
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No shops found nearby.</p>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;