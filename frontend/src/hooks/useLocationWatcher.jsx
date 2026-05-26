import { useState, useEffect } from "react";
import axios from "axios";

export const useLocationWatcher = () => {
  const [userAddress, setUserAddress] = useState(localStorage.getItem("savedAddress") || "Enable Location");
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem("userCoords");
    return saved ? JSON.parse(saved) : null;
  });

  const fetchReadableAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      
      if (response.data && response.data.address) {
        const addr = response.data.address;
        const localArea = addr.neighbourhood || addr.suburb || addr.quarter || addr.town || addr.village || addr.city_district;
        const mainCity = addr.city || addr.municipality || "Current Location";
        const finalAddressText = localArea ? `${localArea}` : mainCity;

        setUserAddress(finalAddressText);
        localStorage.setItem("savedAddress", finalAddressText);
      }
    } catch (err) {
      console.error("Geocoding runtime logs error:", err);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const currentCoords = { lat: latitude, lng: longitude };
        
        setCoords(currentCoords);
        localStorage.setItem("userCoords", JSON.stringify(currentCoords));
        await fetchReadableAddress(latitude, longitude);
      },
      (error) => console.error("Location error:", error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { userAddress, setUserAddress, coords, setCoords };
};