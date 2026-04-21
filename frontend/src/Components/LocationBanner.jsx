import React, { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const LocationBanner = ({ setAddress, setCoords }) => {
  const [loading, setLoading] = useState(false);

  const geolocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Home.jsx ko state update garne
          setCoords({ lat, lng });
          localStorage.setItem('userCoords', JSON.stringify({ lat, lng }));

          try {
            //Reverse Geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const address = data.address;
            const place = address.village || address.suburb || address.town || address.city || "Location Found";

            localStorage.setItem('savedAddress', place);
            setAddress(place);

            await fetch('http://localhost:5000/api/shops/save-location', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ latitude: lat, longitude: lng }),
            });
          } catch (err) {
            console.error("Error:", err);
            setAddress("Location Found");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setLoading(false);
          alert("Please enable location access.");
        }
      );
    } else {
      setLoading(false);
      console.log("Geolocation not supported");
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="bg-[#10B981] rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <MapPin className="text-white" size={24} />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-lg leading-tight">Enable Location</h3>
            <p className="text-white/80 text-sm">See nearby vendors</p>
          </div>
        </div>
        <button
          onClick={geolocation}
          disabled={loading}
          className="bg-white text-[#10B981] font-bold px-8 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Allow"}
        </button>
      </div>
    </div>
  );
};

export default LocationBanner;