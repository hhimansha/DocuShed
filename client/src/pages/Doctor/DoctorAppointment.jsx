import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '@/assets/assets_admin/assets';

const DoctorAppointments = () => {
  const { userdata,  Appointments=[]  , getDoctorAppointments, currencysymbol,cancelAppointment, completeAppointment } = useContext(AppContext);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

  useEffect(() => {
    console.log("useEffect triggered. userData:", userdata);
    if (userdata) {
      console.log("Calling getDoctorAppointments...");
      getDoctorAppointments();
    }
  }, [userdata]);
  



  return (
    <div className='w-full max-w-6xl m-5'>
    <p className='mb-3 text-lg font-medium'>All Appointments</p>
  
    <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
      {/* Table Header with grid layout */}
      <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
        <p>#</p>
        <p>Patient</p>
        <p>Payment</p>
        <p>Date & Time</p>
        <p>Fees</p>
        <p>Action</p>
      </div>
  
      {/* Table Rows with grid layout */}
      {Appointments.reverse().map((item, index) => (
        <div
          className='grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
          key={index}
        >
          {/* Index */}
          <p>{index + 1}</p>
  
          {/* Patient */}
          <div className='flex items-center gap-2'>
            <img
              src={item.userData.image}
              className='w-10 rounded-full'
              alt=""
            />
            <p>{item.userData.name}</p>
          </div>
  
          {/* Payment */}
          <div>
            <p className='text-xs inline border border-primary px-2 rounded-full'>
              {item.payment}
            </p>
          </div>
  
          {/* Date & Time */}
          <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
  
          {/* Fees */}
          <p>{currencysymbol}{item.amount}</p>
  
          {/* Action */}
          {item.cancelled ? (
            <p className='text-red-400 text-xs font-medium'>Cancelled</p>
          ) : item.isCompleted ? (
            <p className='text-green-500 text-xs font-medium'>Completed</p>
          ) : (
            <div className='flex'>
              <img
                onClick={() => cancelAppointment(item._id)}
                className='w-10 cursor-pointer'
                src={assets.cancel_icon}
                alt=""
              />
              <img
                onClick={() => completeAppointment(item._id)}
                className='w-10 cursor-pointer'
                src={assets.tick_icon}
                alt=""
              />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default DoctorAppointments;
