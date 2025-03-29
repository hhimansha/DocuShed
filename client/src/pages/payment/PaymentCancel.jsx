import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment was cancelled');
    // Redirect after a delay
    const timer = setTimeout(() => {
      navigate('/my-appointments');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Your appointment is not confirmed.
        </p>
        <button
          onClick={() => navigate('/my-appointments')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Back to Appointments
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;