import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Myprofile from './pages/Myprofile';
import MyAppointment from './pages/MyAppointment';
import Appointment from './pages/Appointment';
import Navbar from './Components/Navbar';
import Footer from './components/Footer';
import Navadmin from './components/Navadmin';
import Admindashbord from './pages/Admindashbord';
import Navsidebar from './components/Navsidebar';
import Dasgbord from './pages/Admin/Dashbord';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import ResetPassword from './pages/ResetPassword';
import Verify from './pages/Verify'
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';


const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={isAdminRoute ? '' : 'mx-4 sm:mx-[10%]'}>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Show Navbar only if not admin route */}
      {!isAdminRoute && <Navbar />}

      {/* Show AdminNav and Navsidebar only if admin route */}
      {isAdminRoute && (
        <div>
          <Navadmin />
          <div className='flex items-start'>
            <Navsidebar />
            <div className="flex-1">
              <Routes>
                {/* Admin routes inside sidebar layout */}
                <Route path='/admin' element={<Admindashbord />} />
                <Route path='/admin/dashbord' element={<Dasgbord />} />
                <Route path='/admin/all-appointment' element={<AllAppointment />} />
                <Route path='/admin/addDoctor' element={<AddDoctor />} />
                <Route path='/admin/DoctorsList' element={<DoctorsList />} />
                <Route path='/admin/doctor-dashboard' element={<DoctorDashboard />} />
                <Route path='/admin/doctor-appointments' element={<DoctorAppointments />} />
                <Route path='/admin/doctor-profile' element={<DoctorProfile />} />
              </Routes>
            </div>
          </div>
        </div>
      )}

      {/* General Routes */}
      {!isAdminRoute && (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/my-appointments' element={<MyAppointment />} />
          <Route path='/my-profile' element={<Myprofile />} />         
          <Route path='/verify' element={<Verify />} />
          <Route path='/reset-password' element={<ResetPassword />} />   
        </Routes>
        
      )}

{!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
