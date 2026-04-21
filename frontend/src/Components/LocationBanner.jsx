import React from 'react';
import { useState } from 'react';
import { MapPin,Loader2 } from 'lucide-react';

const LocationBanner = ({setAddress,setCoords}) => {
  const [loading, setloading]=useState(false)

  const geolocation=()=>{
    setloading(true);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async(Position)=>{
        const lat=Position.coords.latitude;
        const lng=Position.coords.longitude;
        setCoords({ lat, lng });
        try{
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          
          const address = data.address;
          const place = address.village || 
              address.suburb || 
              address.city_district || 
              address.town || 
              address.city || 
              address.county || 
              "Location Found";
          
          setAddress(place); // Home.jsx ko state update bhayo
          localStorage.setItem('savedAddress', place);
          await sendLocationToBackend(lat, lng);
        }catch(err){
          console.error("Geocoding error", err);
          setAddress("Location Found");
        }finally{
          setloading(false);
        }
      },(error)=>{
        console.error("Error getting location:", error.message);
        alert("Location access denied. Please enable it from settings.");
      })
    }else{
      console.log("geolocation features is not allowed in your browser")
    }
  }

  const sendLocationToBackend = async (lat, lng) => {
    try{
      const response = await fetch('http://localhost:5000/api/shops/save-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
      const data = await response.json();
      console.log("Backend Response:", data);
    }catch(error){
        console.error("Backend error:", error);
    }finally{
        setloading(false);
    }
};
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
        <button
          onClick={geolocation}
          disabled={loading}
          className="bg-white text-[#10B981] font-bold px-8 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> 
            </>
          ) : (
            "Allow"
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationBanner;