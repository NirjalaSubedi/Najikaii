import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import AuthHero from '../Components/AuthSidebar';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Signup page bata pathako email access gareko, yedi chhaina bhane safe fallback
    const email = location.state?.email || "your email"; 

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const inputRefs = useRef([]);

    // Countdown Timer Logic
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Handle OTP input change and auto-focus
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false; // Number matrai allow garne

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Value type huna sath automatic next box ma focus lane
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle Backspace deletion and focus movement
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Verify OTP API Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const otpString = otp.join("");
        if (otpString.length < 6) {
            setError("Please enter complete 6-digit OTP code.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                email,
                otp: otpString
            });

            if (res.data.success) {
                setSuccess("Account verified successfully! Redirecting...");
                setTimeout(() => {
                    navigate('/login'); // Verify bhayesi Login page ma redirect
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP code.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP Handle
    const handleResend = async () => {
        setError('');
        setSuccess('');
        
        try {
            const res = await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
            if (res.data.success) {
                setSuccess("A new OTP has been sent to your email.");
                setTimer(60); // Reset timer back to 60s
                setOtp(new Array(6).fill("")); // Clear boxes
                inputRefs.current[0].focus();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    return (
            <div className="w-full lg:w-1/2 h-full overflow-y-auto px-8 lg:px-20 py-12 flex flex-col justify-center items-center">
                <div className="w-full max-w-md">
                    
                    <div className="mb-8 text-center lg:text-left">
                        <div className="inline-flex p-3 bg-green-50 rounded-2xl text-[#00B56A] mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Verify your email</h2>
                        <p className="text-sm text-gray-500">
                            We've sent a 6-digit verification code to <span className="font-semibold text-gray-700">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs rounded-xl border border-green-100">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Boxes Grid */}
                        <div className="flex justify-between gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e.key, index)}
                                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 focus:border-[#00B56A] focus:ring-4 focus:ring-[#00B56A]/10 outline-none transition-all bg-gray-50/50"
                                />
                            ))}
                        </div>

                        {/* Submit Action Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00B56A] text-white py-3 rounded-xl font-bold hover:bg-[#009e5b] transition-all shadow-lg shadow-green-100 active:scale-[0.98] disabled:bg-gray-400 text-sm"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>

                    {/* Resend Logic and Timer Section */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        {timer > 0 ? (
                            <p>Resend code in <span className="text-gray-900 font-bold">{timer}s</span></p>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="inline-flex items-center gap-2 text-[#00B56A] font-bold hover:underline group"
                            >
                                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
                                Resend OTP Code
                            </button>
                        )}
                    </div>

                    {/* Back Link to registration */}
                    <div className="mt-6 text-center">
                        <Link to="/signup" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                            <ArrowLeft size={14} /> Back to Sign Up
                        </Link>
                    </div>

                </div>
            </div>
    );
};

export default VerifyOtp;