import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Payment completed successfully!');
    // You might want to redirect after a delay
    const timer = setTimeout(() => {
      navigate('/my-appointments');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your appointment has been confirmed. You'll receive a confirmation email shortly.
        </p>
        <p className="text-gray-500 text-sm">
          Redirecting to your appointments...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;