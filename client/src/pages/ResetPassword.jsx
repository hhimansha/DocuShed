import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from "axios";
import { toast } from 'react-toastify';


const ResetPassword = () => {

 const {backendUrl}=useContext(AppContext)
 axios.defaults.withCredentials=true

  const navigate=useNavigate()
  const [email,setemail]=useState('')
  const [newPassword,setNewpassword]=useState('')
  
  const [isemailsent ,setisemailsend]=useState('')
  const [otp ,setotp]=useState(0)
  const [otpsubmit ,setotpsubmit]=useState(false)


  const inputRefs=React.useRef([])

  
    const hadleinput=(e,indext)=>{
      if(e.target.value.length >0 && indext<inputRefs.current.length-1){
        inputRefs.current[indext+1].focus();
      }
  
    }
     
    const hadlekeyDown =(e,index)=>{
      if(e.key === 'Backspace' && e.target.value === ''&& index >0){
        inputRefs.current[index-1].focus();
      }
    }
  
    const handlePast = (e)=>{
      const paste =e.clipboardData.getData('text')
      const pasteArray=paste.split('');
      pasteArray.forEach((Char,index)=>{
         if(inputRefs.current[index]){
          inputRefs.current[index].value=Char;
         }
      })
    }

    const onsubmitemail = async (e)=>{
      e.preventDefault();
      try {
        const {data} =await axios.post(backendUrl +'/api/auth/send-reset-otp',{email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setisemailsend(true)
      } catch (error) {
        toast.error(error.message)
      }
    }

    const onSubmitOTP = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const enteredOtp = otpArray.join('');
    
      try {
        const { data } = await axios.post(backendUrl + '/api/auth/verifyResetOtp', { email, otp: enteredOtp });
    
        if (data.success) {
          setotp(enteredOtp);
          setotpsubmit(true);  // Move to the new password form only if OTP is correct
          toast.success(data.message);
        } else {
          toast.error(data.message);  // Show an error if OTP is wrong
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    

    const onsubmitnewpassword = async (e)=>{
      e.preventDefault();
      try {
        const {data} =await axios.post(backendUrl +'/api/auth/reset-password',{email,otp,newPassword})
        data.success ? toast.success(data.message):toast.error(data.message)
        data.success && navigate('/login')



      } catch (error) {
        toast.error(error.message)
        
      }
    }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-white to-white '>
       
       {!isemailsent &&
       <form onSubmit={onsubmitemail} className='bg-white p-8 rounded-lg shadow-lg w-96 text-sm border-2 border-black'>
       <h1 className='text-black text-2xl font-semibold text-center mb-4'>Reset password</h1>
       <p className='text-center mb-6 text-black0'>Enter your registed emil address</p>
       <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-white'>
        
         <input
            className="border border-gray-300 rounded w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email" placeholder='Email'
            onChange={(e) => setemail(e.target.value)}
            value={email}
            required
          />
    
       </div>
       <button className='bg-indigo-600 text-white w-full py-3 rounded-md text-base mt-4 hover:bg-indigo-700 transition duration-200'>Submit</button>
       </form>
       }
      
      {!otpsubmit && isemailsent &&
      <form  onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' >
      <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password OTP</h1>
      <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
       <div className='flex justify-between mb-8' onPaste={handlePast}>
        {
         Array(6).fill(0).map((_,indext)=>(
          <input type="text" maxLength='1' key={indext} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' 
          ref={e=>inputRefs.current[indext]=e}
          onInput={(e)=>hadleinput(e,indext)}
          onKeyDown={(e)=> hadlekeyDown(e,indext)}
          />
         ))
        }

      

       </div>
       <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>submit</button>
    
     </form>
      }
      
      {otpsubmit && isemailsent &&
       <form onSubmit={onsubmitnewpassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
       <h1 className='text-white text-2xl font-semibold text-center mb-4'>New password</h1>
       <p className='text-center mb-6 text-indigo-300'>Enter new password below</p>
       <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
         <img src={assets.lock_icon} alt="" className='w-3 h-3' />
         <input type="password" placeholder='password ' className='bg-transparent outline-none text-white' value={newPassword} onChange={e => setNewpassword(e.target.value)} required />
    
       </div>
       <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
       </form>
      }
      
      
       
     
     

       

    </div>
  )
}

export default ResetPassword