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
   const [profileDta,setProfileData]=useState(false)
  const [patient,setpatints]=useState([])
  const currencysymbol = '$';

//chatapp
  const [input ,setinput]=useState("")
  const [resendPromt ,setRecentPromt] =useState("")
  const [prevPromts,SetPreviosPromts]=useState([])
  const [showResult,setShowResult]=useState(false)
  const [resultData,setResultData]=useState("")

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

  const getdoctorprofiledata = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/profile', { withCredentials: true });
      if (data.success) {
        setProfileData(data.profileDta);
        console.log(data.profileDta);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  const geallpatints = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/allpatient`, { // Ensure correct API endpoint
        withCredentials: true
      });
      if (data.success) {
        setpatints(data.patient); // ✅ Use 'patient' (from backend response)
        console.log(data.patient); // Debugging
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
};

  useEffect(() => {
    getDoctorsData();
  }, []); // Runs once when component mounts

  useEffect(() => {
    getuser(); // Fetch user data once on component mount
  }, []);

  const deletePatient = async (patientId)=>{
    try {
      const {data}=await axios.delete(`${backendUrl}/api/admin/patients/${patientId}`,{withCredentials:true})
      if (data.success) {
        toast.success(data.message);
        geallpatints();

      }
    } catch (error) {
      
    }

  }

  
  const deletedoctor = async (doctorId)=>{
    try {
      const {data}=await axios.delete(`${backendUrl}/api/admin/doctordelete/${doctorId}`,{withCredentials:true})
      if (data.success) {
        toast.success(data.message);
        gealldoctos();

      }
    } catch (error) {
      
    }

  }

  const delayPara = (indext,nextword)=>{
      setTimeout(function(params){
          setResultData(prev =>prev+nextword);
      },20*indext)
  }

  const newchat  =()=>{
    setIslogin(false)
    setShowResult(false)
  }

  const onsent = async (prompt) => {
    const userInput = prompt || input; // Use `prompt` if available, otherwise fallback to `input`
    
    if (!userInput) {
      toast.error("Please enter a prompt.");
      return;
    }
  
    try {
      setResultData(""); // ✅ Clear previous result before new request
      setLoading(true);
      setShowResult(true);
      setinput(""); // ✅ Clear input immediately to avoid old message display
  
      // ✅ Update previous prompts before making the request
      SetPreviosPromts(prev => [...prev, userInput]);
      setRecentPromt(userInput);
  
      // ✅ Send API request
      let response = await axios.post(
        `${backendUrl}/api/ai/generate/`,
        { prompt: userInput },
        { withCredentials: true }
      );
  
      console.log("API Response:", response);
  
      const output = response?.data?.text;
      if (!output) {
        throw new Error("Response text is missing.");
      }
  
      let responseArray = output.split("**");  
      let newResponse = responseArray.map((chunk, i) =>
        i % 2 === 1 ? `<b>${chunk}</b>` : chunk
      ).join("");
  
      let formattedResponse = newResponse.replace(/\*/g, "</br>");
      
      let newResponseArry = formattedResponse.split(" ");
      newResponseArry.forEach((word, i) => delayPara(i, word + " "));
  
      setLoading(false);
    } catch (error) {
      console.error("Error during request:", error);
      toast.error("Error during AI generation.");
    }
  };
  
 
 





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
    dashData,getdahdata,
    getdoctorprofiledata,profileDta,setProfileData,
    setpatints,patient,geallpatints,deletePatient,deletedoctor,
    prevPromts,
    SetPreviosPromts,
    onsent,setRecentPromt,resendPromt,showResult,resultData,input,setinput,newchat
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
