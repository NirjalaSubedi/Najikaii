import React from "react";
import Navbar from "../Components/Navbar";
import LocationBanner from "../Components/LocationBanner";
import ImageBanner from "../Components/ImageBanner";
import CategorySelector from "../Components/CategorySelector";
import NearbyShops from "../Components/NearbyShops";

const Home = ()=>{
    return(
        <>
            <Navbar/>
            <LocationBanner/>
            <ImageBanner/>
            <CategorySelector/>
            <NearbyShops/>
        </>
    )
}
export default Home;