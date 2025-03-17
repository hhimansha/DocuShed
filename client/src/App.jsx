import React from 'react'
import { Route, Routes } from 'react-router-dom'
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


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar/>
   <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/doctors' element={<Doctors/>}/>
    <Route path='/doctors/:speciality' element={<Doctors/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/contact' element={<Context/>}/>
    <Route path='/my-profile' element={<Myprofile/>}/>
    <Route path='/my-appointments' element={<MyApointment/>}/>
    <Route path='/appointment/:docId' element={<Appointment/>}/>
    


   </Routes>
   <Fotter/>

    </div>
  )
}

export default App