import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '@/Context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const Login = () => {
  const { backendUrl, setIslogin, getuser } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Login');
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [otpsubmit ,setotpsubmit]=useState(false)


  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
        if (state === 'Login') {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email: Email,
                password: Password
            }, {
                withCredentials: true
            });

            console.log(data); // Debugging

            if (data.status === 'success') {
                const { isAdmin, isStaff } = data;

                // Call once
                await getuser();
                setIslogin(true);

                // Role-based redirect with SweetAlert2
                if (isAdmin) {
                    Swal.fire({
                        title: 'Admin Login Success!',
                        text: 'Redirecting to Admin Dashboard...',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/admin/dashbord';
                    });

                } else if (isStaff) {
                    Swal.fire({
                        title: 'Doctor Login Success!',
                        text: 'Redirecting to Doctor Dashboard...',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/doctordashed';
                    });

                } else {
                    Swal.fire({
                        title: 'Login Successful!',
                        text: 'Redirecting to Home...',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        window.location.href = '/';
                    });
                }
            }

        } else {
            // Sign up logic with Toast
            const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
                name: Name,
                email: Email,
                password: Password
            });

            if (data.success === true) {
                toast.success("Account Created! Please Login");
                setState('Login');
            }
        }
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || "Something went wrong!",
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Try Again'
        });
    }
};



  return (
    <form className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      <div className="flex flex-col gap-6 p-8 min-w-[340px] sm:min-w-[400px] bg-white rounded-xl shadow-lg border-1 border-2 border-black">
        <p className="text-2xl font-semibold text-center text-gray-800">
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </p>
        <p className="text-sm text-center text-gray-600">
          Please {state === 'Sign up' ? 'Sign up' : 'Login'} to Book an appointment
        </p>

        {state === 'Sign up' && (
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
        )}

        <div className="w-full ">
          <p className="text-sm text-gray-700 ">Email</p>
          <input
            className="border border-gray-300 rounded w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={Email}
            required
          />
        </div>

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

        {state === "Login" && (
      <p
      className="text-indigo-600 cursor-pointer hover:underline"
      onClick={() => {
        navigate('/reset-password');
        window.location.href = '/reset-password';
      }}
    >
      Forget password
    </p>
    
        )}
        <button
          onClick={onSubmitHandler}
          className="bg-indigo-600 text-white w-full py-3 rounded-md text-base mt-4 hover:bg-indigo-700 transition duration-200"
        >
          {state === 'Sign up' ? 'Create Account' : 'Login'}
        </button>

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
      <ToastContainer position="top-right" autoClose={2000} />

     



    </form>
  );
};

export default Login;
