import { assets } from '@/assets/assets';
import { AppContext } from '@/Context/AppContext';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userdata, getuser, backendUrl } = useContext(AppContext);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

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


  const updateUserProfile = async () => {
    try {

      if (phone && (!/^\d{10}$/.test(phone))) {
        toast.error("Phone number must contain only numbers and be exactly 10 digits long.");
        return;
      }
      const formData = new FormData();
      formData.append('userId', userdata._id); // Send user ID
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('address', JSON.stringify({ line1: address, line2: address2 }));
      formData.append('gender', gender);
      formData.append('birthday', birthday);

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






  return userdata && (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 border-2 border-black">
      <div className="flex flex-col items-center">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75 "
                src={image ? URL.createObjectURL(image) : userdata.image || assets.upload_area} // show image or default
                alt=""
              />
              <img
                className="w-24 absolute bottom-12 right-12 md:w-10 lg:w-12"
                src={assets.upload} // always show upload icon in edit mode
                alt="Upload Icon"
              />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
        ) : (
          <img
            src={userdata?.image ? userdata.image : assets.upload_area}
            alt=""
            className="w-36 rounded "
          />
        )}


        <h2 className="mt-4 text-2xl font-semibold text-gray-800">{name}</h2>
      </div>

      <div className="mt-6 border-t border-gray-300 pt-4 ">
        <h3 className="text-lg font-medium text-gray-700">Contact Information</h3>
        {isEdit ? (
          <>
            name: <input type="text" className="w-full mt-2 p-2 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} />
            phone number:<input type="text" className="w-full mt-2 p-2 border rounded-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
            Address line1: <input type="text" className="w-full mt-2 p-2 border rounded-lg" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address Line 1" />
            Address line2: <input type="text" className="w-full mt-2 p-2 border rounded-lg" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address Line 2" />
          </>
        ) : (
          <>
            <p className="text-gray-600"><strong>Email:</strong> {userdata?.email}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {userdata?.phone || 'Not provided'}</p>
            {userdata?.address ? (
              <>
                <p className="text-gray-600 flex gap-2 py-2"><strong>Address:</strong> {userdata?.address?.line1 || 'Not provided'}, <br />        {userdata?.address?.line2 || 'Not provided'}</p>

              </>
            ) : (
              <p className="text-gray-600">Address not available</p>
            )}







          </>
        )}
      </div>

      <div className="mt-4 border-t border-gray-300 pt-4">
        <h3 className="text-lg font-medium text-gray-700">Basic Information</h3>
        {isEdit ? (
          <>
            <select className="w-full mt-2 p-2 border rounded-lg" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="" disabled>Select Gender</option> {/* Ensure there's always a value */}
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

          </>
        ) : (
          <>
            <p className="text-gray-600"><strong>Gender:</strong> {userdata?.gender || 'Not specified'}</p>

          </>
        )}
      </div>

      <div className="mt-6 flex space-x-4">
        {isEdit ? (
          <button onClick={updateUserProfile} className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all">
            Save
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEdit(true);
              setName(userdata?.name || "");
              setPhone(userdata?.phone || "");
              setAddress(userdata?.address?.line1 || "");
              setAddress2(userdata?.address?.line2 || "");
              setGender(userdata?.gender || "");
              setBirthday(userdata?.birthday || "");
            }}
            className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all"
          >
            Edit
          </button>

        )}
        <button
          className=" px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-blue-700 hover:text-white transition-all"
          onClick={() => setShowPasswordChange(!showPasswordChange)}
        >
          Change Password

        </button>

      </div>

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
          <button
            onClick={handlePasswordReset}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Password
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
