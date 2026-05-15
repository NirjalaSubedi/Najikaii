import React from 'react';
import vegetables from '../images/vegetables.png'

const AuthHero = () => {
    return (
        <div className="hidden lg:flex w-1/2 bg-[#00a86b] flex-col justify-center items-center p-12 text-white">
            <div className="mb-8">
                {/* Logo Section */}
                <div className="flex items-center gap-2 text-3xl font-bold mb-4">Najikai</div>
                <img 
                    src={vegetables} 
                    alt="Fresh Groceries" 
                    className="rounded-2xl shadow-2xl mb-8 w-full max-w-md object-cover"
                />

                <h1 className="text-4xl font-extrabold mb-4">Shop Fresh, Shop Local</h1>
                <p className="text-lg text-green-50 opacity-90">
                    Connect with vendors near you and get fresh groceries delivered to your doorstep in minutes.
                </p>
            </div>
        </div>
    );
};

export default AuthHero;