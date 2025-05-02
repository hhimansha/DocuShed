import { assets } from '@/assets/assets_admin/assets';
import { AppContext } from '@/Context/AppContext';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    experience: '',
    fees: '',
    about: '',
    speciality: 'General physician',
    degree: '',
    address1: '',
    address2: '',
  });

  const { backendUrl } = useContext(AppContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ];

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        return toast.error('Profile image is required');
      }

      const submitData = new FormData();
      submitData.append('image', docImg);
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('experience', formData.experience);
      submitData.append('fees', Number(formData.fees));
      submitData.append('about', formData.about);
      submitData.append('speciality', formData.speciality);
      submitData.append('degree', formData.degree);
      submitData.append('address', JSON.stringify({ 
        line1: formData.address1, 
        line2: formData.address2 
      }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, submitData, {
        withCredentials: true
      });

      if (data.success === true) {
        toast.success(data.message);
        setDocImg(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          experience: '',
          fees: '',
          about: '',
          speciality: 'General physician',
          degree: '',
          address1: '',
          address2: '',
        });
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Doctor</h1>
        <p className="text-sm text-gray-500 mt-1">Complete the form below to add a new doctor to the system</p>
      </div>

      <form onSubmit={onSubmitHandler} className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with profile image upload */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center">
            <div className="relative group">
              <label htmlFor="doc-img" className="cursor-pointer block">
                <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white">
                  {docImg ? (
                    <img 
                      src={URL.createObjectURL(docImg)} 
                      alt="Doctor profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-white flex flex-col items-center justify-center h-full w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs mt-1">Upload</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </label>
              <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" className="hidden" accept="image/*" />
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-white">Doctor Profile Photo</h2>
              <p className="text-blue-100 text-sm mt-1">Upload a professional profile photo</p>
              {!docImg && <p className="text-red-200 text-xs mt-2">* Profile image is required</p>}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="doctor@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="5+ years"
                />
              </div>

              <div>
                <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees ($)</label>
                <input
                  type="number"
                  id="fees"
                  name="fees"
                  required
                  value={formData.fees}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                <select
                  id="speciality"
                  name="speciality"
                  required
                  value={formData.speciality}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                >
                  {specialities.map((speciality) => (
                    <option key={speciality} value={speciality}>{speciality}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">Education/Degree</label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  required
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="MD, PhD"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700">Clinic Address</label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  required
                  value={formData.address1}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="Street Address"
                />
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  required
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                  placeholder="City, State, Zip Code"
                />
              </div>
            </div>
          </div>

          {/* About Section - Full Width */}
          <div className="mt-6">
            <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About Doctor</label>
            <textarea
              id="about"
              name="about"
              required
              value={formData.about}
              onChange={handleChange}
              rows="5"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              placeholder="Provide detailed information about the doctor's background, expertise, and approach to patient care..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Doctor
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;