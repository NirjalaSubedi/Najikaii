import React from "react";
import { Zap, Store } from 'lucide-react';
import BannerImage from '../images/indeximage.jpg';

const ImageBanner = () => {
  return (
    <div className="px-6 py-4">
      <div className="relative w-full h-[280px] md:h-[320px] overflow-hidden rounded-3xl shadow-lg bg-[#064e3b]">
        
        <img 
          src={BannerImage} 
          alt="Najikai Banner" 
          className="w-full h-full object-cover object-top opacity-90 mix-blend-overlay" 
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 text-white">
          
          <p className="font-bold text-xs text-[#00B56A] tracking-[0.2em] mb-2 uppercase drop-shadow-sm">
            Fresh & Local
          </p>

          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-8 drop-shadow-md">
            Shop from vendors <br /> near you
          </h2>

          <div className="flex flex-wrap gap-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/30 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
              <Zap size={18} className="text-[#00B56A]" fill="currentColor" />
              <p className="text-xs md:text-sm font-bold">Fast delivery in 15–30 min</p>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/30 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
              <Store size={18} className="text-[#00B56A]" />
              <p className="text-xs md:text-sm font-bold">500+ local vendors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageBanner;