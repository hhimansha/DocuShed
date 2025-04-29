import { assets } from '@/assets/assets_admin/assets'
import React from 'react'

const Doctordashbord = () => {
  return (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        {[
          { icon: assets.earning_icon, label: 'Earnings', value: 0 },
          { icon: assets.appointments_icon, label: 'Appointments', value: 0 },
          { icon: assets.patients_icon, label: 'Patients', value: 0 }
        ].map((item, index) => (
          <div key={index} className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={item.icon} alt={item.label} />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{item.value}</p>
              <p className='text-gray-400'>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white mt-10 rounded border'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img src={assets.list_icon} alt='List Icon' />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4'>
          {[].map((booking, index) => (
            <div key={index} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100'>
              <img className='rounded-full w-10' src={assets.default_avatar} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'></p>
                <p className='text-gray-600'>Booking on </p>
              </div>
              <p className='text-green-500 text-xs font-medium'></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctordashbord
