import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

// Create context
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_Backend_URL;

  const [isLogin, setIslogin] = useState(false);
  const [userdata, setuserdata] = useState(false);
  const [Doctors, Setdoctors] = useState([]);
  const [usershowdoctors, setusershowdocters] = useState([]);
  const [loading, setLoading] = useState(false); 
   const[available ,setavailable] =useState(false)                                             // Optional: loading state
   const[dashData,setDashdata]=useState(false)

  const currencysymbol = '$';

  // Fetch all doctors
  const gealldoctos = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        withCredentials: true
      });
      if (data.success) {
        Setdoctors(data.doctors);
        console.log(data.doctors); // Should show array now
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user data
  const getuser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/data`, { withCredentials: true });
      if (data.success) {
        setuserdata(data.userData);
        setIslogin(true);
      } else {
        setuserdata(false); // Clear user data if not logged in
        setIslogin(false);
      }
    } catch (error) {
      setuserdata(false);
      setIslogin(false);
      console.error("Error fetching user:", error.message);
    }
  };

  // Change doctor availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        { withCredentials: true }
      );
      if (data.success) {
       
        gealldoctos(); 
        toast.success(data.message);// Refresh the list of doctors after updating availability
        (data.available);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get doctor data for the user
  const getDoctorsData = async () => {
    try {
      setLoading(true); // Start loading
      const { data } = await axios.get(`${backendUrl}/api/auth/all-doctors`);
      if (data.success) {
        setusershowdocters(data.doctors); // Corrected the data property
      } else {
        toast.error(data.message);
      }
      setLoading(false); // Stop loading
    } catch (error) {
      toast.error("Failed to fetch doctors");
      setLoading(false); // Stop loading
    }
  };

  const getdahdata = async ()=>{
    try {
      const {data} =await axios.get(backendUrl + '/api/admin/dashbord', { withCredentials: true })
      if(data.success){
        setDashdata(data.dashData) 
        console.log(data.dashData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
      
    }
  }

  useEffect(() => {
    getDoctorsData();
  }, []); // Runs once when component mounts

  useEffect(() => {
    getuser(); // Fetch user data once on component mount
  }, []);

  const value = {
    
    currencysymbol,
    backendUrl,
    isLogin,
    setIslogin,
    userdata,
    setuserdata,
    getuser,
    gealldoctos,
    Doctors,
    changeAvailability,
    getDoctorsData,
    usershowdoctors,
    loading, // Added loading to context value
    setavailable,
    available,
    dashData,getdahdata
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
