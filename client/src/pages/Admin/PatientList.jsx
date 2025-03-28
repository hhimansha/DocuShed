import { assets } from '@/assets/assets';
import { AppContext } from '@/Context/AppContext';
import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientList = () => {
  const { userdata, patient, geallpatints, deletePatient } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter patients by name or email using optional chaining to avoid errors
  const filteredPatients = patient.filter((item) =>
    (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (item.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  useEffect(() => {
    if (userdata) {
      geallpatints();
    }
  }, [userdata]);

  // Handle delete patient
  const handleDelete = (patientId) => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this patient?</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              deletePatient(patientId);
              toast.dismiss();
              toast.success('Patient deleted successfully!');
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
        position: "top-right",  // Position the toast at the top-right corner
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };
  return (
    <div className='m-5 max-h-[90vh] overflow-scroll'>
      <h1 className='text-lg font-medium mb-3'>All Patients</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search patients by name or email..."
        className="w-full max-w-sm p-2 border border-gray-300 rounded mb-5 outline-none focus:border-indigo-400 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className='w-full flex flex-wrap gap-4 pt-2 gap-y-6'>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((item, index) => (
            <div className='border border-indigo-200 rounded-xl max-w-75 overflow-hidden cursor-pointer group' key={index}>
              {item.image ? (
                <img
                  className='bg-blue-50 w-75 h-90 object-cover group-hover:bg-indigo-400 transition-all duration-500'
                  src={item.image}  // Ensure item.image path is valid
                  alt={item.name || 'No Image Available'}
                />
              ) : (
                <img
                  className='w-75 h-90 object-cover transition-all duration-500'
                  src={assets.upload_area}  // Ensure assets.upload_area is correctly imported or in public folder
                  alt={item.name || 'No Image Available'}
                />
              )}

              <div className='p-4'>
                <p className='text-gray-600 flex gap-2 py-2'>
                  <strong>Name:</strong> {item.name}
                </p>

                {/* Email rendering */}
                <p className='text-gray-600 flex gap-2 py-2'>
                  <strong>Email:</strong> <span>{item.email}</span>
                </p>

                <p className='text-gray-600 flex gap-2 py-2'>
                  <strong>Number:</strong> {item.phone || 'Not provided'}
                </p>

                <p className='text-gray-600 flex gap-2 py-2'>
                  <strong>Gender:</strong> {item.gender || 'Not provided'}
                </p>

                <p className="text-gray-600 flex gap-2 py-2">
                  <strong>Address:</strong> {item?.address?.line1 || 'Not provided'}, <br /> {item?.address?.line2 || 'Not provided'}
                </p>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(item._id)} // Pass the patient's unique id
                  className="mt-4  text-white  p-2 rounded-full"
                >
                  <img src={assets.delete1} className='w-4' alt="" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No patients found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default PatientList;
