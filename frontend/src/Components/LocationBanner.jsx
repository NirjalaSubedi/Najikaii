import React from 'react';
import { MapPin } from 'lucide-react';

const LocationBanner = () => {

  const geolocation=()=>{
    if(navigator.geolocation){

    }else{
      console.log("geolocation features is not allowed in your browser")
    }
  }
  return (
    <div className="px-6 py-4">
      <div className="bg-[#10B981] rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <MapPin className="text-white" size={24} />
          </div>
          
          {/* Text Section */}
          <div className="text-white">
            <h3 className="font-bold text-lg leading-tight">
              Enable Location for Better Experience
            </h3>
            <p className="text-white/80 text-sm">
              See products from vendors near you with fast delivery
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button className="bg-white text-[#10B981] font-bold px-8 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          Allow
        </button>
      </div>
    </div>
  );
};

export default LocationBanner;