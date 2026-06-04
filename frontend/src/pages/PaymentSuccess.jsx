import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const navigate = useNavigate();

  // URL query string bata base64 data parameter fetch garne
  const dataToken = searchParams.get('data');

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!dataToken) {
        setStatus('error');
        return;
      }

      try {
        // Backend eSewa validation endpoint call garne (Hamile agi banako dynamic hook API)
        // Note: Response query check mapping path context verification configuration regex array check
        const response = await axios.get(`http://localhost:5000/api/payment/esewa-verify?data=${dataToken}`);

        if (response.data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error("Verification error client route:", err);
        setStatus('error');
      }
    };

    verifyTransaction();
  }, [dataToken]);

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader className="animate-spin text-[#00B56A] mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-700">Verifying Payment...</h2>
        <p className="text-sm text-gray-400">Please do not close or refresh the window.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-black text-red-500 mb-2">Payment Verification Failed!</h2>
          <p className="text-sm text-gray-500 mb-6">Signature mismatch vayo wa valid record database pipeline ma bhetiyena.</p>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            Go Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-emerald-50">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-[#00B56A]" size={64} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Order Confirmed!</h2>
        <p className="text-sm text-[#00B56A] font-bold bg-emerald-50 py-1.5 px-4 rounded-full inline-block mb-6">
          Payment Successfully Verified
        </p>
        <p className="text-xs text-gray-500 mb-6">
          Timro location coordinate basis ma najikai vendor le delivery process initiate gari sakeko chha.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-[#00B56A] hover:bg-[#009E5B] text-white py-3.5 rounded-2xl font-extrabold shadow-lg shadow-emerald-700/10 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;