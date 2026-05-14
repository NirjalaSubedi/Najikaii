
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShopCard from '../Components/ShopCard';
const AllShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const res = await axios.get(`http://localhost:5000/api/shops/viewallshops?lat=${latitude}&lng=${longitude}`);
        setShops(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Data fetch garda error aayo", err);
        setLoading(false);
      }
    });
  }, []);

  if (loading) return <div className="text-center mt-10">Loading Nearby Shops...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">All Shops Near You</h2>
      
      {/* Grid Layout for Shops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.length > 0 ? (
          shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))
        ) : (
          <p>No shops found in your area.</p>
        )}
      </div>
    </div>
  );
};

export default AllShops;