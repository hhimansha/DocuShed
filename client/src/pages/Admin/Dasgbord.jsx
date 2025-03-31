import { assets } from '@/assets/assets_admin/assets';
import { AppContext } from '@/Context/AppContext'
import React, { useContext, useEffect } from 'react'

const Dasgbord = () => {
  const { dashData,getdahdata,userdata}=useContext(AppContext);
   
useEffect(()=>{
if(userdata.role==="admin"){
  getdahdata();
}
 
},[userdata])

  return dashData && (
    <div className='m-5'>
    <div className='flex flex-wrap gap-3'>
      <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.doctor_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
          <p className='text-gray-400'>Doctors</p>
        </div>
      </div>
     
      <div  className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.appointment_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>0</p>
          <p className='text-gray-400'>Appointment</p>
        </div>
      </div>

      <div  className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.patients_icon} alt="" />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
          <p className='text-gray-400'>patients</p>
        </div>
      </div>
    </div>
    <div className='bg-white'>
      <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
       <img src={assets.list_icon} alt="" />
       <p className='font-semibold'>Lates Booking</p>

      </div>
      <div className='pt-4 border border-t-0'>
       
      

      </div>
    </div>

    </div>
  )
}

export default Dasgbord