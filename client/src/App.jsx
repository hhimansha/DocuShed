import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Context from './pages/Context';
import Myprofile from './pages/Myprofile';
import MyApointment from './pages/MyApointment';
import Appointment from './pages/Appointment';
import Navbar from './Components/Navbar';
import Fotter from './Components/fotter';
import Navadmin from './components/Navadmin';
import Admindashbord from './pages/Admindashbord';
import Navsidebar from './components/Navsidebar';
import Dasgbord from './pages/Admin/Dasgbord';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import ResetPassword from './pages/ResetPassword';
import Doctordashbord from './pages/Doctor/Doctordashbord';
import AllEarnings from './pages/Admin/AllEarnings';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import Doctorprofile from './pages/Doctor/Doctorprofile';
import PatientList from './pages/Admin/PatientList';
import AppointmentConfirmation from './pages/payment/AppointmentConfirmation';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';
import Chatbot from './pages/Chatbot';
import AllPaymentsAdmin from './pages/Admin/AllPayments';
import AllPaymentsDoctor from './pages/Doctor/AllPayments';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDoctorRoute = location.pathname.startsWith('/doctordashed');
  const isChatbot = location.pathname.startsWith('/Chatbot');

  return (
    <div className={!isAdminRoute && !isDoctorRoute && !isChatbot ? 'mx-4 sm:mx-[10%]' : ''}>
      <ToastContainer position="top-right" autoClose={2000} />
  
      {!isAdminRoute && !isDoctorRoute && !isChatbot && <Navbar />}
  
      {isAdminRoute ? (
        <div>
          <Navadmin />
          <div className='flex items-start'>
            <Navsidebar />
            <div className="flex-1">
              <Routes>
                <Route path='/admin' element={<Admindashbord />} />
                <Route path='/admin/dashbord' element={<Dasgbord />} />
                <Route path='/admin/all-appointment' element={<AllAppointment />} />
                <Route path='/admin/all-earnings' element={<AllEarnings />} />
                <Route path='/admin/addDoctor' element={<AddDoctor />} />
                <Route path='/admin/DoctorsList' element={<DoctorsList />} />
                <Route path='/admin/PatientList' element={<PatientList />} />
                <Route path='/admin/payments' element={<AllPaymentsAdmin />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : isDoctorRoute ? (
        <div>
          <Navadmin />
          <div className='flex items-start'>
            <Navsidebar />
            <div className="flex-1">
              <Routes>
                <Route path='/doctordashed' element={<Doctordashbord />} />
                <Route path='/doctordashed-appointment' element={<DoctorAppointment />} />
                <Route path='/doctordashed-profile' element={<Doctorprofile />} />
                <Route path='/doctordashed-payments' element={<AllPaymentsDoctor />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : isChatbot ? (
        <Routes>
          <Route path='/Chatbot' element={<Chatbot />} />
        </Routes>
      ) : (
        // General Routes
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Context />} />
          <Route path='/my-profile' element={<Myprofile />} />
          <Route path='/my-appointments' element={<MyApointment />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/appointment-confirmation/:appointmentId' element={<AppointmentConfirmation />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/payment-cancel' element={<PaymentCancel />} />
          <Route path='*' element={<Home />} />
        </Routes>
      )}
  
      {!isAdminRoute && !isDoctorRoute && !isChatbot && <Fotter />}
    </div>
  );
  
};



export default App;
