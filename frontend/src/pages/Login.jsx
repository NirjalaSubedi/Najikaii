import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthHero from '../Components/AuthSidebar';
import axios from 'axios';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/google-login', {
            idToken: credentialResponse.credential 
        });

        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            
            localStorage.setItem('user', JSON.stringify(response.data.user));

            console.log("Database ma check/register vayo!");
            window.location.href = "/"; 
        }
    } catch (error) {
        console.error("Database Error:", error.response?.data?.message || "Auth Failed");
        alert("Google Login failed in Database!");
    }
};

    return (
        <div className="flex min-h-screen font-sans bg-white">
            <AuthHero />
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-20 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-5">
                        <h2 className="text-2xl font-extrabold text-gray-900">Welcome back!</h2>
                        <p className="text-gray-500">Sign in to continue shopping</p>
                    </div>

                    <form className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Mail size={20} />
                                </span>
                                <input 
                                    type="email" 
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="you@example.com" 
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Lock size={20} />
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="••••••••" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00B56A] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <a href="#" className="text-xs font-semibold text-[#00B56A] hover:underline">Forgot password?</a>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button className="w-full bg-[#00B56A] text-white py-3.5 rounded-xl font-bold hover:bg-[#009e5b] transition-all shadow-lg shadow-green-100 active:scale-[0.98]">
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8 flex items-center">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold  tracking-widest">or continue with</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    {/* Google Login Section */}
                    <div className="flex justify-center w-full">
                        <div className="w-full max-w-[320px]">
                            <GoogleLogin 
                                onSuccess={handleGoogleSuccess} 
                                onError={() => console.log('Login Failed')}
                                useOneTap
                                theme="outline"
                                shape="pill"
                                width="320"
                            />
                        </div>
                    </div>

                    {/* Signup Link */}
                    <p className="mt-5 text-center text-sm text-gray-500">
                        Don't have an account? <Link to="/signup" className="text-[#00B56A] font-bold hover:underline">Sign Up</Link>
                    </p>

                    {/* Back Link */}
                    <div className="mt-3 text-center">
                        <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowLeft size={14} /> Back to Najikai
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;