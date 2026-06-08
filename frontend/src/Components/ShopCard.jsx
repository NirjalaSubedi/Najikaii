import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';

const ShopCard = ({ shop }) => {
  const { 
    name, 
    address, 
    rating = 4.8, 
    distance, 
    deliveryTime = "15-25 min", 
    imageUrl 
  } = shop;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer max-w-sm">
      {/* Shop Image Section */}
      <div className="relative h-48 w-full">
        <img 
          src={imageUrl || 'https://via.placeholder.com/400x300?text=Shop+Image'} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Distance Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <MapPin size={14} className="text-green-600" />
          <span className="text-xs font-bold text-gray-800">{distance ? `${distance} km` : 'N/A'}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        
        <div className="flex items-center gap-1 text-gray-500 mb-4">
          <MapPin size={14} />
          <p className="text-sm truncate">{address}</p>
        </div>

        <div className="flex justify-between items-center mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-800">{rating}</span>
          </div>

          {/* Delivery Time */}
          <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
            <Clock size={14} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">{deliveryTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;