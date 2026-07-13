import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2, ShoppingBag, Home } from 'lucide-react';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your eSewa transaction security context...');
  const [orderDetails, setOrderDetails] = useState(null);
  const [failureCode, setFailureCode] = useState('');

  useEffect(() => {
    const verifyTransaction = async () => {
      const queryParams = new URLSearchParams(location.search);
      const explicitStatus = queryParams.get('status');
      const encodedData = queryParams.get('data');
      const reason = queryParams.get('reason');
      const detail = queryParams.get('detail');
      const orderIdFromUrl = queryParams.get('orderId'); 

      const reasonMessageMap = {
        missing_data: 'Payment response data bhetiyena. Please retry from checkout.',
        incomplete_status: 'Payment complete status ma pugena. eSewa ma transaction completion check garnus.',
        signature_mismatch: 'Payment signature verify garna milena. Please retry from checkout.',
        invalid_order_id: 'Order reference invalid chha. Please retry from checkout.',
        order_not_found: 'Order record bhetiyena. Please create order again from checkout.',
        amount_mismatch: 'Payment amount ra order total mismatch bhayo. Please retry from checkout.',
        server_error: 'Verification server error aayo. Please retry in a moment.',
        gateway_failed: 'eSewa gateway le transaction reject garyo. Please retry payment.'
      };

      if (explicitStatus === 'success') {
        setStatus('success');
        setMessage('Payment successfully verified.');
        if (orderIdFromUrl) {
          setOrderDetails({ _id: orderIdFromUrl, id: orderIdFromUrl });
        }
        localStorage.removeItem('checkoutItems');
        return;
      }

      if (explicitStatus === 'failed' || explicitStatus === 'cancelled') {
        setStatus('error');
        setFailureCode(reason || explicitStatus);

        console.error('[Payment Failed]', {
          status: explicitStatus,
          reason,
          detail,
          query: Object.fromEntries(queryParams.entries()),
        });

        const detailMessage = detail ? ` (detail: ${detail})` : '';
        setMessage((reasonMessageMap[reason] || 'Payment complete bhayena. Tapai le फेरि try garna saknuhuncha.') + detailMessage);
        return;
      }

      if (encodedData) {
        try {
          const response = await axios.post('http://localhost:5000/api/payment/verify-esewa', 
            { data: encodedData },
            {
              withCredentials: true,
              headers: getAuthHeaders(),
            }
          );

          if (response.data?.success) {
            setStatus('success');
            setMessage('Payment successfully verified via eSewa secure channels!');
            setOrderDetails(response.data.order);
            localStorage.removeItem('checkoutItems');
          } else {
            setStatus('error');
            setFailureCode('verification_rejected');
            setMessage(response.data?.message || 'Transaction declaration rejected by backend.');
          }
        } catch (err) {
          console.error('Verification workflow crashed:', err);
          setStatus('error');
          setFailureCode('network_exception');
          setMessage(err.response?.data?.message || 'Network exception during confirmation.');
        }
        return;
      }

      setStatus('error');
      setFailureCode('missing_data');
      setMessage('Payment response data bhetiyena. Please retry from checkout.');
    };

    verifyTransaction();
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f8fb] px-4 font-sans text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl">
        
        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#00B56A]">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Verifying Payment</h2>
            <p className="text-sm font-semibold text-slate-500 leading-relaxed">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#00B56A]">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-emerald-600">Payment Successful!</h2>
              <p className="text-sm font-semibold text-slate-500">{message}</p>
            </div>

            {orderDetails && (
              <div className="rounded-2xl bg-slate-50 p-4 text-left text-sm space-y-2 border border-slate-100">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Order ID:</span>
                  <span className="font-bold text-slate-700 font-mono text-xs">{orderDetails._id || orderDetails.id}</span>
                </div>
                {orderDetails.totalAmount && (
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Total Paid:</span>
                    <span className="font-black text-[#00B56A]">Rs. {orderDetails.totalAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Status:</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">Paid</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link to="/" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm">
                <Home size={16} /> Home
              </Link>
              <button onClick={() => navigate('/my-orders')} className="flex items-center justify-center gap-2 rounded-xl bg-[#00B56A] px-4 py-3 text-sm font-black text-white shadow-md shadow-emerald-500/10 transition hover:bg-[#009E5B]">
                <ShoppingBag size={16} /> My Orders
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <XCircle className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-rose-600">Payment Failed</h2>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">{message}</p>
              {failureCode && (
                <p className="text-xs font-bold uppercase tracking-wide text-rose-500">Error Code: {failureCode}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button onClick={() => navigate('/checkout')} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800">
                Try Checkout Again
              </button>
              <Link to="/" className="text-xs font-bold text-slate-400 hover:text-slate-600 underline pt-2">
                Back to Home Screen
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;