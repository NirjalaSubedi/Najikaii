import React from "react";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import LocationBanner from "../Components/LocationBanner";
import ImageBanner from "../Components/ImageBanner";
import CategorySelector from "../Components/CategorySelector";
import NearbyShops from "../Components/NearbyShops";

const Home = ()=>{
    const[userAddress,setuserAddress]=useState(localStorage.getItem('savedAddress') || "Enable Location");
    return(
        <>
            <Navbar Address={userAddress}/>
            <LocationBanner setAddress={setuserAddress}/>
            <ImageBanner/>
            <CategorySelector/>
            <NearbyShops/>
        </>
    )
}
export default Home;