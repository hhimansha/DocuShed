import { createContext } from "react";
import { doctors } from "../assets/assets";

// Create context
export const AppContext = createContext();

const AppContextProvider = (props) => {

  // Context value
  const backendUrl=import.meta.env.VITE_Backend_URL
  const[isLogin,setIslogin]=useState(false)

  const currencysymbol='$'


  const value = {
    doctors,
    currencysymbol,
    backendUrl,
    isLogin,
    setIslogin
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}  {/* Corrected spelling here */}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
