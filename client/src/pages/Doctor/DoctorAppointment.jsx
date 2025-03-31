import React from 'react'

const DoctorAppointment = () => {
  return (
    <div className='w-full max-w-6xl m-5 '>

    <p className='mb-3 text-lg font-medium'>All Appointments</p>

    <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
      <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
        <p>#</p>
        <p>Patient</p>
        <p>Age</p>
        <p>Date & Time</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Action</p>
      </div>
    
        <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' >
          <p className='max-sm:hidden'></p>
          <div className='flex items-center gap-2'>
            <img src='' className='w-8 rounded-full' alt="" /> <p></p>
          </div>
          <p className='max-sm:hidden'></p>
          <p></p>
          <div className='flex items-center gap-2'>
            <img src='' className='w-8 rounded-full bg-gray-200' alt="" /> <p></p>
          </div>
          <p></p>
            

        </div>
     
    </div>

  </div>
  )
}

export default DoctorAppointment