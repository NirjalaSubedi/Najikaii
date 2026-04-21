import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Star, Clock, Zap, MapPin } from 'lucide-react';

const NearbyShops = () => {
  useEffect(()=>{
    const fetchshop = async()=>{
      try{
        const shop = await axios.get('http://localhost:5000/api/auth/getNearbyShops');
        setShops(shop.data.data);
      }catch(e){
        console.log("fetch error",e);
      }
    }
    fetchshop();
  },[])
  return (
    <div className="px-6 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nearby Shops</h2>
          <p className="text-gray-500 text-sm">Vendors close to your location</p>
        </div>
        <button className="text-[#00B56A] font-semibold hover:underline">View All</button>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shops.map((shop) => (
          <div key={shop.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">
            
            {/* Image Container */}
            <div className="relative h-40 overflow-hidden">
              <img 
                src={shop.image} 
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Distance Badge */}
              <div className="absolute top-3 right-3 bg-[#00B56A] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <MapPin size={10} fill="white" />
                {shop.distance}
              </div>

              {/* Hover View Shop Button */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white text-gray-900 px-4 py-2 rounded-xl font-bold text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  View Shop
                </button>
              </div>
            </div>

            {/* Shop Details */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 truncate">{shop.name}</h3>
              <p className="text-gray-500 text-xs mb-2">{shop.category}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-sm">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span className="font-bold">{shop.rating}</span>
                  <span className="text-gray-400 text-xs">({shop.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock size={14} />
                  {shop.time}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-gray-500 text-xs font-medium">Min. Rs. {shop.minOrder}</span>
                <div className="flex items-center gap-1 text-[#00B56A] text-xs font-bold">
                  <Zap size={12} fill="currentColor" />
                  Fast Delivery
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyShops;