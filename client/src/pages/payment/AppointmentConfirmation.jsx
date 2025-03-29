import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppointmentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [appointment, setAppointment] = useState({
    doctor: {
      id: '67de99784ca990e4c2e054a3',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      image: 'https://res.cloudinary.com/dioir4ydv/image/upload/v1742641529/h9ny4qyzr0aohxxvk5be.png',
      hourlyRate: 5000, // LKR
    },
    date: '2023-11-15',
    time: '14:30 - 15:00',
    duration: 0.5, // hours
    user: {
      id: '67e66a0e01744f4d2de6b916',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0771234567'
    }
  });

  // Calculate total amount
  const totalAmount = appointment.doctor.hourlyRate * appointment.duration;

  // Initialize PayHere payment
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post('http://localhost:5000/api/payments/initiate', {
        appointmentId: '67df0c15d07116292701cdff', // Replace with actual appointment ID
        doctorId: appointment.doctor.id,
        userId: appointment.user.id,
        amount: totalAmount,
        doctorName: appointment.doctor.name,
        userFirstName: appointment.user.name.split(' ')[0],
        userLastName: appointment.user.name.split(' ')[1] || '',
        userEmail: appointment.user.email,
        userPhone: appointment.user.phone
      });

      // Load PayHere script dynamically
      const script = document.createElement('script');
      script.src = `https://www.payhere.lk/lib/payhere.js`;
      script.async = true;
      
      script.onload = () => {
        // Initialize PayHere checkout
        window.payhere.onCompleted = function(onCompleted) {
          // Handle successful payment
          navigate('/payment-success');
        };
        
        window.payhere.onDismissed = function(onDismissed) {
          // Handle dismissed payment
          setIsProcessing(false);
        };
        
        window.payhere.onError = function(onError) {
          // Handle error
          setIsProcessing(false);
          alert('Payment failed. Please try again.');
        };
        
        // Start payment
        window.payhere.startPayment(response.data.paymentData);
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      alert('Payment initialization failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Appointment Confirmation</h1>
            <p className="mt-1 text-indigo-200">Review your appointment details before payment</p>
          </div>
          
          {/* Appointment Details */}
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Doctor Info */}
              <div className="md:w-1/3">
                <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <img 
                    src={appointment.doctor.image} 
                    alt={appointment.doctor.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{appointment.doctor.name}</h2>
                    <p className="text-indigo-600">{appointment.doctor.specialization}</p>
                    <div className="mt-2">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="ml-2 font-medium">LKR {appointment.doctor.hourlyRate.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Appointment Summary */}
              <div className="md:w-2/3">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{appointment.duration} hour(s)</span>
                    </div>
                    
                    <div className="border-t border-gray-200 my-4"></div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-medium">LKR {appointment.doctor.hourlyRate.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-indigo-700">LKR {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className='flex '>
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className={`w-80 justify-end flex py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Proceed to Payment'}
                    </button>
                    </div>
                    
                    <p className="mt-3 text-center text-sm text-gray-500">
                      You'll be redirected to PayHere for secure payment processing
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