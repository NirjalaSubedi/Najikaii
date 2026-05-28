import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import AuthHero from '../Components/AuthSidebar';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleRoleBasedRedirect = (userObj) => {
        const userRole = userObj?.role;

        if (userRole === 'Admin') {
            navigate('/admin/dashboard'); 
        } else if (userRole === 'Vendor') {
            navigate('/vendor/dashboard');
        } else {
            navigate('/'); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            if (res.data.success) {
                toast.success("Login Successful!");
                
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                setTimeout(() => {
                    handleRoleBasedRedirect(res.data.user);
                }, 1500);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid email or password';
            setError(errorMsg);            
            toast.error(errorMsg);
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
                toast.success("Logged in via Google successfully!");
                
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                
                setTimeout(() => {
                    handleRoleBasedRedirect(res.data.user);
                }, 1500);
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            const googleError = error.response?.data?.message || "Google Authentication failed!";
            setError(googleError);
            toast.error(googleError);
        }
    };

    return (
        <div className="flex min-h-screen font-sans bg-white">
            {/* Left Side: Hero Section */}
            <AuthHero />

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-20 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back!</h2>
                        <p className="text-gray-500">Sign in to continue shopping</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input 
                                    type="email" 
                                    name="email" 
                                    required 
                                    value={formData.email} 
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="you@example.com" 
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-semibold text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-xs font-medium text-[#00B56A] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B56A] transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    required 
                                    value={formData.password} 
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-12 py-2.5 rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    placeholder="••••••••" 
                                />
                                <button
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00B56A]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#00B56A] text-white py-3 rounded-xl font-bold hover:bg-[#009e5b] transition-all shadow-lg shadow-green-100 active:scale-[0.98] disabled:bg-gray-400 text-sm"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
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
                            width="380"
                        />
                    </div>

                    {/* Redirecting to Signup */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account? <Link to="/signup" className="text-[#00B56A] font-bold hover:underline">Sign Up</Link>
                    </p>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
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