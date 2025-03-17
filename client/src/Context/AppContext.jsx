import { createContext } from "react";
import { doctors } from "../assets/assets";

// Create context
export const AppContext = createContext();

const AppContextProvider = (props) => {

  // Context value

  const currencysymbol='$'


  const value = {
    doctors,
    currencysymbol
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}  {/* Corrected spelling here */}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
