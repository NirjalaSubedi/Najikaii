import React from "react";
import { Zap,Store } from 'lucide-react';
import BannerImage from '../images/indeximage.jpg';

const ImageBanner = ()=>{
    return(
        <div>
            <div>
                <img src={BannerImage}/>
            </div>
            <div>
                <div>
                    <p>FRESH & LOCAL</p>
                </div>
                <div>
                    <p>Shop from vendors</p>
                    <p>near you</p>
                </div>
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-white shadow-lg">
                        <div className="text-green-400">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <p className="text-sm font-semibold tracking-wide">Fast delivery in 15-30 min</p>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default ImageBanner;