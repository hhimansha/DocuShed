import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '@/assets/chatbot_assets/assets'
import { AppContext } from '@/Context/AppContext'
const Sidebar = () => {

    const [extended, setextended] = useState(false)
    const { userdata, prevPromts, SetPreviosPromts, onsent, setRecentPromt, resendPromt, showResult, resultData, input, setinput, loading ,newchat} = useContext(AppContext)
    const loadPromt = async (prompt) => {
        setextended(prompt)
        await onsent(prompt)
    }
    return (
        <div className="sidebar">
            <div className="top">
                <img onClick={() => setextended(prev => !prev)} className="menu" src={assets.menu_icon} alt="" />
                <div onClick={()=>newchat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended ? <div className="recent">
                    <p className="recent-title">Recent</p>
                    {prevPromts.map((item) => (
                        <div key={item} onClick={() => loadPromt(item)} className="recent-entry">
                            <img src={assets.message_icon} alt="" />
                            <p>{item.slice(0, 18)}....</p>
                        </div>
                    ))}



                </div>
                    : null

                }




            </div>

        </div>

    )
}

export default Sidebar