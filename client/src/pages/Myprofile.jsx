//import React from 'react';
import React, { useContext, useEffect, useState } from 'react'

import { AppContext } from '../Context/AdminAppContext'
import { assets } from '@/assets/assets_admin/assets';
const MyProfile = () => {
      const { userdata } = useContext(AppContext) 
  return (
    <div className="flex flex-col items-center p-10 min-h-screen bg-white border-4">
      <div >

      <img src={userdata.image ? userdata.image : assets.upload_area} alt="Profile" />


        
      </div>

      <div className="w-full max-w-md">
        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Contact Information</h2>
          <div className="mb-2">
            <span className="font-semibold">name:</span>{' '}
            <span className="text-blue-600">{userdata.name}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Email:</span>{' '}
            <span className="text-blue-600">{userdata.email}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Address:</span>{' '}
            <span> - </span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">Basic Information</h2>
          <div className="mb-2">
            <span className="font-semibold">Gender:</span>{' '}
            <span>Not Selected</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Birthday:</span>{' '}
            <span>Not Selected</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="px-6 py-2 border rounded-full text-blue-600 border-blue-600 hover:bg-blue-50">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
