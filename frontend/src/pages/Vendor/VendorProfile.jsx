import axios from 'axios';
import { useEffect, useState } from 'react';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/auth/MyProfileInfo', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data.userInfo);
                const { location, ...rest } = response.data.userInfo;
                setFormData(rest);
            } catch (error) {
                console.error("Profile fetch error:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'shopImage') {
            const file = e.target.files[0];
            setFormData({ ...formData, shopImage: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'location' && formData[key] !== undefined) data.append(key, formData[key]);
            });

            const response = await axios.put('http://localhost:5000/api/auth/update-userProfile', data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setProfile(response.data.user);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile.");
        }
    };

    if (!profile) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            <div className="space-y-6">
                {/* Image Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Shop Showcase Image *</label>
                    <div className="flex items-center gap-6">
                        <img src={imagePreview || `http://localhost:5000/${profile.shopImage}`} alt="Shop" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
                        {isEditing && <input type="file" name="shopImage" onChange={handleInputChange} className="text-sm text-gray-500" />}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Full Name *</label>
                        <input name="name" disabled={!isEditing} defaultValue={profile.name} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                        <input name="PhoneNumber" disabled={!isEditing} defaultValue={profile.PhoneNumber} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-500" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Address *</label>
                    <input name="Address" disabled={!isEditing} defaultValue={typeof profile.Address === 'object' ? profile.Address.city : profile.Address} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-500" />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Shop Name *</label>
                    <input name="shopName" disabled={!isEditing} defaultValue={profile.shopName} onChange={handleInputChange} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-emerald-500" />
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                {isEditing ? (
                    <>
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleUpdate} className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Save Changes</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default Profile;