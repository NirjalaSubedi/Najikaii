import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import LocationBanner from "../Components/LocationBanner";
import ImageBanner from "../Components/ImageBanner";
import CategorySelector from "../Components/CategorySelector";
import NearbyShops from "../Components/NearbyShops";
import Footer from "../Components/Footer";
const Home = () => {
  const [userAddress, setuserAddress] = useState(localStorage.getItem('savedAddress') || "Enable Location");
  
  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('userCoords');
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <>
      <Navbar Address={userAddress} />
      {userAddress === "Enable Location" && (
        <LocationBanner setAddress={setuserAddress} setCoords={setCoords} />
      )}
      <ImageBanner />
      <CategorySelector />
      {/* Coords state pass gareko chha */}
      <NearbyShops coords={coords} />
      <Footer/>
    </>
  );
};

export default Home;