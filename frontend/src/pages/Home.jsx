import React from "react";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import LocationBanner from "../Components/LocationBanner";
import ImageBanner from "../Components/ImageBanner";
import CategorySelector from "../Components/CategorySelector";
import NearbyShops from "../Components/NearbyShops";

const Home = ()=>{
    const[userAddress,setuserAddress]=useState(localStorage.getItem('savedAddress') || "Enable Location");
    const [coords, setCoords] = useState(null);
    return(
        <>
            <Navbar Address={userAddress}/>
            {userAddress === "Enable Location" && (
                <LocationBanner 
                    setAddress={setuserAddress}
                    setCoords={setCoords}
                    />
            )}
            <ImageBanner/>
            <CategorySelector/>
            <NearbyShops coords={coords}/>
        </>
    )
}
export default Home;