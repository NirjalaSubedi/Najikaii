import React from "react";
import Navbar from "../Components/Navbar";
import LocationBanner from "../Components/LocationBanner";
import ImageBanner from "../Components/ImageBanner";
import CategorySelector from "../Components/CategorySelector";
import NearbyShops from "../Components/NearbyShops";
import ProductGrid from "../Components/ProductGrid";
import Footer from "../Components/Footer";
import { useLocationWatcher } from "../hooks/useLocationWatcher";
import { useProductFilter } from "../hooks/useProductFilter"; 
import CartNotificationBar from "../Components/CartNotificationBar";

const Home = () => {
  const { userAddress, setUserAddress, coords, setCoords } = useLocationWatcher();
  const { selectedCategory, setSelectedCategory } = useProductFilter();

  return (
    <>
      <Navbar Address={userAddress} />
      {userAddress === "Enable Location" && (
        <LocationBanner setAddress={setUserAddress} setCoords={setCoords} />
      )}
      <ImageBanner />
      <NearbyShops coords={coords} />
      
      <CategorySelector 
        activeCategory={selectedCategory} 
        setActiveCategory={setSelectedCategory} 
      />
      <ProductGrid coords={coords} selectedCategory={selectedCategory} />
      <Footer />
      <CartNotificationBar/>
    </>
  );
};

export default Home;