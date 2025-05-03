import { assets } from '@/assets/assets';
import { AppContext } from '@/Context/AppContext';
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Camera, User, Mail, Phone, MapPin, Calendar, Lock, Edit3, Trash2, Save, X } from 'lucide-react';

const MyProfile = () => {
  const { userdata, getuser, backendUrl } = useContext(AppContext);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const navigator = useNavigate();

  // Editable Fields
  const [name, setName] = useState(userdata?.name || '');
  const [phone, setPhone] = useState(userdata?.phone || '');
  const [address, setAddress] = useState(userdata?.address?.line1 || '');
  const [address2, setAddress2] = useState(userdata?.address?.line2 || '');
  const [gender, setGender] = useState(userdata?.gender || '');
  const [birthday, setBirthday] = useState(userdata?.birthday || '');
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userdata) {
      setName(userdata.name || '');
      setPhone(userdata.phone || '');
      setAddress(userdata.address?.line1 || '');
      setAddress2(userdata.address?.line2 || '');
      setGender(userdata.gender || '');
    
    }
  }, [userdata]);

  const updateUserProfile = async () => {
    try {
      if (phone && (!/^\d{10}$/.test(phone))) {
        toast.error("Phone number must contain only numbers and be exactly 10 digits long.");
        return;
      }
      const formData = new FormData();
      formData.append('userId', userdata._id);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('address', JSON.stringify({ line1: address, line2: address2 }));
      formData.append('gender', gender);
      

      if (image) formData.append('image', image);

      const { data } = await axios.post(backendUrl + '/api/auth/update-profile', formData, {
        withCredentials: true
      });

      if (data.success) {
        toast.success(data.message);
        await getuser(); // Refresh user data
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/user-rest-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Password changed successfully");
        setShowPasswordChange(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const deleteHandler = async () => {
    toast.warn(
      <div className="font-sans">
        <p className="font-medium text-gray-800">Are you sure you want to delete this profile?</p>
        <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={async () => {
              try {
                const { data } = await axios.delete(`${backendUrl}/api/auth/delete-user`, { withCredentials: true });
                toast.dismiss();
                toast.success('Account deleted successfully!');
                await getuser();
                navigator('/');
              } catch (error) {
                toast.dismiss();
                toast.error(error.response?.data?.message || 'Failed to delete account');
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Delete Account
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true,
        className: "rounded-xl shadow-xl"
      }
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  // Last password change - placeholder function
  const getLastPasswordChange = () => {
    return '3 months ago';
  };

  if (!userdata) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-pulse p-6 bg-white rounded-xl shadow-md w-full max-w-md">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-32 bg-gray-200 rounded mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Photo */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-48"></div>
          
          <div className="relative px-6 lg:px-8 pb-8">
            {/* Profile Photo */}
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20">
              <div className="relative">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer group">
                    <div className="h-36 w-36 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center relative">
                      <img
                        className="h-full w-full object-cover rounded-full group-hover:opacity-75 transition-opacity duration-300"
                        src={image ? URL.createObjectURL(image) : userdata.image || assets.upload_area}
                        alt="Profile"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" className="hidden" accept="image/*" />
                  </label>
                ) : (
                  <div className="h-36 w-36 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                    <img
                      src={userdata?.image || assets.upload_area}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
                <h1 className="text-3xl font-bold text-white mb-8">{userdata?.name}</h1>
                <div className="flex items-center justify-center md:justify-start text-gray-600 mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <p>{userdata?.email}</p>
                </div>
                {userdata?.phone && (
                  <div className="flex items-center justify-center md:justify-start text-gray-600 mt-1">
                    <Phone className="h-4 w-4 mr-2" />
                    <p>{userdata?.phone}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 md:mt-0 flex space-x-3">
                {isEdit ? (
                  <button
                    onClick={updateUserProfile}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-sm flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEdit(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-sm flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                )}
                
                {isEdit && (
                  <button
                    onClick={() => {
                      setIsEdit(false);
                      setName(userdata?.name || "");
                      setPhone(userdata?.phone || "");
                      setAddress(userdata?.address?.line1 || "");
                      setAddress2(userdata?.address?.line2 || "");
                      setGender(userdata?.gender || "");
                    
                      setImage(false);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`pb-4 px-1 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'personal'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-4 px-1 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'security'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Security
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 lg:px-8 pb-8">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <>
                {isEdit ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="col-span-1 lg:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Your Information</h3>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder="10-digit phone number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <div className="relative">
                        <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" 
                          value={address} 
                          onChange={(e) => setAddress(e.target.value)} 
                          placeholder="Street address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                      <div className="relative">
                        <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200" 
                          value={address2} 
                          onChange={(e) => setAddress2(e.target.value)} 
                          placeholder="Apt, suite, unit, building, floor, etc."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <div className="relative">
                        <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <select 
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 appearance-none" 
                          value={gender} 
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                    
                    
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Full Name</p>
                          <p className="mt-1 text-gray-800 font-medium">{userdata?.name || 'Not provided'}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Email Address</p>
                          <p className="mt-1 text-gray-800 font-medium">{userdata?.email || 'Not provided'}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Phone Number</p>
                          <p className="mt-1 text-gray-800 font-medium">{userdata?.phone || 'Not provided'}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-gray-500">Gender</p>
                          <p className="mt-1 text-gray-800 font-medium">{userdata?.gender || 'Not specified'}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Address</p>
                          {userdata?.address?.line1 ? (
                            <p className="mt-1 text-gray-800 font-medium">
                              {userdata.address.line1}
                              {userdata.address.line2 && <>, {userdata.address.line2}</>}
                            </p>
                          ) : (
                            <p className="mt-1 text-gray-800 font-medium">Not provided</p>
                          )}
                        </div>
                        
                        
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Password & Security</h3>
                    {!showPasswordChange && (
                      <button
                        onClick={() => setShowPasswordChange(true)}
                        className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 flex items-center"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </button>
                    )}
                  </div>
                  
                  {showPasswordChange ? (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-md font-medium text-gray-800 mb-4">Update Your Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={handlePasswordReset}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-sm flex items-center justify-center"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Update Password
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordChange(false);
                              setCurrentPassword("");
                              setNewPassword("");
                              setConfirmPassword("");
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-700">
                            Your password was last changed <span className="font-medium">{getLastPasswordChange()}</span>.
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            Keep your account secure by updating your password regularly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Management</h3>
                  <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <h4 className="text-md font-medium text-red-800 mb-2">Delete Account</h4>
                    <p className="text-red-600 text-sm mb-4">
                      Warning: This action cannot be undone. All your data will be permanently removed.
                    </p>
                    <button
                      onClick={deleteHandler}
                      className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;