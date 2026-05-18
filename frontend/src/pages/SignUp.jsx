import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Phone, MapPin, Store, Image, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthHero from '../Components/AuthSidebar';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Customer'); // Customer ya Vendor state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        PhoneNumber: '',
        Address: '',
        password: '',
        confirmPassword: '',
        shopName: '',
        shopImage: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Password ra Confirm Password match bhayena!");
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            role: activeTab, 
            shopName: activeTab === 'Vendor' ? formData.shopName : undefined,
            shopImage: activeTab === 'Vendor' ? formData.shopImage : undefined
        };

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', payload);
            
            if (res.data.success) {
                navigate('/verify-otp', { state: { email: formData.email } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/google-login', {
                idToken: credentialResponse.credential 
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                console.log("Logged in via Google successfully!");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            setError(error.response?.data?.message || "Google Authentication failed!");
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden font-sans bg-white">
            
            {/* Left Side: Hero Section */}
            <AuthHero />

            {/* Right Side*/}
            <div className="w-full lg:w-1/2 h-full overflow-y-auto px-8 lg:px-20 py-10 flex flex-col justify-start items-center">
                <div className="w-full max-w-md my-auto py-6">
                    <div className="mb-6">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Create account</h2>
                        <p className="text-sm text-gray-500">Join Najikai today</p>
                    </div>

                    {/* Customer / Vendor Tabs Selector */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setActiveTab('Customer')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                                activeTab === 'Customer'
                                    ? 'bg-white text-[#00B56A] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <User size={16} /> Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('Vendor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                                activeTab === 'Vendor'
                                    ? 'bg-white text-[#00B56A] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <Store size={16} /> Vendor
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text" name="name" required value={formData.name} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="Nirjala Subedi"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email" name="email" required value={formData.email} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Phone size={18} />
                                </span>
                                <input
                                    type="text" name="PhoneNumber" required value={formData.PhoneNumber} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="+977 98XXXXXXXX"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <MapPin size={18} />
                                </span>
                                <input
                                    type="text" name="Address" required value={formData.Address} onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="Jhumka, Sunsari"
                                />
                            </div>
                        </div>

                        {/* Dynamic Vendor Fields */}
                        {activeTab === 'Vendor' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Shop Name</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                            <Store size={18} />
                                        </span>
                                        <input
                                            type="text" name="shopName" required value={formData.shopName} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                            placeholder="Sunsari Grocery Store"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Shop Image URL</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                            <Image size={18} />
                                        </span>
                                        <input
                                            type="text" name="shopImage" value={formData.shopImage} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange}
                                    className="w-full pl-11 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00B56A]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full pl-11 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00B56A]"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#00B56A] text-white py-3 rounded-xl font-bold hover:bg-[#009e5b] transition-all shadow-lg shadow-green-100 active:scale-[0.98] disabled:bg-gray-400 text-sm mt-2 flex justify-center items-center"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider for Social Section */}
                    <div className="relative my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-100"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">or continue with</span>
                        <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    {/* Google Login Component */}
                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Login Failed")}
                            useOneTap
                            theme="outline"
                            size="large"
                            width="100%"
                        />
                    </div>

                    {/* Redirect link option */}
                    <div className="text-center text-sm text-gray-500 mt-5">
                        Already have an account? <Link to="/login" className="text-[#00B56A] font-bold hover:underline">Sign In</Link>
                    </div>

                    {/* Back Link */}
                    <div className="mt-4 text-center">
                        <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowLeft size={14} /> Back to Najikai
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;