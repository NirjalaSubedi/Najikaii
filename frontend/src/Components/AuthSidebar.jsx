import React from 'react';
import vegetables from '../images/vegetables.png';

const AuthHero = () => {
    return (
        <div className="hidden lg:flex w-1/2 bg-[#00a86b] flex-col justify-center items-center p-12 text-white">
            <div className="max-w-md w-full flex flex-col items-center text-center">
                
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="flex items-center gap-3 text-4xl font-bold">
                        <span>Najikai</span>
                    </div>
                </div>
                
                <div className="w-full mb-8">
                    <img 
                        src={vegetables} 
                        alt="Fresh Groceries" 
                        className="rounded-3xl shadow-2xl w-full object-cover transform hover:scale-105 transition duration-500"
                    />
                </div>

                <h1 className="text-3xl font-extrabold mb-3 leading-tight">
                    Shop Fresh, Shop Local
                </h1>
                <p className="text-base text-green-50 opacity-90 leading-relaxed px-4">
                    Connect with vendors near you and get fresh groceries delivered to your doorstep in minutes.
                </p>

            </div>
        </div>
    );
};

export default AuthHero;