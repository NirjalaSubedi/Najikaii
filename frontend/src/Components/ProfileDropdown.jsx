import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const ProfileDropdown = ({ onClose }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Error parsing user data from localStorage:", error);
                }
            }
        };

        fetchUserData();

        window.addEventListener('storage', fetchUserData);
        return () => {
            window.removeEventListener('storage', fetchUserData);
        };
    }, []);

    if (!user) return null;

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const userPhone = user?.phone || user?.phonenumber || user?.phoneNumber || user?.rawUser?.PhoneNumber || user?.rawUser?.phoneNumber;
    const userAddress = user?.address || user?.Address || user?.rawUser?.Address || user?.rawUser?.address;

    return (
        <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <button 
                onClick={onClose}
                className="flex items-center gap-3 text-gray-800 font-bold text-sm mb-6 hover:opacity-80 transition-opacity"
            >
                <ArrowLeft size={16} strokeWidth={2.5} />
                <span>My Profile</span>
            </button>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#00B56A] text-white flex items-center justify-center rounded-2xl font-bold text-xl tracking-wider">
                    {getInitials(user?.name)}
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                        {user?.name || 'User Name'}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-50 text-[#00B56A] font-bold text-xs rounded-full">
                        {user?.role || 'Customer'}
                    </span>
                </div>
            </div>

            <div className="space-y-4 border-t border-gray-50 pt-5 mb-6">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                        <Mail size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">
                            {user?.email || 'No email attached'}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                        <Phone size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">
                            {userPhone && userPhone !== "" ? userPhone : '+977 98XXXXXXXX'}
                        </p>
                    </div>
                </div>

                
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                        <MapPin size={16} />
                    </div>
                <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                    {userAddress && typeof userAddress === 'object' 
                        ? `${userAddress.city || ''}${userAddress.city && userAddress.province ? ', ' : ''}${userAddress.province || ''}` || 'Not Provided'
                        : (userAddress || 'Not Provided')
                    }
                </p>
            </div>
        </div>

                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                        <Calendar size={16} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Joined</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">
                            {user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2026-01-15'}
                        </p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => alert("Redirect to Edit Profile page")}
                className="w-full bg-[#00B56A] text-white py-3 rounded-2xl font-bold hover:bg-[#009e5b] transition-all text-sm shadow-md shadow-green-100 active:scale-[0.99]"
            >
                Edit Profile
            </button>
        </div>
    );
};

export default ProfileDropdown;