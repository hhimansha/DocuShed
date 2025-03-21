import React, { useEffect, useContext } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Context from './pages/Context'
import Myprofile from './pages/Myprofile'
import MyApointment from './pages/MyApointment'
import Appointment from './pages/Appointment'
import Navbar from './Components/Navbar'
import Fotter from './Components/fotter'
import Navadmin from './components/Navadmin';
import Admindashbord from './pages/Admindashbord';
import { AppContext } from './context/AppContext';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isLogin, getuser } = useContext(AppContext);

  useEffect(() => {
    if (isLogin) {
      getuser(); // Fetch user data if logged in
    }
  }, [isLogin, getuser]);


  return (
    <div className='mx-4 sm:mx-[10%]'>

      <ToastContainer />

      {/* Show Navbar only if not admin route */}
      {!isAdminRoute && <Navbar />}

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
        <Route path='/admin' element={<Admindashbord />} />
      </Routes>

      {/* Show AdminNav only if admin route */}
      {isAdminRoute && isLogin  &&  <Navadmin />}

      <Fotter />

    </div>
  )
}

export default App;
