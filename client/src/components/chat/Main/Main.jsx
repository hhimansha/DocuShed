import React, { useContext } from 'react'
import './Main.css'
import { AppContext } from '@/Context/AppContext'
import { assets } from '@/assets/chatbot_assets/assets'
import { useNavigate } from 'react-router-dom'

const Main = () => {
  const { userdata, prevPromts, SetPreviosPromts, onsent, setRecentPromt, resendPromt, showResult, resultData, input, setinput, loading } = useContext(AppContext)
  const navigator=useNavigate()
  const handleCardClick = (text) => {
    onsent(text);  // Trigger the `onsent` function with the text from the clicked card
    setRecentPromt(text); // Optionally update recent prompt if needed
  };

  return (
    <div className='main'>
      <div className="nav">
        <p onClick={()=>navigator('/')}> PreScripto</p>
        <img src={userdata?.image ? userdata.image : assets.upload_area} alt="" />
      </div>
      <div className="main-containe">

        {!showResult
        ? <>
          <div className="greet">
            <p ><span>Hello, {userdata.name}</span></p>
            <p>How can I help you today?</p>
          </div>
          <div className="cards">
            <div className="card" onClick={() => handleCardClick("dummy hdbsdbdj sdjsdb")}>
              <p>dummy hdbsdbdj sdjsdb</p>
              <img src={assets.compass_icon} alt="" />
            </div>
            <div className="card" onClick={() => handleCardClick("dummy hdbsdbdj sdjsdb")}>
              <p>dummy hdbsdbdj sdjsdb</p>
              <img src={assets.bulb_icon} alt="" />
            </div>
            <div className="card" onClick={() => handleCardClick("dummy hdbsdbdj sdjsdb")}>
              <p>dummy hdbsdbdj sdjsdb</p>
              <img src={assets.message_icon} alt="" />
            </div>
            <div className="card" onClick={() => handleCardClick("dummy hdbsdbdj sdjsdb")}>
              <p>dummy hdbsdbdj sdjsdb</p>
              <img src={assets.code_icon} alt="" />
            </div>
          </div>
        </>
        : <div className='result'>
          <div className="result-title">
            <img  src={userdata?.image ? userdata.image : assets.upload_area} alt="" />
            <p>{resendPromt}</p>
          </div>
          <div className="result-dataa">
            <img src={assets.gemini_icon} alt="" />
            {
              loading ? <div className='loading'>
                <hr />
                <hr />
                <hr />
              </div>
                :
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
            }

          </div>
        </div>
        }

        <div className="main-bottum">
          <div className="search-box">
            <input onChange={(e) => setinput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
            <div>
             
              {input ? <img onClick={() => onsent()} src={assets.send_icon} alt="" />
                : null
              }
            </div>
          </div>
          <p className="bottum-info">
            PreScripto may display inaccurate info, including about people, so double-check its responses. Your privacy and PreScripto Apps
          </p>
        </div>
      </div>
    </div>
  )
}

export default Main;
