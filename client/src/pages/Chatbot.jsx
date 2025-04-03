import React, { useContext } from 'react';
import Sidebar from '@/components/chat/sidebar/Sidebar';
import Main from '@/components/chat/Main/Main';
import { AppContext } from '@/Context/AppContext';

const Chatbot = () => {
  const { userdata } = useContext(AppContext);

  return (
    <div className="flex min-h-screen animate-fadeIn">
      {userdata.role === "user" && (
        <>
          <Sidebar />
          <Main />
        </>
      )}
    </div>
  );
};

export default Chatbot;
