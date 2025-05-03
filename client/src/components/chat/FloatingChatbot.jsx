import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/Context/AppContext';
import { assets } from '@/assets/chatbot_assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingChatbot = () => {
  const { 
    userdata, 
    prevPromts, 
    onsent, 
    setRecentPromt, 
    resendPromt, 
    showResult, 
    resultData, 
    input, 
    setinput, 
    loading,
    newchat
  } = useContext(AppContext);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [extended, setExtended] = useState(false);

  const loadPromt = async (prompt) => {
    setExtended(prompt);
    await onsent(prompt);
  };

  const handleCardClick = (text) => {
    onsent(text);
    setRecentPromt(text);
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer && !chatContainer.contains(event.target)) {
        const bubble = document.querySelector('.chat-bubble');
        if (bubble && !bubble.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      <motion.div
        className={`chat-bubble w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-[#002284] shadow-lg cursor-pointer flex items-center justify-center ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence>
          {isHovering && (
            <motion.div 
              className="absolute -top-10 bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              Ask Nova
            </motion.div>
          )}
        </AnimatePresence>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`chat-container bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col ${isMinimized ? 'w-80 h-16' : 'w-[500px] h-[700px]'}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-[#002284] p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {/* <img 
                  src={userdata?.image ? userdata.image : assets.upload_area} 
                  alt="User" 
                  className="w-8 h-8 rounded-full object-cover"
                /> */}
                <h3 className="font-semibold">Nova</h3>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 rounded-full hover:bg-white/20 transition"
                >
                  {isMinimized ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/20 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {!showResult ? (
                    <>
                      <div className="greet">
                        <p className="text-gray-800"><span className="font-semibold">Hello, {userdata.name}</span></p>
                        <p className="text-gray-600">How can I help you today?</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          className="card bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-150 transition"
                          onClick={() => handleCardClick("Who are the available doctors?")}
                        >
                          <p className="text-sm text-gray-700">Who are the available doctors?</p>
                          {/* <img src={assets.compass_icon} alt="" className="w-5 h-5 mt-2" /> */}
                        </div>
                        <div 
                          className="card bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-150 transition"
                          onClick={() => handleCardClick("What are the common symptoms of diabetes?")}
                        >
                          <p className="text-sm text-gray-700">What are the common symptoms of diabetes?</p>
                          {/* <img src={assets.bulb_icon} alt="" className="w-5 h-5 mt-2" /> */}
                        </div>
                        <div 
                          className="card bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-150 transition"
                          onClick={() => handleCardClick("Do you have any available slots for today?")}
                        >
                          <p className="text-sm text-gray-700">Do you have any available slots for today?</p>
                          {/* <img src={assets.message_icon} alt="" className="w-5 h-5 mt-2" /> */}
                        </div>
                        <div 
                          className="card bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-150 transition"
                          onClick={() => handleCardClick("s Dr. Zoe Kelly available for an appointment?")}
                        >
                          <p className="text-sm text-gray-700">Is Dr. Zoe Kelly available for an appointment?</p>
                          {/* <img src={assets.code_icon} alt="" className="w-5 h-5 mt-2" /> */}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='result'>
                      <div className="result-title flex items-center space-x-2 mb-3">
                        <img 
                          src={userdata?.image ? userdata.image : assets.upload_area} 
                          alt="User" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <p className="text-gray-800 font-medium">{resendPromt}</p>
                      </div>
                      <div className="result-dataa bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <img src={assets.gemini_icon} alt="" className="w-6 h-6 mt-1" />
                          {loading ? (
                            <div className='loading space-y-2 w-full'>
                              <div className="h-3 bg-gray-200 rounded-full animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded-full animate-pulse w-5/6"></div>
                              <div className="h-3 bg-gray-200 rounded-full animate-pulse w-4/6"></div>
                            </div>
                          ) : (
                            <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: resultData }}></p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="search-box relative">
                    <input 
                      onChange={(e) => setinput(e.target.value)} 
                      value={input} 
                      type="text" 
                      placeholder='How can I help you?' 
                      className="w-full p-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {input && (
                      <button 
                        onClick={() => onsent()} 
                        className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-6 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Nova may display inaccurate info, including about people, so double-check its responses.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;