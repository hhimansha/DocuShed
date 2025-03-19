import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Form } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('Login');
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Handle form submission here                                                  
  };

  return (
    <form className="min-h-screen flex items-center justify-center bg-gradient-to-br">
      <div className="flex flex-col gap-6 p-8 min-w-[340px] sm:min-w-[400px] bg-white rounded-xl shadow-lg  border-1">
        <p className="text-2xl font-semibold text-center text-gray-800">
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </p>
        <p className="text-sm text-center text-gray-600">
          Please {state === 'Sign up' ? 'Sign up' : 'Login'} to Book an appointment
        </p>

        {/* Full Name Field */}
         {state === 'Sign up' &&
        <div className="w-full">
          <p className="text-sm text-gray-700">Full Name</p>
          <input
            className="border border-gray-300 rounded w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={Name}
            required
          />
        </div>
}

        {/* Email Field */}
        <div className="w-full">
          <p className="text-sm text-gray-700">Email</p>
          <input
            className="border border-gray-300 rounded w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={Email}
            required
          />
        </div>

        {/* Password Field */}
        <div className="w-full">
          <p className="text-sm text-gray-700">Password</p>
          <input
            className="border border-gray-300 rounded w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={Password}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmitHandler}
          className="bg-indigo-600 text-white w-full py-3 rounded-md text-base mt-4 hover:bg-indigo-700 transition duration-200"
        >
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </button>

        {/* Switch to Sign Up / Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {state === 'Sign up' ? (
            <span
              onClick={() => setState('Login')}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Already have an account? Login here.
            </span>
          ) : (
            <span
              onClick={() => setState('Sign up')}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Don't have an account? Sign up here.
            </span>
          )}
        </p>
      </div>
    </form>
  );
};

export default Login;
