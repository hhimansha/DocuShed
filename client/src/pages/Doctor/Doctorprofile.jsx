import { AppContext } from '@/Context/AppContext'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
    const { userdata, getdoctorprofiledata, profileDta, setProfileData, currencysymbol, backendUrl } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileDta.address,
                fees: profileDta.fees,
                available: profileDta.available,
                about: profileDta.about,
            };

            const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, { withCredentials: true });
            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getdoctorprofiledata();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    useEffect(() => {
        if (userdata.role === "doctor") {
            getdoctorprofiledata();
        }
    }, [userdata]);

    
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
            setShowPasswordChange(false);  // Close password change section
            setCurrentPassword("");        // Clear the inputs
            setNewPassword("");
            setConfirmPassword("");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      };


    return profileDta && (
        <div className="flex flex-col gap-4 m-5">
            <div>
                <img className="bg-blue-600/80 w-full sm:max-w-64 rounded-lg" src={profileDta.image} alt="Doctor" />
            </div>
            <div className="flex-1 border border-black rounded-lg p-8 py-7 bg-white">
                <p className="flex items-center gap-2 font-extrabold text-gray-700">{profileDta.name}</p>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <p>{profileDta.degree} - {profileDta.speciality}</p>
                    <button className="py-0.5 px-2 border text-xs rounded-full">{profileDta.experience}</button>
                </div>

                {/* About Section */}
                <div>
                    <p className="text-sm font-medium text-neutral-800 mt-3">About:</p>
                    {isEdit ? (
                        <textarea
                            rows="4"
                            className="border rounded-lg p-2 w-full text-sm text-gray-700 mt-1"
                            value={profileDta.about}
                            onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                        />
                    ) : (
                        <p className="text-sm text-gray-600 max-w-[700px] mt-1">{profileDta.about}</p>
                    )}
                </div>

                {/* Appointment Fee */}
                <p className="text-gray-600 font-medium mt-4">
                    Appointment fee: <span className="text-gray-800">
                        {currencysymbol}
                        {isEdit ? (
                            <input type="number" 
                                className="border p-1 rounded ml-1"
                                onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                value={profileDta.fees} 
                            />
                        ) : profileDta.fees}
                    </span>
                </p>

                {/* Address */}
                <div className="flex gap-2 py-2">
                    <p>Address:</p>
                    <p className="text-sm">
                        {isEdit ? (
                            <input type="text"
                                className="border p-1 rounded"
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev, 
                                    address: { ...prev.address, line1: e.target.value }
                                }))}
                                value={profileDta.address?.line1 || ''}
                            />
                        ) : profileDta.address?.line1}
                        <br />
                        {isEdit ? (
                            <input type="text"
                                className="border p-1 rounded"
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev, 
                                    address: { ...prev.address, line2: e.target.value }
                                }))}
                                value={profileDta.address?.line2 || ''}
                            />
                        ) : profileDta.address?.line2}
                    </p>
                </div>

                {/* Availability Checkbox */}
                <div className="flex gap-2 pt-2">
                    <input 
                        type="checkbox"
                        checked={profileDta.available}
                        onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                    />
                    <label>Available</label>
                </div>
                
             
                <div className='flex gap-2 py-2'>
                     
                {/* Edit / Save Buttons */}
                {isEdit ? (
                    <button onClick={updateProfile} className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all">
                        Save
                    </button>
                ) : (
                    <button onClick={() => setIsEdit(true)} className="px-4  py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all">
                        Edit
                    </button>

                    
                
                )}
                <button 
                   className=" px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all "
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                        Change Password
                </button>
                </div>

          
                
                {/* Change Password Section */}
                {showPasswordChange && (
                    <div className="mt-6 border-t border-gray-300 pt-4">
                        <h3 className="text-lg font-medium text-gray-700">Change Password</h3>
                        <input 
                            type="password" 
                            placeholder="Current Password" 
                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input 
                            type="password" 
                            placeholder="New Password" 
                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handlePasswordReset} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                            Save Password
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorProfile;
