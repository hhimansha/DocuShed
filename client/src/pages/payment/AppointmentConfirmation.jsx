import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';


const AppointmentConfirmation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl} = useContext(AppContext);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(backendUrl + `/api/auth/appointments/${appointmentId}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setAppointment(response.data.appointment);
        } else {
          setError('Failed to load appointment details');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Calculate total amount
  const totalAmount = appointment?.amount || 0;

  // Initialize PayHere payment
  const handlePayment = async () => {
    if (!appointment) return;
    
    setIsProcessing(true);
    try {
      const response = await axios.post(backendUrl + '/api/payments/initiate', {
        appointmentId: appointment._id,
        doctorId: appointment.doctor._id,
        userId: appointment.patient._id,
        amount: totalAmount,
        doctorName: appointment.docData?.name || 'Doctor',
        userFirstName: appointment.userData?.name?.split(' ')[0] || 'User',
        userLastName: appointment.userData?.name?.split(' ')[1] || '',
        userEmail: appointment.userData?.email || '',
        userPhone: appointment.userData?.phone || ''
      }, {
        withCredentials: true
      });

      // Load PayHere script dynamically
      const script = document.createElement('script');
      script.src = `https://www.payhere.lk/lib/payhere.js`;
      script.async = true;
      
      script.onload = () => {
        window.payhere.onCompleted = function() {
          navigate('/payment-success');
        };
        
        window.payhere.onDismissed = function() {
          setIsProcessing(false);
        };
        
        window.payhere.onError = function() {
          setIsProcessing(false);
          alert('Payment failed. Please try again.');
        };
        
        window.payhere.startPayment(response.data.paymentData);
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      alert(error.response?.data?.error || 'Payment initialization failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!appointment) {
    return <div className="min-h-screen flex items-center justify-center">Appointment not found</div>;
  }

  // Format date and time
  const [day, month, year] = appointment.slotDate.split('_');
  const appointmentDate = new Date(year, month - 1, day);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8 lg:px-24">
    <div className="max-w-5xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002284] to-indigo-800 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Appointment Confirmation</h1>
          <p className="mt-2 text-indigo-200 text-sm">Please review and confirm your appointment details below</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Doctor Card */}
            <div className="lg:w-1/3">
              <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white transition hover:shadow-lg">
                <img 
                  src={appointment.docData?.image} 
                  alt={appointment.docData?.name}
                  className="w-full h-72 object-cover"
                />
                <div className="p-5 space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">{appointment.docData?.name}</h2>
                  <p className="text-sm text-[#002284] font-medium">{appointment.docData?.speciality}</p>
                  <div className="pt-2 border-t text-sm text-gray-700">
                    <span className="block">Appointment Fee:</span>
                    <span className="text-lg font-semibold">LKR {appointment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:w-2/3">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Appointment Summary</h3>

                <div className="space-y-5 text-base text-gray-700">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{formattedDate}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{appointment.slotTime}</span>
                  </div>

                  <div className="border-t border-gray-300 my-4"></div>

                  <div className="flex justify-between text-lg font-semibold text-indigo-700">
                    <span>Total Amount:</span>
                    <span>LKR {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || appointment.payment}
                    className={`w-full max-w-xs mx-auto py-3 px-5 rounded-lg text-lg font-medium shadow-md transition ${
                      isProcessing
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : appointment.payment
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-[#002284] hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {appointment.payment ? (
                      'Payment Completed'
                    ) : isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>

                  <p className="mt-3 text-sm text-gray-500">
                    {appointment.payment
                      ? 'Your payment has been successfully processed'
                      : "You'll be redirected to PayHere for secure payment"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  </div>
  );
};

export default AppointmentConfirmation;