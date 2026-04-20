import React from "react";
import { Zap, Store } from 'lucide-react';
import BannerImage from '../images/indeximage.jpg';

const ImageBanner = () => {
  return (
    <div className="px-6 py-4">
      <div className="relative w-full h-[220px] md:h-[250px] overflow-hidden rounded-[2rem] shadow-sm bg-gray-100">
        
        <img 
          src={BannerImage} 
          alt="Najikai Banner" 
          className="w-full h-full object-cover object-top" 
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#0b603d]/70 via-[#062d24]/20 to-transparent pointer-events-none"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-14">
          
          <p className="text-[#00FF95] font-bold text-[11px] tracking-[0.2em] mb-1 uppercase drop-shadow-md">
            Fresh & Local
          </p>

          <h2 className="text-white text-[32px] md:text-[45px] font-extrabold leading-[1.1] mb-6 drop-shadow-md">
            Shop from vendors <br /> near you
          </h2>

          {/* Badges Section */}
          <div className="flex flex-wrap gap-3">
            {/* Delivery Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Zap size={14} className="text-[#00FF95]" fill="currentColor" />
              <span className="text-white text-[12px] font-bold">Fast delivery in 15–30 min</span>
            </div>

            {/* Vendor Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Store size={14} className="text-[#00FF95]" />
              <span className="text-white text-[12px] font-bold">500+ local vendors</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImageBanner;