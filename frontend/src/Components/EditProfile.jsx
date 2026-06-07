import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Phone, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProfile = ({ user, onBack, onUpdateSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        city: '',
        province: ''
    });

    useEffect(() => {
        if (user) {
            const addr = user?.address || {};
            setFormData({
                name: user?.name || '',
                phoneNumber: user?.phoneNumber || '',
                city: typeof addr === 'object' ? (addr.city || '') : '',
                province: typeof addr === 'object' ? (addr.province || '') : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            
            const res = await axios.put('http://localhost:5000/api/auth/update-profile', {
                name: formData.name,
                PhoneNumber: formData.PhoneNumber,
                address: {
                    city: formData.city,
                    province: formData.province
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success || res.status === 200) {
                const updatedUser = {
                    ...user,
                    name: formData.name,
                    PhoneNumber: formData.PhoneNumber,
                    address: {
                        city: formData.city,
                        province: formData.province
                    }
                };

                localStorage.setItem('user', JSON.stringify(updatedUser));
                onUpdateSuccess(updatedUser);
                toast.success("Profile updated successfully!");
            }
        } catch (err) {
            console.error("Update profile error:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Back Button */}
            <button 
                onClick={onBack}
                className="flex items-center gap-3 text-gray-800 font-bold text-sm mb-6 hover:opacity-80 transition-opacity"
            >
                <ArrowLeft size={16} strokeWidth={2.5} />
                <span>Edit Profile</span>
            </button>

            <form onSubmit={handleSaveChanges} className="space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <User size={16} />
                        </span>
                        <input 
                            type="text" 
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none text-xs font-semibold transition-all"
                            placeholder="Enter your full name"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone</label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Phone size={16} />
                        </span>
                        <input 
                            type="text" 
                            name="phoneNumber"
                            required
                            value={formData.PhoneNumber}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none text-xs font-semibold transition-all"
                            placeholder="+977 98XXXXXXXX"
                        />
                    </div>
                </div>

                {/* Address Fields */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Address (City & Province)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <MapPin size={14} />
                            </span>
                            <input 
                                type="text" 
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none text-xs font-semibold transition-all"
                                placeholder="City (e.g. Jhumka)"
                            />
                        </div>
                        <input 
                            type="text" 
                            name="province"
                            required
                            value={formData.province}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none text-xs font-semibold transition-all"
                            placeholder="Province (e.g. Koshi)"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#00B56A] text-white py-3 mt-4 rounded-xl font-bold hover:bg-[#009e5b] transition-all text-sm shadow-md shadow-green-100 disabled:bg-gray-400"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;