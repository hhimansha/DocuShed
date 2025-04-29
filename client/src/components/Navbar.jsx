import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '@/Context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIns, setIsLoggedIns] = useState(false);


    const { backendUrl, setIslogin, isLogin, userdata, getuser } = useContext(AppContext);


    const logoutHandler = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            setIsLoggedIns(false);
            setIslogin(false);
            // Clear user data
            navigate('/');
            window.location.reload(); // reload to re-check login status
        } catch (err) {
            console.error("Logout failed");
        }
    };


    useEffect(() => {
        const checkLogin = async () => {
            await getuser();
        };
        checkLogin();
    }, []);


    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400">
            <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink
                    to='/'
                    className={({ isActive }) => isActive ? 'border-b-2 border-blue-500' : ''}
                >
                    <li className='py-1'>Home</li>
                </NavLink>
                <NavLink
                    to='/doctors'
                    className={({ isActive }) => isActive ? 'border-b-2 border-blue-500' : ''}
                >
                    <li className='py-1'>All doctors</li>
                </NavLink>
                <NavLink
                    to='/about'
                    className={({ isActive }) => isActive ? 'border-b-2 border-blue-500' : ''}
                >
                    <li className='py-1'>About</li>
                </NavLink>
                <NavLink
                    to='/contact'
                    className={({ isActive }) => isActive ? 'border-b-2 border-blue-500' : ''}
                >
                    <li className='py-1'>Contact</li>
                </NavLink>
                {userdata?<NavLink
                    to='/Chatbot'
                    className={({ isActive }) => isActive ? 'border-b-2 border-blue-500' : ''}
                >
                    <li className='py-1'>ASK AI</li>
                </NavLink>
                :null}
                
            </ul>

            <div className="flex items-center gap-4">
                {userdata.role == "user" ? (
                    <div className="relative group flex items-center gap-2 cursor-pointer">
                        <img className="w-8 rounded-full  " src={userdata?.image ? userdata.image : assets.upload_area} alt="" />
                        <img className="w-2.5" src={assets.dropdown_icon} alt="" />
                        <div className="absolute top-full right-0 mt-2 w-48 bg-stone-100 rounded-lg shadow-lg text-gray-600 text-base font-medium z-50 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                            <div className="flex flex-col gap-4 p-4">
                                <p onClick={() => navigate('my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                                <p onClick={() => navigate('my-appointments')} className="hover:text-black cursor-pointer">My Appointment</p>
                                <p onClick={logoutHandler} className="hover:text-black cursor-pointer">Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">
                        Create Account
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar;
