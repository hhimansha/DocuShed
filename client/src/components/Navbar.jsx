import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(true);

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400">
            <img onClick={()=>navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className='py-1'>Home</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>All doctors</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />

                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>About</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />

                </NavLink>
                <NavLink to='/contact'>
                    <li className='py-1'>Contact</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />

                </NavLink>
                <NavLink to='/ai'>
                    <li className='py-1'>ASK AI </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />

                </NavLink>

            </ul>

            <div className="flex items-center gap-4">
                {token ? (
                    <div className="relative group flex items-center gap-2 cursor-pointer">
                        <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
                        <img className="w-2.5" src={assets.dropdown_icon} alt="" />

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-stone-100 rounded-lg shadow-lg text-gray-600 text-base font-medium z-50 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                            <div className="flex flex-col gap-4 p-4">
                                <p onClick={()=>navigate('my-profile')} className="hover:text-black cursor-pointer">MY Profile</p>
                                <p onClick={()=>navigate('my-appointments')} className="hover:text-black cursor-pointer">My Appointment</p>
                                <p onClick={()=>setToken(false)} className="hover:text-black cursor-pointer">Logout</p>
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

export default Navbar
