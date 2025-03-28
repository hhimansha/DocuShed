import { assets } from '@/assets/assets';
import { AppContext } from '@/Context/AppContext'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DoctorsList = () => {
  const { gealldoctos, Doctors, userdata, changeAvailability,deletedoctor } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userdata) {
      gealldoctos();
    }
  }, [userdata]);

  // Filter doctors based on search term
  const filteredDoctors = Doctors.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDelete = (doctorId) => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this doctor?</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              deletedoctor(doctorId);
              toast.dismiss();
             
            }}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };
  


  return (
    <div className='m-5 max-h-[90vh] overflow-scroll'>
      <h1 className='text-lg font-medium mb-3'>All Doctors</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search doctors by name or speciality..."
        className="w-full max-w-sm p-2 border border-gray-300 rounded mb-5 outline-none focus:border-indigo-400 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className='w-full flex flex-wrap gap-4 pt-2 gap-y-6'>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((item, index) => (
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img className='bg-blue-50 w-65 h-75 object-cover group-hover:bg-indigo-400 transition-all duration-500' src={item.image} alt={item.name} />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  {/* Left side: Checkbox & Text */}
                  <div className="flex items-center gap-2">
                    <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                    <p>Available</p>
                  </div>

                  {/* Right side: Delete Button */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex items-center justify-center p-2 rounded-full"
                  >
                    <img src={assets.delete1} className="w-4 h-4" alt="Delete" />
                  </button>
                </div>


              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No doctors found matching your search.</p>
        )}
      </div>
    </div>
  )
}

export default DoctorsList
