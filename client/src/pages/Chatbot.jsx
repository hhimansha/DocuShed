import React from 'react';
import Sidebar from '@/components/chat/sidebar/Sidebar';
import Main from '@/components/chat/Main/Main';

const Chatbot = () => {
  return (
    <div className="flex  min-h-screen animate-fadeIn ">
      
        <Sidebar />
    
        <Main />
      
    </div>
  );
};

export default Chatbot;
