import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Phone, MapPin, Store, Image as ImageIcon, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import AuthHero from '../Components/AuthSidebar';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Customer');
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
        shopImage: null 
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, shopImage: e.target.files[0] });
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
        setError("Password ra Confirm Password match bhayena!");
        return;
    }
    setLoading(true);
    //Geolocation fetch garne
    const getCoords = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err)
            );
        });
    };

    try {
        // Location get garne
        const coords = await getCoords().catch(() => null); 
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('PhoneNumber', formData.PhoneNumber);
        data.append('Address', formData.Address);
        data.append('password', formData.password);
        data.append('role', activeTab);
        
        if (coords) {
            data.append('location', JSON.stringify({
                type: "Point",
                coordinates: [coords.lng, coords.lat] 
            }));
        }
        
        if (activeTab === 'Vendor') {
            data.append('shopName', formData.shopName);
            if (formData.shopImage) data.append('shopImage', formData.shopImage);
        }

        const res = await axios.post('http://localhost:5000/api/auth/register', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
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
                window.location.href = "/";
            }
        } catch (error) {
            setError(error.response?.data?.message || "Google Authentication failed!");
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden font-sans bg-white">
            <AuthHero />
            <div className="w-full lg:w-1/2 h-full overflow-y-auto px-8 lg:px-20 py-10 flex flex-col justify-start items-center">
                <div className="w-full max-w-md my-auto py-6">
                    <div className="mb-6">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Create account</h2>
                        <p className="text-sm text-gray-500">Join Najikai today</p>
                    </div>

                    <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
                        <button type="button" onClick={() => setActiveTab('Customer')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Customer' ? 'bg-white text-[#00B56A] shadow-sm' : 'text-gray-500'}`}>
                            <User size={16} /> Customer
                        </button>
                        <button type="button" onClick={() => setActiveTab('Vendor')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'Vendor' ? 'bg-white text-[#00B56A] shadow-sm' : 'text-gray-500'}`}>
                            <Store size={16} /> Vendor
                        </button>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Standard Inputs */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" placeholder="Nirjala Subedi" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                            <input type="text" name="PhoneNumber" required value={formData.PhoneNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" placeholder="+977 98XXXXXXXX" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                            <input type="text" name="Address" required value={formData.Address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" placeholder="Jhumka, Sunsari" />
                        </div>

                        {/* Dynamic Vendor Fields */}
                        {activeTab === 'Vendor' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Shop Name</label>
                                    <input type="text" name="shopName" required value={formData.shopName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" placeholder="Sunsari Grocery Store" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Upload Shop Image</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00B56A]/10 file:text-[#00B56A]" />
                                </div>
                            </>
                        )}

                        {/* Passwords */}
                        <div className="relative">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                            <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" placeholder="••••••••" />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm" placeholder="••••••••" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#00B56A] text-white py-3 rounded-xl font-bold hover:bg-[#009e5b] disabled:bg-gray-400 text-sm mt-2">
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Google Login & Footer */}
                    <div className="mt-6 flex justify-center w-full">
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Login Failed")} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;