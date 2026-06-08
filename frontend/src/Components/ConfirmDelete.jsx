import React, { useEffect, useState, useRef } from 'react'; // useRef थप्नुहोस्
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ConfirmDelete = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  
  const apiCalled = useRef(false);

  useEffect(() => {
    if (apiCalled.current) return;

    const verifyAndDelete = async () => {
      apiCalled.current = true;
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/confirm-delete/${token}`);
        
        if (res.status === 200) {
          setStatus('success');
          toast.success("Tapaiko account permanent delete bhayo!");
          
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login"; 
          }, 3000);
        }
      } catch (err) {
        setStatus('error');
        console.error(err);
        toast.error(err.response?.data?.message || "Link expire bhayo wa kunai samasya aayo.");
      }
    };

    if (token) {
      verifyAndDelete();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] font-sans px-4">
      <div className="max-w-md w-full text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-slate-100">
        
        {status === 'processing' && (
          <>
            <div className="w-12 h-12 border-4 border-[#00B56A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-black text-slate-800">Account Deleting...</h2>
            <p className="text-sm text-slate-500 mt-2">Kripaya kehi ber parkhinuhoas, database bata delete hudaii chha.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-50 text-[#00B56A] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <h2 className="text-2xl font-black text-green-600">Successfully Deleted!</h2>
            <p className="text-sm text-slate-600 mt-2">Tapaiko account permanent delete bhaisakyo.</p>
            <p className="text-xs text-slate-400 mt-4">Redirecting to login page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✕</div>
            <h2 className="text-xl font-black text-red-600">Link Expired or Invalid!</h2>
            <p className="text-sm text-slate-500 mt-2">Yo session token expire bhaisakyo wa account pahile nai delete bhaisakyo.</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-6 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDelete;