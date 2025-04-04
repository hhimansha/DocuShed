import { assets } from '@/assets/assets_admin/assets';
import { AppContext } from '@/Context/AppContext';
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

const Navsidebar = () => {
  const { userdata } = useContext(AppContext);

  return (
    <div className='min-h-screen bg-white border-r'>
      {userdata.role === "admin" && (
        <div className='mt-5'>
          <NavLink
            to="/admin/dashbord"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.home_icon} alt="Home Icon" />
            <p className='text-[#515151]'>Dashboard</p>
          </NavLink>

          <NavLink
            to="/admin/all-appointment"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.appointment_icon} alt="Appointments Icon" />
            <p className='text-[#515151]'>Appointments</p>
          </NavLink>

          <NavLink
            to="/admin/addDoctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.add_icon} alt="Add Doctors Icon" />
            <p className='text-[#515151]'>Add Doctors</p>
          </NavLink>

          <NavLink
            to="/admin/PatientList"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.patient1} className='w-8 h-8' alt="Doctors List Icon" />
            <p className='text-[#515151]'>patients List</p>
          </NavLink>

          <NavLink
            to="/admin/DoctorsList"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.people_icon} alt="Doctors List Icon" />
            <p className='text-[#515151]'>Doctors List</p>
          </NavLink>


        </div>
      )}




       <div className='min-h-screen bg-white border-r'>
      {userdata.role === "doctor" && (
        <div className='mt-5'>
          <NavLink
            to="/doctordashed"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.home_icon} alt="Home Icon" />
            <p className='text-[#515151]'>Dashboard</p>
          </NavLink>

          <NavLink
            to="/doctordashed-appointment"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.appointment_icon} alt="Appointments Icon" />
            <p className='text-[#515151]'>Appointments</p>
          </NavLink>

         

          <NavLink
            to="/doctordashed-profile"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img src={assets.people_icon} alt="Doctors List Icon" />
            <p className='text-[#515151]'>Profile</p>
          </NavLink>
        </div>
      )}
    </div>
    </div>

  );
};

export default Navsidebar;
