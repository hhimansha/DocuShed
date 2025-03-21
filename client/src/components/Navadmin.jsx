import React from 'react'
import { assets } from '@/assets/assets_admin/assets'
import { useContext ,useState} from 'react'
import { AppContext } from '@/Context/AppContext'

const Navadmin = () => {
      const [isLoggedIns, setIsLoggedIns] = useState(false); 
    const { backendUrl, setIslogin, isLogin, userdata, getuser } = useContext(AppContext);
    
    const logoutHandler = async () => {
        try {
          await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
          setIsLoggedIns(false);
          setIslogin(false);
          // Clear user data
          window.location.reload(); // reload to re-check login status
        } catch (err) {
          console.error("Logout failed");
        }
      };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
        <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{userdata ?'Admin':'Doctor'}</p>
        </div>

        <button onClick={logoutHandler} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>logout</button>
         
    </div>
  )
}

export default Navadmin
