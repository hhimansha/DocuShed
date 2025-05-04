import React, { useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Make sure you're using this for cookie handling

const Emailverify = () => {
  const inputRefs = useRef([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle OTP input change, ensure only digits are entered
  const handleInput = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only digits
    e.target.value = value;

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus(); // Move focus to the next input
    }
  };

  // Handle Backspace to move focus to the previous input
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event to allow only digits
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // Submit OTP to the backend for verification
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map((input) => input.value).join(''); // Collect OTP from input fields
    console.log('Entered OTP:', otp);

    try {
      const userEmail = Cookies.get('userEmail'); // Get email from cookies

      if (!userEmail) {
        setError('No email found. Please try again.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { otp, userEmail });

      if (response.data.success) {
        setSuccess(true);
        setError(null);
        alert('OTP verified successfully');
        // Redirect or proceed after successful OTP verification
      } else {
        setError(response.data.message); // Display the error message from the backend
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // Provide more context about the error message
      setError(error.response?.data?.message || 'Failed to verify OTP');
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={onSubmitOTP} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Verification Code</h1>
        <p className="text-gray-500 mt-2">Enter the 6-digit code sent to your email</p>
      </div>

      {/* Error message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Success message */}
      {success && <div className="text-green-500 text-center mb-4">OTP verified successfully!</div>}

      {/* OTP Input Fields */}
      <div className="flex justify-between mb-8 gap-2" onPaste={handlePaste}>
        {Array(6).fill(0).map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-12 h-12 text-center text-xl font-medium bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            ref={(el) => (inputRefs.current[index] = el)}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            required
          />
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
      >
        Verify Code
      </button>
    </form>
  );
};

export default Emailverify;
