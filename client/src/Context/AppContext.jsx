import { createContext, useState ,useEffect} from "react";
import { doctors } from "../assets/assets";
import axios from 'axios'
// Create context
export const AppContext = createContext();

const AppContextProvider = (props) => {

  // Context value
  const backendUrl=import.meta.env.VITE_Backend_URL
  const[isLogin,setIslogin]=useState(false)

  const[userdata,setuserdata]=useState(false)

  const currencysymbol='$'


  const getuser = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/data', { withCredentials: true });
      //console.log(data);
      if (data.success) {
        setuserdata(data.userData); 
        setIslogin(true); // optional if you are using isLogin elsewhere
      } else {
        setuserdata(false); // clear user data if not logged in
        setIslogin(false);
      }
    } catch (error) {
      setuserdata(false);
      setIslogin(false);
      console.error("Error fetching user:", error.message);
    }
  };

  

useEffect(() => {
  getuser(); // Call once on component mount
}, []); // Empty dependency array ensures it only runs once

  

  const value = {
    doctors,
    currencysymbol,
    backendUrl,
    isLogin,
    setIslogin,
    userdata,setuserdata,
    getuser
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}  {/* Corrected spelling here */}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
