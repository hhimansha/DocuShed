import React, { useContext, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from "axios"
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [otpSubmit, setOtpSubmit] = useState(false)

  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }
     
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }
  
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
    const enteredOtp = otpArray.join('')
  
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verifyResetOtp', { email, otp: enteredOtp })
  
      if (data.success) {
        setOtp(enteredOtp)
        setOtpSubmit(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }
  
  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-md px-6 py-8">
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
              <p className="text-gray-500 mt-2">Enter your registered email address</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Send Reset Link
            </button>
            
            <div className="text-center mt-6">
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
        
        {isEmailSent && !otpSubmit && (
          <form onSubmit={onSubmitOTP} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Verification Code</h1>
              <p className="text-gray-500 mt-2">Enter the 6-digit code sent to your email</p>
            </div>
            
            <div className="flex justify-between mb-8 gap-2" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl font-medium bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required
                />
              ))}
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Verify Code
            </button>
            
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                Didn't receive the code?{' '}
                <button 
                  type="button"
                  onClick={onSubmitEmail}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Resend
                </button>
              </p>
            </div>
          </form>
        )}
        
        {isEmailSent && otpSubmit && (
          <form onSubmit={onSubmitNewPassword} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">New Password</h1>
              <p className="text-gray-500 mt-2">Create a strong password for your account</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword