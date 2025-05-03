import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '@/assets/assets_admin/assets';

const AllEarnings = () => {
  const { 
    userdata, 
    Payments = [], 
    getAllPayments, 
    currencysymbol 
  } = useContext(AppContext);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  useEffect(() => {
    if (userdata) {
      getAllPayments();
    }
  }, [userdata]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Earnings</p>
    
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        {/* Table Header with grid layout */}
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Doctor</p>
          <p>Patient</p>
          <p>Amount</p>
          <p>Status</p>
          <p>Date</p>
          <p>Payment ID</p>
        </div>
    
        {/* Table Rows with grid layout */}
        {Payments.reverse().map((payment, index) => (
          <div
            className='grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
            key={payment._id}
          >
            {/* Index */}
            <p>{index + 1}</p>
    
            {/* Doctor */}
            <div className='flex items-center gap-2'>
              <img
                src={payment.doctorId.image}
                className='w-10 h-10 rounded-full object-cover'
                alt=""
              />
              <p>{payment.doctorId.name}</p>
            </div>
    
            {/* Patient */}
            <div>
              <p>{payment.userId.name}</p>
              <p className='text-xs text-gray-400'>{payment.userId.email}</p>
            </div>
    
            {/* Amount */}
            <p>{currencysymbol}{payment.amount}</p>
    
            {/* Status */}
            <span className={`text-xs inline px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
              {payment.status}
            </span>
    
            {/* Date */}
            <p>{formatDate(payment.createdAt)}</p>
    
            {/* Payment ID */}
            <p className='text-xs text-gray-400 truncate'>{payment._id.substring(0, 8)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEarnings;